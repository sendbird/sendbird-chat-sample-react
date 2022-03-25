"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageParamsProperties = void 0;
const baseMessageParams_1 = require("./baseMessageParams");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
class UserMessageParamsProperties extends baseMessageParams_1.BaseMessageParamsProperties {
    constructor() {
        super(...arguments);
        this.message = null;
        this.translationTargetLanguages = null;
    }
}
exports.UserMessageParamsProperties = UserMessageParamsProperties;
class UserMessageParams extends UserMessageParamsProperties {
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
    static fromFailedUserMessage(failedMessage) {
        return new UserMessageParams((0, deundefined_1.deundefined)({
            data: failedMessage.data,
            customType: failedMessage.customType,
            mentionType: failedMessage.mentionType,
            mentionedUserIds: failedMessage.requestedMentionUserIds,
            metaArrays: failedMessage.metaArrays,
            parentMessageId: failedMessage.parentMessageId,
            appleCriticalAlertOptions: failedMessage.appleCriticalAlertOptions,
            message: failedMessage.message,
            translationTargetLanguages: Object.keys(failedMessage.translations),
        }));
    }
    validate() {
        return (new baseMessageParams_1.default(this).validate() &&
            ((0, validator_1.isTypeOf)('string', this.message) || this.message === null) &&
            (0, validator_1.isArrayOf)('string', this.translationTargetLanguages));
    }
}
exports.default = UserMessageParams;
//# sourceMappingURL=userMessageParams.js.map