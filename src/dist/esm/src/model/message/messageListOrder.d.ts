export declare enum MessageListOrder {
    CHANNEL_LATEST = "channel_latest"
}
/**
 * @internal
 */
export declare const getMessageIndexBy: (order: MessageListOrder) => string[];
