import { AdminMessage, AdminMessagePayload, ApiClient, APIRequestCommand, APIRequestMethod, APIRequestParams, APIResponseCommand, APIResponseCommandPayload, AppleCriticalAlertOptions, AppleCriticalAlertOptionsPayload, ApplicationUserListQuery, ApplicationUserListQueryParams, AsyncStorageStatic, Auth, BannedUserListQuery, BannedUserListQueryParams, BaseChannel, BaseChannelHandlerParams, BaseChannelPayload, BaseCommand, BaseListQuery, BaseListQueryParams, BaseMessage, BaseMessageParamsProperties, BaseMessagePayload, BaseMessageUpdateParamsProperties, BaseStore, BlockedUserListQuery, BlockedUserListQueryParams, BlockKeyHash, BlockManager, BlockManagerParams, CacheContext, ChannelDataListQuery, ChannelDataListQueryParams, ChannelType, Collection, CollectionMetadata, CollectionParams, CollectionQueryParams, CollectionState, CollectionUpdateParams, ColumnValues, CommandDispatcher, CommandDispatcherContext, CommandRouter, CommandRouterParams, Config, ConfigParams, ConnectionHandler, ConnectionState, Deferred, DoNotDisturbPreference, Emoji, EmojiCategory, EmojiCategoryPayload, EmojiContainer, EmojiContainerPayload, EmojiPayload, Encryption, EventDispatcher, EventDispatcherContext, EventHandler, EventMap, FailedMessageHandler, FileCompat, FileInfo, FileMessage, FileMessageParams, FileMessageParamsProperties, FileMessagePayload, FileMessageUpdateParams, FileMessageUpdateParamsProperties, FileParams, FriendChangelogs, FriendDiscovery, FriendListQuery, FriendListQueryParams, Indexer, IndexerItem, IndexerParams, InstancedObject, InstancedObjectPayload, InvitationPreference, LogLevel, MemoryStore, MemoryStoreParams, MentionType, MessageChangelogs, MessageChangeLogsParams, MessageChangeLogsParamsProperties, MessageHandler, MessageListParams, MessageListParamsProperties, MessageMetaArray, MessageMetaArrayPayload, MessageModule, MessageRequestHandler, MessageRetrievalParams, MessageRetrievalParamsProperties, MessageSearchOrder, MessageSearchQuery, MessageSearchQueryParams, MessageType, MessageTypeFilter, MetaCounter, MetaData, Module, ModuleNamespaces, ModuleParams, MutedInfo, MutedUserListQuery, MutedUserListQueryParams, Mutex, NestDB, NestDBParams, NestDBSchema, NestDBState, OGImage, OGImagePayload, OGMetaData, OGMetaDataPayload, OperatorListQuery, OperatorListQueryParams, Plugin_2, PluginPayload, PreviousMessageListQuery, PreviousMessageListQueryParams, PrimitiveType, PushNotificationDeliveryOption, PushTemplate, PushTokenRegistrationState, PushTokens, PushTokenType, PushTriggerOption, Query, QueryCondition, QueryFetchParams, QueryFunction, QueryGroupCondition, QueryParams, QueryPropertyCondition, QueryValueCondition, Reaction, ReactionEvent, ReactionEventOperation, ReactionEventPayload, ReactionPayload, ReplyType, ReportCategory, RequestQueue, RequestQueueParams, RequestState, RestrictedUser, RestrictedUserPayload, RestrictionInfo, RestrictionInfoPayload, RestrictionType, RetryStrategy, Role, SDKState, SendableMessage, SendableMessagePayload, SendbirdChat, SendbirdChatOptions, SendbirdChatParams, Sender, SenderPayload, SessionHandler, SessionManager, SessionManagerParams, SessionRefreshWebSocketCommand, SessionTokenRefreshReject, SessionTokenRefreshResolve, SnoozePeriod, StoreItem, SuperChannelFilter, ThreadedMessageListParams, ThreadedMessageListParamsProperties, ThreadInfo, ThreadInfoPayload, ThreadInfoUpdateEvent, ThreadInfoUpdateEventPayload, Thumbnail, ThumbnailPayload, ThumbnailSize, TotalUnreadMessageCountParams, TotalUnreadMessageCountParamsProperties, Transaction, TransactionEventHandler, TransactionEventType, TransactionParams, TransactionRequestData, TransactionRequestOptions, UnreadItemCount, UnreadItemCountParams, UnreadItemCountParamsProperties, UnreadItemKey, User, UserEventHandler, UserMessage, UserMessageParams, UserMessageParamsProperties, UserMessagePayload, UserMessageUpdateParams, UserMessageUpdateParamsProperties, UserOnlineState, UserPayload, UserUpdateParams, UserUpdateParamsProperties, WebSocketClient, WebSocketEventCommand, WebSocketEventType, WebSocketRequestCommand, WebSocketRequestCommandParams } from './shared-do-not-import-from-here'

export declare class OpenChannel extends BaseChannel {
    private _lastParticipantCountUpdated;
    participantCount: number;
    operators: User[];
    constructor(_iid: string, payload: OpenChannelPayload);
    static payloadify(obj: OpenChannel): OpenChannelPayload;
    serialize(): object;
    isOperator(userOrUserId: string | User): boolean;
    _updateParticipantCount(count: number, updatedAt: number): boolean;
    createParticipantListQuery(params: ParticipantListQueryParams): ParticipantListQuery;
    refresh(): Promise<OpenChannel>;
    enter(): Promise<void>;
    exit(): Promise<void>;
    updateChannel(params: OpenChannelUpdateParams): Promise<OpenChannel>;
    updateChannelWithOperatorUserIds(name: string, coverUrlOrImageFile: FileCompat | string, data: string, operatorUserIds: string[], customType: string): Promise<OpenChannel>;
    delete(): Promise<void>;
}

export declare class OpenChannelCreateParams extends OpenChannelCreateParamsProperties {
    constructor(props?: OpenChannelCreateParamsProperties);
    validate(): boolean;
}

declare class OpenChannelCreateParamsProperties {
    channelUrl?: string;
    name?: string;
    coverUrlOrImage?: FileCompat | string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
}

export declare class OpenChannelHandler extends OpenChannelHandlerParams {
    constructor(params?: OpenChannelHandlerParams);
}

declare abstract class OpenChannelHandlerParams extends BaseChannelHandlerParams {
    onUserEntered?: (channel: OpenChannel, user: User) => void;
    onUserExited?: (channel: OpenChannel, user: User) => void;
    onChannelParticipantCountChanged?: (channel: OpenChannel) => void;
}

export declare class OpenChannelListQuery extends BaseListQuery {
    readonly includeFrozen: boolean;
    readonly includeMetaData: boolean;
    readonly nameKeyword: string;
    readonly urlKeyword: string;
    readonly customTypes: string[];
    constructor(iid: string, params: OpenChannelListQueryParams);
    protected _validate(): boolean;
    next(): Promise<OpenChannel[]>;
}

export declare interface OpenChannelListQueryParams extends BaseListQueryParams {
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    nameKeyword?: string;
    urlKeyword?: string;
    customTypes?: string[];
}

export declare class OpenChannelModule extends Module {
    name: "openChannel";
    private _manager;
    init(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    }): void;
    createOpenChannelListQuery(params?: OpenChannelListQueryParams): OpenChannelListQuery;
    addOpenChannelHandler(key: string, handler: OpenChannelHandler): void;
    removeOpenChannelHandler(key: string): void;
    removeAllOpenChannelHandlers(): void;
    buildOpenChannelFromSerializedData(serialized: object): OpenChannel;
    getChannel(channelUrl: string): Promise<OpenChannel>;
    getChannelWithoutCache(channelUrl: string): Promise<OpenChannel>;
    createChannel(params: OpenChannelCreateParams): Promise<OpenChannel>;
    createChannelWithOperatorUserIds(name: string, coverUrlOrImageFile: FileCompat | string, data: string, operatorUserIds: string[], customType: string): Promise<OpenChannel>;
}

declare interface OpenChannelPayload extends BaseChannelPayload {
    "participant_count"?: number;
    "operators"?: UserPayload[];
}

export declare class OpenChannelUpdateParams extends OpenChannelUpdateParamsProperties {
    constructor(props?: OpenChannelUpdateParamsProperties);
    validate(): boolean;
}

declare class OpenChannelUpdateParamsProperties {
    name?: string;
    coverUrlOrImage?: FileCompat | string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
}

export declare class ParticipantListQuery extends ChannelDataListQuery {
    constructor(iid: string, channelUrl: string, params: ParticipantListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}

declare interface ParticipantListQueryParams extends ChannelDataListQueryParams {
}

export declare type SendbirdOpenChat = SendbirdChat & {
    openChannel: OpenChannelModule;
};

export {};

