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
const groupChannelManager_1 = require("../manager/groupChannelManager");
const instancedObject_1 = require("../model/instancedObject");
const groupChannelListOrder_1 = require("../model/channel/groupChannelListOrder");
const groupChannelFilter_1 = require("./groupChannelFilter");
const const_1 = require("./const");
class GroupChannelCache extends instancedObject_1.default {
    constructor(_iid, { sdkState, cacheContext, }) {
        super(_iid);
        this._channels = new Map();
        this._sdkState = sdkState;
        this._cacheContext = cacheContext;
    }
    get collection() {
        const { nestdb } = this._cacheContext;
        return nestdb ? nestdb.collection(const_1.NESTDB_GROUPCHANNEL_COLLECTION_NAME) : null;
    }
    get localCacheEnabled() {
        const { localCacheEnabled } = this._cacheContext;
        return localCacheEnabled && !!this.collection;
    }
    _serialize(channel) {
        return Object.assign(Object.assign({}, channel.serialize()), { lastMessageUpdatedAt: channel.lastMessage ? channel.lastMessage.createdAt : 0 });
    }
    _deserialize(serialized) {
        const manager = groupChannelManager_1.default.of(this._iid);
        return manager.buildGroupChannelFromSerializedData(serialized);
    }
    get channels() {
        return [...this._channels.values()];
    }
    isCachedInMemory(channelUrl) {
        return this._channels.has(channelUrl);
    }
    get(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._channels.has(channelUrl)) {
                if (this.localCacheEnabled) {
                    const serialized = yield this.collection.getByKey(channelUrl);
                    if (serialized) {
                        const channel = this._deserialize(serialized);
                        this._channels.set(channelUrl, channel);
                        return channel;
                    }
                }
                return null;
            }
            else
                return this._channels.get(channelUrl);
        });
    }
    fetch({ token, limit = const_1.DEFAULT_GROUPCHANNEL_LIMIT, backward = false, filter = new groupChannelFilter_1.default(), order = groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.localCacheEnabled) {
                const index = (0, groupChannelListOrder_1.getGroupChannelIndexBy)(order);
                const queryParams = {
                    where: (item) => {
                        if (token) {
                            switch (order) {
                                case groupChannelListOrder_1.GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL: {
                                    if ((!backward && item['name'].localeCompare(token) < 0) ||
                                        (backward && item['name'].localeCompare(token) > 0)) {
                                        return false;
                                    }
                                    break;
                                }
                                case groupChannelListOrder_1.GroupChannelListOrder.CHRONOLOGICAL: {
                                    if ((!backward && item['createdAt'] > token) ||
                                        (backward && item['createdAt'] < token)) {
                                        return false;
                                    }
                                    break;
                                }
                                case groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE: {
                                    if ((!backward && item['lastMessageUpdatedAt'] >= token) ||
                                        (backward && item['lastMessageUpdatedAt'] <= token)) {
                                        return false;
                                    }
                                    break;
                                }
                            }
                        }
                        return filter.match(this._deserialize(item), this._sdkState.userId);
                    },
                    index,
                    backward,
                };
                const query = yield this.collection.query(queryParams);
                const result = yield query.fetch({ limit });
                const channels = result.map((serialized) => this._deserialize(serialized));
                channels.forEach((channel) => {
                    if (!this._channels.has(channel.url)) {
                        this._channels.set(channel.url, channel);
                    }
                });
                return channels;
            }
            return [];
        });
    }
    upsert(channels) {
        return __awaiter(this, void 0, void 0, function* () {
            channels.forEach((channel) => {
                if (this._channels.has(channel.url)) {
                    const originalChannel = this._channels.get(channel.url);
                    Object.assign(originalChannel, channel, { _iid: this._iid });
                }
                else
                    this._channels.set(channel.url, channel);
            });
            if (this.localCacheEnabled) {
                yield this.collection.upsertMany(channels.map((channel) => this._serialize(channel)));
            }
        });
    }
    remove(channelUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const channelUrl of channelUrls) {
                this._channels.delete(channelUrl);
                if (this.localCacheEnabled) {
                    yield this.collection.remove(channelUrl);
                }
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this._channels.clear();
            if (this.localCacheEnabled) {
                yield this.collection.clear();
            }
        });
    }
    _setBlockStateOfAllChannels(blockerId, blockeeId, isBlocking) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedChannels = [];
            if (blockerId === this._sdkState.userId) {
                for (const channel of this._channels.values()) {
                    for (const member of channel.members) {
                        if (member.userId === blockeeId) {
                            member.isBlockedByMe = isBlocking;
                            updatedChannels.push(channel);
                            break;
                        }
                    }
                }
            }
            else if (blockeeId === this._sdkState.userId) {
                for (const channel of this._channels.values()) {
                    for (const member of channel.members) {
                        if (member.userId === blockerId) {
                            member.isBlockingMe = isBlocking;
                            updatedChannels.push(channel);
                            break;
                        }
                    }
                }
            }
            if (updatedChannels.length > 0)
                yield this.upsert(updatedChannels);
        });
    }
    block(blockerId, blockeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._setBlockStateOfAllChannels(blockerId, blockeeId, true);
        });
    }
    unblock(blockerId, blockeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._setBlockStateOfAllChannels(blockerId, blockeeId, false);
        });
    }
    markAsRead(ts, channelUrls = [...this._channels.keys()]) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedChannels = [];
            for (const channelUrl of channelUrls) {
                const channel = yield this.get(channelUrl);
                if (channel._updateUnreadMemberState(this._sdkState.userId, ts)) {
                    channel._updateUnreadCount(0, 0);
                    updatedChannels.push(channel);
                }
            }
            if (updatedChannels.length > 0)
                yield this.upsert(updatedChannels);
        });
    }
}
exports.default = GroupChannelCache;
//# sourceMappingURL=groupChannelCache.js.map