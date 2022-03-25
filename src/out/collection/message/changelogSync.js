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
const connectionStateChangeCommand_1 = require("../../comm/command/internal/connectionStateChangeCommand");
const messageEventCommand_1 = require("../../comm/command/internal/messageEventCommand");
const messageManager_1 = require("../../manager/messageManager");
const _instanceMap = {};
const createMessageChangelogSyncKey = (userId, channelUrl) => {
    return `sendbird:${userId}@groupchannel/${channelUrl}/message/changelogs`;
};
const createMessageChangelogSyncMetadataKey = (userId, channelUrl) => {
    return `sendbird:${userId}@groupchannel/${channelUrl}/message/changelogs.meta`;
};
class MessageChangelogSync {
    constructor({ _iid, channel }) {
        this._sync = null;
        this._metadata = null;
        this._iid = _iid;
        this._channel = channel;
        const { sdkState } = vault_1.default.of(this._iid);
        this._metadataKey = createMessageChangelogSyncMetadataKey(sdkState.userId, channel.url);
        const syncKey = createMessageChangelogSyncKey(sdkState.userId, this._channel.url);
        this._sync = new sync_1.default(syncKey, () => __awaiter(this, void 0, void 0, function* () {
            const result = {
                hasNext: true,
                nextToken: 0,
            };
            yield this.loadMetadata();
            const messageManager = messageManager_1.default.of(this._iid);
            const { hasMore, token } = yield messageManager.getMessageChangelogs(this._channel.url, this._channel.channelType, this._metadata.token, {}, messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_CHANGELOGS);
            result.hasNext = hasMore;
            result.nextToken = token;
            this._metadata.token = token;
            yield this.saveMetadata();
            return result;
        }));
    }
    static of(_iid, channel) {
        if (!_instanceMap[_iid])
            _instanceMap[_iid] = {};
        if (!_instanceMap[_iid][channel.url]) {
            const sync = _instanceMap[_iid][channel.url] = new MessageChangelogSync({ _iid, channel });
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
    loadMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._metadata) {
                const { cacheContext } = vault_1.default.of(this._iid);
                const rawMetadata = yield cacheContext.store.get(this._metadataKey);
                this._metadata = {
                    token: rawMetadata ? rawMetadata.token : 0,
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
        this._sync.start(0);
    }
    pause() {
        this._sync.stop();
    }
}
exports.default = MessageChangelogSync;
//# sourceMappingURL=changelogSync.js.map