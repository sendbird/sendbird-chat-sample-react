"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unless = void 0;
const unless = (expr) => {
    return {
        do: (action) => {
            if (!expr)
                action();
        },
        throw: (err) => {
            if (!expr)
                throw err;
        },
    };
};
exports.unless = unless;
//# sourceMappingURL=unless.js.map