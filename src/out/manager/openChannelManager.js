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
const error_1 = require("../error");
const openChannelCache_1 = require("../cache/openChannelCache");
const websocketEventCommand_1 = require("../core/command/websocket/websocketEventCommand");
const types_1 = require("../model/channel/types");
const openChannel_1 = require("../model/channel/openChannel");
const openChannelCreateParams_1 = require("../model/params/openChannelCreateParams");
const stateType_1 = require("../comm/connectionManager/stateType");
const connectionStateChangeCommand_1 = require("../comm/command/internal/connectionStateChangeCommand");
const getOpenChannelCommand_1 = require("../comm/command/channel/open/getOpenChannelCommand");
const createOpenChannelCommand_1 = require("../comm/command/channel/open/createOpenChannelCommand");
const enterOpenChannelCommand_1 = require("../comm/command/channel/open/enterOpenChannelCommand");
const exitOpenChannelCommand_1 = require("../comm/command/channel/open/exitOpenChannelCommand");
const channelEvent_1 = require("../comm/event/channelEvent");
const channelEventCommand_1 = require("../comm/command/channel/channelEventCommand");
const operatorUpdateEventCommand_1 = require("../comm/command/channel/operatorUpdateEventCommand");
const memberCountUpdateEventCommand_1 = require("../comm/command/channel/memberCountUpdateEventCommand");
const muteUserCommand_1 = require("../comm/command/channel/muteUserCommand");
const unmuteUserCommand_1 = require("../comm/command/channel/unmuteUserCommand");
const banUserCommand_1 = require("../comm/command/channel/banUserCommand");
const unbanUserCommand_1 = require("../comm/command/channel/unbanUserCommand");
const freezeCommand_1 = require("../comm/command/channel/freezeCommand");
const updateMetaDataCommand_1 = require("../comm/command/channel/updateMetaDataCommand");
const updateMetaCountersCommand_1 = require("../comm/command/channel/updateMetaCountersCommand");
const userMessageCommand_1 = require("../comm/command/message/userMessageCommand");
const fileMessageCommand_1 = require("../comm/command/message/fileMessageCommand");
const adminMessageCommand_1 = require("../comm/command/message/adminMessageCommand");
const updateUserMessageCommand_1 = require("../comm/command/message/updateUserMessageCommand");
const updateFileMessageCommand_1 = require("../comm/command/message/updateFileMessageCommand");
const updateAdminMessageCommand_1 = require("../comm/command/message/updateAdminMessageCommand");
const deleteMessageCommand_1 = require("../comm/command/message/deleteMessageCommand");
const reactionCommand_1 = require("../comm/command/message/reactionCommand");
const threadInfoUpdateEventCommand_1 = require("../comm/command/message/threadInfoUpdateEventCommand");
const unless_1 = require("../utils/unless");
const validator_1 = require("../utils/validator");
const serializer_1 = require("../utils/serializer");
const _managerMap = {};
class OpenChannelManager {
    constructor(_iid, { sdkState, dispatcher, requestQueue, }) {
        this._sdkState = sdkState;
        this._requestQueue = requestQueue;
        this._dispatcher = dispatcher;
        this._openChannelCache = new openChannelCache_1.default(_iid);
        this._openChannelHandlers = new Map();
        this._dispatcher.on((command) => {
            if (command instanceof websocketEventCommand_1.default) {
                this._handleEvent(command);
            }
            else if (command instanceof connectionStateChangeCommand_1.default) {
                if (command.stateType === stateType_1.ConnectionStateType.CONNECTED) {
                    const { enteredChannels } = this._openChannelCache;
                    for (const channel of enteredChannels) {
                        channel.enter();
                    }
                }
            }
        });
        _managerMap[_iid] = this;
    }
    static of(_iid) {
        return _managerMap[_iid];
    }
    buildOpenChannelFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        return new openChannel_1.default(obj['_iid'], openChannel_1.default.payloadify(obj));
    }
    getChannelFromCache(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._openChannelCache.get(channelUrl);
        });
    }
    upsertChannelsToCache(channels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._openChannelCache.upsert(channels);
        });
    }
    removeChannelsFromCache(channelUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const channelUrl of channelUrls) {
                yield this._openChannelCache.remove(channelUrl);
            }
        });
    }
    setEnteredToCache(channel) {
        this._openChannelCache.enter(channel.url);
    }
    setExitedToCache(channel) {
        this._openChannelCache.exit(channel.url);
    }
    _handleEvent(command) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (command.code) {
                case 'MESG':
                case 'FILE':
                case 'ADMM':
                case 'BRDM': {
                    let translatedCommand = null;
                    if (command.code === 'MESG')
                        translatedCommand = command.as(userMessageCommand_1.UserMessageEventCommand);
                    else if (command.code === 'FILE')
                        translatedCommand = command.as(fileMessageCommand_1.FileMessageEventCommand);
                    else if (command.code === 'ADMM' || command.code == 'BRDM')
                        translatedCommand = command.as(adminMessageCommand_1.AdminMessageEventCommand);
                    if (translatedCommand) {
                        const { message, isMentioned } = translatedCommand;
                        if (message.channelType === types_1.ChannelType.OPEN) {
                            const channel = yield this.getChannel(message.channelUrl, true);
                            for (const handler of this._openChannelHandlers.values()) {
                                if (this._openChannelCache.isEnteredChannel(channel.url))
                                    handler.onMessageReceived(channel, message);
                                if (isMentioned)
                                    handler.onMentionReceived(channel, message);
                            }
                        }
                    }
                    break;
                }
                case 'MEDI':
                case 'FEDI':
                case 'AEDI': {
                    let translatedCommand = null;
                    if (command.code === 'MEDI')
                        translatedCommand = command.as(updateUserMessageCommand_1.UpdateUserMessageEventCommand);
                    else if (command.code === 'FEDI')
                        translatedCommand = command.as(updateFileMessageCommand_1.UpdateFileMessageEventCommand);
                    else if (command.code === 'AEDI')
                        translatedCommand = command.as(updateAdminMessageCommand_1.UpdateAdminMessageEventCommand);
                    if (translatedCommand) {
                        const { message } = translatedCommand;
                        if (message.channelType === types_1.ChannelType.OPEN) {
                            try {
                                const channel = yield this.getChannel(message.channelUrl, true);
                                for (const handler of this._openChannelHandlers.values()) {
                                    if (this._openChannelCache.isEnteredChannel(channel.url))
                                        handler.onMessageUpdated(channel, message);
                                }
                            }
                            catch (_) { }
                        }
                    }
                    break;
                }
                case 'DELM': {
                    const { channelUrl, channelType, messageId } = command.as(deleteMessageCommand_1.DeleteMessageEventCommand);
                    if (channelType === types_1.ChannelType.OPEN) {
                        try {
                            const channel = yield this.getChannel(channelUrl, true);
                            for (const handler of this._openChannelHandlers.values()) {
                                if (this._openChannelCache.isEnteredChannel(channel.url))
                                    handler.onMessageDeleted(channel, messageId);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'MRCT': {
                    const { channelUrl, channelType, event } = command.as(reactionCommand_1.ReactionEventCommand);
                    if (channelType === types_1.ChannelType.OPEN) {
                        try {
                            const channel = yield this.getChannel(channelUrl, true);
                            for (const handler of this._openChannelHandlers.values()) {
                                handler.onReactionUpdated(channel, event);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'MTHD': {
                    const { event } = command.as(threadInfoUpdateEventCommand_1.ThreadInfoUpdateEventCommand);
                    if (event.channelType === types_1.ChannelType.OPEN) {
                        try {
                            const channel = yield this.getChannel(event.channelUrl, true);
                            for (const handler of this._openChannelHandlers.values()) {
                                handler.onThreadInfoUpdated(channel, event);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'MCNT': {
                    const { openChannelMemberCounts } = command.as(memberCountUpdateEventCommand_1.MemberCountUpdateEventCommand);
                    const dirtyChannels = [];
                    for (const countInfo of openChannelMemberCounts) {
                        try {
                            const { channelUrl, participantCount, updatedAt, } = countInfo;
                            const channel = yield this.getChannelFromCache(channelUrl);
                            if (channel) {
                                if (channel._updateParticipantCount(participantCount, updatedAt)) {
                                    dirtyChannels.push(channel);
                                }
                            }
                        }
                        catch (_) { }
                    }
                    if (dirtyChannels.length > 0) {
                        try {
                            yield this.upsertChannelsToCache(dirtyChannels);
                            for (const handler of this._openChannelHandlers.values()) {
                                handler.onChannelMemberCountChanged(dirtyChannels);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'SYEV': {
                    const { event } = command.as(channelEventCommand_1.ChannelEventCommand);
                    if (event.isOpenChannelEvent) {
                        switch (event.category) {
                            case channelEvent_1.ChannelEventCategory.CHANNEL_ENTER: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { participantCount, user } = command.as(enterOpenChannelCommand_1.EnterOpenChannelEventCommand);
                                const isParticipantCountChanged = channel._updateParticipantCount(participantCount, event.ts);
                                this._openChannelHandlers.forEach((handler) => {
                                    handler.onUserEntered(channel, user);
                                    if (isParticipantCountChanged)
                                        handler.onChannelParticipantCountChanged(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_EXIT: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { participantCount, user } = command.as(exitOpenChannelCommand_1.ExitOpenChannelEventCommand);
                                const isParticipantCountChanged = channel._updateParticipantCount(participantCount, event.ts);
                                this._openChannelHandlers.forEach((handler) => {
                                    handler.onUserExited(channel, user);
                                    if (isParticipantCountChanged)
                                        handler.onChannelParticipantCountChanged(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_OPERATOR_UPDATE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { operators } = command.as(operatorUpdateEventCommand_1.OperatorUpdateEventCommand);
                                channel.operators = operators;
                                this.upsertChannelsToCache([channel]);
                                this._openChannelHandlers.forEach((handler) => {
                                    handler.onOperatorUpdated(channel, operators);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_MUTE:
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_UNMUTE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const isMuted = event.category === channelEvent_1.ChannelEventCategory.USER_CHANNEL_MUTE;
                                const { user } = command.as(isMuted ? muteUserCommand_1.MuteUserEventCommand : unmuteUserCommand_1.UnmuteUserEventCommand);
                                this._openChannelHandlers.forEach((handler) => {
                                    isMuted ? handler.onUserMuted(channel, user) : handler.onUserUnmuted(channel, user);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_BAN:
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_UNBAN: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const isBanned = event.category === channelEvent_1.ChannelEventCategory.USER_CHANNEL_BAN;
                                const { user } = command.as(isBanned ? banUserCommand_1.BanUserEventCommand : unbanUserCommand_1.UnbanUserEventCommand);
                                this._openChannelHandlers.forEach((handler) => {
                                    isBanned ? handler.onUserBanned(channel, user) : handler.onUserUnbanned(channel, user);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_FREEZE:
                            case channelEvent_1.ChannelEventCategory.CHANNEL_UNFREEZE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { freeze } = command.as(freezeCommand_1.FreezeEventCommand);
                                channel.isFrozen = freeze;
                                this.upsertChannelsToCache([channel]);
                                this._openChannelHandlers.forEach((handler) => {
                                    freeze ? handler.onChannelFrozen(channel) : handler.onChannelUnfrozen(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_DELETED: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                yield this.removeChannelsFromCache([channel.url]);
                                this._openChannelHandlers.forEach((handler) => {
                                    handler.onChannelDeleted(channel.url, channel.channelType);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_PROP_CHANGED: {
                                const channel = yield this.getChannelWithoutCache(event.channelUrl, true);
                                this._openChannelHandlers.forEach((handler) => {
                                    handler.onChannelChanged(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_META_DATA_CHANGED: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { created, updated, deleted } = command.as(updateMetaDataCommand_1.UpdateMetaDataEventCommand);
                                if (created)
                                    channel._upsertCachedMetaData(created, event.ts);
                                if (updated)
                                    channel._upsertCachedMetaData(updated, event.ts);
                                if (deleted)
                                    channel._removeFromCachedMetaData(deleted, event.ts);
                                this._openChannelHandlers.forEach((handler) => {
                                    if (created)
                                        handler.onMetaDataCreated(channel, created);
                                    if (updated)
                                        handler.onMetaDataUpdated(channel, updated);
                                    if (deleted)
                                        handler.onMetaDataDeleted(channel, deleted);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_META_COUNTERS_CHANGED: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { created, updated, deleted } = command.as(updateMetaCountersCommand_1.UpdateMetaCounterEventCommand);
                                this._openChannelHandlers.forEach((handler) => {
                                    if (created)
                                        handler.onMetaCounterCreated(channel, created);
                                    if (updated)
                                        handler.onMetaCounterUpdated(channel, updated);
                                    if (deleted)
                                        handler.onMetaCounterDeleted(channel, deleted);
                                });
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        });
    }
    addHandler(key, handler) {
        this._openChannelHandlers.set(key, handler);
    }
    removeHandler(key) {
        this._openChannelHandlers.delete(key);
    }
    clearHandler() {
        this._openChannelHandlers.clear();
    }
    getChannel(channelUrl, internal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', channelUrl))
                .throw(error_1.default.invalidParameters);
            try {
                const cachedChannel = yield this.getChannelFromCache(channelUrl);
                if (cachedChannel)
                    return cachedChannel;
            }
            catch (err) {
            }
            return yield this.getChannelWithoutCache(channelUrl);
        });
    }
    getChannelWithoutCache(channelUrl, internal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', channelUrl))
                .throw(error_1.default.invalidParameters);
            const request = new getOpenChannelCommand_1.GetOpenChannelRequestCommand({
                channelUrl,
                isInternalCall: internal,
            });
            const response = yield this._requestQueue.send(request);
            const { channel } = response.as(getOpenChannelCommand_1.GetOpenChannelResponseCommand);
            yield this.upsertChannelsToCache([channel]);
            return channel;
        });
    }
    createChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof openChannelCreateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const request = new createOpenChannelCommand_1.CreateOpenChannelRequestCommand(params);
            const response = yield this._requestQueue.send(request);
            const { channel } = response.as(getOpenChannelCommand_1.GetOpenChannelResponseCommand);
            this.upsertChannelsToCache([channel]);
            return channel;
        });
    }
}
exports.default = OpenChannelManager;
//# sourceMappingURL=openChannelManager.js.map