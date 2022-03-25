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
exports.NESTDB_UNSENT_MESSAGE_COLLECTION_KEY = exports.NESTDB_UNSENT_MESSAGE_COLLECTION_NAME = void 0;
const error_1 = require("../error");
const instancedObject_1 = require("../model/instancedObject");
const messageFilter_1 = require("./messageFilter");
const messageListOrder_1 = require("../model/message/messageListOrder");
const messageManager_1 = require("../manager/messageManager");
exports.NESTDB_UNSENT_MESSAGE_COLLECTION_NAME = 'UnsentMessage';
exports.NESTDB_UNSENT_MESSAGE_COLLECTION_KEY = 'reqId';
class UnsentMessageCache extends instancedObject_1.default {
    constructor(_iid, { sdkState, cacheContext, }) {
        super(_iid);
        this._sdkState = sdkState;
        this._cacheContext = cacheContext;
    }
    get collection() {
        const { nestdb } = this._cacheContext;
        return nestdb && nestdb.collection(exports.NESTDB_UNSENT_MESSAGE_COLLECTION_NAME);
    }
    get localCacheEnabled() {
        const { localCacheEnabled } = this._cacheContext;
        return localCacheEnabled && !!this.collection;
    }
    _serialize(message) {
        if (message.messageId > 0)
            throw error_1.default.invalidParameters;
        return message.serialize();
    }
    _deserialize(serialized) {
        if (serialized) {
            serialized = Object.assign(Object.assign({}, serialized), { messageId: parseInt(serialized['messageId']) });
            const manager = messageManager_1.default.of(this._iid);
            return manager.buildMessageFromSerializedData(serialized);
        }
        return null;
    }
    get(reqId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                const serialized = yield this.collection.getByKey(`${reqId}`);
                if (serialized)
                    return this._deserialize(serialized);
            }
            return null;
        });
    }
    fetch({ channelUrl, filter = new messageFilter_1.default(), order = messageListOrder_1.MessageListOrder.CHANNEL_LATEST, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                const index = (0, messageListOrder_1.getMessageIndexBy)(order);
                const queryParams = {
                    where: {
                        'channelUrl': channelUrl,
                        '/where': (item) => filter.match(this._deserialize(item)),
                    },
                    index,
                };
                const query = yield this.collection.query(queryParams);
                const result = yield query.fetch({});
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
    remove(reqIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                for (const reqId of reqIds) {
                    yield this.collection.remove(reqId);
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
}
exports.default = UnsentMessageCache;
//# sourceMappingURL=unsentMessageCache.js.map