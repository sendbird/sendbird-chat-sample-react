import GroupChannelFilter from '../cache/groupChannelFilter';
import MessageFilter from '../cache/messageFilter';
import { GroupChannelListOrder } from '../model/channel/groupChannelListOrder';
import Member from '../model/channel/member';
import GroupChannel from '../model/channel/groupChannel';
import GroupChannelChangelogs from '../model/channel/groupChannelChangelogs';
import GroupChannelListParams from '../model/params/groupChannelListParams';
import GroupChannelHandler from '../model/handler/groupChannelHandler';
import BaseMessage from '../model/message/baseMessage';
import SendableMessage from '../model/message/sendableMessage';
import GroupChannelCreateParams from '../model/params/groupChannelCreateParams';
import { GroupChannelChangeLogsParamsProperties } from '../model/params/groupChannelChangeLogsParams';
import GroupChannelCountParams from '../model/params/groupChannelCountParams';
import { GroupChannelEventObserver } from '../collection/groupChannel/broadcast';
import { MessageEventObserver } from '../collection/message/broadcast';
import { GroupChannelEventSource } from '../comm/command/internal/groupChannelEventCommand';
import GroupChannelListQuery from '../query/groupChannelListQuery';
/**
 * @internal
 */
export default class GroupChannelManager {
    private _iid;
    private _sdkState;
    private _sessionManager;
    private _requestQueue;
    private _groupChannelBroadcast;
    private _groupChannelCache;
    private _groupChannelHandlers;
    private _leftChannels;
    private _messageBroadcast;
    private _messageCache;
    private _unsentMessageCache;
    private _dispatcher;
    private _markAsReadAllLastSentAt;
    constructor(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    });
    static of(_iid: string): GroupChannelManager;
    get handlers(): GroupChannelHandler[];
    buildGroupChannelFromSerializedData(serialized: object): GroupChannel;
    buildGroupChannelListQueryFromSerializedData(serialized: object): GroupChannelListQuery;
    buildMemberFromSerializedData(serialized: object): Member;
    getChannelFromCache(channelUrl: string): Promise<GroupChannel>;
    getChannelsFromCache(token: number | string, filter: GroupChannelFilter, order: GroupChannelListOrder): Promise<GroupChannel[]>;
    private _handleEvent;
    _markAsLeave(channel: GroupChannel): void;
    addHandler(key: string, handler: GroupChannelHandler): void;
    removeHandler(key: string): void;
    clearHandler(): void;
    subscribeGroupChannelEvent(key: string, observer: GroupChannelEventObserver): void;
    unsubscribeGroupChannelEvent(key: string): void;
    subscribeMessageEvent(key: string, observer: MessageEventObserver): void;
    unsubscribeMessageEvent(key: string): void;
    private _updateJoinedMemberCount;
    getChannel(channelUrl: string, internal?: boolean): Promise<GroupChannel>;
    getChannelWithoutCache(channelUrl: string, internal?: boolean): Promise<GroupChannel>;
    getMyGroupChannels(startToken: string, params: GroupChannelListParams, limit: number, source?: GroupChannelEventSource): Promise<{
        channels: GroupChannel[];
        token: string;
    }>;
    getMessageFromCache(messageId: number): Promise<BaseMessage>;
    getMessagesFromCache(channelUrl: string, token: number, direction: 'prev' | 'next', filter: MessageFilter, limit?: number): Promise<BaseMessage[]>;
    getAllFailedMessagesFromCache(channelUrl: string, filter: MessageFilter): Promise<SendableMessage[]>;
    removeFailedMessageFromCache(reqId: string): Promise<void>;
    getCachedMessageCountBetween(channelUrl: string, filter: MessageFilter, from: number, to: number): Promise<number>;
    getMyGroupChannelChangeLogs(token: string | number, params: GroupChannelChangeLogsParamsProperties, source?: GroupChannelEventSource): Promise<GroupChannelChangelogs>;
    getGroupChannelCount(params: GroupChannelCountParams): Promise<number>;
    createChannel(params: GroupChannelCreateParams): Promise<GroupChannel>;
    markAsReadAll(): Promise<void>;
    markAsReadWithChannelUrls(channelUrls: string[]): Promise<void>;
    markAsDelivered(channelUrl: string): Promise<void>;
}
