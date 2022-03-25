"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
const util_1 = require("../../util");
const hash = (key, level, params) => {
    const hashLimit = params.base * Math.pow(params.multiplier, level) + params.constant;
    const hashFunction = params.hashFunction || util_1.sdbm;
    return hashFunction(key, hashLimit);
};
exports.hash = hash;
//# sourceMappingURL=hasher.js.map