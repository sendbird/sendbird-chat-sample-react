import GroupChannelEventContext from '../groupChannel/context';
import MessageEventContext from './context';
import MessageFilter from '../../cache/messageFilter';
import GroupChannel from '../../model/channel/groupChannel';
import BaseMessage from '../../model/message/baseMessage';
import SendableMessage from '../../model/message/sendableMessage';
export interface MessageCollectionParams {
    filter?: MessageFilter;
    limit?: number;
}
export interface MessageCollectionEventHandler {
    onChannelUpdated: (context: GroupChannelEventContext, channel: GroupChannel) => void;
    onChannelDeleted: (context: GroupChannelEventContext, channelUrl: string) => void;
    onMessagesAdded: (context: MessageEventContext, channel: GroupChannel, messages: BaseMessage[]) => void;
    onMessagesUpdated: (context: MessageEventContext, channel: GroupChannel, messages: BaseMessage[]) => void;
    onMessagesDeleted: (context: MessageEventContext, channel: GroupChannel, messageIds: number[]) => void;
    onHugeGapDetected: () => void;
}
export declare enum MessageCollectionInitPolicy {
    CACHE_AND_REPLACE_BY_API = "cache_and_replace_by_api",
    API_ONLY = "api_only"
}
export declare type MessageCollectionInitResultHandler = (err: Error, messages: BaseMessage[]) => void;
export declare class MessageCollectionInitHandler {
    private _onCacheResult;
    private _onApiResult;
    /**
     * @private
     */
    _invokeResponse(source: 'local' | 'remote', err: Error, messages: BaseMessage[]): void;
    onCacheResult(handler: MessageCollectionInitResultHandler): MessageCollectionInitHandler;
    onApiResult(handler: MessageCollectionInitResultHandler): MessageCollectionInitHandler;
}
export default class MessageCollection {
    readonly filter: MessageFilter;
    private _channel;
    private _messages;
    private _hasPrevious;
    private _hasNext;
    private _syncRange;
    private _limit;
    private _readReceiptMap;
    private _deliveryReceiptMap;
    private _prevFill;
    private _nextFill;
    private _iid;
    private _key;
    private _handler;
    /**
     * @private
     */
    constructor(_iid: string, { channel, filter, limit, }: MessageCollectionParams & {
        channel: GroupChannel;
    });
    get channel(): GroupChannel;
    get messages(): BaseMessage[];
    get hasPrevious(): boolean;
    get hasNext(): boolean;
    private get viewTop();
    private get viewBottom();
    setEventHandler(handler: MessageCollectionEventHandler): void;
    private _addMessagesToView;
    private _updateMessagesToView;
    private _removeMessagesFromView;
    private _removeUnsentMessageFromView;
    private _getLocalMessages;
    private _getRemoteMessages;
    private _checkHugeGap;
    initialize(policy: MessageCollectionInitPolicy, ts?: number): MessageCollectionInitHandler;
    loadPrevious(): Promise<BaseMessage[]>;
    loadNext(): Promise<BaseMessage[]>;
    loadAllFailedMessages(): Promise<SendableMessage[]>;
    removeFailedMessage(reqId: string): Promise<void>;
    dispose(): void;
}
