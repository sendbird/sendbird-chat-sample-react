"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberState = void 0;
const restrictedUser_1 = require("../restrictedUser");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
const types_1 = require("./types");
var MemberState;
(function (MemberState) {
    MemberState["NONE"] = "none";
    MemberState["JOINED"] = "joined";
    MemberState["INVITED"] = "invited";
})(MemberState = exports.MemberState || (exports.MemberState = {}));
class Member extends restrictedUser_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.state = null;
        this.role = null;
        this.isMuted = false;
        this.isBlockedByMe = false;
        this.isBlockingMe = false;
        this.state = (0, validator_1.isEnumOf)(MemberState, payload['state']) ? payload['state'] : null;
        this.role = (0, validator_1.isEnumOf)(types_1.Role, payload['role']) ? payload['role'] : null;
        if (payload.hasOwnProperty('is_muted')) {
            this.isMuted = payload['is_muted'];
        }
        if (payload.hasOwnProperty('is_blocked_by_me')) {
            this.isBlockedByMe = payload['is_blocked_by_me'];
        }
        if (payload.hasOwnProperty('is_blocking_me')) {
            this.isBlockingMe = payload['is_blocking_me'];
        }
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'state': obj.state, 'role': obj.role, 'is_muted': obj.isMuted, 'is_blocked_by_me': obj.isBlockedByMe, 'is_blocking_me': obj.isBlockingMe })) : null;
    }
}
exports.default = Member;
//# sourceMappingURL=member.js.map