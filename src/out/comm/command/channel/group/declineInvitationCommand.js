"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclineInvitationEventCommand = exports.DeclineInvitationResponseCommand = exports.DeclineInvitationRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
const channelEventCommand_1 = require("../channelEventCommand");
const user_1 = require("../../../../model/user");
const member_1 = require("../../../../model/channel/member");
;
class DeclineInvitationRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, userId, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/decline`;
        this.params = {
            user_id: userId,
        };
    }
}
exports.DeclineInvitationRequestCommand = DeclineInvitationRequestCommand;
class DeclineInvitationResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new groupChannel_1.default(_iid, payload);
        this.channel.myMemberState = member_1.MemberState.NONE;
    }
}
exports.DeclineInvitationResponseCommand = DeclineInvitationResponseCommand;
class DeclineInvitationEventCommand extends channelEventCommand_1.ChannelEventCommand {
    constructor(_iid, code, payload) {
        super(_iid, code, payload);
        const { member_count = null, joined_member_count = null, inviter = null, invitee = null, } = payload.data;
        this.memberCount = member_count;
        this.joinedMemberCount = joined_member_count;
        this.inviter = inviter ? new user_1.default(_iid, inviter) : null;
        this.invitee = invitee ? new member_1.default(_iid, invitee) : null;
    }
}
exports.DeclineInvitationEventCommand = DeclineInvitationEventCommand;
//# sourceMappingURL=declineInvitationCommand.js.map