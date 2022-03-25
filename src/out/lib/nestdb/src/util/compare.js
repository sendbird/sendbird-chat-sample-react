"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = void 0;
const error_1 = require("../error");
const compare = (v1, v2) => {
    if (v2 === null || typeof v2 === 'undefined')
        return 1;
    else if (v1 === null || typeof v1 === 'undefined')
        return -1;
    if (typeof v1 !== typeof v2)
        throw error_1.default.compareTypesNotMatch;
    let compared = 0;
    const type = typeof v1;
    switch (type) {
        case 'boolean':
        case 'number':
            compared = v1 - v2;
            break;
        case 'string':
            compared = v1.localeCompare(v2);
            break;
        default:
    }
    return compared;
};
exports.compare = compare;
//# sourceMappingURL=compare.js.map