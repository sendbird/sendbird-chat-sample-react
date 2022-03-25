"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDoNotDisturbResponseCommand = exports.SetDoNotDisturbRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetDoNotDisturbRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, doNotDisturbOn, startHour, startMin, endHour, endMin, timezone, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference`;
        this.params = {
            do_not_disturb: doNotDisturbOn,
            start_hour: startHour,
            start_min: startMin,
            end_hour: endHour,
            end_min: endMin,
            timezone: timezone,
        };
    }
}
exports.SetDoNotDisturbRequestCommand = SetDoNotDisturbRequestCommand;
class SetDoNotDisturbResponseCommand extends apiResponseCommand_1.default {
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
exports.SetDoNotDisturbResponseCommand = SetDoNotDisturbResponseCommand;
//# sourceMappingURL=setDoNotDisturbCommand.js.map