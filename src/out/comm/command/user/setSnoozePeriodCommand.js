"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetSnoozePeriodResponseCommand = exports.SetSnoozePeriodRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetSnoozePeriodRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, snoozeOn, startTs, endTs }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push_preference`;
        this.params = {
            snooze_enabled: snoozeOn,
            snooze_start_ts: startTs,
            snooze_end_ts: endTs,
        };
    }
}
exports.SetSnoozePeriodRequestCommand = SetSnoozePeriodRequestCommand;
class SetSnoozePeriodResponseCommand extends apiResponseCommand_1.default {
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
exports.SetSnoozePeriodResponseCommand = SetSnoozePeriodResponseCommand;
//# sourceMappingURL=setSnoozePeriodCommand.js.map