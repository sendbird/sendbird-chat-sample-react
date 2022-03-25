"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRetrievalParamsProperties = void 0;
const types_1 = require("../channel/types");
const validator_1 = require("../../utils/validator");
class MessageRetrievalParamsProperties {
    constructor() {
        this.channelUrl = null;
        this.channelType = null;
        this.messageId = 0;
        this.includeReactions = false;
        this.includeMetaArray = false;
        this.includeParentMessageInfo = false;
        this.includeThreadInfo = false;
        this.includePollDetails = false;
    }
}
exports.MessageRetrievalParamsProperties = MessageRetrievalParamsProperties;
class MessageRetrievalParams extends MessageRetrievalParamsProperties {
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
        return ((0, validator_1.isTypeOf)('string', this.channelUrl) &&
            (0, validator_1.isTypeOf)('string', this.channelType) &&
            (0, validator_1.isEnumOf)(types_1.ChannelType, this.channelType) &&
            (0, validator_1.isTypeOf)('number', this.messageId) &&
            (0, validator_1.isTypeOf)('boolean', this.includeMetaArray) &&
            (0, validator_1.isTypeOf)('boolean', this.includeParentMessageInfo) &&
            (0, validator_1.isTypeOf)('boolean', this.includeThreadInfo) &&
            (0, validator_1.isTypeOf)('boolean', this.includePollDetails));
    }
}
exports.default = MessageRetrievalParams;
//# sourceMappingURL=messageRetrievalParams.js.map