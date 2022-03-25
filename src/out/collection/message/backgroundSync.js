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
const vault_1 = require("../../vault");
const sync_1 = require("../sync");
const stateType_1 = require("../../comm/connectionManager/stateType");
const messageManager_1 = require("../../manager/messageManager");
const connectionStateChangeCommand_1 = require("../../comm/command/internal/connectionStateChangeCommand");
const messageEventCommand_1 = require("../../comm/command/internal/messageEventCommand");
const timeRange_1 = require("../../utils/timeRange");
const _instanceMap = {};
const createMessageBackgroundSyncKey = (userId, channelUrl) => {
    return `sendbird:${userId}@groupchannel/${channelUrl}/message/sync`;
};
const createMessageBackgroundSyncMetadataKey = (userId, channelUrl) => {
    return `sendbird:${userId}@groupchannel/${channelUrl}/message/sync.meta`;
};
const DEFAULT_SYNC_LIMIT = 100;
class MessageBackgroundSync {
    constructor({ _iid, channel }) {
        this._prevSync = null;
        this._nextSync = null;
        this._metadata = null;
        this._iid = _iid;
        this._channel = channel;
        const { sdkState } = vault_1.default.of(this._iid);
        this._metadataKey = createMessageBackgroundSyncMetadataKey(sdkState.userId, channel.url);
        const syncKey = createMessageBackgroundSyncKey(sdkState.userId, channel.url);
        this._prevSync = new sync_1.default(syncKey, (ts) => __awaiter(this, void 0, void 0, function* () {
            const result = {
                hasNext: true,
                nextToken: 0,
            };
            yield this.loadMetadata();
            if (!this._metadata.previousComplete) {
                const messageManager = messageManager_1.default.of(this._iid);
                const messages = yield messageManager.getMessagesByTimestamp(this._channel.url, this._channel.channelType, this._metadata.range.top, {
                    prevResultSize: DEFAULT_SYNC_LIMIT,
                    nextResultSize: 0,
                    includeReactions: true,
                    includeMetaArray: true,
                    includeParentMessageInfo: true,
                    includeThreadInfo: true,
                }, messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_BACKGROUND);
                this.extendRange(messages);
                result.hasNext = messages.length >= DEFAULT_SYNC_LIMIT;
                result.nextToken = this._metadata.range.top;
                this._metadata.previousComplete = result.hasNext;
                yield this.saveMetadata();
            }
            else {
                result.hasNext = false;
            }
            return result;
        }));
        this._nextSync = new sync_1.default(syncKey, (ts) => __awaiter(this, void 0, void 0, function* () {
            const result = {
                hasNext: true,
                nextToken: 0,
            };
            yield this.loadMetadata();
            const messageManager = messageManager_1.default.of(this._iid);
            const messages = yield messageManager.getMessagesByTimestamp(this._channel.url, this._channel.channelType, this._metadata.range.top, {
                prevResultSize: 0,
                nextResultSize: DEFAULT_SYNC_LIMIT,
                includeReactions: true,
                includeMetaArray: true,
                includeParentMessageInfo: true,
                includeThreadInfo: true,
            }, messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_BACKGROUND);
            this.extendRange(messages);
            result.hasNext = messages.length >= DEFAULT_SYNC_LIMIT;
            result.nextToken = this._metadata.range.bottom;
            yield this.saveMetadata();
            return result;
        }));
    }
    static of(_iid, channel) {
        if (!_instanceMap[_iid])
            _instanceMap[_iid] = {};
        if (!_instanceMap[_iid][channel.url]) {
            const sync = _instanceMap[_iid][channel.url] = new MessageBackgroundSync({ _iid, channel });
            const { dispatcher } = vault_1.default.of(_iid);
            dispatcher.on((command) => {
                if (command instanceof connectionStateChangeCommand_1.default) {
                    switch (command.stateType) {
                        case stateType_1.ConnectionStateType.CONNECTED:
                            sync.resume();
                            break;
                        default:
                            sync.pause();
                    }
                }
            });
        }
        return _instanceMap[_iid][channel.url];
    }
    get range() {
        var _a;
        return (_a = this._metadata) === null || _a === void 0 ? void 0 : _a.range;
    }
    get previousComplete() {
        var _a;
        return (_a = this._metadata) === null || _a === void 0 ? void 0 : _a.previousComplete;
    }
    extendRange(messages) {
        if (this._metadata) {
            this._metadata.range.extends(...messages.map((message) => message.createdAt));
        }
    }
    loadMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._metadata) {
                const { cacheContext } = vault_1.default.of(this._iid);
                const rawMetadata = yield cacheContext.store.get(this._metadataKey);
                this._metadata = {
                    range: new timeRange_1.default(rawMetadata ? rawMetadata.range : {
                        top: Number.MAX_SAFE_INTEGER,
                        bottom: 0,
                    }),
                    previousComplete: rawMetadata ? rawMetadata.previousComplete : false,
                };
            }
        });
    }
    saveMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._metadata) {
                const { cacheContext } = vault_1.default.of(this._iid);
                yield cacheContext.store.set({
                    key: this._metadataKey,
                    value: this._metadata,
                    generation: 1,
                });
            }
        });
    }
    resume() {
        var _a, _b, _c, _d;
        if (this._metadata && !this._metadata.previousComplete) {
            this._prevSync.start((_b = (_a = this._metadata) === null || _a === void 0 ? void 0 : _a.range.top) !== null && _b !== void 0 ? _b : Date.now());
        }
        this._nextSync.start((_d = (_c = this._metadata) === null || _c === void 0 ? void 0 : _c.range.bottom) !== null && _d !== void 0 ? _d : Date.now());
    }
    pause() {
        this._prevSync.stop();
        this._nextSync.stop();
    }
}
exports.default = MessageBackgroundSync;
//# sourceMappingURL=backgroundSync.js.map