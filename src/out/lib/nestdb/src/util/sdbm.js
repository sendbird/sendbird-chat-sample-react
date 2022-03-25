"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdbm = void 0;
const sdbm = (key, hashLimit) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
    return (hash >>> 0) % hashLimit;
};
exports.sdbm = sdbm;
//# sourceMappingURL=sdbm.js.map