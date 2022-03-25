"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictionType = void 0;
const deundefined_1 = require("../utils/deundefined");
const validator_1 = require("../utils/validator");
var RestrictionType;
(function (RestrictionType) {
    RestrictionType["MUTED"] = "muted";
    RestrictionType["BANNED"] = "banned";
})(RestrictionType = exports.RestrictionType || (exports.RestrictionType = {}));
class RestrictionInfo {
    constructor(payload) {
        var _a, _b, _c;
        this.restrictionType = null;
        this.description = null;
        this.endAt = -1;
        if ((0, validator_1.isEnumOf)(RestrictionType, payload['restriction_type'])) {
            this.restrictionType = payload['restriction_type'];
        }
        this.description = (_a = payload['description']) !== null && _a !== void 0 ? _a : null;
        this.endAt = (_c = (_b = payload['end_at']) !== null && _b !== void 0 ? _b : payload['muted_end_at']) !== null && _c !== void 0 ? _c : -1;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)({
            'restriction_type': obj.restrictionType,
            'description': obj.description,
            'end_at': obj.endAt,
        }) : null;
    }
}
exports.default = RestrictionInfo;
//# sourceMappingURL=restrictionInfo.js.map