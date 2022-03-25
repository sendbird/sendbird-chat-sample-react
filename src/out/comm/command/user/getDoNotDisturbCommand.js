"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDoNotDisturbResponseCommand = exports.GetDoNotDisturbRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetDoNotDisturbRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference`;
    }
}
exports.GetDoNotDisturbRequestCommand = GetDoNotDisturbRequestCommand;
class GetDoNotDisturbResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.preference = {
            doNotDisturbOn: payload.do_not_disturb,
            startHour: payload.start_hour,
            startMin: payload.start_min,
            endHour: payload.end_hour,
            endMin: payload.end_min,
            timezone: payload.timezone,
        };
    }
}
exports.GetDoNotDisturbResponseCommand = GetDoNotDisturbResponseCommand;
//# sourceMappingURL=getDoNotDisturbCommand.js.map