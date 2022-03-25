"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseMessage_1 = require("./baseMessage");
const sender_1 = require("./sender");
const types_1 = require("./types");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
class SendableMessage extends baseMessage_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c;
        super(_iid, payload);
        this.sender = null;
        this.reqId = '';
        this.requestState = types_1.RequestState.PENDING;
        this.requestedMentionUserIds = [];
        this.errorCode = 0;
        this.sender = new sender_1.default(this._iid, payload.user);
        this.reqId = (_a = payload['req_id']) !== null && _a !== void 0 ? _a : '';
        this.requestState = (this.messageId > 0) ? types_1.RequestState.SUCCEEDED : types_1.RequestState.FAILED;
        if (payload['request_state'] && (0, validator_1.isEnumOf)(types_1.RequestState, payload['request_state'])) {
            this.requestState = payload['request_state'];
        }
        this.requestedMentionUserIds = (_b = payload['requested_mention_user_ids']) !== null && _b !== void 0 ? _b : [];
        this.errorCode = (_c = payload['error_code']) !== null && _c !== void 0 ? _c : 0;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'user': sender_1.default.payloadify(obj.sender), 'req_id': obj.reqId, 'request_state': obj.requestState, 'requested_mention_user_ids': obj.requestedMentionUserIds, 'error_code': obj.errorCode })) : null;
    }
    get isResendable() {
        return this.requestState === types_1.RequestState.FAILED && (0, validator_1.isResendableError)(this.errorCode);
    }
    isIdentical(message) {
        return (this.messageId > 0 && message.messageId > 0) ?
            this.messageId === message.messageId :
            this.reqId === message.reqId;
    }
}
exports.default = SendableMessage;
//# sourceMappingURL=sendableMessage.js.map