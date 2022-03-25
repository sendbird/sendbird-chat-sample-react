"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../../utils/deundefined");
const validator_1 = require("../../utils/validator");
class MessageMetaArray {
    constructor(payload) {
        this.key = payload['key'];
        this.value = (0, validator_1.isArrayOf)('string', payload['value']) ? [...payload['value']] : [];
    }
    static payloadify(obj) {
        var _a;
        return obj ? (0, deundefined_1.deundefined)({
            key: obj.key,
            value: (_a = obj.value) !== null && _a !== void 0 ? _a : []
        }) : null;
    }
}
exports.default = MessageMetaArray;
//# sourceMappingURL=messageMetaArray.js.map