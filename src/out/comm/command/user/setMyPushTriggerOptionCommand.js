"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMyPushTriggerOptionResponseCommand = exports.SetMyPushTriggerOptionRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const types_1 = require("../../../types");
const const_1 = require("../const");
class SetMyPushTriggerOptionRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, channelUrl, pushTriggerOption, enable }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference/${encodeURIComponent(channelUrl)}`;
        this.params = {
            push_trigger_option: pushTriggerOption,
            enable: enable,
        };
    }
}
exports.SetMyPushTriggerOptionRequestCommand = SetMyPushTriggerOptionRequestCommand;
class SetMyPushTriggerOptionResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.pushTriggerOption = types_1.PushTriggerOption[payload.push_trigger_option];
        this.enabled = payload.enable;
    }
}
exports.SetMyPushTriggerOptionResponseCommand = SetMyPushTriggerOptionResponseCommand;
//# sourceMappingURL=setMyPushTriggerOptionCommand.js.map