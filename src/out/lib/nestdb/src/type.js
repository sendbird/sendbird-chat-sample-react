"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitiveType = void 0;
const isPrimitiveType = (val) => {
    const t = typeof val;
    return val === null
        || t === 'undefined'
        || t === 'boolean'
        || t === 'number'
        || t === 'string';
};
exports.isPrimitiveType = isPrimitiveType;
//# sourceMappingURL=type.js.map