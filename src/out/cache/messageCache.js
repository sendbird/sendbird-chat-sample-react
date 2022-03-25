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
const messageManager_1 = require("../manager/messageManager");
const instancedObject_1 = require("../model/instancedObject");
const messageFilter_1 = require("./messageFilter");
const messageListOrder_1 = require("../model/message/messageListOrder");
const const_1 = require("./const");
class MessageCache extends instancedObject_1.default {
    constructor(_iid, { sdkState, cacheContext, }) {
        super(_iid);
        this._sdkState = sdkState;
        this._cacheContext = cacheContext;
    }
    get collection() {
        const { nestdb } = this._cacheContext;
        return nestdb ? nestdb.collection(const_1.NESTDB_MESSAGE_COLLECTION_NAME) : null;
    }
    get localCacheEnabled() {
        const { localCacheEnabled } = this._cacheContext;
        return localCacheEnabled && !!this.collection;
    }
    _serialize(message) {
        return Object.assign(Object.assign({}, message.serialize()), { messageId: `${message.messageId}` });
    }
    _deserialize(serialized) {
        serialized = Object.assign(Object.assign({}, serialized), { messageId: parseInt(serialized['messageId']) });
        const manager = messageManager_1.default.of(this._iid);
        return manager.buildMessageFromSerializedData(serialized);
    }
    get(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                const serialized = yield this.collection.getByKey(`${messageId}`);
                if (serialized)
                    return this._deserialize(serialized);
            }
            return null;
        });
    }
    fetch({ channelUrl, token, limit = const_1.DEFAULT_MESSAGE_LIMIT, backward = false, filter = new messageFilter_1.default(), order = messageListOrder_1.MessageListOrder.CHANNEL_LATEST, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                const index = (0, messageListOrder_1.getMessageIndexBy)(order);
                const queryParams = {
                    where: {
                        'channelUrl': channelUrl,
                        '/where': (item) => {
                            if (token) {
                                switch (order) {
                                    case messageListOrder_1.MessageListOrder.CHANNEL_LATEST: {
                                        if ((!backward && item['createdAt'] > token) ||
                                            (backward && item['createdAt'] < token)) {
                                            return false;
                                        }
                                        break;
                                    }
                                }
                            }
                            return filter.match(this._deserialize(item));
                        }
                    },
                    index,
                    backward,
                };
                const query = yield this.collection.query(queryParams);
                const result = yield query.fetch({ limit });
                return result.map((serialized) => this._deserialize(serialized));
            }
            return [];
        });
    }
    upsert(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                yield this.collection.upsertMany(messages.map((message) => this._serialize(message)));
            }
        });
    }
    remove(messageIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                for (const messageId of messageIds) {
                    yield this.collection.remove(`${messageId}`);
                }
            }
        });
    }
    removeChannel(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                yield this.collection.removeIf({ channelUrl });
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                yield this.collection.clear();
            }
        });
    }
    countBetween(channelUrl, filter, range) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                const index = (0, messageListOrder_1.getMessageIndexBy)(messageListOrder_1.MessageListOrder.CHANNEL_LATEST);
                const query = this.collection.query({
                    where: {
                        'channelUrl': channelUrl,
                        '/where': (item) => {
                            const message = this._deserialize(item);
                            return range.includes(message.createdAt) && filter.match(message);
                        }
                    },
                    index,
                });
                return yield query.count();
            }
            return 0;
        });
    }
}
exports.default = MessageCache;
//# sourceMappingURL=messageCache.js.map