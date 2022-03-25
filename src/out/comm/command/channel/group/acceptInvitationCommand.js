"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptInvitationResponseCommand = exports.AcceptInvitationRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const member_1 = require("../../../../model/channel/member");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
class AcceptInvitationRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, userId, accessCode, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/accept`;
        this.params = {
            user_id: userId,
            access_code: accessCode,
        };
    }
}
exports.AcceptInvitationRequestCommand = AcceptInvitationRequestCommand;
class AcceptInvitationResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new groupChannel_1.default(_iid, payload);
        this.channel.myMemberState = member_1.MemberState.JOINED;
    }
}
exports.AcceptInvitationResponseCommand = AcceptInvitationResponseCommand;
//# sourceMappingURL=acceptInvitationCommand.js.map