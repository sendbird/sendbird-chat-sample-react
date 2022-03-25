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
const ASYNCSTORAGE_ITEM_SIZE_LIMIT = 6 * 1024 * 1024;
class AsyncStorageStore {
    constructor({ AsyncStorage, encryption = encrypt_1.DEFAULT_ENCRYPTION, }) {
        this.itemSizeLimit = ASYNCSTORAGE_ITEM_SIZE_LIMIT;
        this._asyncStorage = AsyncStorage;
        this._encryption = encryption;
    }
    _isBelonging(key) {
        return key.startsWith(`${this.dbname}/`);
    }
    _getActualKey(key) {
        return `${this.dbname}/${key}`;
    }
    init(dbname) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbname = dbname;
        });
    }
    getAllKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const allKeys = yield this._asyncStorage.getAllKeys();
            const filteredKeys = allKeys.filter((key) => this._isBelonging(key));
            return filteredKeys.map((key) => key.substr(`${this.dbname}/`.length));
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._encryption.decrypt(JSON.parse(yield this._asyncStorage.getItem(this._getActualKey(key))));
        });
    }
    set(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, value } = item;
            const serialized = JSON.stringify(this._encryption.encrypt(value));
            if (serialized.length < this.itemSizeLimit) {
                yield this._asyncStorage.setItem(this._getActualKey(key), serialized);
                return JSON.parse(serialized);
            }
            else {
                throw error_1.default.storeItemSizeExceeded;
            }
        });
    }
    setMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const item of items) {
                try {
                    const { key, value } = item;
                    const serialized = JSON.stringify(this._encryption.encrypt(value));
                    if (serialized.length < this.itemSizeLimit) {
                        yield this._asyncStorage.setItem(this._getActualKey(key), serialized);
                        results.push(value);
                    }
                    else {
                        results.push(error_1.default.storeItemSizeExceeded);
                    }
                }
                catch (err) {
                    results.push(error_1.default.collectionWriteFailed);
                }
            }
            return results;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._asyncStorage.removeItem(this._getActualKey(key));
            return key;
        });
    }
    removeMany(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key of keys) {
                yield this._asyncStorage.removeItem(this._getActualKey(key));
            }
            return keys;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield this.getAllKeys();
            yield this.removeMany(keys);
        });
    }
}
exports.default = AsyncStorageStore;
//# sourceMappingURL=index.js.map