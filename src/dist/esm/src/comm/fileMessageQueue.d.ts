import BaseChannel from '../model/channel/baseChannel';
import FileMessage from '../model/message/fileMessage';
import FileMessageParams from '../model/params/fileMessageParams';
/**
 * @internal
 */
export default class FileMessageQueue {
    private _sdkState;
    private _requestQueue;
    private _dispatcher;
    private _queueMap;
    private _isConnected;
    constructor({ sdkState, dispatcher, requestQueue }: {
        sdkState: any;
        dispatcher: any;
        requestQueue: any;
    });
    private _sendFileMessage;
    private _resolveMessageQueue;
    private _uploadNextPendingItem;
    request(channel: BaseChannel, requestId: string, params: FileMessageParams): Promise<FileMessage>;
    cancel(channel: BaseChannel, requestId?: string): void;
}
