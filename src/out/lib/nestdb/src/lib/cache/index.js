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
exports.CacheGetOptions = exports.CacheState = void 0;
var CacheState;
(function (CacheState) {
    CacheState["PENDING"] = "pending";
    CacheState["PERSISTENT"] = "persistent";
    CacheState["VOLATILE"] = "volatile";
})(CacheState = exports.CacheState || (exports.CacheState = {}));
var CacheGetOptions;
(function (CacheGetOptions) {
    CacheGetOptions[CacheGetOptions["NO_CACHE"] = 0] = "NO_CACHE";
    CacheGetOptions[CacheGetOptions["DEFAULT"] = 1] = "DEFAULT";
    CacheGetOptions[CacheGetOptions["PERSISTENT"] = 2] = "PERSISTENT";
})(CacheGetOptions = exports.CacheGetOptions || (exports.CacheGetOptions = {}));
const DEFAULT_CACHE_LIMIT = 256;
const REPLACABLE_STATE = [
    CacheState.PENDING,
    CacheState.VOLATILE,
];
const _cacheByDbname = {};
class Cache {
    constructor({ dbname, limit = DEFAULT_CACHE_LIMIT, }) {
        if (!_cacheByDbname[dbname]) {
            this.dbname = dbname;
            this._items = [];
            this._limit = limit;
            _cacheByDbname[dbname] = this;
        }
        return _cacheByDbname[dbname];
    }
    static get(dbname) {
        return _cacheByDbname[dbname];
    }
    get items() {
        return this._items;
    }
    find(store, key, options = CacheGetOptions.DEFAULT) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheItem = this.get(key);
            if (!cacheItem) {
                const value = yield store.get(key);
                if (value) {
                    cacheItem = {
                        key,
                        value,
                        generation: 1,
                        state: (options === CacheGetOptions.PERSISTENT) ? CacheState.PERSISTENT : CacheState.VOLATILE,
                    };
                    this.put(cacheItem);
                }
            }
            else {
                if (options === CacheGetOptions.PERSISTENT) {
                    cacheItem.state = CacheState.PERSISTENT;
                }
            }
            return cacheItem;
        });
    }
    get(key, options = CacheGetOptions.DEFAULT) {
        const cacheIndex = this._items.map((cacheItem) => cacheItem.key).indexOf(key);
        if (cacheIndex > -1) {
            const cacheItem = this._items[cacheIndex];
            if (options === CacheGetOptions.PERSISTENT) {
                cacheItem.state = CacheState.PERSISTENT;
            }
            if (options !== CacheGetOptions.NO_CACHE) {
                this.put(cacheItem);
            }
            return cacheItem;
        }
        return null;
    }
    put(cacheItem) {
        if (this._limit > 0) {
            const cacheIndex = this._items.map((cacheItem) => cacheItem.key).indexOf(cacheItem.key);
            if (cacheIndex > -1) {
                if (REPLACABLE_STATE.includes(this._items[cacheIndex].state) && REPLACABLE_STATE.includes(cacheItem.state)) {
                    this._items.splice(cacheIndex, 1);
                    this._items.push(cacheItem);
                }
                else {
                    this._items[cacheIndex].state = cacheItem.state;
                    this._items[cacheIndex].generation = cacheItem.generation;
                    this._items[cacheIndex].value = cacheItem.value;
                }
            }
            else {
                this._items.push(cacheItem);
                const volatileCache = this._items.filter((cacheItem) => cacheItem.state === CacheState.VOLATILE);
                let overflow = volatileCache.length - this._limit;
                if (overflow > 0) {
                    const shrinkedCache = [];
                    for (const cacheItem of this._items) {
                        if (cacheItem.state === CacheState.VOLATILE) {
                            if (overflow > 0) {
                                overflow--;
                                continue;
                            }
                        }
                        shrinkedCache.push(cacheItem);
                    }
                    this._items = shrinkedCache;
                }
            }
        }
    }
    remove(key) {
        const cacheIndex = this._items.map((cacheItem) => cacheItem.key).indexOf(key);
        if (cacheIndex > -1) {
            this._items.splice(cacheIndex, 1);
        }
    }
    clearByCondition(condition) {
        this._items = this._items.filter((cacheItem) => !condition(cacheItem));
    }
    clear(force = false) {
        this._items = !force ?
            this._items.filter((cacheItem) => cacheItem.state !== CacheState.VOLATILE) :
            [];
    }
}
exports.default = Cache;
//# sourceMappingURL=index.js.map