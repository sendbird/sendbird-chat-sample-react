"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
const error_1 = require("../error");
const clone = (val, _ref = new WeakMap()) => {
    if (typeof val === 'object' && val !== null) {
        if (!_ref.has(val)) {
            _ref.set(val, true);
            let cloned = null;
            if (Array.isArray(val))
                cloned = val.map((item) => (0, exports.clone)(item, _ref));
            else if (val instanceof RegExp)
                cloned = val;
            else if (val instanceof Date)
                cloned = val;
            else {
                cloned = {};
                for (const key in val)
                    cloned[key] = (0, exports.clone)(val[key], _ref);
            }
            _ref.delete(val);
            return cloned;
        }
        else {
            throw error_1.default.circularReferenceFound;
        }
    }
    return val;
};
exports.clone = clone;
//# sourceMappingURL=clone.js.map