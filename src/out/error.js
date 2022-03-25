"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendbirdErrorCode = void 0;
var SendbirdErrorCode;
(function (SendbirdErrorCode) {
    SendbirdErrorCode[SendbirdErrorCode["SESSION_KEY_EXPIRED"] = 400302] = "SESSION_KEY_EXPIRED";
    SendbirdErrorCode[SendbirdErrorCode["SESSION_TOKEN_EXPIRED"] = 400309] = "SESSION_TOKEN_EXPIRED";
    SendbirdErrorCode[SendbirdErrorCode["INTERNAL_SERVER_ERROR"] = 500901] = "INTERNAL_SERVER_ERROR";
    SendbirdErrorCode[SendbirdErrorCode["RATE_LIMIT_EXCEEDED"] = 500910] = "RATE_LIMIT_EXCEEDED";
    SendbirdErrorCode[SendbirdErrorCode["UNKNOWN_SERVER_ERROR"] = 900200] = "UNKNOWN_SERVER_ERROR";
    SendbirdErrorCode[SendbirdErrorCode["DEBUG_MODE_REQUIRED"] = 700000] = "DEBUG_MODE_REQUIRED";
    SendbirdErrorCode[SendbirdErrorCode["LOST_INSTANCE"] = 700100] = "LOST_INSTANCE";
    SendbirdErrorCode[SendbirdErrorCode["INVALID_CONNECTION_STATE_TRANSITION"] = 700200] = "INVALID_CONNECTION_STATE_TRANSITION";
    SendbirdErrorCode[SendbirdErrorCode["INVALID_INITIALIZATION"] = 800100] = "INVALID_INITIALIZATION";
    SendbirdErrorCode[SendbirdErrorCode["CONNECTION_REQUIRED"] = 800101] = "CONNECTION_REQUIRED";
    SendbirdErrorCode[SendbirdErrorCode["CONNECTION_CANCELED"] = 800102] = "CONNECTION_CANCELED";
    SendbirdErrorCode[SendbirdErrorCode["INVALID_PARAMETER"] = 800110] = "INVALID_PARAMETER";
    SendbirdErrorCode[SendbirdErrorCode["NETWORK_ERROR"] = 800120] = "NETWORK_ERROR";
    SendbirdErrorCode[SendbirdErrorCode["NETWORK_ROUTING_ERROR"] = 800121] = "NETWORK_ROUTING_ERROR";
    SendbirdErrorCode[SendbirdErrorCode["MALFORMED_DATA"] = 800130] = "MALFORMED_DATA";
    SendbirdErrorCode[SendbirdErrorCode["MALFORMED_ERROR_DATA"] = 800140] = "MALFORMED_ERROR_DATA";
    SendbirdErrorCode[SendbirdErrorCode["WRONG_CHANNEL_TYPE"] = 800150] = "WRONG_CHANNEL_TYPE";
    SendbirdErrorCode[SendbirdErrorCode["MARK_AS_READ_RATE_LIMIT_EXCEEDED"] = 800160] = "MARK_AS_READ_RATE_LIMIT_EXCEEDED";
    SendbirdErrorCode[SendbirdErrorCode["QUERY_IN_PROGRESS"] = 800170] = "QUERY_IN_PROGRESS";
    SendbirdErrorCode[SendbirdErrorCode["ACK_TIMEOUT"] = 800180] = "ACK_TIMEOUT";
    SendbirdErrorCode[SendbirdErrorCode["LOGIN_TIMEOUT"] = 800190] = "LOGIN_TIMEOUT";
    SendbirdErrorCode[SendbirdErrorCode["WEBSOCKET_CONNECTION_CLOSED"] = 800200] = "WEBSOCKET_CONNECTION_CLOSED";
    SendbirdErrorCode[SendbirdErrorCode["WEBSOCKET_CONNECTION_FAILED"] = 800210] = "WEBSOCKET_CONNECTION_FAILED";
    SendbirdErrorCode[SendbirdErrorCode["REQUEST_FAILED"] = 800220] = "REQUEST_FAILED";
    SendbirdErrorCode[SendbirdErrorCode["FILE_UPLOAD_CANCEL_FAILED"] = 800230] = "FILE_UPLOAD_CANCEL_FAILED";
    SendbirdErrorCode[SendbirdErrorCode["REQUEST_CANCELED"] = 800240] = "REQUEST_CANCELED";
    SendbirdErrorCode[SendbirdErrorCode["REQUEST_DUPLICATED"] = 800250] = "REQUEST_DUPLICATED";
    SendbirdErrorCode[SendbirdErrorCode["FILE_SIZE_LIMIT_EXCEEDED"] = 800260] = "FILE_SIZE_LIMIT_EXCEEDED";
    SendbirdErrorCode[SendbirdErrorCode["SESSION_TOKEN_REQUEST_FAILED"] = 800500] = "SESSION_TOKEN_REQUEST_FAILED";
    SendbirdErrorCode[SendbirdErrorCode["SESSION_TOKEN_REFRESHED"] = 800501] = "SESSION_TOKEN_REFRESHED";
    SendbirdErrorCode[SendbirdErrorCode["SESSION_TOKEN_REFRESH_FAILED"] = 800502] = "SESSION_TOKEN_REFRESH_FAILED";
})(SendbirdErrorCode = exports.SendbirdErrorCode || (exports.SendbirdErrorCode = {}));
const DEFAULT_ERROR_NAME = 'SendbirdError';
class SendbirdError extends Error {
    constructor({ code = 0, message }) {
        super(message);
        this.name = DEFAULT_ERROR_NAME;
        this.code = code;
    }
    get isSessionTokenExpiredError() {
        return this.code === SendbirdErrorCode.SESSION_TOKEN_EXPIRED;
    }
    get isSessionKeyExpiredError() {
        return this.code === SendbirdErrorCode.SESSION_KEY_EXPIRED;
    }
    static get debugModeRequired() {
        return new SendbirdError({
            code: SendbirdErrorCode.DEBUG_MODE_REQUIRED,
            message: 'Cannot run this operation in production mode.',
        });
    }
    static get lostInstance() {
        return new SendbirdError({
            code: SendbirdErrorCode.LOST_INSTANCE,
            message: 'Instance ID is missing. It should belong to an instance.',
        });
    }
    static get invalidConnectionStateTransition() {
        return new SendbirdError({
            code: SendbirdErrorCode.INVALID_CONNECTION_STATE_TRANSITION,
            message: 'Invalid connection state transition.',
        });
    }
    static get connectionRequired() {
        return new SendbirdError({
            code: SendbirdErrorCode.CONNECTION_REQUIRED,
            message: 'Connection is required.',
        });
    }
    static get connectionCanceled() {
        return new SendbirdError({
            code: SendbirdErrorCode.CONNECTION_CANCELED,
            message: 'Connection is canceled.',
        });
    }
    static get invalidParameters() {
        return new SendbirdError({
            code: SendbirdErrorCode.INVALID_PARAMETER,
            message: 'Invalid parameters.',
        });
    }
    static get networkError() {
        return new SendbirdError({
            code: SendbirdErrorCode.NETWORK_ERROR,
            message: 'There was a network error.',
        });
    }
    static get markAsReadAllRateLimitExceeded() {
        return new SendbirdError({
            code: SendbirdErrorCode.MARK_AS_READ_RATE_LIMIT_EXCEEDED,
            message: 'markAsRead rate limit exceeded.',
        });
    }
    static get queryInProgress() {
        return new SendbirdError({
            code: SendbirdErrorCode.QUERY_IN_PROGRESS,
            message: 'Query in progress.',
        });
    }
    static get noAckTimeout() {
        return new SendbirdError({
            code: SendbirdErrorCode.ACK_TIMEOUT,
            message: 'Command received no ack.',
        });
    }
    static get loginTimeout() {
        return new SendbirdError({
            code: SendbirdErrorCode.LOGIN_TIMEOUT,
            message: 'Connection timeout.',
        });
    }
    static get connectionClosed() {
        return new SendbirdError({
            code: SendbirdErrorCode.WEBSOCKET_CONNECTION_CLOSED,
            message: 'Connection is closed. Please reconnect.',
        });
    }
    static get requestFailed() {
        return new SendbirdError({
            code: SendbirdErrorCode.REQUEST_FAILED,
            message: 'Request failed.',
        });
    }
    static get fileUploadCanceled() {
        return new SendbirdError({
            code: SendbirdErrorCode.FILE_UPLOAD_CANCEL_FAILED,
            message: 'File upload has been canceled.',
        });
    }
    static get requestCanceled() {
        return new SendbirdError({
            code: SendbirdErrorCode.REQUEST_CANCELED,
            message: 'Request has been canceled.',
        });
    }
    static get sessionTokenRefreshFailed() {
        return new SendbirdError({
            code: SendbirdErrorCode.SESSION_TOKEN_REFRESH_FAILED,
            message: 'Failed to refresh the session key.',
        });
    }
    static get sessionTokenRequestFailed() {
        return new SendbirdError({
            code: SendbirdErrorCode.SESSION_TOKEN_REQUEST_FAILED,
            message: 'Failed to get the session token.',
        });
    }
}
exports.default = SendbirdError;
//# sourceMappingURL=error.js.map