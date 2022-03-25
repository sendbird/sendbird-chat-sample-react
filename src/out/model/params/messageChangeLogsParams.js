"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageChangeLogsParamsProperties = void 0;
const types_1 = require("../message/types");
const validator_1 = require("../../utils/validator");
class MessageChangeLogsParamsProperties {
    constructor() {
        this.replyType = types_1.ReplyType.NONE;
        this.includeReactions = false;
        this.includeReplies = false;
        this.includeThreadInfo = false;
        this.includeMetaArray = false;
        this.includeParentMessageInfo = false;
        this.includePollDetails = false;
    }
}
exports.MessageChangeLogsParamsProperties = MessageChangeLogsParamsProperties;
class MessageChangeLogsParams extends MessageChangeLogsParamsProperties {
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
        return ((0, validator_1.isEnumOf)(types_1.ReplyType, this.replyType) &&
            (0, validator_1.isTypeOf)('boolean', this.includeReactions) &&
            (0, validator_1.isTypeOf)('boolean', this.includeReplies) &&
            (0, validator_1.isTypeOf)('boolean', this.includeMetaArray) &&
            (0, validator_1.isTypeOf)('boolean', this.includeParentMessageInfo) &&
            (0, validator_1.isTypeOf)('boolean', this.includeThreadInfo) &&
            (0, validator_1.isTypeOf)('boolean', this.includePollDetails));
    }
}
exports.default = MessageChangeLogsParams;
//# sourceMappingURL=messageChangeLogsParams.js.map