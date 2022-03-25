"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPushTriggerOptionResponseCommand = exports.GetPushTriggerOptionRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetPushTriggerOptionRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference`;
    }
}
exports.GetPushTriggerOptionRequestCommand = GetPushTriggerOptionRequestCommand;
class GetPushTriggerOptionResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.pushTriggerOption = payload.push_trigger_option;
    }
}
exports.GetPushTriggerOptionResponseCommand = GetPushTriggerOptionResponseCommand;
//# sourceMappingURL=getPushTriggerOptionCommand.js.map