"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionEventOperation = void 0;
const validator_1 = require("../../utils/validator");
var ReactionEventOperation;
(function (ReactionEventOperation) {
    ReactionEventOperation["ADD"] = "add";
    ReactionEventOperation["DELETE"] = "delete";
})(ReactionEventOperation = exports.ReactionEventOperation || (exports.ReactionEventOperation = {}));
class ReactionEvent {
    constructor(payload) {
        this.messageId = 0;
        this.userId = null;
        this.key = null;
        this.operation = null;
        this.updatedAt = 0;
        const messageId = (0, validator_1.isTypeOf)('string', payload['msg_id']) ?
            parseInt(payload['msg_id']) :
            payload['msg_id'];
        const userId = payload['user_id'];
        const operation = payload['operation']
            ? payload['operation'].toLowerCase()
            : null;
        const key = payload['reaction'];
        const updatedAt = payload['updated_at'];
        if (messageId &&
            (0, validator_1.isTypeOf)('string', userId) &&
            (0, validator_1.isTypeOf)('string', operation) &&
            (0, validator_1.isEnumOf)(ReactionEventOperation, operation) &&
            (0, validator_1.isTypeOf)('string', key) &&
            key &&
            (0, validator_1.isTypeOf)('number', updatedAt)) {
            this.messageId = messageId;
            this.userId = userId;
            this.key = key;
            this.operation = operation;
            this.updatedAt = updatedAt;
        }
    }
}
exports.default = ReactionEvent;
//# sourceMappingURL=reactionEvent.js.map