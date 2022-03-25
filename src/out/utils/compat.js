"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReactNative = void 0;
const isReactNative = () => {
    return typeof document === 'undefined' &&
        typeof navigator != 'undefined' &&
        navigator.product == 'ReactNative';
};
exports.isReactNative = isReactNative;
//# sourceMappingURL=compat.js.map