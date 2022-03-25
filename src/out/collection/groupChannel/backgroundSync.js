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
const groupChannelManager_1 = require("../../manager/groupChannelManager");
const groupChannelListOrder_1 = require("../../model/channel/groupChannelListOrder");
const connectionStateChangeCommand_1 = require("../../comm/command/internal/connectionStateChangeCommand");
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const timeRange_1 = require("../../utils/timeRange");
const _instanceMap = {};
const createGroupChannelBackgroundSyncKey = (userId) => {
    return `sendbird:${userId}@groupchannel/sync`;
};
const createGroupChannelBackgroundSyncMetadatakey = (userId) => {
    return `sendbird:${userId}@groupchannel/sync.meta`;
};
const DEFAULT_SYNC_LIMIT = 100;
class GroupChannelBackgroundSync {
    constructor({ _iid }) {
        this._sync = null;
        this._metadata = null;
        this._iid = _iid;
        const { sdkState } = vault_1.default.of(this._iid);
        this._metadataKey = createGroupChannelBackgroundSyncMetadatakey(sdkState.userId);
        const syncKey = createGroupChannelBackgroundSyncKey(sdkState.userId);
        this._sync = new sync_1.default(syncKey, () => __awaiter(this, void 0, void 0, function* () {
            const result = {
                hasNext: true,
                nextToken: '',
            };
            yield this.loadMetadata();
            if (!this._metadata.completed) {
                const groupChannelManager = groupChannelManager_1.default.of(this._iid);
                const { channels, token } = yield groupChannelManager.getMyGroupChannels(this._metadata.token, {
                    includeEmpty: true,
                    order: groupChannelListOrder_1.GroupChannelListOrder.CHRONOLOGICAL,
                }, DEFAULT_SYNC_LIMIT, groupChannelEventCommand_1.GroupChannelEventSource.SYNC_CHANNEL_BACKGROUND);
                result.hasNext = channels.length >= DEFAULT_SYNC_LIMIT && !!token;
                result.nextToken = token;
                this._metadata.token = token;
                this._metadata.range.extends(...channels.map((channel) => channel.createdAt));
                this._metadata.completed = !result.hasNext;
                yield this.saveMetadata();
            }
            else {
                result.hasNext = false;
                result.nextToken = '';
            }
            return result;
        }));
    }
    static of(_iid) {
        if (!_instanceMap[_iid]) {
            const sync = _instanceMap[_iid] = new GroupChannelBackgroundSync({ _iid });
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
    get range() {
        var _a;
        return (_a = this._metadata) === null || _a === void 0 ? void 0 : _a.range;
    }
    get completed() {
        var _a;
        return (_a = this._metadata) === null || _a === void 0 ? void 0 : _a.completed;
    }
    loadMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._metadata) {
                const { cacheContext } = vault_1.default.of(this._iid);
                const rawMetadata = yield cacheContext.store.get(this._metadataKey);
                this._metadata = {
                    token: rawMetadata ? rawMetadata.token : '',
                    range: new timeRange_1.default(rawMetadata ? rawMetadata.range : {
                        top: Number.MAX_SAFE_INTEGER,
                        bottom: 0,
                    }),
                    completed: rawMetadata ? rawMetadata.completed : false,
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
        var _a, _b;
        this._sync.start((_b = (_a = this._metadata) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : '');
    }
    pause() {
        this._sync.stop();
    }
}
exports.default = GroupChannelBackgroundSync;
//# sourceMappingURL=backgroundSync.js.map