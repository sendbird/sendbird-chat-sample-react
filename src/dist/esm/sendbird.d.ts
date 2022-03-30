import { AdminMessage, AdminMessagePayload, ApiClient, APIRequestCommand, APIRequestMethod, APIRequestParams, APIResponseCommand, APIResponseCommandPayload, AppleCriticalAlertOptions, AppleCriticalAlertOptionsPayload, ApplicationUserListQuery, ApplicationUserListQueryParams, AsyncStorageStatic, Auth, BannedUserListQuery, BannedUserListQueryParams, BaseCommand, BaseListQuery, BaseListQueryParams, BaseMessage, BaseMessagePayload, BaseStore, BlockedUserListQuery, BlockedUserListQueryParams, BlockKeyHash, BlockManager, BlockManagerParams, CacheContext, ChannelDataListQuery, ChannelDataListQueryParams, ChannelType, Collection, CollectionMetadata, CollectionParams, CollectionQueryParams, CollectionState, CollectionUpdateParams, ColumnValues, CommandDispatcher, CommandDispatcherContext, CommandRouter, CommandRouterParams, Config, ConfigParams, ConnectionHandler, ConnectionState, Deferred, DoNotDisturbPreference, Emoji, EmojiCategory, EmojiCategoryPayload, EmojiContainer, EmojiContainerPayload, EmojiPayload, Encryption, EventDispatcher, EventDispatcherContext, EventHandler, EventMap, FileCompat, FileInfo, FileMessage, FileMessagePayload, FriendChangelogs, FriendDiscovery, FriendListQuery, FriendListQueryParams, Indexer, IndexerItem, IndexerParams, InstancedObject, InstancedObjectPayload, InvitationPreference, LogLevel, MemoryStore, MemoryStoreParams, MentionType, MessageMetaArray, MessageMetaArrayPayload, MessageModule, MessageRetrievalParams, MessageRetrievalParamsProperties, MessageSearchOrder, MessageSearchQuery, MessageSearchQueryParams, MessageType, MessageTypeFilter, MetaCounter, MetaData, Module, ModuleNamespaces, ModuleParams, MutedUserListQuery, MutedUserListQueryParams, Mutex, NestDB, NestDBParams, NestDBSchema, NestDBState, OGImage, OGImagePayload, OGMetaData, OGMetaDataPayload, OperatorListQuery, OperatorListQueryParams, Plugin_2, PluginPayload, PrimitiveType, PushTemplate, PushTokenRegistrationState, PushTokens, PushTokenType, PushTriggerOption, Query, QueryCondition, QueryFetchParams, QueryFunction, QueryGroupCondition, QueryParams, QueryPropertyCondition, QueryValueCondition, Reaction, ReactionEvent, ReactionEventOperation, ReactionEventPayload, ReactionPayload, ReportCategory, RequestQueue, RequestQueueParams, RequestState, RestrictedUser, RestrictedUserPayload, RestrictionInfo, RestrictionInfoPayload, RestrictionType, RetryStrategy, Role, SDKState, SendableMessage, SendableMessagePayload, SendbirdChat, SendbirdChatOptions, SendbirdChatParams, Sender, SenderPayload, SessionHandler, SessionManager, SessionManagerParams, SessionRefreshWebSocketCommand, SessionTokenRefreshReject, SessionTokenRefreshResolve, SnoozePeriod, StoreItem, SuperChannelFilter, ThreadedMessageListParams, ThreadedMessageListParamsProperties, ThreadInfo, ThreadInfoPayload, ThreadInfoUpdateEvent, ThreadInfoUpdateEventPayload, Thumbnail, ThumbnailPayload, ThumbnailSize, TotalUnreadMessageCountParams, TotalUnreadMessageCountParamsProperties, Transaction, TransactionEventHandler, TransactionEventType, TransactionParams, TransactionRequestData, TransactionRequestOptions, UnreadItemCount, UnreadItemCountParams, UnreadItemCountParamsProperties, UnreadItemKey, User, UserEventHandler, UserMessage, UserMessagePayload, UserOnlineState, UserPayload, UserUpdateParams, UserUpdateParamsProperties, WebSocketClient, WebSocketEventCommand, WebSocketEventType, WebSocketRequestCommand, WebSocketRequestCommandParams } from './shared-do-not-import-from-here'

export { Plugin_2 as Plugin };

export default SendbirdChat;

export declare class SendbirdError extends Error {
    readonly code: number;
    shouldThrowOutside: boolean;
    constructor({ code, message }: SendbirdErrorParams);
    get isSessionTokenExpiredError(): boolean;
    get isSessionKeyExpiredError(): boolean;
    static get debugModeRequired(): SendbirdError;
    static get lostInstance(): SendbirdError;
    static get invalidConnectionStateTransition(): SendbirdError;
    static get connectionRequired(): SendbirdError;
    static get connectionCanceled(): SendbirdError;
    static get invalidParameters(): SendbirdError;
    static get networkError(): SendbirdError;
    static get markAsReadAllRateLimitExceeded(): SendbirdError;
    static get queryInProgress(): SendbirdError;
    static get noAckTimeout(): SendbirdError;
    static get loginTimeout(): SendbirdError;
    static get connectionClosed(): SendbirdError;
    static get requestFailed(): SendbirdError;
    static get fileUploadCanceled(): SendbirdError;
    static get requestCanceled(): SendbirdError;
    static get sessionTokenRefreshFailed(): SendbirdError;
    static get sessionTokenRequestFailed(): SendbirdError;
    throwOutside(): void;
}

declare interface SendbirdErrorParams {
    code?: number;
    message?: string;
}

export { };



export { ApplicationUserListQuery, ApplicationUserListQueryParams, BannedUserListQuery, BannedUserListQueryParams, BlockedUserListQuery, BlockedUserListQueryParams, ChannelType, ConnectionHandler, ConnectionState, DoNotDisturbPreference, Emoji, EmojiCategory, EmojiContainer, Encryption, FileCompat, FriendChangelogs, FriendDiscovery, FriendListQuery, FriendListQueryParams, InvitationPreference, LogLevel, MemoryStore, MetaCounter, MetaData, MutedUserListQuery, MutedUserListQueryParams, OperatorListQuery, OperatorListQueryParams, PushTemplate, PushTokenRegistrationState, PushTokens, PushTokenType, PushTriggerOption, ReportCategory, RestrictedUser, RestrictionInfo, RestrictionType, Role, SendbirdChatOptions, SendbirdChatParams, SessionHandler, SnoozePeriod, TotalUnreadMessageCountParams, UnreadItemCountParams, User, UserEventHandler, UserOnlineState } from './shared-do-not-import-from-here'