"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMyPushTriggerOptionResponseCommand = exports.GetMyPushTriggerOptionRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const types_1 = require("../../../types");
const const_1 = require("../const");
class GetMyPushTriggerOptionRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, channelUrl }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference/${encodeURIComponent(channelUrl)}`;
    }
}
exports.GetMyPushTriggerOptionRequestCommand = GetMyPushTriggerOptionRequestCommand;
class GetMyPushTriggerOptionResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.pushTriggerOption = types_1.PushTriggerOption[payload.push_trigger_option];
        this.enabled = payload.enable;
    }
}
exports.GetMyPushTriggerOptionResponseCommand = GetMyPushTriggerOptionResponseCommand;
//# sourceMappingURL=getMyPushTriggerOptionCommand.js.map