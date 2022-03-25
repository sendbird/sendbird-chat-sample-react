"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSnoozePeriodResponseCommand = exports.GetSnoozePeriodRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetSnoozePeriodRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference`;
    }
}
exports.GetSnoozePeriodRequestCommand = GetSnoozePeriodRequestCommand;
class GetSnoozePeriodResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.snoozePeriod = {
            isSnoozeOn: payload.snooze_enabled,
        };
        if (typeof payload.snooze_start_ts === 'number') {
            this.snoozePeriod.startTs = payload.snooze_start_ts;
        }
        if (typeof payload.snooze_end_ts === 'number') {
            this.snoozePeriod.endTs = payload.snooze_end_ts;
        }
    }
}
exports.GetSnoozePeriodResponseCommand = GetSnoozePeriodResponseCommand;
//# sourceMappingURL=getSnoozePeriodCommand.js.map