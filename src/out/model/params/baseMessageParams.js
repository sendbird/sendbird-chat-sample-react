"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMessageParamsProperties = void 0;
const messageMetaArray_1 = require("../message/messageMetaArray");
const appleCriticalAlertOptions_1 = require("../message/appleCriticalAlertOptions");
const types_1 = require("../message/types");
const validator_1 = require("../../utils/validator");
class BaseMessageParamsProperties {
    constructor() {
        this.data = null;
        this.customType = null;
        this.mentionType = types_1.MentionType.USERS;
        this.mentionedUserIds = [];
        this.metaArrays = [];
        this.parentMessageId = 0;
        this.isReplyToChannel = false;
        this.pushNotificationDeliveryOption = null;
        this.appleCriticalAlertOptions = null;
    }
}
exports.BaseMessageParamsProperties = BaseMessageParamsProperties;
class BaseMessageParams extends BaseMessageParamsProperties {
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
            Array.isArray(this.metaArrays) &&
            this.metaArrays.every((item) => item instanceof messageMetaArray_1.default) &&
            ((0, validator_1.isTypeOf)('number', this.parentMessageId) || this.parentMessageId === null) &&
            (0, validator_1.isTypeOf)('boolean', this.isReplyToChannel) &&
            (this.pushNotificationDeliveryOption === null ||
                (0, validator_1.isEnumOf)(types_1.PushNotificationDeliveryOption, this.pushNotificationDeliveryOption)) &&
            (this.appleCriticalAlertOptions === null || this.appleCriticalAlertOptions instanceof appleCriticalAlertOptions_1.default));
    }
}
exports.default = BaseMessageParams;
//# sourceMappingURL=baseMessageParams.js.map