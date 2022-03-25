"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUnreadItemCountResponseCommand = exports.GetUnreadItemCountRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../model/channel/groupChannel");
class GetUnreadItemCountRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, filter }) {
        super();
        const { keys } = filter;
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/unread_item_count`;
        this.params = {
            item_keys: keys,
        };
    }
}
exports.GetUnreadItemCountRequestCommand = GetUnreadItemCountRequestCommand;
class GetUnreadItemCountResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        if (typeof payload[groupChannel_1.UnreadItemKey.GROUP_CHANNEL_UNREAD_MENTION_COUNT] === 'number') {
            this.groupChannelUnreadMentionCount = payload[groupChannel_1.UnreadItemKey.GROUP_CHANNEL_UNREAD_MENTION_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.GROUP_CHANNEL_UNREAD_MESSAGE_COUNT] === 'number') {
            this.groupChannelUnreadMessageCount = payload[groupChannel_1.UnreadItemKey.GROUP_CHANNEL_UNREAD_MESSAGE_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.GROUP_CHANNEL_INVITATION_COUNT] === 'number') {
            this.groupChannelInvitationCount = payload[groupChannel_1.UnreadItemKey.GROUP_CHANNEL_INVITATION_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.SUPER_UNREAD_MENTION_COUNT] === 'number') {
            this.superGroupChannelUnreadMentionCount = payload[groupChannel_1.UnreadItemKey.SUPER_UNREAD_MENTION_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.SUPER_UNREAD_MESSAGE_COUNT] === 'number') {
            this.superGroupChannelUnreadMessageCount = payload[groupChannel_1.UnreadItemKey.SUPER_UNREAD_MESSAGE_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.SUPER_INVITATION_COUNT] === 'number') {
            this.superGroupChannelInvitationCount = payload[groupChannel_1.UnreadItemKey.SUPER_INVITATION_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.NONSUPER_UNREAD_MENTION_COUNT] === 'number') {
            this.nonSuperGroupChannelUnreadMentionCount = payload[groupChannel_1.UnreadItemKey.NONSUPER_UNREAD_MENTION_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.NONSUPER_UNREAD_MESSAGE_COUNT] === 'number') {
            this.nonSuperGroupChannelUnreadMessageCount = payload[groupChannel_1.UnreadItemKey.NONSUPER_UNREAD_MESSAGE_COUNT];
        }
        if (typeof payload[groupChannel_1.UnreadItemKey.NONSUPER_INVITATION_COUNT] === 'number') {
            this.nonSuperGroupChannelInvitationCount = payload[groupChannel_1.UnreadItemKey.NONSUPER_INVITATION_COUNT];
        }
    }
}
exports.GetUnreadItemCountResponseCommand = GetUnreadItemCountResponseCommand;
//# sourceMappingURL=getUnreadItemCountCommand.js.map