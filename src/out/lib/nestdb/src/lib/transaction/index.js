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
const cache_1 = require("../cache");
const config_1 = require("../../config");
const keygen_1 = require("../../util/keygen");
class Transaction {
    constructor({ dbname, collectionName, store, }) {
        this._metadata = null;
        this._requests = [];
        this._onCommit = new Map();
        this._onWrite = new Map();
        this._onError = new Map();
        this.dbname = dbname;
        this.collectionName = collectionName;
        this.metadataKey = (0, keygen_1.createTransactionMetadataKey)(dbname, collectionName);
        this.recordsetKey = (0, keygen_1.createTransactionRecordsetKey)(dbname, collectionName);
        this._store = store;
    }
    get generation() {
        return this._metadata ? this._metadata.generation : 0;
    }
    get requestCount() {
        return this._requests.length;
    }
    _getReducedRecordset(appendedRecords = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const recordSet = ((yield this._store.get(this.recordsetKey)) || []);
            recordSet.push(...appendedRecords);
            return this._reduceRecordSet(recordSet);
        });
    }
    _reduceRecordSet(recordSet) {
        const reducedRecordSet = [];
        const recordMap = {};
        for (let i = recordSet.length - 1; i >= 0; i--) {
            const record = recordSet[i];
            const filteredRequests = [];
            for (let j = record.requests.length - 1; j >= 0; j--) {
                const request = record.requests[j];
                const data = request.data;
                if (!recordMap[data.key]) {
                    filteredRequests.unshift(request);
                    recordMap[data.key] = true;
                }
            }
            if (filteredRequests.length > 0) {
                record.requests = filteredRequests;
                reducedRecordSet.unshift(record);
            }
        }
        return reducedRecordSet;
    }
    _applyRecord(recordset, record) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = cache_1.default.get(this.dbname);
            const { generation, requests } = record;
            let error = null;
            try {
                const results = yield this._store.setMany(requests.map((request) => {
                    return Object.assign(Object.assign({}, request.data), { generation });
                }));
                for (let i = 0; i < requests.length; i++) {
                    if (results[i] instanceof Error) {
                        if (!error)
                            error = results[i];
                        const { data } = requests[i];
                        cache.put(Object.assign(Object.assign({}, data), { generation, state: cache_1.CacheState.PERSISTENT }));
                    }
                }
            }
            catch (err) {
                error = err;
            }
            if (!error) {
                const splicedRecordSet = recordset.filter((record) => record.generation !== generation);
                yield this._store.set({ key: this.recordsetKey, value: splicedRecordSet, generation });
                this._onWrite.forEach((handler) => {
                    handler(requests.map((req) => req.data));
                });
            }
            else {
                this._onError.forEach((handler) => handler(error));
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._metadata = (yield this._store.get(this.metadataKey)) || { generation: 1 };
            const recordset = yield this._getReducedRecordset();
            for (const record of recordset) {
                yield this._applyRecord(recordset, record);
            }
        });
    }
    on(eventType, key, handler) {
        switch (eventType) {
            case interface_1.TransactionEventType.COMMIT:
                this._onCommit.set(key, handler);
                break;
            case interface_1.TransactionEventType.WRITE:
                this._onWrite.set(key, handler);
                break;
            case interface_1.TransactionEventType.ERROR:
                this._onError.set(key, handler);
                break;
        }
    }
    requestWrite(item, options = null) {
        this._requests.push({
            data: item,
            options,
        });
        const cache = cache_1.default.get(this.dbname);
        cache.put(Object.assign({ state: cache_1.CacheState.PENDING, generation: this.generation }, item));
    }
    requestMultipleWrite(items, options = null) {
        const cache = cache_1.default.get(this.dbname);
        for (const item of items) {
            this._requests.push({
                data: item,
                options,
            });
            cache.put(Object.assign({ state: cache_1.CacheState.PENDING, generation: this.generation }, item));
        }
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = cache_1.default.get(this.dbname);
            cache.clearByCondition((cacheItem) => cacheItem.state === cache_1.CacheState.PENDING);
            this._requests = [];
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = this._requests;
            if (requests.length > 0) {
                const uniqueRequests = [];
                const dataCheckMap = {};
                for (let i = requests.length - 1; i >= 0; i--) {
                    const request = requests[i];
                    const data = request.data;
                    if (!dataCheckMap[data.key]) {
                        dataCheckMap[data.key] = true;
                        uniqueRequests.unshift(request);
                    }
                }
                const record = { generation: this.generation, requests: uniqueRequests };
                const recordset = yield this._getReducedRecordset([record]);
                yield this._store.set({ key: this.recordsetKey, value: recordset, generation: this.generation });
                this._metadata.generation++;
                yield this._store.set({ key: this.metadataKey, value: this._metadata, generation: 1 });
                const cache = cache_1.default.get(this.dbname);
                for (let i = 0; i < uniqueRequests.length; i++) {
                    const { data, options } = uniqueRequests[i];
                    cache.put(Object.assign(Object.assign({}, data), { generation: record.generation, state: (!options || !options.persistent) ?
                            cache_1.CacheState.VOLATILE :
                            cache_1.CacheState.PERSISTENT }));
                }
                this._requests = [];
                this._onCommit.forEach((handler) => {
                    handler(requests.map((req) => req.data));
                });
                const config = config_1.default.get(this.dbname);
                setTimeout(() => {
                    try {
                        this._applyRecord(recordset, record);
                    }
                    catch (err) {
                        this._onError.forEach((handler) => handler(err));
                    }
                }, config.transactionApplyDelay);
            }
        });
    }
}
exports.default = Transaction;
//# sourceMappingURL=index.js.map