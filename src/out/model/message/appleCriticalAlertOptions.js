"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../../utils/deundefined");
const DEFAULT_NAME = 'default';
const DEFAULT_VOLUME = 1.0;
class AppleCriticalAlertOptions {
    constructor(payload) {
        var _a, _b;
        this.name = null;
        this.volume = 0;
        this.name = (_a = payload['name']) !== null && _a !== void 0 ? _a : DEFAULT_NAME;
        this.volume = (_b = payload['volume']) !== null && _b !== void 0 ? _b : DEFAULT_VOLUME;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)({
            name: obj.name,
            volume: obj.volume,
        }) : null;
    }
}
exports.default = AppleCriticalAlertOptions;
//# sourceMappingURL=appleCriticalAlertOptions.js.map