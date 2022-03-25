"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMessageUpdateParamsProperties = void 0;
const appleCriticalAlertOptions_1 = require("../message/appleCriticalAlertOptions");
const types_1 = require("../message/types");
const validator_1 = require("../../utils/validator");
class BaseMessageUpdateParamsProperties {
    constructor() {
        this.data = null;
        this.customType = null;
        this.mentionType = types_1.MentionType.USERS;
        this.mentionedUserIds = [];
        this.appleCriticalAlertOptions = null;
    }
}
exports.BaseMessageUpdateParamsProperties = BaseMessageUpdateParamsProperties;
class BaseMessageUpdateParams extends BaseMessageUpdateParamsProperties {
    constructor(props) {
        super();
        if (props) {
            for (const key in props) {
                if (this.hasOwnProperty(key)) {
                    this[key] = props[key];
                }
            }
        }
    }
    validate() {
        return (((0, validator_1.isTypeOf)('string', this.data) || this.data === null) &&
            ((0, validator_1.isTypeOf)('string', this.customType) || this.customType === null) &&
            (0, validator_1.isEnumOf)(types_1.MentionType, this.mentionType) &&
            (0, validator_1.isArrayOf)('string', this.mentionedUserIds) &&
            (this.appleCriticalAlertOptions === null || this.appleCriticalAlertOptions instanceof appleCriticalAlertOptions_1.default));
    }
}
exports.default = BaseMessageUpdateParams;
//# sourceMappingURL=baseMessageUpdateParams.js.map