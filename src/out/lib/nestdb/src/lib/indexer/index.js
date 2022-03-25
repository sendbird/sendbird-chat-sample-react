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
const block_1 = require("../block");
const cache_1 = require("../cache");
const interface_1 = require("../transaction/interface");
const error_1 = require("../../error");
const type_1 = require("../../type");
const util_1 = require("../../util");
const keygen_1 = require("../../util/keygen");
class Indexer {
    constructor({ dbname, collectionName, keyName, fields, transaction, store, }) {
        this._origin = [];
        this._table = [];
        this.dbname = dbname;
        this.collectionName = collectionName;
        this.keyName = keyName;
        this.fields = fields;
        this.indexerKey = (0, keygen_1.createIndexerKey)(this.dbname, this.collectionName, this.fields.join('>'));
        this._transaction = transaction;
        this._store = store;
        this._transaction.on(interface_1.TransactionEventType.COMMIT, this.indexerKey, () => this.commit());
        this._transaction.on(interface_1.TransactionEventType.ERROR, this.indexerKey, () => this.abort());
    }
    static createKey(index) { return index.join('>'); }
    static parseKey(key) { return key.split('>'); }
    _addItem(item) {
        const key = item[this.keyName];
        const columnValues = this.getColumnValues(item);
        const [index, matched] = this.indexOf(columnValues);
        if (!matched) {
            this._table.splice(index, 0, {
                columnValues,
                keys: [key],
            });
            return true;
        }
        else {
            if (!this._table[index].keys.includes(key)) {
                this._table[index].keys.push(key);
                return true;
            }
        }
        return false;
    }
    _removeItem(item) {
        const key = item[this.keyName];
        const columnValues = this.getColumnValues(item);
        const [index, matched] = this.indexOf(columnValues);
        if (matched) {
            const keyIndex = this._table[index].keys.indexOf(key);
            if (keyIndex > -1) {
                this._table[index].keys.splice(keyIndex, 1);
                if (this._table[index].keys.length === 0) {
                    this._table.splice(index, 1);
                }
                return true;
            }
        }
        return false;
    }
    get origin() {
        return this._origin;
    }
    get table() {
        return this._table;
    }
    getColumnValues(item) {
        const columnValues = [];
        for (let field of this.fields) {
            if (field[0] === '-')
                field = field.slice(1);
            if ((0, type_1.isPrimitiveType)(item[field])) {
                columnValues.push(item[field]);
            }
            else {
                throw error_1.default.indexTypesNotMatch;
            }
        }
        return columnValues;
    }
    diff(a, b) {
        for (const i in this.fields) {
            const inverse = (this.fields[i][0] === '-') ? -1 : 1;
            const compared = (0, util_1.compare)(a[i], b[i]);
            if (compared !== 0)
                return inverse * compared;
        }
        return 0;
    }
    indexOf(columnValues) {
        if (this._table.length > 0) {
            let start = 0;
            let end = this._table.length - 1;
            while (start <= end) {
                const pivot = Math.floor((start + end) / 2);
                const compared = this.diff(columnValues, this._table[pivot].columnValues);
                if (compared > 0) {
                    start = pivot + 1;
                }
                else if (compared < 0) {
                    end = pivot - 1;
                }
                else
                    return [pivot, true];
            }
            return [start, false];
        }
        return [0, false];
    }
    ensure() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = cache_1.default.get(this.dbname);
            const cacheItem = yield cache.find(this._store, this.indexerKey, cache_1.CacheGetOptions.PERSISTENT);
            if (!cacheItem) {
                const blockKeyPrefix = (0, keygen_1.createBlockKeyPrefix)(this.dbname, this.collectionName);
                const keys = yield this._store.getAllKeys();
                for (const key of keys) {
                    if (key.startsWith(blockKeyPrefix)) {
                        const cacheItem = yield cache.find(this._store, key, cache_1.CacheGetOptions.NO_CACHE);
                        const block = block_1.default.createFromCacheItem(cacheItem);
                        for (const item of block.items) {
                            this._addItem(item);
                        }
                    }
                }
                this._transaction.requestWrite({
                    key: this.indexerKey,
                    value: this._table,
                }, { persistent: true });
            }
            else {
                this._origin = cacheItem.value;
                this._table = (0, util_1.clone)(this._origin);
            }
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = cache_1.default.get(this.dbname);
            cache.remove(this.indexerKey);
            yield this._store.remove(this.indexerKey);
        });
    }
    addItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._addItem(item)) {
                this._transaction.requestWrite({
                    key: this.indexerKey,
                    value: this._table,
                }, { persistent: true });
            }
        });
    }
    removeItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._removeItem(item)) {
                this._transaction.requestWrite({
                    key: this.indexerKey,
                    value: this._table,
                }, { persistent: true });
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this._table = [];
            this._transaction.requestWrite({
                key: this.indexerKey,
                value: this._table,
            }, { persistent: true });
        });
    }
    commit() {
        this._origin = this._table;
        this._table = (0, util_1.clone)(this._origin);
    }
    abort() {
        this._table = (0, util_1.clone)(this._origin);
    }
}
exports.default = Indexer;
//# sourceMappingURL=index.js.map