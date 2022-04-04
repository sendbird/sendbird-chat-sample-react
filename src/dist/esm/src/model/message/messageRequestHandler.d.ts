import SendableMessage from './sendableMessage';
export declare type MessageHandler = (message: SendableMessage) => void;
export declare type FailedMessageHandler = (err: Error, message: SendableMessage) => void;
export default class MessageRequestHandler {
    private _onPending;
    private _onFailed;
    private _onSucceeded;
    /**
     * @private
     */
    _trigger(err: Error, message: SendableMessage): void;
    onPending(handler: MessageHandler): MessageRequestHandler;
    onFailed(handler: FailedMessageHandler): MessageRequestHandler;
    onSucceeded(handler: MessageHandler): MessageRequestHandler;
}
