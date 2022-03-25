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
exports.AsyncStorageStore = exports.IndexedDbStore = exports.MemoryStore = exports.Cursor = exports.Query = exports.Collection = exports.Config = exports.NestDBError = exports.NestDBState = void 0;
const config_1 = require("./config");
exports.Config = config_1.default;
const error_1 = require("./error");
exports.NestDBError = error_1.default;
const collection_1 = require("./component/collection");
exports.Collection = collection_1.default;
const query_1 = require("./component/query");
exports.Query = query_1.default;
const cache_1 = require("./lib/cache");
const cursor_1 = require("./lib/cursor");
exports.Cursor = cursor_1.default;
const memoryStore_1 = require("./store/memoryStore");
exports.MemoryStore = memoryStore_1.default;
const indexedDbStore_1 = require("./store/indexedDbStore");
exports.IndexedDbStore = indexedDbStore_1.default;
const asyncStorageStore_1 = require("./store/asyncStorageStore");
exports.AsyncStorageStore = asyncStorageStore_1.default;
const logger_1 = require("./util/logger");
const mutex_1 = require("./util/mutex");
const noop_1 = require("./util/noop");
const keygen_1 = require("./util/keygen");
const DATABASE_UPGRADE_TERM = 10;
var NestDBState;
(function (NestDBState) {
    NestDBState["INIT"] = "INIT";
    NestDBState["OPENING"] = "OPENING";
    NestDBState["OPENED"] = "OPENED";
    NestDBState["CLOSED"] = "CLOSED";
})(NestDBState || (NestDBState = {}));
exports.NestDBState = NestDBState;
class NestDB {
    constructor({ name, version, store, config, }) {
        this.name = name;
        this._version = version;
        this._state = NestDBState.INIT;
        this._config = config || new config_1.default({ dbname: name });
        this._store = store;
        this._event = {
            success: noop_1.noop,
            error: noop_1.noop,
            upgrade: noop_1.redirectUpgrade,
        };
        this._collections = new Map();
        this._globalMutex = new mutex_1.default(`${this.name}.lock`);
        if (this._config.disableLogger)
            logger_1.default.off();
        new cache_1.default({ dbname: name, limit: this._config.cacheLimit });
    }
    get version() {
        return this._version;
    }
    get state() {
        return this._state;
    }
    commitSchema(schemas) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state === NestDBState.OPENING) {
                yield Promise.all(schemas.map((schema) => __awaiter(this, void 0, void 0, function* () {
                    const { collectionName, keyName, index = [], } = schema;
                    if (!this._collections.has(collectionName)) {
                        this._collections.set(collectionName, new collection_1.default({
                            dbname: this.name,
                            collectionName,
                            keyName,
                            keyHash: schema.keyHash || null,
                            indexes: index,
                            store: this._store,
                        }));
                    }
                    yield this._collections.get(collectionName).init();
                })));
            }
            else {
                throw error_1.default.databaseSchemaNotOnUpgrade;
            }
        });
    }
    open() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this._globalMutex.lock();
            if (this._state !== NestDBState.OPENED) {
                this._state = NestDBState.OPENING;
                try {
                    yield this._store.init(this.name);
                    const metadataKey = (0, keygen_1.createDatabaseMetadataKey)(this.name);
                    const defaultMetadata = { version: 0, collectionNames: [] };
                    const metadata = (_a = (yield this._store.get(metadataKey))) !== null && _a !== void 0 ? _a : defaultMetadata;
                    return new Promise((resolve, reject) => {
                        const upgrade = (next) => {
                            if (metadata.version < this._version) {
                                this._event.upgrade(metadata.version, (err) => __awaiter(this, void 0, void 0, function* () {
                                    if (!err) {
                                        metadata.version++;
                                        metadata.collectionNames = Array.from(this._collections.keys());
                                        try {
                                            yield this._store.set({ key: metadataKey, value: metadata, generation: this._version });
                                            next({ continued: true });
                                        }
                                        catch (err) {
                                            next({ continued: false, err });
                                        }
                                    }
                                    else
                                        next({ continued: false, err });
                                }));
                            }
                            else
                                next({ continued: false });
                        };
                        const handleUpgradeResult = (result) => {
                            const { continued = false, err = null } = result;
                            if (!continued) {
                                if (!err) {
                                    const collectionInitializes = [];
                                    metadata.collectionNames.forEach((collectionName) => {
                                        if (!this._collections.has(collectionName)) {
                                            collectionInitializes.push((() => __awaiter(this, void 0, void 0, function* () {
                                                const metadata = yield collection_1.default.metadataOf(this.name, collectionName, this._store);
                                                if (metadata) {
                                                    const collection = new collection_1.default({
                                                        dbname: this.name,
                                                        collectionName,
                                                        keyName: metadata.keyName,
                                                        indexes: metadata.indexes,
                                                        store: this._store,
                                                    });
                                                    this._collections.set(collectionName, collection);
                                                    yield collection.init();
                                                }
                                            }))());
                                        }
                                    });
                                    Promise.all(collectionInitializes)
                                        .then(() => {
                                        this._state = NestDBState.OPENED;
                                        this._globalMutex.unlock();
                                        this._event.success();
                                        resolve();
                                    })
                                        .catch((err) => {
                                        logger_1.default.error(err.message);
                                        this._globalMutex.unlock();
                                        this._event.error(err);
                                        reject(err);
                                    });
                                }
                                else {
                                    logger_1.default.error(err.message);
                                    this._globalMutex.unlock();
                                    this._event.error(err);
                                    reject(err);
                                }
                            }
                            else {
                                setTimeout(() => upgrade(handleUpgradeResult), DATABASE_UPGRADE_TERM);
                            }
                        };
                        upgrade(handleUpgradeResult);
                    });
                }
                catch (err) {
                    switch (err.code) {
                        case error_1.ErrorCode.STORE_NOT_AVAILABLE_IN_PRIVATE_BROWSING: {
                            logger_1.default.warning('Access to the local storage is not allowed in private browsing. '
                                + 'Switched to MemoryStore automatically.');
                            this._store = new memoryStore_1.default({});
                            this._globalMutex.unlock();
                            this._event.error(err);
                            yield this.open();
                            break;
                        }
                        case error_1.ErrorCode.STORE_NOT_AVAILABLE: {
                            logger_1.default.warning('IndexedDB is not available in this environment. '
                                + 'Switched to MemoryStore automatically. '
                                + 'Consider using other store to save data persistently (e.g. AsyncStorage).');
                            this._store = new memoryStore_1.default({});
                            this._globalMutex.unlock();
                            this._event.error(err);
                            yield this.open();
                            break;
                        }
                        default:
                            logger_1.default.error(err.message);
                            this._globalMutex.unlock();
                            this._event.error(err);
                            throw err;
                    }
                }
            }
        });
    }
    close() {
        this._state = NestDBState.CLOSED;
        this._collections.forEach((col) => col.close());
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = cache_1.default.get(this.name);
            if (cache) {
                cache.clearByCondition((cacheItem) => cacheItem.key.startsWith((0, keygen_1.createDatabaseHost)(this.name)));
            }
            yield this._store.clear();
        });
    }
    on(eventType, handler) {
        this._event[eventType] = handler;
    }
    off(eventType) {
        if (typeof this._event[eventType] === 'function') {
            switch (eventType) {
                case 'upgrade':
                    this._event[eventType] = noop_1.redirectUpgrade;
                    break;
                default:
                    this._event[eventType] = noop_1.noop;
                    break;
            }
        }
    }
    collection(collectionName) {
        return this._collections.get(collectionName) || null;
    }
}
exports.default = NestDB;
//# sourceMappingURL=nest.js.map