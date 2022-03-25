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
const error_1 = require("../../error");
const keygen_1 = require("../../util/keygen");
const SHARD_SIZE_BUFFER = 1024;
class BlobContainer {
    constructor({ dbname, collectionName, store, }) {
        this.dbname = dbname;
        this.collectionName = collectionName;
        this._store = store;
    }
    _makeShards(blobItem, key) {
        const shardSize = Math.max(this._store.itemSizeLimit - SHARD_SIZE_BUFFER, 0);
        if (shardSize > 0) {
            const numberOfShards = Math.ceil(blobItem.data.length / shardSize);
            const blobId = `${numberOfShards}.${blobItem.type}.${key}`;
            const shards = [];
            for (let i = 0; i < blobItem.data.length; i += shardSize) {
                const shard = blobItem.data.slice(i, i + shardSize);
                shards.push(shard);
            }
            return { blobId, shards };
        }
        return { blobId: null, shards: null };
    }
    _encode(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    resolve({
                        data: fileReader.result,
                        type: blob.type,
                    });
                };
                fileReader.readAsDataURL(blob);
            });
        });
    }
    _decode(blobItem) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof fetch !== 'undefined') {
                const res = yield fetch(blobItem.data);
                return yield res.blob();
            }
            else {
                const sliceSize = 512;
                const byteArrays = [];
                const bytes = atob(blobItem.data.split(',')[1]);
                for (let i = 0; i < bytes.length; i += sliceSize) {
                    const slice = bytes.slice(i, i + sliceSize);
                    const charArray = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        charArray[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(charArray));
                }
                return new Blob(byteArrays, { type: blobItem.type });
            }
        });
    }
    get(blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shards = [];
            const [n, type] = blobId.split('.');
            const numberOfShards = parseInt(n);
            if (numberOfShards > 0) {
                for (let i = 0; i < numberOfShards; i++) {
                    const shardId = (0, keygen_1.createBlobId)(this.dbname, this.collectionName, blobId, i);
                    const shard = yield this._store.get(shardId);
                    if (shard && shard['d'])
                        shards.push(shard['d']);
                    else
                        throw error_1.default.storeBrokenBlob;
                }
                return yield this._decode({
                    data: shards.join(''),
                    type,
                });
            }
            return null;
        });
    }
    save(blob, key = `${Date.now()}`) {
        return __awaiter(this, void 0, void 0, function* () {
            const shardItems = [];
            const blobItem = yield this._encode(blob);
            const { blobId, shards } = this._makeShards(blobItem, key);
            if (blobId) {
                for (let i = 0; i < shards.length; i++) {
                    const shardId = (0, keygen_1.createBlobId)(this.dbname, this.collectionName, blobId, i);
                    shardItems.push({
                        key: shardId,
                        value: { d: shards[i] },
                        generation: 1,
                    });
                }
                const results = yield this._store.setMany(shardItems);
                if (results.some((result) => result instanceof Error)) {
                    throw error_1.default.storeWriteFailed;
                }
                return blobId;
            }
            return null;
        });
    }
    remove(blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shardIds = [];
            const [n] = blobId.split('.');
            const numberOfShards = parseInt(n);
            if (numberOfShards > 0) {
                for (let i = 0; i < numberOfShards; i++) {
                    shardIds.push((0, keygen_1.createBlobId)(this.dbname, this.collectionName, blobId, i));
                }
                yield this._store.removeMany(shardIds);
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = (0, keygen_1.createBlobIdPrefix)(this.dbname, this.collectionName);
            const keysToRemove = [];
            const keys = yield this._store.getAllKeys();
            for (const key of keys) {
                if (key.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }
            yield this._store.removeMany(keys);
        });
    }
}
exports.default = BlobContainer;
//# sourceMappingURL=index.js.map