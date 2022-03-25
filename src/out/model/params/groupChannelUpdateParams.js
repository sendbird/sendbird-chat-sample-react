"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelUpdateParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class GroupChannelUpdateParamsProperties {
    constructor() {
        this.coverUrl = null;
        this.coverImage = null;
        this.isDistinct = null;
        this.isPublic = null;
        this.isDiscoverable = null;
        this.accessCode = null;
        this.name = null;
        this.data = null;
        this.customType = null;
        this.operatorUserIds = [];
        this.messageSurvivalSeconds = null;
    }
}
exports.GroupChannelUpdateParamsProperties = GroupChannelUpdateParamsProperties;
class GroupChannelUpdateParams extends GroupChannelUpdateParamsProperties {
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
        return (((0, validator_1.isTypeOf)('string', this.coverUrl) || this.coverUrl === null) &&
            ((0, validator_1.isFile)(this.coverImage) || (0, validator_1.isTypeOf)('string', this.coverImage) || this.coverImage === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isDistinct) || this.isDistinct === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isPublic) || this.isPublic === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isDiscoverable) || this.isDiscoverable === null) &&
            ((0, validator_1.isTypeOf)('string', this.accessCode) || this.accessCode === null) &&
            ((0, validator_1.isTypeOf)('string', this.name) || this.name === null) &&
            ((0, validator_1.isTypeOf)('string', this.data) || this.data === null) &&
            ((0, validator_1.isTypeOf)('string', this.customType) || this.customType === null) &&
            ((0, validator_1.isArrayOf)('string', this.operatorUserIds) || this.operatorUserIds === null) &&
            ((0, validator_1.isTypeOf)('number', this.messageSurvivalSeconds) || this.messageSurvivalSeconds === null));
    }
}
exports.default = GroupChannelUpdateParams;
//# sourceMappingURL=groupChannelUpdateParams.js.map