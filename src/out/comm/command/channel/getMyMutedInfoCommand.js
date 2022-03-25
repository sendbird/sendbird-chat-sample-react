"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMyMutedInfoResponseCommand = exports.GetMyMutedInfoRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class GetMyMutedInfoRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, userId, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/mute/${userId}`;
    }
}
exports.GetMyMutedInfoRequestCommand = GetMyMutedInfoRequestCommand;
class GetMyMutedInfoResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.isMuted = false;
        this.startAt = null;
        this.endAt = null;
        this.remainingDuration = null;
        this.description = null;
        const { is_muted, start_at, end_at, remaining_duration, description } = payload;
        this.isMuted = is_muted;
        this.startAt = start_at;
        this.endAt = end_at;
        this.remainingDuration = remaining_duration;
        this.description = description;
    }
}
exports.GetMyMutedInfoResponseCommand = GetMyMutedInfoResponseCommand;
//# sourceMappingURL=getMyMutedInfoCommand.js.map