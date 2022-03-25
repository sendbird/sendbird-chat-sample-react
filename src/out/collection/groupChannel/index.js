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
const context_1 = require("./context");
const backgroundSync_1 = require("./backgroundSync");
const changelogSync_1 = require("./changelogSync");
const groupChannelManager_1 = require("../../manager/groupChannelManager");
const groupChannelListOrder_1 = require("../../model/channel/groupChannelListOrder");
const groupChannelFilter_1 = require("../../cache/groupChannelFilter");
const const_1 = require("../../cache/const");
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const uuid_1 = require("../../utils/uuid");
const utils_1 = require("./utils");
class GroupChannelCollection {
    constructor(_iid, { filter, order, limit, }) {
        this.channels = [];
        this._iid = _iid;
        this._key = `gcc-${(0, uuid_1.uuid)()}`;
        this.filter = filter !== null && filter !== void 0 ? filter : new groupChannelFilter_1.default();
        this.order = order !== null && order !== void 0 ? order : groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE;
        this._token = '';
        this._limit = limit !== null && limit !== void 0 ? limit : const_1.DEFAULT_GROUPCHANNEL_LIMIT;
        backgroundSync_1.default.of(_iid).resume();
        changelogSync_1.default.of(_iid).resume();
        const { sdkState } = vault_1.default.of(this._iid);
        const manager = groupChannelManager_1.default.of(this._iid);
        manager.subscribeGroupChannelEvent(this._key, {
            onUpdate: (channels, source) => {
                const matchedChannels = channels.filter((channel) => this.filter.match(channel, sdkState.userId));
                const unmatchedChannelUrls = channels
                    .filter((channel) => !this.filter.match(channel, sdkState.userId))
                    .map((channel) => channel.url);
                if (matchedChannels.length > 0)
                    this._addChannelsToView(matchedChannels, source);
                if (unmatchedChannelUrls.length > 0)
                    this._removeChannelsFromView(unmatchedChannelUrls, source);
            },
            onRemove: (channelUrls, source) => {
                this._removeChannelsFromView(channelUrls, source);
            },
        });
    }
    get hasMore() {
        return this._hasMore;
    }
    setEventHandler(handler) {
        this._handler = handler;
    }
    _addChannelsToView(channels, source, forceAppend = false) {
        const addedChannels = [];
        const updatedChannels = [];
        for (const channel of channels) {
            const { place, contains } = (0, utils_1.placeOfChannel)(this.channels, channel, this.order);
            if (!contains) {
                if (place === this.channels.length) {
                    const backgroundSync = backgroundSync_1.default.of(this._iid);
                    if (forceAppend || backgroundSync.completed) {
                        addedChannels.push(channel);
                        this.channels.push(channel);
                    }
                }
                else {
                    addedChannels.push(channel);
                    this.channels.splice(place, 0, channel);
                }
            }
            else {
                updatedChannels.push(channel);
                switch (source) {
                    case groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UPDATED:
                    case groupChannelEventCommand_1.GroupChannelEventSource.EVENT_MESSAGE_RECEIVED: {
                        this.channels.splice(place, 1);
                        {
                            const { place } = (0, utils_1.placeOfChannel)(this.channels, channel, this.order);
                            this.channels.splice(place, 0, channel);
                        }
                        break;
                    }
                    default:
                        this.channels[place] = channel;
                }
            }
        }
        if ((0, groupChannelEventCommand_1.shouldGiveEvent)(source)) {
            const context = new context_1.default(source);
            if (addedChannels.length > 0)
                this._handler.onChannelAdded(context, addedChannels);
            if (updatedChannels.length > 0)
                this._handler.onChannelUpdated(context, updatedChannels);
        }
    }
    _removeChannelsFromView(channelUrls, source) {
        const removedChannelUrls = [];
        for (const channelUrl of channelUrls) {
            const index = this.channels.findIndex((channel) => channel.url === channelUrl);
            if (index >= 0) {
                removedChannelUrls.push(this.channels[index].url);
                this.channels.splice(index, 1);
            }
        }
        if ((0, groupChannelEventCommand_1.shouldGiveEvent)(source)) {
            if (removedChannelUrls.length > 0) {
                const context = new context_1.default(source);
                this._handler.onChannelRemoved(context, removedChannelUrls);
            }
        }
        return removedChannelUrls;
    }
    _getLocalChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupChannelManager = groupChannelManager_1.default.of(this._iid);
            return yield groupChannelManager.getChannelsFromCache(this._token, this.filter, this.order);
        });
    }
    _getRemoteChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupChannelManager = groupChannelManager_1.default.of(this._iid);
            const { channels, token } = yield groupChannelManager.getMyGroupChannels(this._token, Object.assign(Object.assign({}, this.filter), { order: this.order }), this._limit);
            this._token = token;
            return channels;
        });
    }
    loadMore() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._hasMore) {
                let channels = yield this._getLocalChannels();
                try {
                    channels = yield this._getRemoteChannels();
                }
                catch (err) {
                }
                this._addChannelsToView(channels, groupChannelEventCommand_1.GroupChannelEventSource.REQUEST_CHANNEL, true);
                return channels;
            }
            return [];
        });
    }
    dispose() {
        const manager = groupChannelManager_1.default.of(this._iid);
        manager.unsubscribeGroupChannelEvent(this._key);
    }
}
exports.default = GroupChannelCollection;
//# sourceMappingURL=index.js.map