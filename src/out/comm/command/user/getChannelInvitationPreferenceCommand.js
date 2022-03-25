"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChannelInvitationPreferenceResponseCommand = exports.GetChannelInvitationPreferenceRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetChannelInvitationPreferenceRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/channel_invitation_preference`;
    }
}
exports.GetChannelInvitationPreferenceRequestCommand = GetChannelInvitationPreferenceRequestCommand;
class GetChannelInvitationPreferenceResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.autoAccept = payload.auto_accept;
    }
}
exports.GetChannelInvitationPreferenceResponseCommand = GetChannelInvitationPreferenceResponseCommand;
//# sourceMappingURL=getChannelInvitationPreferenceCommand.js.map