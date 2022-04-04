import WebSocketRequestCommand from '../../../core/command/websocket/websocketRequestCommand';
/**
 * @internal
 */
export interface MessageAckCommandParams {
    channelUrl: string;
    messageId: number;
}
/**
 * @internal
 */
export declare class MessageAckCommand extends WebSocketRequestCommand {
    constructor({ channelUrl, messageId }: MessageAckCommandParams);
}
