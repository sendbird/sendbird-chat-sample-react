"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetChannelInvitationPreferenceResponseCommand = exports.SetChannelInvitationPreferenceRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetChannelInvitationPreferenceRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, willAutoAccept }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/channel_invitation_preference`;
        this.params = {
            auto_accept: willAutoAccept,
        };
    }
}
exports.SetChannelInvitationPreferenceRequestCommand = SetChannelInvitationPreferenceRequestCommand;
class SetChannelInvitationPreferenceResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.autoAccept = payload.auto_accept;
    }
}
exports.SetChannelInvitationPreferenceResponseCommand = SetChannelInvitationPreferenceResponseCommand;
//# sourceMappingURL=setChannelInvitationPreferenceCommand.js.map