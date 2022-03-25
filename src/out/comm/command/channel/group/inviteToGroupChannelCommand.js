"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteToGroupChannelEventCommand = exports.InviteToGroupChannelResponseCommand = exports.InviteToGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
const channelEventCommand_1 = require("../channelEventCommand");
const user_1 = require("../../../../model/user");
const member_1 = require("../../../../model/channel/member");
;
class InviteToGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, userIds, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/invite`;
        this.params = {
            user_ids: userIds,
        };
    }
}
exports.InviteToGroupChannelRequestCommand = InviteToGroupChannelRequestCommand;
class InviteToGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new groupChannel_1.default(_iid, payload);
    }
}
exports.InviteToGroupChannelResponseCommand = InviteToGroupChannelResponseCommand;
class InviteToGroupChannelEventCommand extends channelEventCommand_1.ChannelEventCommand {
    constructor(_iid, code, payload) {
        super(_iid, code, payload);
        const { member_count = null, joined_member_count = null, inviter = null, invitees = [], } = payload.data;
        this.memberCount = member_count;
        this.joinedMemberCount = joined_member_count;
        this.inviter = inviter ? new user_1.default(_iid, inviter) : null;
        this.invitees = invitees.map((payload) => new member_1.default(_iid, payload));
    }
}
exports.InviteToGroupChannelEventCommand = InviteToGroupChannelEventCommand;
//# sourceMappingURL=inviteToGroupChannelCommand.js.map