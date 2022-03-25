"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
const query_1 = require("../query");
const iterator_1 = require("../query/iterator");
const match_1 = require("../query/match");
const config_1 = require("../../config");
const error_1 = require("../../error");
const blobContainer_1 = require("../../lib/blobContainer");
const transaction_1 = require("../../lib/transaction");
const manager_1 = require("../../lib/block/manager");
const indexer_1 = require("../../lib/indexer");
const util_1 = require("../../util");
const mutex_1 = require("../../util/mutex");
const keygen_1 = require("../../util/keygen");
class Collection {
    constructor({ dbname, collectionName, keyName, keyHash, indexes, store, }) {
        this._state = interface_1.CollectionState.INIT;
        this._metadata = null;
        this._indexers = [];
        this.dbname = dbname;
        this.name = collectionName;
        this.keyName = keyName;
        this.indexes = [[keyName], ...indexes.filter((index) => indexer_1.default.createKey(index) !== this.keyName)];
        this._keyHash = keyHash;
        this._store = store;
        this._mutex = new mutex_1.default((0, keygen_1.createCollectionLock)(dbname, collectionName));
        this._blobContainer = new blobContainer_1.default({ dbname, collectionName, store });
        this._transaction = new transaction_1.default({ dbname, collectionName, store });
    }
    static metadataOf(dbname, collectionName, store) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadataKey = (0, keygen_1.createCollectionMetadataKey)(dbname, collectionName);
            return yield store.get(metadataKey);
        });
    }
    get state() {
        return this._state;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._mutex.lock();
            try {
                const config = config_1.default.get(this.dbname);
                const previousMetadata = yield Collection.metadataOf(this.dbname, this.name, this._store);
                this._metadata = previousMetadata || {
                    keyName: this.keyName,
                    blockLevel: 1,
                    blockHashBase: config.blockHashBase,
                    blockHashMultiplier: config.blockHashMultiplier,
                    blockHashConstant: config.blockHashConstant,
                    indexes: this.indexes,
                };
                yield this._transaction.init();
                this._blockManager = new manager_1.default({
                    dbname: this.dbname,
                    collectionName: this.name,
                    hashFunction: this._keyHash,
                    metadata: this._metadata,
                    transaction: this._transaction,
                    store: this._store,
                });
                const newIndexes = [...this.indexes];
                const deprecatedIndexes = [];
                const newIndexKeys = newIndexes.map((newIndex) => indexer_1.default.createKey(newIndex));
                const previousIndexKeys = previousMetadata
                    ? previousMetadata.indexes.map((indexItem) => indexer_1.default.createKey(indexItem))
                    : [];
                for (const previousIndexKey of previousIndexKeys) {
                    if (!newIndexKeys.includes(previousIndexKey)) {
                        deprecatedIndexes.push(indexer_1.default.parseKey(previousIndexKey));
                    }
                }
                const migrations = [];
                migrations.push(...newIndexes.map((newIndex) => {
                    const indexer = new indexer_1.default({
                        dbname: this.dbname,
                        collectionName: this.name,
                        keyName: this.keyName,
                        fields: newIndex,
                        transaction: this._transaction,
                        store: this._store,
                    });
                    this._indexers.push(indexer);
                    return indexer.ensure();
                }));
                migrations.push(...deprecatedIndexes.map((deprecatedIndex) => {
                    const indexer = new indexer_1.default({
                        dbname: this.dbname,
                        collectionName: this.name,
                        keyName: this.keyName,
                        fields: deprecatedIndex,
                        transaction: this._transaction,
                        store: this._store,
                    });
                    return indexer.drop();
                }));
                yield Promise.all(migrations);
                yield this._transaction.commit();
                if (newIndexKeys.sort().join(',') !== previousIndexKeys.sort().join(',')) {
                    const metadataKey = (0, keygen_1.createCollectionMetadataKey)(this.dbname, this.name);
                    this._metadata.indexes = newIndexes;
                    yield this._store.set({ key: metadataKey, value: this._metadata, generation: 1 });
                }
                this._state = interface_1.CollectionState.READY;
                this._mutex.unlock();
            }
            catch (err) {
                this._mutex.unlock();
                throw err;
            }
        });
    }
    close() {
        this._state = interface_1.CollectionState.CLOSED;
    }
    _hasPropertyOfKeyName(item) {
        const key = item[this.keyName];
        return typeof key === 'string' && !!key;
    }
    _getIndexerBy(index = null) {
        if (!index)
            index = [this.keyName];
        const indexKey = indexer_1.default.createKey(index);
        for (const indexer of this._indexers) {
            if (indexKey === indexer_1.default.createKey(indexer.fields)) {
                return indexer;
            }
        }
        return null;
    }
    _upgradeBlockLevel() {
        return __awaiter(this, void 0, void 0, function* () {
            const metadataKey = (0, keygen_1.createCollectionMetadataKey)(this.dbname, this.name);
            this._metadata.blockLevel++;
            yield this._store.set({ key: metadataKey, value: this._metadata, generation: 1 });
        });
    }
    _requestInsert(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = item[this.keyName];
            const prev = yield this._blockManager.getFromBlock(key);
            if (!prev) {
                const result = yield this._blockManager.putToBlock(key, item);
                if (!result) {
                    yield this._upgradeBlockLevel();
                    yield this._blockManager.putToBlock(key, item);
                }
                for (const indexer of this._indexers) {
                    yield indexer.addItem(item);
                }
            }
            else {
                throw error_1.default.collectionInsertDuplicate;
            }
        });
    }
    _requestUpsert(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = item[this.keyName];
            const prev = yield this._blockManager.getFromBlock(key);
            if (!prev) {
                const result = yield this._blockManager.putToBlock(key, item);
                if (!result) {
                    yield this._upgradeBlockLevel();
                    yield this._blockManager.putToBlock(key, item);
                }
                for (const indexer of this._indexers) {
                    yield indexer.addItem(item);
                }
            }
            else {
                yield this._blockManager.putToBlock(key, item);
                for (const indexer of this._indexers) {
                    if (indexer.diff(indexer.getColumnValues(prev), indexer.getColumnValues(item)) !== 0) {
                        yield indexer.removeItem(prev);
                        yield indexer.addItem(item);
                    }
                }
            }
        });
    }
    _requestUpdate(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = item[this.keyName];
            const prev = yield this._blockManager.getFromBlock(key);
            if (prev) {
                yield this._blockManager.putToBlock(key, item);
                for (const indexer of this._indexers) {
                    if (indexer.diff(indexer.getColumnValues(prev), indexer.getColumnValues(item)) !== 0) {
                        yield indexer.removeItem(prev);
                        yield indexer.addItem(item);
                    }
                }
            }
        });
    }
    _requestRemove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const prev = yield this._blockManager.getFromBlock(key);
            if (prev) {
                yield this._blockManager.removeFromBlock(key);
                for (const indexer of this._indexers) {
                    yield indexer.removeItem(prev);
                }
            }
        });
    }
    _requestClear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._blockManager.clearAllBlocks();
            for (const indexer of this._indexers) {
                yield indexer.clear();
            }
        });
    }
    getByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    const result = yield this._blockManager.getFromBlock(key);
                    this._mutex.unlock();
                    return (0, util_1.clone)(result);
                }
                catch (err) {
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    query(params = {}) {
        if (this._state === interface_1.CollectionState.READY) {
            return new query_1.default({
                condition: params.where,
                mutex: this._mutex,
                blockManager: this._blockManager,
                indexer: this._getIndexerBy(params.index),
                backward: !!params.backward,
            });
        }
        return null;
    }
    insertOne(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    if (!this._hasPropertyOfKeyName(item))
                        throw error_1.default.collectionKeyNotGiven;
                    yield this._requestInsert((0, util_1.clone)(item));
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return item;
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    insertMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    if (items.some((item) => !this._hasPropertyOfKeyName(item)))
                        throw error_1.default.collectionKeyNotGiven;
                    for (const item of items)
                        yield this._requestInsert((0, util_1.clone)(item));
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return items;
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    upsertOne(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    if (!this._hasPropertyOfKeyName(item))
                        throw error_1.default.collectionKeyNotGiven;
                    yield this._requestUpsert((0, util_1.clone)(item));
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return item;
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    upsertMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    if (items.some((item) => !this._hasPropertyOfKeyName(item)))
                        throw error_1.default.collectionKeyNotGiven;
                    for (const item of items)
                        yield this._requestUpsert((0, util_1.clone)(item));
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return items;
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    update(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    if (!this._hasPropertyOfKeyName(item))
                        throw error_1.default.collectionKeyNotGiven;
                    yield this._requestUpdate((0, util_1.clone)(item));
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return item;
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    updateIf(where, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    const updatedItems = [];
                    const iterator = new iterator_1.default({
                        condition: where,
                        blockManager: this._blockManager,
                        indexer: this._getIndexerBy(null),
                    });
                    yield iterator.each((cursor) => __awaiter(this, void 0, void 0, function* () {
                        if (!cursor.error) {
                            if (cursor.hasNext) {
                                const item = cursor.nextValue;
                                if ((0, match_1.match)(where, item)) {
                                    if (update.set) {
                                        if (typeof update.set !== 'function') {
                                            for (const field in update.set) {
                                                item[field] = update.set[field];
                                            }
                                        }
                                        else {
                                            update.set(item);
                                        }
                                        updatedItems.push(item);
                                    }
                                }
                                cursor.next();
                            }
                            else {
                                cursor.stop();
                            }
                        }
                        else {
                            cursor.stop();
                            throw cursor.error;
                        }
                    }));
                    for (const item of updatedItems) {
                        yield this._requestUpdate((0, util_1.clone)(item));
                    }
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return updatedItems;
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                this._transaction.clear();
                throw error_1.default.collectionNotReady;
            }
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    yield this._requestRemove(key);
                    yield this._transaction.commit();
                    this._mutex.unlock();
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    removeIf(where) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    const removedKeys = [];
                    const iterator = new iterator_1.default({
                        condition: where,
                        blockManager: this._blockManager,
                        indexer: this._getIndexerBy(null),
                    });
                    yield iterator.each((cursor) => __awaiter(this, void 0, void 0, function* () {
                        if (!cursor.error) {
                            if (cursor.hasNext) {
                                const item = cursor.nextValue;
                                if ((0, match_1.match)(where, item)) {
                                    const key = item[this.keyName];
                                    removedKeys.push(key);
                                }
                                cursor.next();
                            }
                            else {
                                cursor.stop();
                            }
                        }
                        else {
                            cursor.stop();
                            throw cursor.error;
                        }
                    }));
                    for (const key of removedKeys) {
                        yield this._requestRemove(key);
                    }
                    yield this._transaction.commit();
                    this._mutex.unlock();
                    return removedKeys;
                }
                catch (err) {
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                this._transaction.clear();
                throw error_1.default.collectionNotReady;
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === interface_1.CollectionState.READY) {
                yield this._mutex.lock();
                try {
                    yield this._requestClear();
                    yield this._transaction.commit();
                    this._mutex.unlock();
                }
                catch (err) {
                    yield this._transaction.clear();
                    this._mutex.unlock();
                    throw err;
                }
            }
            else {
                throw error_1.default.collectionNotReady;
            }
        });
    }
    getBlob(blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._blobContainer.get(blobId);
        });
    }
    saveBlob(blob, key = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._blobContainer.save(blob, key);
        });
    }
    removeBlob(blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._blobContainer.remove(blobId);
        });
    }
    removeAllBlobs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._blobContainer.clear();
        });
    }
}
exports.default = Collection;
//# sourceMappingURL=index.js.map