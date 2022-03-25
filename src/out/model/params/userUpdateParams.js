"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class UserUpdateParamsProperties {
    constructor() {
        this.profileImage = null;
        this.profileUrl = null;
        this.nickname = null;
    }
}
exports.UserUpdateParamsProperties = UserUpdateParamsProperties;
class UserUpdateParams extends UserUpdateParamsProperties {
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
        return ((0, validator_1.isFile)(this.profileImage, true) &&
            (0, validator_1.isTypeOf)('string', this.profileUrl, true) &&
            (0, validator_1.isTypeOf)('string', this.nickname, true));
    }
}
exports.default = UserUpdateParams;
//# sourceMappingURL=userUpdateParams.js.map