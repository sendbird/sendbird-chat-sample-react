"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSameMembers = exports.isFile = exports.isResendableError = exports.isArrayOf = exports.isEnumOf = exports.isTypeOf = exports.deepEqual = void 0;
const error_1 = require("../error");
const RESENDABLE_ERROR_CODES = [
    error_1.SendbirdErrorCode.CONNECTION_REQUIRED,
    error_1.SendbirdErrorCode.NETWORK_ERROR,
    error_1.SendbirdErrorCode.ACK_TIMEOUT,
    error_1.SendbirdErrorCode.WEBSOCKET_CONNECTION_CLOSED,
    error_1.SendbirdErrorCode.WEBSOCKET_CONNECTION_FAILED,
    error_1.SendbirdErrorCode.FILE_UPLOAD_CANCEL_FAILED,
    error_1.SendbirdErrorCode.REQUEST_CANCELED,
    error_1.SendbirdErrorCode.INTERNAL_SERVER_ERROR,
    error_1.SendbirdErrorCode.RATE_LIMIT_EXCEEDED,
    error_1.SendbirdErrorCode.UNKNOWN_SERVER_ERROR,
];
const deepEqual = (origin, target) => {
    if (origin !== target) {
        const clonedOrigin = Object.assign({}, origin);
        const clonedTarget = Object.assign({}, target);
        if (clonedOrigin.hasOwnProperty('messageId') &&
            clonedTarget.hasOwnProperty('messageId') &&
            clonedOrigin['messageId'] !== clonedTarget['messageId']) {
            return false;
        }
        else if (clonedOrigin.hasOwnProperty('reqId') &&
            clonedTarget.hasOwnProperty('reqId') &&
            clonedOrigin['reqId'] !== clonedTarget['reqId']) {
            return false;
        }
        if (clonedOrigin.hasOwnProperty('messageId')) {
            delete clonedOrigin['messageId'];
        }
        if (clonedOrigin.hasOwnProperty('reqId')) {
            delete clonedOrigin['reqId'];
        }
        if (clonedTarget.hasOwnProperty('messageId')) {
            delete clonedTarget['messageId'];
        }
        if (clonedTarget.hasOwnProperty('reqId')) {
            delete clonedTarget['reqId'];
        }
        return JSON.stringify(clonedOrigin) === JSON.stringify(clonedTarget);
    }
    return true;
};
exports.deepEqual = deepEqual;
const isTypeOf = (typeOrEnum, value, nullable = false) => {
    if (nullable && (value === null || value === undefined))
        return true;
    return typeof typeOrEnum === 'string' ?
        typeof value === typeOrEnum :
        (0, exports.isEnumOf)(typeOrEnum, value);
};
exports.isTypeOf = isTypeOf;
const isEnumOf = (Enum, value) => {
    return Object.values(Enum).includes(value);
};
exports.isEnumOf = isEnumOf;
const isArrayOf = (typeOrEnum, value, nullable = false) => {
    if (nullable && (value === null || value === undefined))
        return true;
    return Array.isArray(value) && value.every((item) => (0, exports.isTypeOf)(typeOrEnum, item));
};
exports.isArrayOf = isArrayOf;
const isResendableError = (errorCode) => {
    return errorCode > 0 && RESENDABLE_ERROR_CODES.indexOf(errorCode) >= 0;
};
exports.isResendableError = isResendableError;
const isFile = (obj, nullable = false) => {
    if (nullable && obj === null)
        return true;
    const isFileInfoObject = (0, exports.isTypeOf)('object', obj) &&
        obj !== null &&
        obj.hasOwnProperty('name') && typeof obj['name'] === 'string' &&
        obj.hasOwnProperty('uri') && typeof obj['uri'] === 'string' &&
        obj.hasOwnProperty('type') && typeof obj['type'] === 'string';
    if (!isFileInfoObject) {
        if (typeof Blob !== 'undefined') {
            return obj instanceof Blob;
        }
        else if (typeof File !== 'undefined') {
            return obj instanceof File;
        }
    }
    return isFileInfoObject;
};
exports.isFile = isFile;
const hasSameMembers = (a, b) => {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    for (let i = 0; i < sortedA.length; ++i) {
        if (sortedA[i] !== sortedB[i])
            return false;
    }
    return true;
};
exports.hasSameMembers = hasSameMembers;
//# sourceMappingURL=validator.js.map