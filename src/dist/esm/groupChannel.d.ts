import { AdminMessage, AdminMessagePayload, ApiClient, APIRequestCommand, APIRequestMethod, APIRequestParams, APIResponseCommand, APIResponseCommandPayload, AppleCriticalAlertOptions, AppleCriticalAlertOptionsPayload, ApplicationUserListQuery, ApplicationUserListQueryParams, AsyncStorageStatic, Auth, BannedUserListQuery, BannedUserListQueryParams, BaseChannel, BaseChannelHandlerParams, BaseChannelPayload, BaseCommand, BaseListQuery, BaseListQueryParams, BaseMessage, BaseMessageParamsProperties, BaseMessagePayload, BaseMessageUpdateParamsProperties, BaseStore, BlockedUserListQuery, BlockedUserListQueryParams, BlockKeyHash, BlockManager, BlockManagerParams, CacheContext, ChannelDataListQuery, ChannelDataListQueryParams, ChannelType, Collection, CollectionMetadata, CollectionParams, CollectionQueryParams, CollectionState, CollectionUpdateParams, ColumnValues, CommandDispatcher, CommandDispatcherContext, CommandRouter, CommandRouterParams, Config, ConfigParams, ConnectionHandler, ConnectionState, Deferred, DoNotDisturbPreference, Emoji, EmojiCategory, EmojiCategoryPayload, EmojiContainer, EmojiContainerPayload, EmojiPayload, Encryption, EventDispatcher, EventDispatcherContext, EventHandler, EventMap, FailedMessageHandler, FileCompat, FileInfo, FileMessage, FileMessageParams, FileMessageParamsProperties, FileMessagePayload, FileMessageUpdateParams, FileMessageUpdateParamsProperties, FileParams, FriendChangelogs, FriendDiscovery, FriendListQuery, FriendListQueryParams, Indexer, IndexerItem, IndexerParams, InstancedObject, InstancedObjectPayload, InvitationPreference, LogLevel, MemoryStore, MemoryStoreParams, MentionType, MessageChangelogs, MessageChangeLogsParams, MessageChangeLogsParamsProperties, MessageHandler, MessageListParams, MessageListParamsProperties, MessageMetaArray, MessageMetaArrayPayload, MessageModule, MessageRequestHandler, MessageRetrievalParams, MessageRetrievalParamsProperties, MessageSearchOrder, MessageSearchQuery, MessageSearchQueryParams, MessageType, MessageTypeFilter, MetaCounter, MetaData, Module, ModuleNamespaces, ModuleParams, MutedInfo, MutedUserListQuery, MutedUserListQueryParams, Mutex, NestDB, NestDBParams, NestDBSchema, NestDBState, OGImage, OGImagePayload, OGMetaData, OGMetaDataPayload, OperatorListQuery, OperatorListQueryParams, Plugin_2, PluginPayload, PreviousMessageListQuery, PreviousMessageListQueryParams, PrimitiveType, PushNotificationDeliveryOption, PushTemplate, PushTokenRegistrationState, PushTokens, PushTokenType, PushTriggerOption, Query, QueryCondition, QueryFetchParams, QueryFunction, QueryGroupCondition, QueryParams, QueryPropertyCondition, QueryValueCondition, Reaction, ReactionEvent, ReactionEventOperation, ReactionEventPayload, ReactionPayload, ReplyType, ReportCategory, RequestQueue, RequestQueueParams, RequestState, RestrictedUser, RestrictedUserPayload, RestrictionInfo, RestrictionInfoPayload, RestrictionType, RetryStrategy, Role, Schedule, ScheduledStatus, ScheduledUserMessage, ScheduledUserMessageParams, ScheduledUserMessageParamsProperties, ScheduledUserMessagePayload, SDKState, SendableMessage, SendableMessagePayload, SendbirdChat, SendbirdChatOptions, SendbirdChatParams, Sender, SenderPayload, SessionHandler, SessionManager, SessionManagerParams, SessionRefreshWebSocketCommand, SessionTokenRefreshReject, SessionTokenRefreshResolve, SnoozePeriod, StoreItem, SuperChannelFilter, ThreadedMessageListParams, ThreadedMessageListParamsProperties, ThreadInfo, ThreadInfoPayload, ThreadInfoUpdateEvent, ThreadInfoUpdateEventPayload, Thumbnail, ThumbnailPayload, ThumbnailSize, TotalUnreadMessageCountParams, TotalUnreadMessageCountParamsProperties, Transaction, TransactionEventHandler, TransactionEventType, TransactionParams, TransactionRequestData, TransactionRequestOptions, UnreadItemCount, UnreadItemCountParams, UnreadItemCountParamsProperties, UnreadItemKey, User, UserEventHandler, UserMessage, UserMessageParams, UserMessageParamsProperties, UserMessagePayload, UserMessageUpdateParams, UserMessageUpdateParamsProperties, UserOnlineState, UserPayload, UserUpdateParams, UserUpdateParamsProperties, WebSocketClient, WebSocketEventCommand, WebSocketEventType, WebSocketRequestCommand, WebSocketRequestCommandParams } from './shared-do-not-import-from-here'

export declare enum CountPreference {
    ALL = "all",
    UNREAD_MESSAGE_COUNT_ONLY = "unread_message_count_only",
    UNREAD_MENTION_COUNT_ONLY = "unread_mention_count_only",
    OFF = "off"
}

export declare class GroupChannel extends BaseChannel {
    private _unreadMemberStateMap;
    private _undeliveredMemberStateMap;
    private _typingStatus;
    private _lastMemberCountUpdated;
    private _typingStarted;
    private _typingEnded;
    readonly isDistinct: boolean;
    readonly isSuper: boolean;
    readonly isBroadcast: boolean;
    readonly isPublic: boolean;
    readonly isDiscoverable: boolean;
    readonly isAccessCodeRequired: boolean;
    readonly isPushEnabled: boolean;
    unreadMessageCount: number;
    unreadMentionCount: number;
    members: Member[];
    memberCount: number;
    joinedMemberCount: number;
    hiddenState: HiddenState;
    lastMessage: BaseMessage;
    messageOffsetTimestamp: number;
    messageSurvivalSeconds: number;
    myMemberState: MemberState;
    myRole: Role;
    myMutedState: MutedState;
    myLastRead: number;
    myCountPreference: CountPreference;
    myPushTriggerOption: PushTriggerOption;
    inviter: User;
    invitedAt: number;
    joinedAt: number;
    constructor(_iid: string, payload: GroupChannelPayload);
    get isHidden(): boolean;
    get isTyping(): boolean;
    get cachedUnreadMemberState(): object;
    get cachedUndeliveredMemberState(): object;
    static payloadify(obj: GroupChannel): GroupChannelPayload;
    _updateUnreadCount(unreadMessageCount: number, unreadMentionCount: number): void;
    _updateUnreadMemberState(userId: string, ts: number): boolean;
    _updateUndeliveredMemberState(userId: string, ts: number): void;
    _updateTypingStatus(user: User, ts?: number): void;
    _invalidateTypingStatus(): boolean;
    _setLatestMemberCount(memberCount: number, joinedCount: number, ts: number): boolean;
    isReadMessage(message: BaseMessage): boolean;
    serialize(): object;
    createMessageCollection(params?: MessageCollectionParams): MessageCollection;
    createMemberListQuery(params?: MemberListQueryParams): MemberListQuery;
    addMember(member: Member, ts?: number): void;
    removeMember(member: Member): boolean;
    getUnreadMemberCount(message: BaseMessage): number;
    getUndeliveredMemberCount(message: BaseMessage): number;
    getReadMembers(message: SendableMessage, includeAllMembers?: boolean): Member[];
    getUnreadMembers(message: SendableMessage, includeAllMembers?: boolean): Member[];
    getReadStatus(includeAllMembers?: boolean): {
        [key: string]: ReadStatus;
    };
    getTypingUsers(): Member[];
    invalidateTypingStatus(): boolean;
    refresh(): Promise<GroupChannel>;
    freeze(): Promise<void>;
    unfreeze(): Promise<void>;
    updateChannel(params: GroupChannelUpdateParams): Promise<GroupChannel>;
    invite(users: User[]): Promise<GroupChannel>;
    inviteWithUserIds(userIds: string[]): Promise<GroupChannel>;
    join(accessCode?: string): Promise<GroupChannel>;
    leave(): Promise<void>;
    acceptInvitation(accessCode?: string): Promise<GroupChannel>;
    declineInvitation(): Promise<GroupChannel>;
    sendUserMessage(params: UserMessageParams): MessageRequestHandler;
    sendFileMessage(params: FileMessageParams): MessageRequestHandler;
    deleteMessage(message: SendableMessage): Promise<void>;
    hide(params: GroupChannelHideParams): Promise<GroupChannel>;
    unhide(): Promise<GroupChannel>;
    delete(): Promise<void>;
    markAsRead(): Promise<void>;
    markAsDelivered(): Promise<void>;
    startTyping(): Promise<void>;
    endTyping(): Promise<void>;
    registerScheduledUserMessage(params: ScheduledUserMessageParams): Promise<ScheduledUserMessage>;
    getMyPushTriggerOption(): Promise<PushTriggerOption>;
    setMyPushTriggerOption(option: PushTriggerOption): Promise<PushTriggerOption>;
    setMyCountPreference(preference: CountPreference): Promise<CountPreference>;
    resetMyHistory(): Promise<GroupChannel>;
}

export declare interface GroupChannelChangelogs {
    updatedChannels: GroupChannel[];
    deletedChannelUrls: string[];
    hasMore: boolean;
    token: string;
}

export declare class GroupChannelChangeLogsParams extends GroupChannelChangeLogsParamsProperties {
    constructor(props?: GroupChannelChangeLogsParamsProperties);
    validate(): boolean;
}

declare class GroupChannelChangeLogsParamsProperties {
    customTypes?: string[];
    includeEmpty?: boolean;
    includeFrozen?: boolean;
}

export declare class GroupChannelCollection {
    readonly channels: GroupChannel[];
    readonly filter: GroupChannelFilter;
    readonly order: GroupChannelListOrder;
    private _hasMore;
    private _token;
    private _limit;
    private _iid;
    private _key;
    private _handler;
    constructor(_iid: string, { filter, order, limit, }: GroupChannelCollectionParams);
    get hasMore(): boolean;
    setEventHandler(handler: GroupChannelCollectionEventHandler): void;
    private _addChannelsToView;
    private _removeChannelsFromView;
    private _getLocalChannels;
    private _getRemoteChannels;
    loadMore(): Promise<GroupChannel[]>;
    dispose(): void;
}

export declare interface GroupChannelCollectionEventHandler {
    onChannelsAdded: (context: GroupChannelEventContext, channels: BaseChannel[]) => void;
    onChannelsUpdated: (context: GroupChannelEventContext, channels: BaseChannel[]) => void;
    onChannelsDeleted: (context: GroupChannelEventContext, channelUrls: string[]) => void;
}

declare interface GroupChannelCollectionParams {
    filter?: GroupChannelFilter;
    order?: GroupChannelListOrder;
    limit?: number;
}

export declare class GroupChannelCountParams extends GroupChannelCountParamsProperties {
    constructor(props?: GroupChannelCountParamsProperties);
    validate(): boolean;
}

declare class GroupChannelCountParamsProperties {
    memberStateFilter?: MemberStateFilter;
}

export declare class GroupChannelCreateParams extends GroupChannelCreateParamsProperties {
    constructor(props?: GroupChannelCreateParamsProperties);
    validate(): boolean;
    addUserIds(userIds: string[]): void;
    addUserId(userId: string): void;
}

declare class GroupChannelCreateParamsProperties {
    invitedUserIds?: string[];
    channelUrl?: string;
    coverUrl?: string;
    coverImage?: FileCompat;
    isDistinct?: boolean;
    isSuper?: boolean;
    isBroadcast?: boolean;
    isPublic?: boolean;
    isDiscoverable?: boolean;
    isStrict?: boolean;
    isEphemeral?: boolean;
    accessCode?: string;
    name?: string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
    messageSurvivalSeconds?: number;
}

export declare class GroupChannelEventContext {
    readonly source: GroupChannelEventSource;
    constructor(source: GroupChannelEventSource);
}

export declare enum GroupChannelEventSource {
    UNKNOWN = 0,
    EVENT_CHANNEL_CREATED = 1,
    EVENT_CHANNEL_UPDATED = 2,
    EVENT_CHANNEL_DELETED = 3,
    EVENT_CHANNEL_READ = 4,
    EVENT_CHANNEL_DELIVERED = 5,
    EVENT_CHANNEL_INVITED = 6,
    EVENT_CHANNEL_JOINED = 7,
    EVENT_CHANNEL_LEFT = 8,
    EVENT_CHANNEL_ACCEPTED_INVITE = 9,
    EVENT_CHANNEL_DECLINED_INVITE = 10,
    EVENT_CHANNEL_OPERATOR_UPDATED = 11,
    EVENT_CHANNEL_MUTED = 12,
    EVENT_CHANNEL_UNMUTED = 13,
    EVENT_CHANNEL_FROZEN = 14,
    EVENT_CHANNEL_UNFROZEN = 15,
    EVENT_CHANNEL_HIDDEN = 16,
    EVENT_CHANNEL_UNHIDDEN = 17,
    EVENT_CHANNEL_RESET_HISTORY = 18,
    EVENT_CHANNEL_TYPING_STATUS_UPDATE = 19,
    EVENT_CHANNEL_MEMBER_COUNT_UPDATED = 20,
    EVENT_MESSAGE_SENT = 21,
    EVENT_MESSAGE_RECEIVED = 22,
    EVENT_MESSAGE_UPDATED = 23,
    EVENT_BOTTOM = 24,
    REQUEST_CHANNEL = 25,
    REQUEST_CHANNEL_CHANGELOGS = 26,
    SYNC_CHANNEL_BACKGROUND = 27,
    SYNC_CHANNEL_CHANGELOGS = 28
}

export declare class GroupChannelFilter {
    private _searchFilter;
    private _userIdsFilter;
    includeEmpty: boolean;
    nicknameContainsFilter: string;
    channelNameContainsFilter: string;
    memberStateFilter: MemberStateFilter;
    customTypesFilter: string[];
    channelUrlsFilter: string[];
    superChannelFilter: SuperChannelFilter;
    publicChannelFilter: PublicChannelFilter;
    customTypeStartsWithFilter: string;
    unreadChannelFilter: UnreadChannelFilter;
    hiddenChannelFilter: HiddenChannelFilter;
    includeFrozen: boolean;
    private _isFriend;
    get searchFilter(): GroupChannelSearchFilter;
    setSearchFilter(fields: GroupChannelSearchField[], query: string): void;
    get userIdsFilter(): GroupChannelUserIdsFilter;
    setUserIdsFilter(userIds: string[], includeMode: boolean, queryType?: QueryType): void;
    clone(): GroupChannelFilter;
    match(channel: GroupChannel, currentUserId: string): boolean;
}

export declare class GroupChannelHandler extends GroupChannelHandlerParams {
    constructor(params?: GroupChannelHandlerParams);
}

declare abstract class GroupChannelHandlerParams extends BaseChannelHandlerParams {
    onUserJoined?: (channel: GroupChannel, user: User) => void;
    onUserLeft?: (channel: GroupChannel, user: User) => void;
    onUserReceivedInvitation?: (channel: GroupChannel, inviter: User, invitees: User[]) => void;
    onUserDeclinedInvitation?: (channel: GroupChannel, inviter: User, invitee: User) => void;
    onChannelHidden?: (channel: GroupChannel) => void;
    onUnreadMemberCountUpdated?: (channel: GroupChannel) => void;
    onUndeliveredMemberCountUpdated?: (channel: GroupChannel) => void;
    onTypingStatusUpdated?: (channel: GroupChannel) => void;
}

export declare class GroupChannelHideParams extends GroupChannelHideParamsProperties {
    constructor(props?: GroupChannelHideParamsProperties);
    validate(): boolean;
}

declare class GroupChannelHideParamsProperties {
    hidePreviousMessages?: boolean;
    allowAutoUnhide?: boolean;
}

export declare enum GroupChannelListOrder {
    LATEST_LAST_MESSAGE = "latest_last_message",
    CHRONOLOGICAL = "chronological",
    CHANNEL_NAME_ALPHABETICAL = "channel_name_alphabetical",
    METADATA_VALUE_ALPHABETICAL = "metadata_value_alphabetical"
}

declare interface GroupChannelListParams {
    includeEmpty?: boolean;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    channelUrlsFilter?: string[];
    customTypesFilter?: string[];
    customTypeStartsWithFilter?: string;
    nicknameContainsFilter?: string;
    channelNameContainsFilter?: string;
    memberStateFilter?: MemberStateFilter;
    unreadChannelFilter?: UnreadChannelFilter;
    superChannelFilter?: SuperChannelFilter;
    publicChannelFilter?: PublicChannelFilter;
    hiddenChannelFilter?: HiddenChannelFilter;
    userIdsFilter?: GroupChannelUserIdsFilter;
    searchFilter?: GroupChannelSearchFilter;
    metadataKey?: string;
    metadataValues?: string[];
    metadataOrderKeyFilter?: string;
    metadataValueStartsWith?: string;
    order?: GroupChannelListOrder;
}

export declare class GroupChannelListQuery extends BaseListQuery {
    readonly includeEmpty: boolean;
    readonly includeFrozen: boolean;
    readonly includeMetaData: boolean;
    readonly channelUrlsFilter: string[];
    readonly customTypesFilter: string[];
    readonly customTypeStartsWithFilter: string;
    readonly nicknameContainsFilter: string;
    readonly channelNameContainsFilter: string;
    readonly memberStateFilter: MemberStateFilter;
    readonly unreadChannelFilter: UnreadChannelFilter;
    readonly superChannelFilter: SuperChannelFilter;
    readonly publicChannelFilter: PublicChannelFilter;
    readonly hiddenChannelFilter: HiddenChannelFilter;
    readonly searchFilter: GroupChannelSearchFilter;
    readonly userIdsFilter: GroupChannelUserIdsFilter;
    readonly metadataKey: string;
    readonly metadataValues: string[];
    readonly metadataOrderKeyFilter: string;
    readonly metadataValueStartsWith: string;
    readonly order: GroupChannelListOrder;
    constructor(iid: string, params: GroupChannelListQueryParams);
    protected _validate(): boolean;
    serialize(): object;
    next(): Promise<GroupChannel[]>;
}

declare interface GroupChannelListQueryParams extends BaseListQueryParams, GroupChannelListParams {
}

export declare class GroupChannelModule extends Module {
    name: "groupChannel";
    private _manager;
    init(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    }): void;
    createGroupChannelCollection(params?: GroupChannelCollectionParams): GroupChannelCollection;
    createMyGroupChannelListQuery(params?: GroupChannelListQueryParams): GroupChannelListQuery;
    createPublicGroupChannelListQuery(params?: PublicGroupChannelListQueryParams): PublicGroupChannelListQuery;
    addGroupChannelHandler(key: string, handler: GroupChannelHandler): void;
    removeGroupChannelHandler(key: string): void;
    removeAllGroupChannelHandlers(): void;
    buildGroupChannelFromSerializedData(serialized: object): GroupChannel;
    buildGroupChannelListQueryFromSerializedData(serialized: object): GroupChannelListQuery;
    buildMemberFromSerializedData(serialized: object): Member;
    getChannel(channelUrl: string): Promise<GroupChannel>;
    getChannelWithoutCache(channelUrl: string): Promise<GroupChannel>;
    getMyGroupChannelChangeLogsByToken(token: string, params: GroupChannelChangeLogsParams): Promise<GroupChannelChangelogs>;
    getMyGroupChannelChangeLogsByTimestamp(ts: number, params: GroupChannelChangeLogsParams): Promise<GroupChannelChangelogs>;
    getGroupChannelCount(params: GroupChannelCountParams): Promise<number>;
    createChannel(params: GroupChannelCreateParams): Promise<GroupChannel>;
    createDistinctChannelIfNotExist(params: GroupChannelCreateParams): Promise<GroupChannel>;
    createChannelWithUserIds(userIds: string[], isDistinct?: boolean, name?: string, coverUrlOrImageFile?: string | FileCompat, data?: string, customType?: string): Promise<GroupChannel>;
    markAsReadAll(): Promise<void>;
    markAsReadWithChannelUrls(channelUrls: string[]): Promise<void>;
    markAsDelivered(channelUrl: string): Promise<void>;
}

declare interface GroupChannelPayload extends BaseChannelPayload {
    "is_access_code_required"?: boolean;
    "is_distinct"?: boolean;
    "is_super"?: boolean;
    "is_broadcast"?: boolean;
    "is_public"?: boolean;
    "is_discoverable"?: boolean;
    "is_muted"?: string | boolean;
    "is_push_enabled"?: boolean;
    "unread_message_count"?: number;
    "unread_mention_count"?: number;
    "push_trigger_option"?: string;
    "count_preference"?: string;
    "hidden_state"?: string;
    "member_count"?: number;
    "joined_member_count"?: number;
    "member_state"?: string;
    "my_role"?: string;
    "user_last_read"?: number;
    "ts_message_offset"?: number;
    "message_survival_seconds"?: number;
    "read_receipt"?: object;
    "delivery_receipt"?: object;
    "members"?: MemberPayload[];
    "last_message"?: UserMessagePayload | FileMessagePayload | AdminMessagePayload;
    "inviter"?: UserPayload;
    "invited_at"?: number;
    "joined_ts"?: number;
    "is_created"?: boolean;
}

export declare enum GroupChannelSearchField {
    MEMBER_NICKNAME = "member_nickname",
    CHANNEL_NAME = "channel_name"
}

export declare interface GroupChannelSearchFilter {
    query?: string;
    fields?: GroupChannelSearchField[];
}

export declare class GroupChannelUpdateParams extends GroupChannelUpdateParamsProperties {
    constructor(props?: GroupChannelUpdateParamsProperties);
    validate(): boolean;
}

declare class GroupChannelUpdateParamsProperties {
    coverUrl?: string;
    coverImage?: FileCompat;
    isDistinct?: boolean;
    isPublic?: boolean;
    isDiscoverable?: boolean;
    accessCode?: string;
    name?: string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
    messageSurvivalSeconds?: number;
}

export declare interface GroupChannelUserIdsFilter {
    userIds: string[];
    includeMode: boolean;
    queryType: QueryType;
}

export declare enum HiddenChannelFilter {
    UNHIDDEN = "unhidden_only",
    HIDDEN = "hidden_only",
    HIDDEN_ALLOW_AUTO_UNHIDE = "hidden_allow_auto_unhide",
    HIDDEN_PREVENT_AUTO_UNHIDE = "hidden_prevent_auto_unhide"
}

export declare enum HiddenState {
    UNHIDDEN = "unhidden",
    HIDDEN_ALLOW_AUTO_UNHIDE = "hidden_allow_auto_unhide",
    HIDDEN_PREVENT_AUTO_UNHIDE = "hidden_prevent_auto_unhide"
}

export declare class Member extends RestrictedUser {
    state: MemberState;
    role: Role;
    isMuted: boolean;
    isBlockedByMe: boolean;
    isBlockingMe: boolean;
    constructor(_iid: string, payload: MemberPayload);
    static payloadify(obj: Member): MemberPayload;
}

export declare enum MemberListOrder {
    MEMBER_NICKNAME_ALPHABETICAL = "member_nickname_alphabetical",
    OPERATOR_THEN_MEMBER_ALPHABETICAL = "operator_then_member_alphabetical"
}

export declare class MemberListQuery extends ChannelDataListQuery {
    readonly mutedMemberFilter: MutedMemberFilter;
    readonly memberStateFilter: MemberStateFilter;
    readonly nicknameStartsWithFilter: string;
    readonly operatorFilter: OperatorFilter;
    readonly order: MemberListOrder;
    constructor(iid: string, channelUrl: string, params: MemberListQueryParams);
    protected _validate(): boolean;
    next(): Promise<Member[]>;
}

declare interface MemberListQueryParams extends ChannelDataListQueryParams {
    mutedMemberFilter?: MutedMemberFilter;
    memberStateFilter?: MemberStateFilter;
    nicknameStartsWithFilter?: string;
    operatorFilter?: OperatorFilter;
    order?: MemberListOrder;
}

declare interface MemberPayload extends RestrictedUserPayload {
    "state": string;
    "role": string;
    "is_muted"?: boolean;
    "is_blocked_by_me"?: boolean;
    "is_blocking_me"?: boolean;
}

declare enum MembershipFilter {
    ALL = "all",
    JOINED = "joined"
}

export declare enum MemberState {
    NONE = "none",
    JOINED = "joined",
    INVITED = "invited"
}

export declare enum MemberStateFilter {
    ALL = "all",
    JOINED = "joined_only",
    INVITED = "invited_only",
    INVITED_BY_FRIEND = "invited_by_friend",
    INVITED_BY_NON_FRIEND = "invited_by_non_friend"
}

export declare class MessageCollection {
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
    constructor(_iid: string, { channel, filter, limit, }: MessageCollectionParams & {
        channel: GroupChannel;
    });
    get channel(): GroupChannel;
    get messages(): BaseMessage[];
    get hasPrevious(): boolean;
    get hasNext(): boolean;
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

export declare interface MessageCollectionEventHandler {
    onChannelUpdated: (context: GroupChannelEventContext, channel: GroupChannel) => void;
    onChannelDeleted: (context: GroupChannelEventContext, channelUrl: string) => void;
    onMessagesAdded: (context: MessageEventContext, channel: GroupChannel, messages: BaseMessage[]) => void;
    onMessagesUpdated: (context: MessageEventContext, channel: GroupChannel, messages: BaseMessage[]) => void;
    onMessagesDeleted: (context: MessageEventContext, channel: GroupChannel, messageIds: number[]) => void;
    onHugeGapDetected: () => void;
}

export declare class MessageCollectionInitHandler {
    private _onCacheResult;
    private _onApiResult;
    invokeResponse(source: "local" | "remote", err: Error, messages: BaseMessage[]): void;
    onCacheResult(handler: MessageCollectionInitResultHandler): MessageCollectionInitHandler;
    onApiResult(handler: MessageCollectionInitResultHandler): MessageCollectionInitHandler;
}

export declare enum MessageCollectionInitPolicy {
    CACHE_AND_REPLACE_BY_API = "cache_and_replace_by_api",
    API_ONLY = "api_only"
}

declare type MessageCollectionInitResultHandler = (err: Error, messages: BaseMessage[]) => void;

declare interface MessageCollectionParams {
    filter?: MessageFilter;
    limit?: number;
}

export declare class MessageEventContext {
    readonly source: MessageEventSource_2;
    constructor(source: MessageEventSource_2);
}

declare enum MessageEventSource_2 {
    UNKNOWN = 0,
    EVENT_MESSAGE_SENT_SUCCESS = 1,
    EVENT_MESSAGE_SENT_FAILED = 2,
    EVENT_MESSAGE_SENT_PENDING = 3,
    EVENT_MESSAGE_RECEIVED = 4,
    EVENT_MESSAGE_UPDATED = 5,
    EVENT_MESSAGE_DELETED = 6,
    EVENT_MESSAGE_READ = 7,
    EVENT_MESSAGE_DELIVERED = 8,
    EVENT_MESSAGE_REACTION_UPDATED = 9,
    EVENT_MESSAGE_THREADINFO_UPDATED = 10,
    EVENT_BOTTOM = 11,
    REQUEST_MESSAGE = 12,
    REQUEST_THREADED_MESSAGE = 13,
    REQUEST_MESSAGE_CHANGELOGS = 14,
    SYNC_MESSAGE_FILL = 15,
    SYNC_MESSAGE_BACKGROUND = 16,
    SYNC_MESSAGE_CHANGELOGS = 17
}

export { MessageEventSource_2 as MessageEventSource };

export declare class MessageFilter {
    messageTypeFilter: MessageTypeFilter;
    customTypesFilter: string[];
    senderUserIdsFilter: string[];
    clone(): MessageFilter;
    match(message: BaseMessage): boolean;
}

declare enum MutedMemberFilter {
    ALL = "all",
    MUTED = "muted",
    UNMUTED = "unmuted"
}

export declare enum MutedState {
    MUTED = "muted",
    UNMUTED = "unmuted"
}

export declare enum OperatorFilter {
    ALL = "all",
    OPERATOR = "operator",
    NONOPERATOR = "nonoperator"
}

export declare enum PublicChannelFilter {
    ALL = "all",
    PUBLIC = "public",
    PRIVATE = "private"
}

export declare enum PublicGroupChannelListOrder {
    CHRONOLOGICAL = "chronological",
    CHANNEL_NAME_ALPHABETICAL = "channel_name_alphabetical",
    METADATA_VALUE_ALPHABETICAL = "metadata_value_alphabetical"
}

export declare class PublicGroupChannelListQuery extends BaseListQuery {
    readonly includeEmpty: boolean;
    readonly includeFrozen: boolean;
    readonly includeMetaData: boolean;
    readonly channelUrlsFilter: string[];
    readonly customTypesFilter: string[];
    readonly customTypeStartsWithFilter: string;
    readonly nicknameContainsFilter: string;
    readonly channelNameContainsFilter: string;
    readonly membershipFilter: MembershipFilter;
    readonly superChannelFilter: SuperChannelFilter;
    readonly metadataKey: string;
    readonly metadataValues: string[];
    readonly metadataOrderKeyFilter: string;
    readonly metadataValueStartsWith: string;
    readonly order: PublicGroupChannelListOrder;
    constructor(iid: string, params: PublicGroupChannelListQueryParams);
    protected _validate(): boolean;
    next(): Promise<GroupChannel[]>;
}

declare interface PublicGroupChannelListQueryParams extends BaseListQueryParams {
    includeEmpty?: boolean;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    channelUrlsFilter?: string[];
    customTypesFilter?: string[];
    customTypeStartsWithFilter?: string;
    channelNameContainsFilter?: string;
    membershipFilter?: MembershipFilter;
    superChannelFilter?: SuperChannelFilter;
    metadataKey?: string;
    metadataValues?: string[];
    metadataOrderKeyFilter?: string;
    metadataValueStartsWith?: string;
    order?: PublicGroupChannelListOrder;
}

export declare enum QueryType {
    AND = "AND",
    OR = "OR"
}

export declare class ReadStatus extends InstancedObject {
    readonly channelUrl: string;
    readonly channelType: string;
    readonly reader: User;
    readonly readAt: number;
    constructor(_iid: string, payload: ReadStatusPayload);
}

declare interface ReadStatusPayload extends InstancedObjectPayload {
    "channel_url": string;
    "channel_type": string;
    "user": UserPayload;
    "ts": number;
}

export declare type SendbirdGroupChat = SendbirdChat & {
    groupChannel: GroupChannelModule;
};

export declare enum UnreadChannelFilter {
    ALL = "all",
    UNREAD_MESSAGE = "unread_message"
}

export {};



export { SuperChannelFilter, UnreadItemKey } from './shared-do-not-import-from-here'