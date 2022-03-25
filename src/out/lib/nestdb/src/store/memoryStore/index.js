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
const encrypt_1 = require("../encrypt");
const error_1 = require("../../error");
const util_1 = require("../../util");
const DEFAULT_MEMORYSTORE_ITEM_SIZE_LIMIT = 4 * 1024 * 1024;
const DEFAULT_MEMORYSTORE_DELAY = 1;
const _store = {};
class MemoryStore {
    constructor(params = {}) {
        const { itemSizeLimit = DEFAULT_MEMORYSTORE_ITEM_SIZE_LIMIT, delay = DEFAULT_MEMORYSTORE_DELAY, encryption = encrypt_1.DEFAULT_ENCRYPTION, } = params;
        this._encryption = encryption;
        this.itemSizeLimit = itemSizeLimit;
        this.delay = delay;
        this.observer = {};
    }
    get rawData() {
        return _store[this.dbname];
    }
    set rawData(value) {
        _store[this.dbname] = value;
    }
    observe(key, ops, handler) {
        this.observer[key] = {};
        ops.forEach((op) => this.observer[key][op] = handler);
    }
    init(dbname) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbname = dbname;
            _store[this.dbname] = {};
        });
    }
    getAllKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.keys(_store[this.dbname]);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, util_1.sleep)(this.delay);
            const observer = this.observer[key];
            const err = (observer && observer['get']) ? observer['get'](key) : null;
            if (err)
                throw err;
            return _store[this.dbname][key]
                ? this._encryption.decrypt(_store[this.dbname][key])
                : null;
        });
    }
    set(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, util_1.sleep)(this.delay);
            const { key, value } = item;
            const observer = this.observer[key];
            const err = (observer && observer['set']) ? observer['set'](key) : null;
            if (err)
                throw err;
            const encrypted = this._encryption.encrypt(value);
            const serialized = JSON.stringify(encrypted);
            if (serialized.length < this.itemSizeLimit) {
                _store[this.dbname][key] = encrypted;
                return _store[this.dbname][key];
            }
            else {
                throw error_1.default.storeItemSizeExceeded;
            }
        });
    }
    setMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, util_1.sleep)(this.delay);
            const results = [];
            items.forEach((item) => {
                const { key, value } = item;
                const observer = this.observer[key];
                const err = (observer && observer['set']) ? observer['set'](key) : null;
                if (!err) {
                    const encrypted = this._encryption.encrypt(value);
                    const serialized = JSON.stringify(encrypted);
                    if (serialized.length < this.itemSizeLimit) {
                        _store[this.dbname][key] = encrypted;
                        results.push(value);
                    }
                    else {
                        results.push(error_1.default.storeItemSizeExceeded);
                    }
                }
                else {
                    results.push(error_1.default.collectionWriteFailed);
                }
            });
            return results;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, util_1.sleep)(this.delay);
            const observer = this.observer[key];
            const err = (observer && observer['remove']) ? observer['remove'](key) : null;
            if (err)
                throw err;
            if (_store[this.dbname][key]) {
                delete _store[this.dbname][key];
            }
            return key;
        });
    }
    removeMany(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, util_1.sleep)(this.delay);
            for (const key of keys) {
                const observer = this.observer[key];
                const err = (observer && observer['remove']) ? observer['remove'](key) : null;
                if (err)
                    throw err;
                if (_store[this.dbname][key]) {
                    delete _store[this.dbname][key];
                }
            }
            return keys;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, util_1.sleep)(this.delay);
            _store[this.dbname] = {};
        });
    }
}
exports.default = MemoryStore;
//# sourceMappingURL=index.js.map