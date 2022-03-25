"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deundefined = void 0;
const deundefined = (obj) => {
    const result = {};
    if (obj) {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] !== 'undefined' && obj[key] !== NaN && obj[key] !== null) {
                result[key] = obj[key];
            }
        });
    }
    return result;
};
exports.deundefined = deundefined;
//# sourceMappingURL=deundefined.js.map