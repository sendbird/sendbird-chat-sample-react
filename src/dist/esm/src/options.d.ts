export declare const DEFAULT_TYPING_INDICATOR_INVALIDATE_TIME: number;
export declare const DEFAULT_TYPING_INDICATOR_THROTTLE = 1000;
export declare const DEFAULT_WEBSOCKET_RESPONSE_TIMEOUT = 10000;
export default class SendbirdChatOptions {
    private _useMemberAsMessageSender;
    private _typingIndicatorInvalidateTime;
    private _typingIndicatorThrottle;
    private _websocketResponseTimeout;
    get useMemberAsMessageSender(): boolean;
    set useMemberAsMessageSender(value: boolean);
    get typingIndicatorInvalidateTime(): number;
    set typingIndicatorInvalidateTime(value: number);
    get typingIndicatorThrottle(): number;
    set typingIndicatorThrottle(value: number);
    get websocketResponseTimeout(): number;
    set websocketResponseTimeout(value: number);
}
