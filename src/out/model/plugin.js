"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../utils/deundefined");
const validator_1 = require("../utils/validator");
class Plugin {
    constructor(payload) {
        var _a, _b;
        this.type = null;
        this.vendor = null;
        this.detail = {};
        this.type = (_a = payload['type']) !== null && _a !== void 0 ? _a : '';
        this.vendor = (_b = payload['vendor']) !== null && _b !== void 0 ? _b : '';
        if (payload.hasOwnProperty('detail') &&
            (0, validator_1.isTypeOf)('object', payload['detail']) &&
            !Array.isArray(payload['detail'])) {
            this.detail = payload['detail'];
        }
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)({
            'type': obj.type,
            'vendor': obj.vendor,
            'detail': obj.detail,
        }) : null;
    }
}
exports.default = Plugin;
//# sourceMappingURL=plugin.js.map