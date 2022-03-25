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
const _1 = require(".");
const hasher_1 = require("./hasher");
const config_1 = require("../../config");
const cache_1 = require("../cache");
const keygen_1 = require("../../util/keygen");
const util_1 = require("../../util");
class BlockManager {
    constructor({ dbname, collectionName, metadata, hashFunction = util_1.sdbm, transaction, store, }) {
        this.dbname = dbname;
        this.collectionName = collectionName;
        this.hashFunction = hashFunction;
        this.metadata = metadata;
        this._transaction = transaction;
        this._store = store;
    }
    get keyName() {
        return this.metadata.keyName;
    }
    createBlockId(key, level = this.metadata.blockLevel) {
        return (0, keygen_1.createBlockKey)(this.dbname, this.collectionName, level, `${(0, hasher_1.hash)(key, level, {
            hashFunction: this.hashFunction,
            base: this.metadata.blockHashBase,
            multiplier: this.metadata.blockHashMultiplier,
            constant: this.metadata.blockHashConstant,
        })}`);
    }
    _findBlock(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = cache_1.default.get(this.dbname);
            for (let level = this.metadata.blockLevel; level > 0; level--) {
                const blockId = this.createBlockId(key, level);
                const cacheItem = yield cache.find(this._store, blockId);
                if (cacheItem) {
                    const block = _1.default.createFromCacheItem(cacheItem);
                    const item = block.getItemByKey(key);
                    if (item)
                        return block;
                }
            }
            return null;
        });
    }
    getFromBlock(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = yield this._findBlock(key);
            return block ? block.getItemByKey(key) : null;
        });
    }
    putToBlock(key, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = config_1.default.get(this.dbname);
            const blockId = this.createBlockId(key);
            const blockLimit = Math.floor(this._store.itemSizeLimit / config.itemSizeLimit);
            const cache = cache_1.default.get(this.dbname);
            const cacheItem = yield cache.find(this._store, blockId);
            const block = cacheItem
                ? _1.default.createFromCacheItem(cacheItem)
                : new _1.default({ blockId, keyName: this.keyName, items: [], limit: blockLimit });
            if (block.add(item)) {
                this._transaction.requestWrite({ key: block.blockId, value: block.serialize() });
                return true;
            }
            return false;
        });
    }
    removeFromBlock(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = yield this._findBlock(key);
            if (block) {
                if (block.remove(key)) {
                    this._transaction.requestWrite({ key: block.blockId, value: block.serialize() });
                    return true;
                }
            }
            return false;
        });
    }
    clearAllBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            const blockKeyPrefix = (0, keygen_1.createBlockKeyPrefix)(this.dbname, this.collectionName);
            const keys = yield this._store.getAllKeys();
            const blockKeys = keys.filter((key) => key.startsWith(blockKeyPrefix));
            yield this._store.removeMany(blockKeys);
            const cache = cache_1.default.get(this.dbname);
            for (const key of blockKeys)
                cache.remove(key);
        });
    }
}
exports.default = BlockManager;
//# sourceMappingURL=manager.js.map