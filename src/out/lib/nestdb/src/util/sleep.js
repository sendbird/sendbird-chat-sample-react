"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (ts) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ts);
    });
};
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map