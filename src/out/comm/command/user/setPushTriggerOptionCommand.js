"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPushTriggerOptionResponseCommand = exports.SetPushTriggerOptionRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetPushTriggerOptionRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, pushTriggerOption }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference`;
        this.params = {
            push_trigger_option: pushTriggerOption,
        };
    }
}
exports.SetPushTriggerOptionRequestCommand = SetPushTriggerOptionRequestCommand;
class SetPushTriggerOptionResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.pushTriggerOption = payload.push_trigger_option;
    }
}
exports.SetPushTriggerOptionResponseCommand = SetPushTriggerOptionResponseCommand;
//# sourceMappingURL=setPushTriggerOptionCommand.js.map