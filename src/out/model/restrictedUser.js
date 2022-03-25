"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const restrictionInfo_1 = require("./restrictionInfo");
const deundefined_1 = require("../utils/deundefined");
class RestrictedUser extends user_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.restrictionInfo = null;
        this.restrictionInfo = new restrictionInfo_1.default(payload);
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), restrictionInfo_1.default.payloadify(obj.restrictionInfo))) : null;
    }
}
exports.default = RestrictedUser;
//# sourceMappingURL=restrictedUser.js.map