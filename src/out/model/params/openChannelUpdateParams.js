"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenChannelUpdateParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class OpenChannelUpdateParamsProperties {
    constructor() {
        this.name = null;
        this.coverUrlOrImage = null;
        this.data = null;
        this.customType = null;
        this.operatorUserIds = [];
    }
}
exports.OpenChannelUpdateParamsProperties = OpenChannelUpdateParamsProperties;
class OpenChannelUpdateParams extends OpenChannelUpdateParamsProperties {
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
        return (((0, validator_1.isArrayOf)('string', this.operatorUserIds) || this.operatorUserIds === null) &&
            ((0, validator_1.isTypeOf)('string', this.coverUrlOrImage) || (0, validator_1.isFile)(this.coverUrlOrImage) || this.coverUrlOrImage === null) &&
            ((0, validator_1.isTypeOf)('string', this.name) || this.name === null) &&
            ((0, validator_1.isTypeOf)('string', this.data) || this.data === null) &&
            ((0, validator_1.isTypeOf)('string', this.customType) || this.customType === null));
    }
}
exports.default = OpenChannelUpdateParams;
//# sourceMappingURL=openChannelUpdateParams.js.map