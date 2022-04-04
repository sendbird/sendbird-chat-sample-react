/**
 * @internal
 */
export interface SendbirdErrorParams {
    code?: number;
    message?: string;
}
export declare enum SendbirdErrorCode {
    SESSION_KEY_EXPIRED = 400302,
    SESSION_TOKEN_EXPIRED = 400309,
    INTERNAL_SERVER_ERROR = 500901,
    RATE_LIMIT_EXCEEDED = 500910,
    UNKNOWN_SERVER_ERROR = 900200,
    DEBUG_MODE_REQUIRED = 700000,
    LOST_INSTANCE = 700100,
    INVALID_CONNECTION_STATE_TRANSITION = 700200,
    INVALID_INITIALIZATION = 800100,
    CONNECTION_REQUIRED = 800101,
    CONNECTION_CANCELED = 800102,
    INVALID_PARAMETER = 800110,
    NETWORK_ERROR = 800120,
    NETWORK_ROUTING_ERROR = 800121,
    MALFORMED_DATA = 800130,
    MALFORMED_ERROR_DATA = 800140,
    WRONG_CHANNEL_TYPE = 800150,
    MARK_AS_READ_RATE_LIMIT_EXCEEDED = 800160,
    QUERY_IN_PROGRESS = 800170,
    ACK_TIMEOUT = 800180,
    LOGIN_TIMEOUT = 800190,
    WEBSOCKET_CONNECTION_CLOSED = 800200,
    WEBSOCKET_CONNECTION_FAILED = 800210,
    REQUEST_FAILED = 800220,
    FILE_UPLOAD_CANCEL_FAILED = 800230,
    REQUEST_CANCELED = 800240,
    REQUEST_DUPLICATED = 800250,
    FILE_SIZE_LIMIT_EXCEEDED = 800260,
    SESSION_TOKEN_REQUEST_FAILED = 800500,
    SESSION_TOKEN_REFRESHED = 800501,
    SESSION_TOKEN_REFRESH_FAILED = 800502
}
/**
 * @internal
 */
export declare const isThrowingOutside: (err: Error) => boolean;
export default class SendbirdError extends Error {
    readonly code: number;
    /**
     * @internal
     */
    shouldThrowOutside: boolean;
    /**
     * @private
     */
    constructor({ code, message }: SendbirdErrorParams);
    /**
     * @internal
     */
    get isSessionTokenExpiredError(): boolean;
    /**
     * @internal
     */
    get isSessionKeyExpiredError(): boolean;
    /**
     * @internal
     */
    static get debugModeRequired(): SendbirdError;
    /**
     * @internal
     */
    static get lostInstance(): SendbirdError;
    /**
     * @internal
     */
    static get invalidConnectionStateTransition(): SendbirdError;
    /**
     * @internal
     */
    static get connectionRequired(): SendbirdError;
    /**
     * @internal
     */
    static get connectionCanceled(): SendbirdError;
    /**
     * @internal
     */
    static get invalidParameters(): SendbirdError;
    /**
     * @internal
     */
    static get networkError(): SendbirdError;
    /**
     * @internal
     */
    static get markAsReadAllRateLimitExceeded(): SendbirdError;
    /**
     * @internal
     */
    static get queryInProgress(): SendbirdError;
    /**
     * @internal
     */
    static get noAckTimeout(): SendbirdError;
    /**
     * @internal
     */
    static get loginTimeout(): SendbirdError;
    /**
     * @internal
     */
    static get connectionClosed(): SendbirdError;
    /**
     * @internal
     */
    static get requestFailed(): SendbirdError;
    /**
     * @internal
     */
    static get fileUploadCanceled(): SendbirdError;
    /**
     * @internal
     */
    static get requestCanceled(): SendbirdError;
    /**
     * @internal
     */
    static get sessionTokenRefreshFailed(): SendbirdError;
    /**
     * @internal
     */
    static get sessionTokenRequestFailed(): SendbirdError;
    /**
     * @internal
     */
    throwOutside(): void;
}
