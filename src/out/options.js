"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_WEBSOCKET_RESPONSE_TIMEOUT = exports.DEFAULT_TYPING_INDICATOR_THROTTLE = exports.DEFAULT_TYPING_INDICATOR_INVALIDATE_TIME = void 0;
const validator_1 = require("./utils/validator");
exports.DEFAULT_TYPING_INDICATOR_INVALIDATE_TIME = 10 * 1000;
exports.DEFAULT_TYPING_INDICATOR_THROTTLE = 1000;
const MIN_TYPING_INDICATOR_THROTTLE = 1000;
const MAX_TYPING_INDICATOR_THROTTLE = 9000;
exports.DEFAULT_WEBSOCKET_RESPONSE_TIMEOUT = 10000;
const MIN_WEBSOCKET_RESPONSE_TIMEOUT = 5000;
const MAX_WEBSOCKET_RESPONSE_TIMEOUT = 30000;
class SendbirdChatOptions {
    constructor() {
        this._useMemberAsMessageSender = false;
        this._typingIndicatorInvalidateTime = exports.DEFAULT_TYPING_INDICATOR_INVALIDATE_TIME;
        this._typingIndicatorThrottle = exports.DEFAULT_TYPING_INDICATOR_THROTTLE;
        this._websocketResponseTimeout = exports.DEFAULT_WEBSOCKET_RESPONSE_TIMEOUT;
    }
    get useMemberAsMessageSender() {
        return this._useMemberAsMessageSender;
    }
    set useMemberAsMessageSender(value) {
        if ((0, validator_1.isTypeOf)('boolean', value)) {
            this._useMemberAsMessageSender = value;
        }
    }
    get typingIndicatorInvalidateTime() {
        return this._typingIndicatorInvalidateTime;
    }
    set typingIndicatorInvalidateTime(value) {
        if ((0, validator_1.isTypeOf)('number', value)) {
            this._typingIndicatorInvalidateTime = value;
        }
    }
    get typingIndicatorThrottle() {
        return this._typingIndicatorThrottle;
    }
    set typingIndicatorThrottle(value) {
        if ((0, validator_1.isTypeOf)('number', value)
            && value >= MIN_TYPING_INDICATOR_THROTTLE
            && value <= MAX_TYPING_INDICATOR_THROTTLE) {
            this._typingIndicatorThrottle = value;
        }
    }
    get websocketResponseTimeout() {
        return this._websocketResponseTimeout;
    }
    set websocketResponseTimeout(value) {
        if ((0, validator_1.isTypeOf)('number', value)
            && value >= MIN_WEBSOCKET_RESPONSE_TIMEOUT
            && value <= MAX_WEBSOCKET_RESPONSE_TIMEOUT) {
            this._websocketResponseTimeout = value;
        }
    }
}
exports.default = SendbirdChatOptions;
//# sourceMappingURL=options.js.map