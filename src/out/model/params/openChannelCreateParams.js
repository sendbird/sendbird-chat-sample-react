"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenChannelCreateParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class OpenChannelCreateParamsProperties {
    constructor() {
        this.channelUrl = null;
        this.name = null;
        this.coverUrlOrImage = null;
        this.data = null;
        this.customType = null;
        this.operatorUserIds = [];
    }
}
exports.OpenChannelCreateParamsProperties = OpenChannelCreateParamsProperties;
class OpenChannelCreateParams extends OpenChannelCreateParamsProperties {
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
            ((0, validator_1.isTypeOf)('string', this.customType) || this.customType === null) &&
            (((0, validator_1.isTypeOf)('string', this.channelUrl) && /^\w+$/.test(this.channelUrl)) || this.channelUrl === null));
    }
}
exports.default = OpenChannelCreateParams;
//# sourceMappingURL=openChannelCreateParams.js.map