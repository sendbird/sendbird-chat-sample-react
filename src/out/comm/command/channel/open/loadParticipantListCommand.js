"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadParticipantListResponseCommand = exports.LoadParticipantListRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const user_1 = require("../../../../model/user");
class LoadParticipantListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, token, limit, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_OPEN_CHANNELS}/${encodeURIComponent(channelUrl)}/participants`;
        this.params = {
            token,
            limit,
        };
    }
}
exports.LoadParticipantListRequestCommand = LoadParticipantListRequestCommand;
class LoadParticipantListResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = null;
        this.participants = [];
        const { next, participants } = payload;
        this.token = next;
        this.participants = participants.map((userPayload) => new user_1.default(_iid, userPayload));
    }
}
exports.LoadParticipantListResponseCommand = LoadParticipantListResponseCommand;
//# sourceMappingURL=loadParticipantListCommand.js.map