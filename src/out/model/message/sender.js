"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
const types_1 = require("../channel/types");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
class Sender extends user_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.role = null;
        this.isBlockedByMe = false;
        this.role = (0, validator_1.isEnumOf)(types_1.Role, payload['role']) ? payload['role'] : types_1.Role.NONE;
        if (payload.hasOwnProperty('is_blocked_by_me')) {
            this.isBlockedByMe = payload['is_blocked_by_me'];
        }
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'role': obj.role, 'is_blocked_by_me': obj.isBlockedByMe })) : null;
    }
}
exports.default = Sender;
//# sourceMappingURL=sender.js.map