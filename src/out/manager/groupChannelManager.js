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
const groupChannelCache_1 = require("../cache/groupChannelCache");
const messageCache_1 = require("../cache/messageCache");
const unsentMessageCache_1 = require("../cache/unsentMessageCache");
const const_1 = require("../cache/const");
const userEvent_1 = require("../comm/event/userEvent");
const channelEvent_1 = require("../comm/event/channelEvent");
const websocketEventCommand_1 = require("../core/command/websocket/websocketEventCommand");
const types_1 = require("../model/channel/types");
const member_1 = require("../model/channel/member");
const groupChannel_1 = require("../model/channel/groupChannel");
const sendableMessage_1 = require("../model/message/sendableMessage");
const groupChannelCreateParams_1 = require("../model/params/groupChannelCreateParams");
const groupChannelChangeLogsParams_1 = require("../model/params/groupChannelChangeLogsParams");
const groupChannelCountParams_1 = require("../model/params/groupChannelCountParams");
const broadcast_1 = require("../collection/groupChannel/broadcast");
const broadcast_2 = require("../collection/message/broadcast");
const groupChannelEventCommand_1 = require("../comm/command/internal/groupChannelEventCommand");
const messageEventCommand_1 = require("../comm/command/internal/messageEventCommand");
const userEventCommand_1 = require("../comm/command/user/userEventCommand");
const getMyGroupChannelChangelogsCommand_1 = require("../comm/command/user/getMyGroupChannelChangelogsCommand");
const getGroupChannelCommand_1 = require("../comm/command/channel/group/getGroupChannelCommand");
const loadMyGroupChannelList_1 = require("../comm/command/channel/group/loadMyGroupChannelList");
const groupChannelCountCommand_1 = require("../comm/command/channel/group/groupChannelCountCommand");
const createGroupChannelCommand_1 = require("../comm/command/channel/group/createGroupChannelCommand");
const readAllCommand_1 = require("../comm/command/channel/group/readAllCommand");
const joinGroupChannelCommand_1 = require("../comm/command/channel/group/joinGroupChannelCommand");
const leaveGroupChannelCommand_1 = require("../comm/command/channel/group/leaveGroupChannelCommand");
const inviteToGroupChannelCommand_1 = require("../comm/command/channel/group/inviteToGroupChannelCommand");
const declineInvitationCommand_1 = require("../comm/command/channel/group/declineInvitationCommand");
const readCommand_1 = require("../comm/command/channel/group/readCommand");
const deliverCommand_1 = require("../comm/command/channel/group/deliverCommand");
const hideGroupChannelCommand_1 = require("../comm/command/channel/group/hideGroupChannelCommand");
const startTypingCommand_1 = require("../comm/command/channel/group/startTypingCommand");
const endTypingCommand_1 = require("../comm/command/channel/group/endTypingCommand");
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
const messageAckCommand_1 = require("../comm/command/message/messageAckCommand");
const userMessageCommand_1 = require("../comm/command/message/userMessageCommand");
const fileMessageCommand_1 = require("../comm/command/message/fileMessageCommand");
const adminMessageCommand_1 = require("../comm/command/message/adminMessageCommand");
const updateUserMessageCommand_1 = require("../comm/command/message/updateUserMessageCommand");
const updateFileMessageCommand_1 = require("../comm/command/message/updateFileMessageCommand");
const updateAdminMessageCommand_1 = require("../comm/command/message/updateAdminMessageCommand");
const deleteMessageCommand_1 = require("../comm/command/message/deleteMessageCommand");
const reactionCommand_1 = require("../comm/command/message/reactionCommand");
const threadInfoUpdateEventCommand_1 = require("../comm/command/message/threadInfoUpdateEventCommand");
const groupChannelListQuery_1 = require("../query/groupChannelListQuery");
const unless_1 = require("../utils/unless");
const validator_1 = require("../utils/validator");
const serializer_1 = require("../utils/serializer");
const deundefined_1 = require("../utils/deundefined");
const timeRange_1 = require("../utils/timeRange");
const MARK_AS_READ_ALL_RATE_LIMIT_PERIOD = 1000;
const LEFT_CHANNEL_CLEAR_DELAY = 10000;
const _managerMap = {};
class GroupChannelManager {
    constructor(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }) {
        this._leftChannels = new Map();
        this._markAsReadAllLastSentAt = 0;
        this._iid = _iid;
        this._sdkState = sdkState;
        this._sessionManager = sessionManager;
        this._requestQueue = requestQueue;
        this._dispatcher = dispatcher;
        this._groupChannelHandlers = new Map();
        this._groupChannelCache = new groupChannelCache_1.default(this._iid, { sdkState, cacheContext });
        this._messageCache = new messageCache_1.default(this._iid, { sdkState, cacheContext });
        this._unsentMessageCache = new unsentMessageCache_1.default(this._iid, { sdkState, cacheContext });
        this._groupChannelBroadcast = new broadcast_1.default({
            groupChannelCache: this._groupChannelCache,
            messageCache: this._messageCache,
            unsentMessageCache: this._unsentMessageCache,
            dispatcher,
        });
        this._messageBroadcast = new broadcast_2.default({
            messageCache: this._messageCache,
            unsentMessageCache: this._unsentMessageCache,
            dispatcher,
        });
        this._dispatcher.on((command) => {
            if (command instanceof websocketEventCommand_1.default) {
                this._handleEvent(command);
            }
        });
        _managerMap[_iid] = this;
    }
    static of(_iid) {
        return _managerMap[_iid];
    }
    get handlers() {
        return [...this._groupChannelHandlers.values()];
    }
    buildGroupChannelFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        return new groupChannel_1.default(this._iid, groupChannel_1.default.payloadify(obj));
    }
    buildGroupChannelListQueryFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        return new groupChannelListQuery_1.default(this._iid, obj);
    }
    buildMemberFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        return new member_1.default(this._iid, member_1.default.payloadify(obj));
    }
    getChannelFromCache(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._groupChannelCache.get(channelUrl);
        });
    }
    getChannelsFromCache(token, filter, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._groupChannelCache.fetch({
                token,
                filter,
                order,
            });
        });
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
                        const { message, isMentioned, forceUpdateLastMessage } = translatedCommand;
                        if (message.channelType === types_1.ChannelType.GROUP) {
                            try {
                                const mack = new messageAckCommand_1.MessageAckCommand(message);
                                this._requestQueue.send(mack);
                            }
                            catch (_) { }
                            try {
                                const wasCachedInMemory = this._groupChannelCache.isCachedInMemory(message.channelUrl);
                                const isSentByCurrentUser = (message instanceof sendableMessage_1.default) ? message.sender.userId === this._sdkState.userId : false;
                                const channel = yield this.getChannel(message.channelUrl, true);
                                channel.hiddenState = groupChannel_1.HiddenState.UNHIDDEN;
                                if (message instanceof sendableMessage_1.default) {
                                    for (const member of channel.members) {
                                        if (member.userId === message.sender.userId) {
                                            member.nickname = message.sender.nickname;
                                            member.plainProfileUrl = message.sender.plainProfileUrl;
                                            member.metaData = message.sender.metaData;
                                            member.isBlockedByMe = message.sender.isBlockedByMe;
                                            break;
                                        }
                                    }
                                    if (isSentByCurrentUser) {
                                        const { currentUser } = this._sessionManager;
                                        if (currentUser) {
                                            currentUser.nickname = message.sender.nickname;
                                            currentUser.plainProfileUrl = message.sender.plainProfileUrl;
                                            currentUser.metaData = message.sender.metaData;
                                        }
                                    }
                                }
                                if (!message.silent || isSentByCurrentUser) {
                                    if (channel.isEphemeral || wasCachedInMemory) {
                                        if (!channel.lastMessage || channel.lastMessage.createdAt < message.createdAt) {
                                            channel.lastMessage = message;
                                        }
                                        if (!isSentByCurrentUser) {
                                            channel._updateUnreadCount(channel.unreadMessageCount + 1, channel.unreadMentionCount + (isMentioned ? 1 : 0));
                                        }
                                    }
                                }
                                if (forceUpdateLastMessage) {
                                    if (!channel.lastMessage || channel.lastMessage.createdAt < message.createdAt) {
                                        channel.lastMessage = message;
                                    }
                                }
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_MESSAGE_RECEIVED,
                                }));
                                if (!message.silent || isSentByCurrentUser) {
                                    for (const handler of this._groupChannelHandlers.values()) {
                                        handler.onChannelChanged(channel);
                                    }
                                }
                                this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                                    messages: [message],
                                    source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_RECEIVED,
                                }));
                                for (const handler of this._groupChannelHandlers.values()) {
                                    handler.onMessageReceived(channel, message);
                                    if (isMentioned)
                                        handler.onMentionReceived(channel, message);
                                }
                            }
                            catch (_) { }
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
                        const { message, mentionCountChange } = translatedCommand;
                        if (message.channelType === types_1.ChannelType.GROUP) {
                            const wasCachedInMemory = this._groupChannelCache.isCachedInMemory(message.channelUrl);
                            const channel = yield this.getChannel(message.channelUrl, true);
                            const isSentByCurrentUser = (message instanceof sendableMessage_1.default) ? message.sender.userId === this._sdkState.userId : false;
                            let isChannelChanged = false;
                            if (isSentByCurrentUser) {
                                const { currentUser } = this._sessionManager;
                                if (currentUser) {
                                    currentUser.nickname = message.sender.nickname;
                                    currentUser.plainProfileUrl = message.sender.plainProfileUrl;
                                    currentUser.metaData = message.sender.metaData;
                                }
                            }
                            else {
                                if (channel.isReadMessage(message)) {
                                    if (mentionCountChange !== 0) {
                                        if (!message.silent && wasCachedInMemory) {
                                            channel._updateUnreadCount(channel.unreadMessageCount, channel.unreadMentionCount + mentionCountChange);
                                            isChannelChanged = true;
                                        }
                                    }
                                }
                            }
                            if (!channel.lastMessage || channel.lastMessage.createdAt < message.createdAt) {
                                channel.lastMessage = message;
                                isChannelChanged = true;
                            }
                            else if (channel.lastMessage.isIdentical(message)) {
                                if (wasCachedInMemory) {
                                    if (channel.lastMessage.updatedAt < message.updatedAt) {
                                        channel.lastMessage = message;
                                        isChannelChanged = true;
                                    }
                                }
                                else
                                    isChannelChanged = true;
                            }
                            if (isChannelChanged) {
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_MESSAGE_UPDATED,
                                }));
                                if (!message.silent || isSentByCurrentUser) {
                                    for (const handler of this._groupChannelHandlers.values()) {
                                        handler.onChannelChanged(channel);
                                    }
                                }
                            }
                            this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                                messages: [message],
                                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_UPDATED,
                            }));
                            for (const handler of this._groupChannelHandlers.values()) {
                                handler.onMessageUpdated(channel, message);
                                if (mentionCountChange !== 0)
                                    handler.onMentionReceived(channel, message);
                            }
                        }
                    }
                    break;
                }
                case 'DELM': {
                    const { channelUrl, channelType, messageId } = command.as(deleteMessageCommand_1.DeleteMessageEventCommand);
                    if (channelType === types_1.ChannelType.GROUP) {
                        try {
                            const channel = yield this.getChannel(channelUrl, true);
                            this._dispatcher.dispatch(new messageEventCommand_1.MessageRemoveEventCommand({
                                messageIds: [messageId],
                                source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_DELETED,
                            }));
                            for (const handler of this._groupChannelHandlers.values()) {
                                handler.onMessageDeleted(channel, messageId);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'READ': {
                    const { readStatus } = command.as(readCommand_1.ReadEventCommand);
                    if (readStatus.channelType === types_1.ChannelType.GROUP) {
                        try {
                            const wasCachedInMemory = this._groupChannelCache.isCachedInMemory(readStatus.channelUrl);
                            const channel = yield this.getChannel(readStatus.channelUrl, true);
                            if (wasCachedInMemory)
                                channel._updateUnreadMemberState(readStatus.reader.userId, readStatus.readAt);
                            if (readStatus.reader.userId === this._sdkState.userId) {
                                if (wasCachedInMemory) {
                                    if (channel.unreadMessageCount > 0 || channel.unreadMentionCount > 0) {
                                        channel._updateUnreadCount(0, 0);
                                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                            channels: [channel],
                                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_READ,
                                        }));
                                        for (const handler of this._groupChannelHandlers.values()) {
                                            handler.onChannelChanged(channel);
                                        }
                                    }
                                }
                                else {
                                    if (channel.unreadMessageCount === 0 || channel.unreadMentionCount === 0) {
                                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                            channels: [channel],
                                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_READ,
                                        }));
                                        for (const handler of this._groupChannelHandlers.values()) {
                                            handler.onChannelChanged(channel);
                                        }
                                    }
                                }
                            }
                            else {
                                for (const handler of this._groupChannelHandlers.values()) {
                                    handler.onUnreadMemberCountUpdated(channel);
                                }
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'DLVR': {
                    const { channelUrl, deliveredStateUpdate = {} } = command.as(deliverCommand_1.DeliverEventCommand);
                    try {
                        const wasCachedInMemory = this._groupChannelCache.isCachedInMemory(channelUrl);
                        const channel = yield this.getChannel(channelUrl, true);
                        if (wasCachedInMemory) {
                            for (const userId in deliveredStateUpdate) {
                                channel._updateUndeliveredMemberState(userId, deliveredStateUpdate[userId]);
                            }
                        }
                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                            channels: [channel],
                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_DELIVERED,
                        }));
                        if (Object.keys(deliveredStateUpdate).some((userId) => userId !== this._sdkState.userId)) {
                            for (const handler of this._groupChannelHandlers.values()) {
                                handler.onUndeliveredMemberCountUpdated(channel);
                            }
                        }
                    }
                    catch (_) { }
                    break;
                }
                case 'MRCT': {
                    const { channelUrl, channelType, event } = command.as(reactionCommand_1.ReactionEventCommand);
                    if (channelType === types_1.ChannelType.GROUP) {
                        try {
                            const channel = yield this.getChannel(channelUrl, true);
                            const message = yield this.getMessageFromCache(event.messageId);
                            if (message) {
                                message.applyReactionEvent(event);
                                this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                                    messages: [message],
                                    source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_REACTION_UPDATED,
                                }));
                            }
                            for (const handler of this._groupChannelHandlers.values()) {
                                handler.onReactionUpdated(channel, event);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'MTHD': {
                    const { event } = command.as(threadInfoUpdateEventCommand_1.ThreadInfoUpdateEventCommand);
                    if (event.channelType === types_1.ChannelType.GROUP) {
                        try {
                            const channel = yield this.getChannel(event.channelUrl, true);
                            const message = yield this.getMessageFromCache(event.targetMessageId);
                            if (message) {
                                message.applyThreadInfoUpdateEvent(event);
                                this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                                    messages: [message],
                                    source: messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_THREADINFO_UPDATED,
                                }));
                            }
                            for (const handler of this._groupChannelHandlers.values()) {
                                handler.onThreadInfoUpdated(channel, event);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'MCNT': {
                    const { groupChannelMemberCounts } = command.as(memberCountUpdateEventCommand_1.MemberCountUpdateEventCommand);
                    const dirtyChannels = [];
                    for (const countInfo of groupChannelMemberCounts) {
                        try {
                            const { channelUrl, memberCount, joinedMemberCount, updatedAt, } = countInfo;
                            const channel = yield this.getChannelFromCache(channelUrl);
                            if (channel) {
                                if (channel._setLatestMemberCount(memberCount, joinedMemberCount, updatedAt)) {
                                    dirtyChannels.push(channel);
                                }
                            }
                        }
                        catch (_) { }
                    }
                    if (dirtyChannels.length > 0) {
                        try {
                            this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                channels: dirtyChannels,
                                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_MEMBER_COUNT_UPDATED,
                            }));
                            for (const handler of this._groupChannelHandlers.values()) {
                                handler.onChannelMemberCountChanged(dirtyChannels);
                            }
                        }
                        catch (_) { }
                    }
                    break;
                }
                case 'SYEV': {
                    const { event } = command.as(channelEventCommand_1.ChannelEventCommand);
                    if (event.isGroupChannelEvent) {
                        switch (event.category) {
                            case channelEvent_1.ChannelEventCategory.CHANNEL_JOIN: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { memberCount, joinedMemberCount, members, } = command.as(joinGroupChannelCommand_1.JoinGroupChannelEventCommand);
                                let memberCountUpdated = false;
                                members.forEach((member) => {
                                    if (!channel.isSuper && !channel.isBroadcast) {
                                        member.state = member_1.MemberState.JOINED;
                                        channel.addMember(member, event.ts);
                                        this._updateJoinedMemberCount(channel);
                                    }
                                    else {
                                        memberCountUpdated = memberCountUpdated || channel._setLatestMemberCount(memberCount, joinedMemberCount, event.ts);
                                    }
                                    if (member.userId === this._sdkState.userId) {
                                        channel.myMemberState = member_1.MemberState.JOINED;
                                    }
                                });
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_JOINED,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    for (const member of members)
                                        handler.onUserJoined(channel, member);
                                    if (channel.isBroadcast && memberCountUpdated) {
                                        handler.onChannelMemberCountChanged([channel]);
                                    }
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_LEAVE: {
                                const leftChannelInfo = this._leftChannels.get(event.channelUrl);
                                const channel = leftChannelInfo ? leftChannelInfo.channel : yield this.getChannel(event.channelUrl, true);
                                const { memberCount, joinedMemberCount, member, } = command.as(leaveGroupChannelCommand_1.LeaveGroupChannelEventCommand);
                                let memberCountUpdated = false;
                                if (!channel.isSuper && !channel.isBroadcast) {
                                    channel.removeMember(member);
                                    this._updateJoinedMemberCount(channel);
                                }
                                else {
                                    memberCountUpdated = channel._setLatestMemberCount(memberCount, joinedMemberCount, event.ts);
                                }
                                if (member.userId === this._sdkState.userId) {
                                    if (channel.isPublic) {
                                        channel.myMemberState = member_1.MemberState.NONE;
                                        channel.invitedAt = 0;
                                        channel.joinedAt = 0;
                                        channel._updateUnreadCount(0, 0);
                                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                            channels: [channel],
                                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_LEFT,
                                        }));
                                    }
                                    else {
                                        this._markAsLeave(channel);
                                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelRemoveEventCommand({
                                            channelUrls: [channel.url],
                                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_LEFT,
                                        }));
                                    }
                                }
                                else {
                                    this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                        channels: [channel],
                                        source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_LEFT,
                                    }));
                                }
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onUserLeft(channel, member);
                                    if (channel.isBroadcast && memberCountUpdated) {
                                        handler.onChannelMemberCountChanged([channel]);
                                    }
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_OPERATOR_UPDATE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { operators } = command.as(operatorUpdateEventCommand_1.OperatorUpdateEventCommand);
                                const operatorUserIds = operators.map((user) => user.userId);
                                for (const member of channel.members) {
                                    member.role = operatorUserIds.includes(member.userId) ? types_1.Role.OPERATOR : types_1.Role.NONE;
                                }
                                channel.myRole = operatorUserIds.includes(this._sdkState.userId) ? types_1.Role.OPERATOR : types_1.Role.NONE;
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_OPERATOR_UPDATED,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onOperatorUpdated(channel, operators);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_INVITE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { memberCount, joinedMemberCount, inviter, invitees, } = command.as(inviteToGroupChannelCommand_1.InviteToGroupChannelEventCommand);
                                invitees.forEach((member) => member.state = member_1.MemberState.INVITED);
                                for (const invitee of invitees) {
                                    if (!channel.isSuper && !channel.isBroadcast) {
                                        channel.addMember(invitee, event.ts);
                                    }
                                    else {
                                        channel._setLatestMemberCount(memberCount, joinedMemberCount, event.ts);
                                    }
                                    if (this._sdkState.userId === invitee.userId) {
                                        channel.hiddenState = groupChannel_1.HiddenState.UNHIDDEN;
                                        if (channel.myMemberState !== member_1.MemberState.JOINED) {
                                            channel.myMemberState = member_1.MemberState.INVITED;
                                        }
                                        channel.invitedAt = event.ts;
                                    }
                                }
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_INVITED,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onUserReceivedInvitation(channel, inviter, invitees);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_DECLINE_INVITE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { memberCount, joinedMemberCount, inviter, invitee, } = command.as(declineInvitationCommand_1.DeclineInvitationEventCommand);
                                if (!channel.isSuper && !channel.isBroadcast) {
                                    channel.removeMember(invitee);
                                }
                                else {
                                    channel._setLatestMemberCount(memberCount, joinedMemberCount, event.ts);
                                }
                                if (this._sdkState.userId === invitee.userId) {
                                    channel.invitedAt = 0;
                                    channel.myMemberState = member_1.MemberState.NONE;
                                    if (!channel.isPublic) {
                                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelRemoveEventCommand({
                                            channelUrls: [channel.url],
                                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_DECLINED_INVITE,
                                        }));
                                    }
                                    else {
                                        this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                            channels: [channel],
                                            source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_DECLINED_INVITE,
                                        }));
                                    }
                                }
                                else {
                                    this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                        channels: [channel],
                                        source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_DECLINED_INVITE,
                                    }));
                                }
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onUserDeclinedInvitation(channel, inviter, invitee);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.TYPING_START:
                            case channelEvent_1.ChannelEventCategory.TYPING_END: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const isTyping = event.category === channelEvent_1.ChannelEventCategory.TYPING_START;
                                const { user } = command.as(isTyping ? startTypingCommand_1.StartTypingEventCommand : endTypingCommand_1.EndTypingEventCommand);
                                channel._updateTypingStatus(user, isTyping ? event.ts : 0);
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onTypingStatusUpdated(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_MUTE:
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_UNMUTE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const isMuted = event.category === channelEvent_1.ChannelEventCategory.USER_CHANNEL_MUTE;
                                const { user } = command.as(isMuted ? muteUserCommand_1.MuteUserEventCommand : unmuteUserCommand_1.UnmuteUserEventCommand);
                                if (user.userId === this._sdkState.userId) {
                                    channel.myMutedState = isMuted ? groupChannel_1.MutedState.MUTED : groupChannel_1.MutedState.UNMUTED;
                                }
                                for (const member of channel.members) {
                                    if (member.userId === user.userId) {
                                        member.isMuted = isMuted;
                                        break;
                                    }
                                }
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: isMuted ? groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_MUTED : groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UNMUTED,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    isMuted ? handler.onUserMuted(channel, user) : handler.onUserUnmuted(channel, user);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_BAN: {
                                const leftChannelInfo = this._leftChannels.get(event.channelUrl);
                                const channel = leftChannelInfo ? leftChannelInfo.channel : yield this.getChannel(event.channelUrl, true);
                                this._markAsLeave(channel);
                                const { user } = command.as(banUserCommand_1.BanUserEventCommand);
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onUserBanned(channel, user);
                                });
                                break;
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.USER_CHANNEL_UNBAN: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { user } = command.as(unbanUserCommand_1.UnbanUserEventCommand);
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onUserUnbanned(channel, user);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_FREEZE:
                            case channelEvent_1.ChannelEventCategory.CHANNEL_UNFREEZE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { freeze } = command.as(freezeCommand_1.FreezeEventCommand);
                                channel.isFrozen = freeze;
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: freeze ? groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_FROZEN : groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UNFROZEN,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    freeze ? handler.onChannelFrozen(channel) : handler.onChannelUnfrozen(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_HIDE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                const { allowAutoUnhide, hidePreviousMessages, messageOffsetTimestamp } = command.as(hideGroupChannelCommand_1.HideGroupChannelEventCommand);
                                if (allowAutoUnhide !== null) {
                                    channel.hiddenState = allowAutoUnhide ?
                                        groupChannel_1.HiddenState.HIDDEN_ALLOW_AUTO_UNHIDE : groupChannel_1.HiddenState.HIDDEN_PREVENT_AUTO_UNHIDE;
                                }
                                if (hidePreviousMessages !== null && hidePreviousMessages)
                                    channel._updateUnreadCount(0, 0);
                                if (messageOffsetTimestamp !== null)
                                    channel.messageOffsetTimestamp = messageOffsetTimestamp;
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_HIDDEN,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onChannelHidden(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_UNHIDE: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                channel.hiddenState = groupChannel_1.HiddenState.UNHIDDEN;
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UNHIDDEN,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onChannelChanged(channel);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_DELETED: {
                                const channel = yield this.getChannel(event.channelUrl, true);
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelRemoveEventCommand({
                                    channelUrls: [event.channelUrl],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_DELETED,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
                                    handler.onChannelDeleted(channel.url, channel.channelType);
                                });
                                break;
                            }
                            case channelEvent_1.ChannelEventCategory.CHANNEL_PROP_CHANGED: {
                                const channel = yield this.getChannelWithoutCache(event.channelUrl, true);
                                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                                    channels: [channel],
                                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UPDATED,
                                }));
                                this._groupChannelHandlers.forEach((handler) => {
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
                                this._groupChannelHandlers.forEach((handler) => {
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
                                this._groupChannelHandlers.forEach((handler) => {
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
                case 'USEV': {
                    const { event } = command.as(userEventCommand_1.UserEventCommand);
                    switch (event.category) {
                        case userEvent_1.UserEventCategory.USER_BLOCK:
                            const { blocker, blockee } = userEvent_1.default.getDataAsUserBlockEvent(this._iid, event);
                            this._groupChannelCache.block(blocker.userId, blockee.userId);
                            break;
                        case userEvent_1.UserEventCategory.USER_UNBLOCK: {
                            const { blocker, blockee } = userEvent_1.default.getDataAsUserBlockEvent(this._iid, event);
                            this._groupChannelCache.unblock(blocker.userId, blockee.userId);
                            break;
                        }
                    }
                    break;
                }
            }
        });
    }
    _markAsLeave(channel) {
        var _a;
        const leftChannelInfo = (_a = this._leftChannels.get(channel.url)) !== null && _a !== void 0 ? _a : { channel, ref: 0 };
        leftChannelInfo.ref++;
        this._leftChannels.set(channel.url, leftChannelInfo);
        setTimeout(() => {
            leftChannelInfo.ref--;
            if (leftChannelInfo.ref === 0)
                this._leftChannels.delete(channel.url);
        }, LEFT_CHANNEL_CLEAR_DELAY);
    }
    addHandler(key, handler) {
        this._groupChannelHandlers.set(key, handler);
    }
    removeHandler(key) {
        this._groupChannelHandlers.delete(key);
    }
    clearHandler() {
        this._groupChannelHandlers.clear();
    }
    subscribeGroupChannelEvent(key, observer) {
        this._groupChannelBroadcast.subscribe(key, observer);
    }
    unsubscribeGroupChannelEvent(key) {
        this._groupChannelBroadcast.unsubscribe(key);
    }
    subscribeMessageEvent(key, observer) {
        this._messageBroadcast.subscribe(key, observer);
    }
    unsubscribeMessageEvent(key) {
        this._messageBroadcast.unsubscribe(key);
    }
    _updateJoinedMemberCount(channel) {
        channel.joinedMemberCount = channel.members
            .filter((member) => member.state === member_1.MemberState.JOINED)
            .length;
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
            return yield this.getChannelWithoutCache(channelUrl, internal);
        });
    }
    getChannelWithoutCache(channelUrl, internal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', channelUrl))
                .throw(error_1.default.invalidParameters);
            const request = new getGroupChannelCommand_1.GetGroupChannelRequestCommand({ channelUrl, isInternalCall: internal });
            const response = yield this._requestQueue.send(request);
            const { channel } = response.as(getGroupChannelCommand_1.GetGroupChannelResponseCommand);
            let { unreadMessageCount, unreadMentionCount } = channel;
            switch (channel.myCountPreference) {
                case groupChannel_1.CountPreference.UNREAD_MESSAGE_COUNT_ONLY:
                    unreadMentionCount = 0;
                    break;
                case groupChannel_1.CountPreference.UNREAD_MENTION_COUNT_ONLY:
                    unreadMessageCount = 0;
                    break;
                case groupChannel_1.CountPreference.OFF:
                    unreadMessageCount = 0;
                    unreadMentionCount = 0;
                    break;
            }
            channel._updateUnreadCount(unreadMessageCount, unreadMentionCount);
            yield this._groupChannelCache.upsert([channel]);
            return channel;
        });
    }
    getMyGroupChannels(startToken, params, limit, source = groupChannelEventCommand_1.GroupChannelEventSource.REQUEST_CHANNEL) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new loadMyGroupChannelList_1.LoadMyGroupChannelListRequestCommand(Object.assign(Object.assign({}, params), { userId: this._sdkState.userId, token: startToken, limit }));
            const response = yield this._requestQueue.send(request);
            const { channels, token } = response.as(loadMyGroupChannelList_1.LoadMyGroupChannelListResponseCommand);
            this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({ channels, source }));
            return { channels, token };
        });
    }
    getMessageFromCache(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._messageCache.get(messageId);
        });
    }
    getMessagesFromCache(channelUrl, token, direction, filter, limit = const_1.DEFAULT_MESSAGE_LIMIT) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._messageCache.fetch({
                channelUrl,
                token,
                limit,
                filter,
                backward: direction === 'next',
            });
        });
    }
    getCachedMessageCountBetween(channelUrl, filter, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._messageCache.countBetween(channelUrl, filter, new timeRange_1.default({ top: from, bottom: to }));
        });
    }
    getMyGroupChannelChangeLogs(token, params, source = groupChannelEventCommand_1.GroupChannelEventSource.REQUEST_CHANNEL_CHANGELOGS) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', token) && params instanceof groupChannelChangeLogsParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const request = new getMyGroupChannelChangelogsCommand_1.GetMyGroupChannelChangelogsRequestCommand((0, deundefined_1.deundefined)({
                userId: this._sdkState.userId,
                ts: (typeof token === 'number') ? token : null,
                token: (typeof token === 'string') ? token : null,
                filter: params,
            }));
            const response = yield this._requestQueue.send(request);
            const changelogs = response.as(getMyGroupChannelChangelogsCommand_1.GetMyGroupChannelChangelogsResponseCommand);
            const { updatedChannels, deletedChannelUrls } = changelogs;
            if (updatedChannels.length > 0) {
                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({ channels: updatedChannels, source }));
            }
            if (deletedChannelUrls.length > 0) {
                this._dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelRemoveEventCommand({ channelUrls: deletedChannelUrls, source }));
            }
            return changelogs;
        });
    }
    getGroupChannelCount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelCountParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const request = new groupChannelCountCommand_1.GetGroupChannelCountRequestCommand({
                userId: this._sdkState.userId,
                filter: params,
            });
            const response = yield this._requestQueue.send(request);
            const { groupChannelCount } = response.as(groupChannelCountCommand_1.GetGroupChannelCountResponseCommand);
            return groupChannelCount;
        });
    }
    createChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelCreateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            if (!params.isPublic)
                params.accessCode = null;
            const request = new createGroupChannelCommand_1.CreateGroupChannelRequestCommand(Object.assign({ userId: this._sdkState.userId }, params));
            const response = yield this._requestQueue.send(request);
            const { channel } = response.as(createGroupChannelCommand_1.CreateGroupChannelResponseCommand);
            yield this._groupChannelCache.upsert([channel]);
            return channel;
        });
    }
    markAsReadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            (0, unless_1.unless)(now - this._markAsReadAllLastSentAt >= MARK_AS_READ_ALL_RATE_LIMIT_PERIOD)
                .throw(error_1.default.markAsReadAllRateLimitExceeded);
            this._markAsReadAllLastSentAt = now;
            const request = new readAllCommand_1.ReadAllRequestCommand({
                userId: this._sdkState.userId,
            });
            yield this._requestQueue.send(request);
            const cachedChannels = this._groupChannelCache.channels;
            for (const channel of cachedChannels) {
                channel._updateUnreadMemberState(this._sdkState.userId, now);
                channel._updateUnreadCount(0, 0);
            }
            if (cachedChannels.length > 0)
                yield this._groupChannelCache.upsert(cachedChannels);
        });
    }
    markAsReadWithChannelUrls(channelUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', channelUrls) && now - this._markAsReadAllLastSentAt >= MARK_AS_READ_ALL_RATE_LIMIT_PERIOD)
                .throw(error_1.default.markAsReadAllRateLimitExceeded);
            this._markAsReadAllLastSentAt = now;
            const request = new readAllCommand_1.ReadAllRequestCommand({
                userId: this._sdkState.userId,
                channelUrls,
            });
            yield this._requestQueue.send(request);
            const cachedChannels = this._groupChannelCache.channels;
            const affectedChannels = [];
            for (const channel of cachedChannels) {
                if (channelUrls.includes(channel.url)) {
                    channel._updateUnreadMemberState(this._sdkState.userId, now);
                    channel._updateUnreadCount(0, 0);
                    affectedChannels.push(channel);
                }
            }
            if (affectedChannels.length > 0)
                yield this._groupChannelCache.upsert(affectedChannels);
        });
    }
    markAsDelivered(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.getChannel(channelUrl);
            yield channel.markAsDelivered();
        });
    }
}
exports.default = GroupChannelManager;
//# sourceMappingURL=groupChannelManager.js.map