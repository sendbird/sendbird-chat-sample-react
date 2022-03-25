"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ekey = void 0;
const _ekeyMap = new Map();
const ekey = (_iid, ekey = null) => {
    if (ekey !== null)
        _ekeyMap.set(_iid, ekey);
    return _ekeyMap.get(_iid);
};
exports.ekey = ekey;
//# sourceMappingURL=ekey.js.map