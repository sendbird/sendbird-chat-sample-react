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
exports.UnreadItemKey = exports.HiddenState = exports.MutedState = exports.CountPreference = void 0;
const vault_1 = require("../../vault");
const error_1 = require("../../error");
const types_1 = require("../../types");
const user_1 = require("../user");
const member_1 = require("./member");
const readStatus_1 = require("./readStatus");
const types_2 = require("./types");
const groupChannelManager_1 = require("../../manager/groupChannelManager");
const baseChannel_1 = require("./baseChannel");
const sendableMessage_1 = require("../message/sendableMessage");
const messageParser_1 = require("../message/messageParser");
const messageRequestHandler_1 = require("../message/messageRequestHandler");
const message_1 = require("../../collection/message");
const scheduledUserMessageParams_1 = require("../params/scheduledUserMessageParams");
const groupChannelUpdateParams_1 = require("../params/groupChannelUpdateParams");
const groupChannelHideParams_1 = require("../params/groupChannelHideParams");
const memberListQuery_1 = require("../../query/memberListQuery");
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const getGroupChannelCommand_1 = require("../../comm/command/channel/group/getGroupChannelCommand");
const readCommand_1 = require("../../comm/command/channel/group/readCommand");
const deliverCommand_1 = require("../../comm/command/channel/group/deliverCommand");
const inviteToGroupChannelCommand_1 = require("../../comm/command/channel/group/inviteToGroupChannelCommand");
const acceptInvitationCommand_1 = require("../../comm/command/channel/group/acceptInvitationCommand");
const declineInvitationCommand_1 = require("../../comm/command/channel/group/declineInvitationCommand");
const joinGroupChannelCommand_1 = require("../../comm/command/channel/group/joinGroupChannelCommand");
const leaveGroupChannelCommand_1 = require("../../comm/command/channel/group/leaveGroupChannelCommand");
const updateGroupChannelCommand_1 = require("../../comm/command/channel/group/updateGroupChannelCommand");
const deleteGroupChannelCommand_1 = require("../../comm/command/channel/group/deleteGroupChannelCommand");
const hideGroupChannelCommand_1 = require("../../comm/command/channel/group/hideGroupChannelCommand");
const unhideGroupChannelCommand_1 = require("../../comm/command/channel/group/unhideGroupChannelCommand");
const getPushTriggerOptionCommand_1 = require("../../comm/command/user/getPushTriggerOptionCommand");
const setPushTriggerOptionCommand_1 = require("../../comm/command/user/setPushTriggerOptionCommand");
const setMyCountPreferenceCommand_1 = require("../../comm/command/user/setMyCountPreferenceCommand");
const startTypingCommand_1 = require("../../comm/command/channel/group/startTypingCommand");
const endTypingCommand_1 = require("../../comm/command/channel/group/endTypingCommand");
const resetMyHistoryCommand_1 = require("../../comm/command/channel/group/resetMyHistoryCommand");
const registerScheduledUserMessageCommand_1 = require("../../comm/command/message/registerScheduledUserMessageCommand");
const serializer_1 = require("../../utils/serializer");
const unless_1 = require("../../utils/unless");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
var CountPreference;
(function (CountPreference) {
    CountPreference["ALL"] = "all";
    CountPreference["UNREAD_MESSAGE_COUNT_ONLY"] = "unread_message_count_only";
    CountPreference["UNREAD_MENTION_COUNT_ONLY"] = "unread_mention_count_only";
    CountPreference["OFF"] = "off";
})(CountPreference = exports.CountPreference || (exports.CountPreference = {}));
var MutedState;
(function (MutedState) {
    MutedState["MUTED"] = "muted";
    MutedState["UNMUTED"] = "unmuted";
})(MutedState = exports.MutedState || (exports.MutedState = {}));
var HiddenState;
(function (HiddenState) {
    HiddenState["UNHIDDEN"] = "unhidden";
    HiddenState["HIDDEN_ALLOW_AUTO_UNHIDE"] = "hidden_allow_auto_unhide";
    HiddenState["HIDDEN_PREVENT_AUTO_UNHIDE"] = "hidden_prevent_auto_unhide";
})(HiddenState = exports.HiddenState || (exports.HiddenState = {}));
var UnreadItemKey;
(function (UnreadItemKey) {
    UnreadItemKey["GROUP_CHANNEL_UNREAD_MENTION_COUNT"] = "group_channel_unread_mention_count";
    UnreadItemKey["NONSUPER_UNREAD_MENTION_COUNT"] = "non_super_group_channel_unread_mention_count";
    UnreadItemKey["SUPER_UNREAD_MENTION_COUNT"] = "super_group_channel_unread_mention_count";
    UnreadItemKey["GROUP_CHANNEL_UNREAD_MESSAGE_COUNT"] = "group_channel_unread_message_count";
    UnreadItemKey["NONSUPER_UNREAD_MESSAGE_COUNT"] = "non_super_group_channel_unread_message_count";
    UnreadItemKey["SUPER_UNREAD_MESSAGE_COUNT"] = "super_group_channel_unread_message_count";
    UnreadItemKey["GROUP_CHANNEL_INVITATION_COUNT"] = "group_channel_invitation_count";
    UnreadItemKey["NONSUPER_INVITATION_COUNT"] = "non_super_group_channel_invitation_count";
    UnreadItemKey["SUPER_INVITATION_COUNT"] = "super_group_channel_invitation_count";
})(UnreadItemKey = exports.UnreadItemKey || (exports.UnreadItemKey = {}));
class GroupChannel extends baseChannel_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        super(_iid, payload);
        this._unreadMemberStateMap = new Map();
        this._undeliveredMemberStateMap = new Map();
        this._typingStatus = new Map();
        this._lastMemberCountUpdated = 0;
        this._typingStarted = 0;
        this._typingEnded = 0;
        this.isDistinct = false;
        this.isSuper = false;
        this.isBroadcast = false;
        this.isPublic = false;
        this.isDiscoverable = true;
        this.isAccessCodeRequired = false;
        this.isPushEnabled = false;
        this.unreadMessageCount = 0;
        this.unreadMentionCount = 0;
        this.members = [];
        this.memberCount = 0;
        this.joinedMemberCount = 0;
        this.hiddenState = HiddenState.UNHIDDEN;
        this.lastMessage = null;
        this.messageOffsetTimestamp = 0;
        this.messageSurvivalSeconds = -1;
        this.myMemberState = member_1.MemberState.NONE;
        this.myRole = types_2.Role.NONE;
        this.myMutedState = MutedState.UNMUTED;
        this.myLastRead = 0;
        this.myCountPreference = CountPreference.ALL;
        this.myPushTriggerOption = types_1.PushTriggerOption.DEFAULT;
        this.inviter = null;
        this.invitedAt = 0;
        this.joinedAt = 0;
        this.channelType = types_2.ChannelType.GROUP;
        this.isDistinct = (_a = payload['is_distinct']) !== null && _a !== void 0 ? _a : false;
        this.isSuper = (_b = payload['is_super']) !== null && _b !== void 0 ? _b : false;
        this.isBroadcast = (_c = payload['is_broadcast']) !== null && _c !== void 0 ? _c : false;
        this.isPublic = (_d = payload['is_public']) !== null && _d !== void 0 ? _d : false;
        this.isDiscoverable = (_e = payload['is_discoverable']) !== null && _e !== void 0 ? _e : this.isPublic;
        this.isAccessCodeRequired = (_f = payload['is_access_code_required']) !== null && _f !== void 0 ? _f : false;
        this.isPushEnabled = (_g = payload['is_push_enabled']) !== null && _g !== void 0 ? _g : false;
        if (Array.isArray(payload['members'])) {
            this.members.push(...payload['members']
                .map((payload) => new member_1.default(this._iid, payload)));
        }
        this.memberCount = (_h = payload['member_count']) !== null && _h !== void 0 ? _h : 0;
        this.joinedMemberCount = (_j = payload['joined_member_count']) !== null && _j !== void 0 ? _j : 0;
        this.hiddenState = (0, validator_1.isEnumOf)(HiddenState, payload['hidden_state']) ?
            payload['hidden_state'] :
            HiddenState.UNHIDDEN;
        this.messageOffsetTimestamp = (_k = payload['ts_message_offset']) !== null && _k !== void 0 ? _k : 0;
        this.messageSurvivalSeconds = (_l = payload['message_survival_seconds']) !== null && _l !== void 0 ? _l : -1;
        this.lastMessage = payload['last_message'] ?
            (0, messageParser_1.parseMessagePayload)(this._iid, Object.assign({ 'channel_type': this.channelType }, payload['last_message'])) :
            null;
        if (payload['read_receipt']) {
            Object.keys(payload['read_receipt']).forEach((userId) => {
                if ((0, validator_1.isTypeOf)('number', payload['read_receipt'][userId])) {
                    this._updateUnreadMemberState(userId, payload['read_receipt'][userId]);
                }
            });
        }
        if (payload['delivery_receipt']) {
            Object.keys(payload['delivery_receipt']).forEach((userId) => {
                if ((0, validator_1.isTypeOf)('number', payload['delivery_receipt'][userId])) {
                    this._updateUndeliveredMemberState(userId, payload['delivery_receipt'][userId]);
                }
            });
        }
        this.myMemberState = (0, validator_1.isEnumOf)(member_1.MemberState, payload['member_state']) ?
            payload['member_state'] :
            member_1.MemberState.NONE;
        this.myRole = (0, validator_1.isEnumOf)(types_2.Role, payload['my_role']) ?
            payload['my_role'] :
            types_2.Role.NONE;
        if ((0, validator_1.isEnumOf)(MutedState, payload['is_muted'])) {
            this.myMutedState = payload['is_muted'];
        }
        else if ((0, validator_1.isTypeOf)('boolean', payload['is_muted'])) {
            this.myMutedState = payload['is_muted'] ? MutedState.MUTED : MutedState.UNMUTED;
        }
        else {
            this.myMutedState = MutedState.UNMUTED;
        }
        this.myCountPreference = (0, validator_1.isEnumOf)(CountPreference, payload['count_preference']) ?
            payload['count_preference'] :
            CountPreference.ALL;
        this.myPushTriggerOption = (0, validator_1.isEnumOf)(types_1.PushTriggerOption, payload['push_trigger_option']) ?
            payload['push_trigger_option'] :
            types_1.PushTriggerOption.ALL;
        this.myLastRead = (_m = payload['user_last_read']) !== null && _m !== void 0 ? _m : 0;
        this.inviter = payload['inviter'] ? new user_1.default(this._iid, payload['inviter']) : null;
        this.invitedAt = (_o = payload['invited_at']) !== null && _o !== void 0 ? _o : 0;
        this.joinedAt = (_p = payload['joined_ts']) !== null && _p !== void 0 ? _p : 0;
        this._updateUnreadCount((_q = payload['unread_message_count']) !== null && _q !== void 0 ? _q : 0, (_r = payload['unread_mention_count']) !== null && _r !== void 0 ? _r : 0);
    }
    get isHidden() {
        return this.hiddenState !== HiddenState.UNHIDDEN;
    }
    get isTyping() {
        return Object.keys(this._typingStatus).length > 0;
    }
    get cachedUnreadMemberState() {
        const state = {};
        for (const [userId, ts] of this._unreadMemberStateMap) {
            state[userId] = ts;
        }
        return state;
    }
    get cachedUndeliveredMemberState() {
        const state = {};
        for (const [userId, ts] of this._undeliveredMemberStateMap) {
            state[userId] = ts;
        }
        return state;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'is_access_code_required': obj.isAccessCodeRequired, 'is_distinct': obj.isDistinct, 'is_super': obj.isSuper, 'is_broadcast': obj.isBroadcast, 'is_public': obj.isPublic, 'is_discoverable': obj.isDiscoverable, 'is_muted': obj.myMutedState, 'is_push_enabled': obj.isPushEnabled, 'unread_message_count': obj.unreadMessageCount, 'unread_mention_count': obj.unreadMentionCount, 'push_trigger_option': obj.myPushTriggerOption, 'count_preference': obj.myCountPreference, 'hidden_state': obj.hiddenState, 'member_count': obj.memberCount, 'joined_member_count': obj.joinedMemberCount, 'member_state': obj.myMemberState, 'my_role': obj.myRole, 'user_last_read': obj.myLastRead, 'ts_message_offset': obj.messageOffsetTimestamp, 'message_survival_seconds': obj.messageSurvivalSeconds, 'read_receipt': obj.cachedUnreadMemberState, 'delivery_receipt': obj.cachedUndeliveredMemberState, 'members': obj.members.map((member) => member_1.default.payloadify(member)), 'last_message': (0, messageParser_1.payloadifyMessage)(obj.lastMessage), 'inviter': obj.inviter ? user_1.default.payloadify(obj.inviter) : null, 'invited_at': obj.invitedAt, 'joined_ts': obj.joinedAt })) : null;
    }
    _updateUnreadCount(unreadMessageCount, unreadMentionCount) {
        if (typeof unreadMessageCount === 'number' && unreadMessageCount >= 0) {
            if (this.myCountPreference === CountPreference.ALL || this.myCountPreference === CountPreference.UNREAD_MESSAGE_COUNT_ONLY) {
                if (this.isSuper || this.isBroadcast) {
                    const { maxSuperGroupChannelUnreadCount } = vault_1.default.of(this._iid);
                    this.unreadMessageCount =
                        maxSuperGroupChannelUnreadCount && unreadMessageCount >= maxSuperGroupChannelUnreadCount
                            ? maxSuperGroupChannelUnreadCount
                            : unreadMessageCount;
                }
                else
                    this.unreadMessageCount = unreadMessageCount;
            }
            else
                this.unreadMessageCount = 0;
        }
        else
            this.unreadMessageCount = 0;
        if (typeof unreadMentionCount === 'number' && unreadMentionCount >= 0) {
            if (this.myCountPreference === CountPreference.ALL || this.myCountPreference === CountPreference.UNREAD_MENTION_COUNT_ONLY) {
                this.unreadMentionCount = unreadMentionCount;
            }
            else
                this.unreadMentionCount = 0;
        }
        else
            this.unreadMentionCount = 0;
    }
    _updateUnreadMemberState(userId, ts) {
        const last = this._unreadMemberStateMap.get(userId);
        if (!last || last < ts) {
            this._unreadMemberStateMap.set(userId, ts);
            const { sdkState } = vault_1.default.of(this._iid);
            if (sdkState.userId === userId) {
                this.myLastRead = ts;
            }
            return true;
        }
        return false;
    }
    _updateUndeliveredMemberState(userId, ts) {
        const last = this._undeliveredMemberStateMap.get(userId);
        if (!last || last < ts) {
            this._undeliveredMemberStateMap.set(userId, ts);
        }
    }
    _updateTypingStatus(user, ts = new Date().getTime()) {
        if (ts > 0) {
            this._typingStatus[user.userId] = { user, ts };
        }
        else {
            delete this._typingStatus[user.userId];
        }
    }
    _setLatestMemberCount(memberCount, joinedCount, ts) {
        let isMemberCountChanged = false;
        if (ts >= this._lastMemberCountUpdated) {
            this._lastMemberCountUpdated = ts;
            isMemberCountChanged = memberCount !== this.memberCount || joinedCount !== this.joinedMemberCount;
            this.memberCount = memberCount;
            this.joinedMemberCount = joinedCount;
        }
        return isMemberCountChanged;
    }
    isReadMessage(message) {
        const { sdkState } = vault_1.default.of(this._iid);
        const readTs = this._unreadMemberStateMap.get(sdkState.userId);
        return readTs && readTs >= message.createdAt;
    }
    serialize() {
        return (0, serializer_1.serialize)(this, (objectified) => {
            objectified['cachedUnreadMemberState'] = this.cachedUnreadMemberState;
            objectified['cachedUndeliveredMemberState'] = this.cachedUndeliveredMemberState;
        });
    }
    createMessageCollection(params) {
        return new message_1.default(this._iid, Object.assign({ channel: this }, params));
    }
    createMemberListQuery(params) {
        return new memberListQuery_1.default(this._iid, this.url, params);
    }
    addMember(member, ts = 0) {
        if (!this.isSuper && !this.isBroadcast) {
            const index = this.members.findIndex((iter) => iter.userId === member.userId);
            if (index > -1) {
                const previousMember = this.members[index];
                if (previousMember.state === member_1.MemberState.JOINED) {
                    member.state = previousMember.state;
                }
                this.members.splice(index, 1);
                this.memberCount--;
            }
            this.members.push(member);
            this.memberCount++;
            this._updateUnreadMemberState(member.userId, ts);
            this._updateUndeliveredMemberState(member.userId, ts);
        }
    }
    removeMember(member) {
        if (!this.isSuper && !this.isBroadcast) {
            const index = this.members.findIndex((iter) => iter.userId === member.userId);
            if (index > -1) {
                this.members.splice(index, 1);
                this.memberCount--;
                return true;
            }
        }
        return false;
    }
    getUnreadMemberCount(message) {
        if (message instanceof sendableMessage_1.default && !this.isSuper && !this.isBroadcast) {
            const { sdkState } = vault_1.default.of(this._iid);
            const createdAt = message.createdAt;
            let count = 0;
            for (const member of this.members) {
                if (sdkState.userId !== member.userId &&
                    member.state === member_1.MemberState.JOINED &&
                    message.sender.userId !== member.userId) {
                    const value = this.cachedUnreadMemberState[member.userId] || 0;
                    if (value < createdAt)
                        count++;
                }
            }
            return count;
        }
        return 0;
    }
    getUndeliveredMemberCount(message) {
        if (message instanceof sendableMessage_1.default && !this.isSuper && !this.isBroadcast) {
            const { sdkState } = vault_1.default.of(this._iid);
            const createdAt = message.createdAt;
            let count = 0;
            for (const member of this.members) {
                if (sdkState.userId !== member.userId &&
                    member.state === member_1.MemberState.JOINED &&
                    message.sender.userId !== member.userId) {
                    const value = this.cachedUndeliveredMemberState[member.userId] || 0;
                    if (value < createdAt)
                        count++;
                }
            }
            return count;
        }
        return 0;
    }
    getReadMembers(message, includeAllMembers = false) {
        const { sdkState } = vault_1.default.of(this._iid);
        if (!sdkState.userId || this.isSuper || this.isBroadcast)
            return [];
        const readMembers = [];
        this.members.forEach((member) => {
            if (includeAllMembers || (member.userId !== sdkState.userId && member.userId !== message.sender.userId)) {
                const ts = this._unreadMemberStateMap.get(member.userId);
                if (ts >= message.createdAt) {
                    readMembers.push(member);
                }
            }
        });
        return readMembers;
    }
    getUnreadMembers(message, includeAllMembers = false) {
        const { sdkState } = vault_1.default.of(this._iid);
        if (!sdkState.userId || this.isSuper || this.isBroadcast)
            return [];
        const unreadMembers = [];
        this.members.forEach((member) => {
            if (includeAllMembers || (member.userId !== sdkState.userId && member.userId !== message.sender.userId)) {
                const ts = this._unreadMemberStateMap.get(member.userId);
                if (ts < message.createdAt) {
                    unreadMembers.push(member);
                }
            }
        });
        return unreadMembers;
    }
    getReadStatus(includeAllMembers = false) {
        const { sdkState } = vault_1.default.of(this._iid);
        if (!sdkState.userId || this.isSuper || this.isBroadcast)
            return null;
        const readStatus = {};
        this.members.forEach((member) => {
            if (includeAllMembers || (member.userId !== sdkState.userId)) {
                const ts = this._unreadMemberStateMap.get(member.userId);
                readStatus[member.userId] = new readStatus_1.default(this._iid, {
                    'channel_url': this.url,
                    'channel_type': this.channelType,
                    'user': member_1.default.payloadify(member),
                    'ts': ts,
                });
            }
        });
        return readStatus;
    }
    getTypingUsers() {
        const members = [];
        for (const userId in this._typingStatus) {
            const { user } = this._typingStatus[userId];
            members.push(user);
        }
        return members;
    }
    invalidateTypingStatus() {
        const { typingIndicatorInvalidateTime } = vault_1.default.of(this._iid);
        const now = new Date().getTime();
        let removed = false;
        for (const userId in this._typingStatus) {
            const { ts } = this._typingStatus[userId];
            if (now - ts >= typingIndicatorInvalidateTime) {
                delete this._typingStatus[userId];
                removed = true;
            }
        }
        return removed;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue, dispatcher } = vault_1.default.of(this._iid);
            const request = new getGroupChannelCommand_1.GetGroupChannelRequestCommand({ channelUrl: this.url });
            const response = yield requestQueue.send(request);
            const { channel } = response.as(getGroupChannelCommand_1.GetGroupChannelResponseCommand);
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [channel],
                source: groupChannelEventCommand_1.GroupChannelEventSource.REQUEST_CHANNEL,
            }));
            return channel;
        });
    }
    updateChannel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelUpdateParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new updateGroupChannelCommand_1.UpdateGroupChannelRequestCommand(Object.assign({ channelUrl: this.url }, params));
            const response = yield requestQueue.send(request);
            const { channel } = response.as(updateGroupChannelCommand_1.UpdateGroupChannelResponseCommand);
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [channel],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UPDATED,
            }));
            return channel;
        });
    }
    invite(users) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(users.every((user) => user instanceof user_1.default))
                .throw(error_1.default.invalidParameters);
            return this.inviteWithUserIds(users.map((user) => user.userId));
        });
    }
    inviteWithUserIds(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isArrayOf)('string', userIds))
                .throw(error_1.default.invalidParameters);
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new inviteToGroupChannelCommand_1.InviteToGroupChannelRequestCommand({
                channelUrl: this.url,
                userIds,
            });
            const response = yield requestQueue.send(request);
            const { channel } = response.as(inviteToGroupChannelCommand_1.InviteToGroupChannelResponseCommand);
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [channel],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_INVITED,
            }));
            return channel;
        });
    }
    join(accessCode = null) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', accessCode) || accessCode === null)
                .throw(error_1.default.invalidParameters);
            const { dispatcher, sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new joinGroupChannelCommand_1.JoinGroupChannelRequestCommand({
                channelUrl: this.url,
                userId: sdkState.userId,
                accessCode,
            });
            const response = yield requestQueue.send(request);
            const { channel } = response.as(joinGroupChannelCommand_1.JoinGroupChannelResponseCommand);
            channel.myMemberState = member_1.MemberState.JOINED;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [channel],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_JOINED,
            }));
            return this;
        });
    }
    leave() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new leaveGroupChannelCommand_1.LeaveGroupChannelRequestCommand({
                channelUrl: this.url,
                userId: sdkState.userId,
            });
            yield requestQueue.send(request);
        });
    }
    acceptInvitation(accessCode = null) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isTypeOf)('string', accessCode) || accessCode === null)
                .throw(error_1.default.invalidParameters);
            const { dispatcher, sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new acceptInvitationCommand_1.AcceptInvitationRequestCommand({
                channelUrl: this.url,
                userId: sdkState.userId,
                accessCode,
            });
            const response = yield requestQueue.send(request);
            const { channel } = response.as(acceptInvitationCommand_1.AcceptInvitationResponseCommand);
            channel.myMemberState = member_1.MemberState.JOINED;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [channel],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_ACCEPTED_INVITE,
            }));
            return channel;
        });
    }
    declineInvitation() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new declineInvitationCommand_1.DeclineInvitationRequestCommand({
                channelUrl: this.url,
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { channel } = response.as(declineInvitationCommand_1.DeclineInvitationResponseCommand);
            channel.myMemberState = member_1.MemberState.NONE;
            return channel;
        });
    }
    sendUserMessage(params) {
        const handler = new messageRequestHandler_1.default();
        const { dispatcher } = vault_1.default.of(this._iid);
        super.sendUserMessage(params)
            .onPending((message) => handler.trigger(null, message))
            .onSucceeded((message) => {
            this.lastMessage = message;
            const groupChannelManager = groupChannelManager_1.default.of(this._iid);
            groupChannelManager.handlers.map((handler) => handler.onChannelChanged(this));
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_MESSAGE_SENT,
            }));
            handler.trigger(null, message);
        })
            .onFailed((err, message) => handler.trigger(err, message));
        return handler;
    }
    sendFileMessage(params) {
        const handler = new messageRequestHandler_1.default();
        const { dispatcher } = vault_1.default.of(this._iid);
        super.sendFileMessage(params)
            .onPending((message) => handler.trigger(null, message))
            .onSucceeded((message) => {
            this.lastMessage = message;
            const groupChannelManager = groupChannelManager_1.default.of(this._iid);
            groupChannelManager.handlers.map((handler) => handler.onChannelChanged(this));
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_MESSAGE_SENT,
            }));
            handler.trigger(null, message);
        })
            .onFailed((err, message) => handler.trigger(err, message));
        return handler;
    }
    hide(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof groupChannelHideParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const { dispatcher, sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new hideGroupChannelCommand_1.HideGroupChannelRequestCommand(Object.assign({ channelUrl: this.url, userId: sdkState.userId }, params));
            const response = yield requestQueue.send(request);
            const { messageOffsetTimestamp } = response.as(hideGroupChannelCommand_1.HideGroupChannelResponseCommand);
            this.hiddenState = params.allowAutoUnhide
                ? HiddenState.HIDDEN_ALLOW_AUTO_UNHIDE
                : HiddenState.HIDDEN_PREVENT_AUTO_UNHIDE;
            if (params.hidePreviousMessages)
                this._updateUnreadCount(0, 0);
            if (messageOffsetTimestamp)
                this.messageOffsetTimestamp = messageOffsetTimestamp;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_HIDDEN,
            }));
            return this;
        });
    }
    unhide() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new unhideGroupChannelCommand_1.UnhideGroupChannelRequestCommand({
                channelUrl: this.url,
            });
            yield requestQueue.send(request);
            this.hiddenState = HiddenState.UNHIDDEN;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_UNHIDDEN,
            }));
            return this;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue } = vault_1.default.of(this._iid);
            const request = new deleteGroupChannelCommand_1.DeleteGroupChannelRequestCommand({
                channelUrl: this.url,
            });
            yield requestQueue.send(request);
        });
    }
    markAsRead() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new readCommand_1.ReadRequestCommand({ channelUrl: this.url });
            const response = yield requestQueue.send(request);
            const { readStatus } = response.as(readCommand_1.ReadEventCommand);
            this._unreadMemberStateMap.set(sdkState.userId, readStatus.readAt);
            if (this.unreadMessageCount > 0 || this.unreadMentionCount > 0) {
                this._updateUnreadCount(0, 0);
                dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                    channels: [this],
                    source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_READ,
                }));
            }
        });
    }
    markAsDelivered() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new deliverCommand_1.DeliverRequestCommand({ channelUrl: this.url, userId: sdkState.userId });
            yield requestQueue.send(request);
        });
    }
    startTyping() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue, typingIndicatorThrottle } = vault_1.default.of(this._iid);
            const now = new Date().getTime();
            if (now - this._typingStarted >= typingIndicatorThrottle) {
                this._typingStarted = now;
                this._typingEnded = 0;
                const request = new startTypingCommand_1.StartTypingRequestCommand({ channelUrl: this.url, time: this._typingStarted });
                requestQueue.send(request);
            }
        });
    }
    endTyping() {
        return __awaiter(this, void 0, void 0, function* () {
            const { requestQueue, typingIndicatorThrottle } = vault_1.default.of(this._iid);
            const now = new Date().getTime();
            if (now - this._typingEnded >= typingIndicatorThrottle) {
                this._typingStarted = 0;
                this._typingEnded = now;
                const request = new endTypingCommand_1.EndTypingRequestCommand({ channelUrl: this.url, time: this._typingStarted });
                requestQueue.send(request);
            }
        });
    }
    registerScheduledUserMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof scheduledUserMessageParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new registerScheduledUserMessageCommand_1.RegisterScheduledUserMessageRequestCommand(Object.assign({ channelType: this.channelType, channelUrl: this.url, userId: sdkState.userId, requestId: this._generateRequestId(), scheduleDatetime: params.scheduledDateTimeString }, params));
            const response = yield requestQueue.send(request);
            const { message } = response.as(registerScheduledUserMessageCommand_1.RegisterScheduledUserMessageResponseCommand);
            return message;
        });
    }
    getMyPushTriggerOption() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new getPushTriggerOptionCommand_1.GetPushTriggerOptionRequestCommand({
                userId: sdkState.userId,
            });
            const response = yield requestQueue.send(request);
            const { pushTriggerOption } = response.as(getPushTriggerOptionCommand_1.GetPushTriggerOptionResponseCommand);
            return pushTriggerOption;
        });
    }
    setMyPushTriggerOption(option) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isEnumOf)(types_1.PushTriggerOption, option))
                .throw(error_1.default.invalidParameters);
            const { sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setPushTriggerOptionCommand_1.SetPushTriggerOptionRequestCommand({
                userId: sdkState.userId,
                pushTriggerOption: option,
            });
            const response = yield requestQueue.send(request);
            const { pushTriggerOption } = response.as(setPushTriggerOptionCommand_1.SetPushTriggerOptionResponseCommand);
            return pushTriggerOption;
        });
    }
    setMyCountPreference(preference) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)((0, validator_1.isEnumOf)(CountPreference, preference))
                .throw(error_1.default.invalidParameters);
            const { dispatcher, sdkState, requestQueue } = vault_1.default.of(this._iid);
            const request = new setMyCountPreferenceCommand_1.SetMyCountPreferenceRequestCommand({
                channelUrl: this.url,
                userId: sdkState.userId,
                countPreference: preference,
            });
            const response = yield requestQueue.send(request);
            const { countPreference } = response.as(setMyCountPreferenceCommand_1.SetMyCountPreferenceResponseCommand);
            this.myCountPreference = countPreference;
            this._updateUnreadCount(this.unreadMessageCount, this.unreadMentionCount);
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_CREATED,
            }));
            return countPreference;
        });
    }
    resetMyHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
            const request = new resetMyHistoryCommand_1.ResetMyHistoryRequestCommand({ channelUrl: this.url });
            const response = yield requestQueue.send(request);
            const { messageOffsetTimestamp } = response.as(resetMyHistoryCommand_1.ResetMyHistoryResponseCommand);
            this.messageOffsetTimestamp = messageOffsetTimestamp;
            dispatcher.dispatch(new groupChannelEventCommand_1.GroupChannelUpdateEventCommand({
                channels: [this],
                source: groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_RESET_HISTORY,
            }));
            return this;
        });
    }
}
exports.default = GroupChannel;
//# sourceMappingURL=groupChannel.js.map