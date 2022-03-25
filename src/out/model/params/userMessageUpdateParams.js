"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageUpdateParamsProperties = void 0;
const baseMessageUpdateParams_1 = require("./baseMessageUpdateParams");
const validator_1 = require("../../utils/validator");
class UserMessageUpdateParamsProperties extends baseMessageUpdateParams_1.BaseMessageUpdateParamsProperties {
    constructor() {
        super(...arguments);
        this.message = null;
    }
}
exports.UserMessageUpdateParamsProperties = UserMessageUpdateParamsProperties;
class UserMessageUpdateParams extends UserMessageUpdateParamsProperties {
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
        return (new baseMessageUpdateParams_1.default(this).validate() &&
            ((0, validator_1.isTypeOf)('string', this.message) || this.message === null));
    }
}
exports.default = UserMessageUpdateParams;
//# sourceMappingURL=userMessageUpdateParams.js.map