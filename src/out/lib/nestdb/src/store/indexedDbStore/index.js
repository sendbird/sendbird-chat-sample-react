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
const compat_1 = require("../../util/compat");
const INDEXEDDB_ITEM_SIZE_LIMIT = 100 * 1024 * 1024;
const INDEXEDDB_STORE_NAME = 'NestDBStore';
class IndexedDbStore {
    constructor(params = {}) {
        this.itemSizeLimit = INDEXEDDB_ITEM_SIZE_LIMIT;
        const { encryption = encrypt_1.DEFAULT_ENCRYPTION } = params;
        this._window = typeof window !== 'undefined' ? window : null;
        this._indexedDB = this._window
            ? this._window.indexedDB || this._window.mozIndexedDB || this._window.webkitIndexedDB || this._window.msIndexedDB
            : null;
        this._encryption = encryption;
    }
    init(dbname) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbname = dbname;
            const isAvailable = new Promise((resolve, reject) => {
                if (this._window && compat_1.isBrowser) {
                    if (compat_1.isFirefoxBrowser) {
                        const db = this._indexedDB.open('_testMozilla');
                        db.onerror = () => reject(error_1.default.storeNotAvailableInPrivateBrowsing);
                        db.onsuccess = () => resolve();
                    }
                    else if (compat_1.isLegacyEdgeBrowser) {
                        if (!this._window.indexedDB && (this._window.PointerEvent || this._window.MSPointerEvent)) {
                            reject(error_1.default.storeNotAvailableInPrivateBrowsing);
                        }
                    }
                    else {
                        resolve();
                    }
                }
                else {
                    reject(error_1.default.storeNotAvailable);
                }
            });
            yield isAvailable;
            this._database = yield new Promise((resolve, reject) => {
                const openDBRequest = this._indexedDB.open(dbname);
                openDBRequest.addEventListener('upgradeneeded', (ev) => {
                    const database = ev.target.result;
                    database.createObjectStore(INDEXEDDB_STORE_NAME, { keyPath: 'key' });
                });
                openDBRequest.addEventListener('success', (ev) => resolve(ev.target.result));
                openDBRequest.addEventListener('error', (ev) => reject(ev.target.error));
            });
        });
    }
    getAllKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readonly').objectStore(INDEXEDDB_STORE_NAME);
                const request = objectStore.getAllKeys();
                request.addEventListener('success', (ev) => resolve(ev.target.result));
                request.addEventListener('error', (ev) => reject(ev.target.error));
            });
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readonly').objectStore(INDEXEDDB_STORE_NAME);
                const request = objectStore.get(key);
                request.addEventListener('success', (ev) => resolve(ev.target.result ? this._encryption.decrypt(ev.target.result['value']) : null));
                request.addEventListener('error', (ev) => reject(ev.target.error));
            });
        });
    }
    set(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, value } = item;
            yield new Promise((resolve, reject) => {
                const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readwrite').objectStore(INDEXEDDB_STORE_NAME);
                const request = objectStore.put({
                    key,
                    value: this._encryption.encrypt(value),
                });
                request.addEventListener('success', (ev) => {
                    resolve(ev.target.result);
                });
                request.addEventListener('error', (ev) => reject(ev.target.error));
            });
            return value;
        });
    }
    setMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            const operations = [];
            const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readwrite').objectStore(INDEXEDDB_STORE_NAME);
            items.forEach((item) => {
                const { key, value } = item;
                operations.push(new Promise((resolve) => {
                    const request = objectStore.put({
                        key,
                        value: this._encryption.encrypt(value),
                    });
                    request.addEventListener('success', (ev) => {
                        resolve(ev.target.result);
                    });
                    request.addEventListener('error', () => {
                        resolve(error_1.default.collectionWriteFailed);
                    });
                }));
            });
            yield Promise.all(operations);
            return items.map((item) => item.value);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readwrite').objectStore(INDEXEDDB_STORE_NAME);
                const request = objectStore.delete(key);
                request.addEventListener('success', () => resolve(key));
                request.addEventListener('error', (ev) => reject(ev.target.error));
            });
        });
    }
    removeMany(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readwrite').objectStore(INDEXEDDB_STORE_NAME);
            return yield Promise.all(keys.map((key) => {
                return new Promise((resolve, reject) => {
                    const request = objectStore.delete(key);
                    request.addEventListener('success', () => resolve(key));
                    request.addEventListener('error', (ev) => reject(ev.target.error));
                });
            }));
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const objectStore = this._database.transaction(INDEXEDDB_STORE_NAME, 'readwrite').objectStore(INDEXEDDB_STORE_NAME);
                const request = objectStore.clear();
                request.addEventListener('success', () => resolve());
                request.addEventListener('error', (ev) => reject(ev.target.error));
            });
        });
    }
}
exports.default = IndexedDbStore;
//# sourceMappingURL=index.js.map