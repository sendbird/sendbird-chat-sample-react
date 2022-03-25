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
const groupChannelManager_1 = require("../../manager/groupChannelManager");
const stateType_1 = require("../../comm/connectionManager/stateType");
const connectionStateChangeCommand_1 = require("../../comm/command/internal/connectionStateChangeCommand");
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const _instanceMap = {};
const createGroupChannelChangelogSyncKey = (userId) => {
    return `sendbird:${userId}@groupchannel/changelogs`;
};
const createGroupChannelChangelogSyncMetadataKey = (userId) => {
    return `sendbird:${userId}@groupchannel/changelogs.meta`;
};
class GroupChannelChangelogSync {
    constructor({ _iid }) {
        this._sync = null;
        this._metadataKey = null;
        this._metadata = null;
        this._iid = _iid;
        const { sdkState } = vault_1.default.of(this._iid);
        this._metadataKey = createGroupChannelChangelogSyncMetadataKey(sdkState.userId);
        const syncKey = createGroupChannelChangelogSyncKey(sdkState.userId);
        this._sync = new sync_1.default(syncKey, () => __awaiter(this, void 0, void 0, function* () {
            const result = {
                hasNext: true,
                nextToken: 0,
            };
            yield this.loadMetadata();
            const groupChannelManager = groupChannelManager_1.default.of(this._iid);
            const { hasMore, token } = yield groupChannelManager.getMyGroupChannelChangeLogs(this._metadata.token, {}, groupChannelEventCommand_1.GroupChannelEventSource.SYNC_CHANNEL_CHANGELOGS);
            result.hasNext = hasMore;
            result.nextToken = token;
            this._metadata.token = token;
            yield this.saveMetadata();
            return result;
        }));
    }
    static of(_iid) {
        if (!_instanceMap[_iid]) {
            const sync = _instanceMap[_iid] = new GroupChannelChangelogSync({ _iid });
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
        return _instanceMap[_iid];
    }
    loadMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._metadata) {
                const { cacheContext } = vault_1.default.of(this._iid);
                const rawMetadata = yield cacheContext.store.get(this._metadataKey);
                this._metadata = {
                    token: rawMetadata ? rawMetadata.token : '',
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
exports.default = GroupChannelChangelogSync;
//# sourceMappingURL=changelogSync.js.map