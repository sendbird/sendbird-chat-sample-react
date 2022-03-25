"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledUserMessageParamsProperties = void 0;
const userMessageParams_1 = require("./userMessageParams");
const validator_1 = require("../../utils/validator");
class ScheduledUserMessageParamsProperties extends userMessageParams_1.UserMessageParamsProperties {
    constructor() {
        super(...arguments);
        this.year = null;
        this.month = null;
        this.day = null;
        this.hour = null;
        this.min = null;
        this.timezone = null;
    }
}
exports.ScheduledUserMessageParamsProperties = ScheduledUserMessageParamsProperties;
class ScheduledUserMessageParams extends ScheduledUserMessageParamsProperties {
    constructor(props) {
        super();
        this._scheduledDateTimeString = null;
        if (props) {
            for (const key in props) {
                if (this.hasOwnProperty(key)) {
                    this[key] = props[key];
                }
            }
        }
    }
    get scheduledDateTimeString() {
        var _a;
        return (_a = this._scheduledDateTimeString) !== null && _a !== void 0 ? _a : `${this.year.toString()}-${('0' + this.month.toString()).substr(-2)}-${('0' + this.day.toString()).substr(-2)} ${('0' + this.hour.toString()).substr(-2)}:${('0' + this.min.toString()).substr(-2)}`;
    }
    set scheduledDateTimeString(value) {
        if (value && (0, validator_1.isTypeOf)('string', value)) {
            this._scheduledDateTimeString = value;
        }
    }
    setSchedule(schedule) {
        var _a, _b, _c;
        this.year = schedule.year;
        this.month = schedule.month;
        this.day = schedule.day;
        this.hour = (_a = schedule.hour) !== null && _a !== void 0 ? _a : null;
        this.min = (_b = schedule.min) !== null && _b !== void 0 ? _b : null;
        this.timezone = (_c = schedule.timezone) !== null && _c !== void 0 ? _c : null;
        this._scheduledDateTimeString = null;
    }
    validate() {
        return (new userMessageParams_1.default(this).validate() &&
            (0, validator_1.isTypeOf)('number', this.year) &&
            (0, validator_1.isTypeOf)('number', this.month) &&
            (0, validator_1.isTypeOf)('number', this.day) &&
            (0, validator_1.isTypeOf)('number', this.hour, true) &&
            (0, validator_1.isTypeOf)('number', this.min, true) &&
            (0, validator_1.isTypeOf)('string', this.timezone, true));
    }
}
exports.default = ScheduledUserMessageParams;
//# sourceMappingURL=scheduledUserMessageParams.js.map