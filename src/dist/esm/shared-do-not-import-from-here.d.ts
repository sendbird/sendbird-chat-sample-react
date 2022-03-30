export declare class AdminMessage extends BaseMessage {
    message: string;
    translations: object;
    constructor(_iid: string, payload: AdminMessagePayload);
    static payloadify(obj: AdminMessage): AdminMessagePayload;
    getThreadedMessagesByTimestamp(ts: number, params: ThreadedMessageListParams): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
}

export declare interface AdminMessagePayload extends BaseMessagePayload {
    "message": string;
    "translations"?: object;
}

export declare class ApiClient {
    private _iid;
    private _auth;
    private _sdkState;
    private _dispatcher;
    private _abortControl;
    constructor(_iid: string, { auth, sdkState, dispatcher, }: {
        auth: any;
        sdkState: any;
        dispatcher: any;
    });
    private get _userAgentWithExtension();
    private _createHeader;
    send(request: APIRequestCommand): Promise<APIResponseCommand>;
    cancel(requestId: string): void;
    cancelAll(): void;
}

export declare class APIRequestCommand extends BaseCommand {
    path: string;
    method: APIRequestMethod;
    params: APIRequestParams<unknown>;
    requireAuth: boolean;
    headers: object;
    requestId: string;
    stringifyParams(val: unknown): string;
    get query(): string;
    get payload(): string | FormData;
}

export declare enum APIRequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export declare type APIRequestParams<T> = {
    [K in keyof T]: T[K];
};

export declare class APIResponseCommand extends BaseCommand {
    protected _iid: string;
    protected _payload: APIResponseCommandPayload;
    constructor(_iid: string, payload: APIResponseCommandPayload);
    get payload(): APIResponseCommandPayload;
    as<T extends APIResponseCommand, P extends APIResponseCommandPayload>(SpecifiedEventCommand: new (_iid: string, payload: P) => T): T;
}

export declare interface APIResponseCommandPayload {
}

export declare class AppleCriticalAlertOptions {
    readonly name: string;
    readonly volume: number;
    constructor(payload: AppleCriticalAlertOptionsPayload);
    static payloadify(obj: AppleCriticalAlertOptions): AppleCriticalAlertOptionsPayload;
}

export declare interface AppleCriticalAlertOptionsPayload {
    "name": string;
    "volume": number;
}

export declare class ApplicationUserListQuery extends BaseListQuery {
    readonly userIdsFilter: string[];
    readonly metaDataKeyFilter: string;
    readonly metaDataValuesFilter: string[];
    readonly nicknameStartsWithFilter: string;
    constructor(iid: string, params: ApplicationUserListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}

export declare interface ApplicationUserListQueryParams extends BaseListQueryParams {
    userIdsFilter?: string[];
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: string[];
    nicknameStartsWithFilter?: string;
}

export declare interface AsyncStorageStatic {
    /**
     * Fetches key and passes the result to callback, along with an Error if there is any.
     */
    getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null>;
    /**
     * Sets value for key and calls callback on completion, along with an Error if there is any
     */
    setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;
    removeItem(key: string, callback?: (error?: Error) => void): Promise<void>;
    /**
     * Merges existing value with input value, assuming they are stringified json. Returns a Promise object.
     * Not supported by all native implementation
     */
    mergeItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;
    /**
     * Erases all AsyncStorage for all clients, libraries, etc. You probably don't want to call this.
     * Use removeItem or multiRemove to clear only your own keys instead.
     */
    clear(callback?: (error?: Error) => void): Promise<void>;
    /**
     * Gets all keys known to the app, for all callers, libraries, etc
     */
    getAllKeys(callback?: (error?: Error, keys?: string[]) => void): Promise<string[]>;
    /**
     * multiGet invokes callback with an array of key-value pair arrays that matches the input format of multiSet
     */
    multiGet(keys: string[], callback?: (errors?: Error[], result?: [
        string,
        string | null
    ][]) => void): Promise<[
        string,
        string | null
    ][]>;
    /**
     * multiSet and multiMerge take arrays of key-value array pairs that match the output of multiGet,
     *
     * multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
     */
    multiSet(keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void>;
    /**
     * Delete all the keys in the keys array.
     */
    multiRemove(keys: string[], callback?: (errors?: Error[]) => void): Promise<void>;
    /**
     * Merges existing values with input values, assuming they are stringified json.
     * Returns a Promise object.
     *
     * Not supported by all native implementations.
     */
    multiMerge(keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void>;
}

export declare class Auth {
    sessionKey: string;
    authToken: string;
    get hasSession(): boolean;
    clear(): void;
}

export declare class BannedUserListQuery extends ChannelDataListQuery {
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: BannedUserListQueryParams);
    protected _validate(): boolean;
    next(): Promise<RestrictedUser[]>;
}

export declare interface BannedUserListQueryParams extends ChannelDataListQueryParams {
}

export declare class BaseCommand {
}

export declare abstract class BaseListQuery {
    protected readonly _iid: string;
    readonly limit: number;
    protected _isLoading: boolean;
    protected _hasNext: boolean;
    protected _token: string;
    constructor(iid: string, params: BaseListQueryParams);
    get hasNext(): boolean;
    get isLoading(): boolean;
    protected _validate(): boolean;
}

export declare interface BaseListQueryParams {
    limit?: number;
}

export declare class BaseMessage extends InstancedObject {
    channelUrl: string;
    channelType: ChannelType;
    messageId: number;
    parentMessageId?: number;
    silent?: boolean;
    isOperatorMessage?: boolean;
    messageType?: MessageType;
    data?: string;
    customType?: string;
    mentionType?: MentionType;
    mentionedUsers?: User[];
    threadInfo?: ThreadInfo;
    reactions?: Reaction[];
    metaArrays?: MessageMetaArray[];
    ogMetaData?: OGMetaData;
    appleCriticalAlertOptions?: AppleCriticalAlertOptions;
    createdAt: number;
    updatedAt?: number;
    constructor(_iid: string, payload: BaseMessagePayload);
    static payloadify(obj: BaseMessage): BaseMessagePayload;
    isIdentical(message: BaseMessage): boolean;
    isEqual(message: BaseMessage): boolean;
    get isUserMessage(): boolean;
    get isFileMessage(): boolean;
    get isAdminMessage(): boolean;
    serialize(): object;
    getMetaArraysByKeys(keys: string[]): MessageMetaArray[];
    applyThreadInfoUpdateEvent(threadInfoUpdateEvent: ThreadInfoUpdateEvent): boolean;
    applyReactionEvent(reactionEvent: ReactionEvent): void;
}

export declare interface BaseMessagePayload extends InstancedObjectPayload {
    "type": string;
    "channel_url"?: string;
    "channel_type"?: string;
    "channel"?: {
        "url": string;
        "channelType": string;
    };
    "msg_id"?: number;
    "message_id"?: number;
    "parent_message_id"?: number;
    "data"?: string;
    "custom_type"?: string;
    "mention_type"?: string;
    "mentioned_users"?: UserPayload[];
    "thread_info"?: ThreadInfoPayload;
    "reactions"?: ReactionPayload[];
    "metaarray"?: object;
    "metaarray_key_order"?: string[];
    "sorted_metaarray"?: MessageMetaArrayPayload[];
    "og_tag"?: OGMetaDataPayload;
    "silent"?: boolean;
    "is_op_msg"?: boolean;
    "apple_critical_alert_options"?: AppleCriticalAlertOptionsPayload;
    "ts"?: number;
    "created_at"?: number;
    "updated_at"?: number;
}

export declare interface BaseStore {
    dbname: string;
    itemSizeLimit: number;
    init(dbname: string): Promise<void>;
    getAllKeys(): Promise<string[]>;
    get(key: string): Promise<object>;
    set(item: StoreItem): Promise<object>;
    setMany(items: StoreItem[]): Promise<object[]>;
    remove(key: string): Promise<string>;
    removeMany(keys: string[]): Promise<string[]>;
    clear(): Promise<void>;
}

export declare class BlockedUserListQuery extends BaseListQuery {
    readonly userIdsFilter: string[];
    constructor(iid: string, params: BlockedUserListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}

export declare interface BlockedUserListQueryParams extends BaseListQueryParams {
    userIdsFilter?: string[];
}

export declare type BlockKeyHash = (key: string, limit: number) => number;

export declare class BlockManager {
    readonly dbname: string;
    readonly collectionName: string;
    readonly metadata: CollectionMetadata;
    readonly hashFunction: BlockKeyHash;
    private _transaction;
    private _store;
    constructor({ dbname, collectionName, metadata, hashFunction, transaction, store, }: BlockManagerParams);
    get keyName(): string;
    createBlockId(key: string, level?: number): string;
    private _findBlock;
    getFromBlock(key: string): Promise<object>;
    putToBlock(key: string, item: object): Promise<boolean>;
    removeFromBlock(key: string): Promise<boolean>;
    clearAllBlocks(): Promise<void>;
}

export declare interface BlockManagerParams {
    dbname: string;
    collectionName: string;
    metadata: CollectionMetadata;
    hashFunction?: BlockKeyHash;
    transaction: Transaction;
    store: BaseStore;
}

export declare class CacheContext {
    store: BaseStore;
    nestdb: NestDB;
    encryption: Encryption;
    localCacheEnabled: boolean;
    constructor({ encryption, store, localCacheEnabled, }: {
        encryption?: any;
        store?: any;
        localCacheEnabled?: boolean;
    });
}

export declare abstract class ChannelDataListQuery extends BaseListQuery {
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: ChannelDataListQueryParams);
    protected _validate(): boolean;
}

export declare interface ChannelDataListQueryParams extends BaseListQueryParams {
}

export declare enum ChannelType {
    BASE = "base",
    GROUP = "group",
    OPEN = "open"
}

export declare class Collection {
    readonly dbname: string;
    readonly name: string;
    readonly keyName: string;
    readonly indexes: string[][];
    private _state;
    private _metadata;
    private _keyHash;
    private _mutex;
    private _store;
    private _transaction;
    private _blobContainer;
    private _blockManager;
    private _indexers;
    constructor({ dbname, collectionName, keyName, keyHash, indexes, store, }: CollectionParams);
    static metadataOf(dbname: string, collectionName: string, store: BaseStore): Promise<CollectionMetadata>;
    get state(): CollectionState;
    init(): Promise<void>;
    close(): void;
    private _hasPropertyOfKeyName;
    private _getIndexerBy;
    private _upgradeBlockLevel;
    private _requestInsert;
    private _requestUpsert;
    private _requestUpdate;
    private _requestRemove;
    private _requestClear;
    getByKey(key: string): Promise<object>;
    query(params?: CollectionQueryParams): Query;
    insertOne(item: object): Promise<object>;
    insertMany(items: object[]): Promise<object[]>;
    upsertOne(item: object): Promise<object>;
    upsertMany(items: object[]): Promise<object[]>;
    update(item: object): Promise<object>;
    updateIf(where: QueryCondition, update: CollectionUpdateParams): Promise<object[]>;
    remove(key: string): Promise<void>;
    removeIf(where: QueryCondition): Promise<string[]>;
    clear(): Promise<void>;
    getBlob(blobId: string): Promise<Blob>;
    saveBlob(blob: Blob, key?: string): Promise<string>;
    removeBlob(blobId: string): Promise<void>;
    removeAllBlobs(): Promise<void>;
}

export declare interface CollectionMetadata {
    keyName: string;
    blockLevel: number;
    blockHashBase: number;
    blockHashMultiplier: number;
    blockHashConstant: number;
    indexes: string[][];
}

export declare interface CollectionParams {
    dbname: string;
    collectionName: string;
    keyName: string;
    keyHash?: BlockKeyHash;
    indexes: string[][];
    store: BaseStore;
}

export declare interface CollectionQueryParams {
    where?: QueryCondition;
    index?: string[];
    backward?: boolean;
}

export declare enum CollectionState {
    INIT = "init",
    READY = "ready",
    CLOSED = "closed"
}

export declare interface CollectionUpdateParams {
    set?: object | ((item: object) => void);
}

export declare type ColumnValues = PrimitiveType[];

export declare class CommandDispatcher {
    private _dispatcher;
    on(handler: EventHandler<BaseCommand>): CommandDispatcherContext;
    once(handler: EventHandler<BaseCommand>): CommandDispatcherContext;
    dispatch(command: BaseCommand): void;
}

export declare type CommandDispatcherContext = EventDispatcherContext<{
    "event": BaseCommand;
}>;

export declare class CommandRouter {
    readonly apiClient: ApiClient;
    readonly websocketClient: WebSocketClient;
    private _sdkState;
    private _ackStateMap;
    private _dispatcher;
    constructor(_iid: string, { auth, sdkState, dispatcher, }: CommandRouterParams);
    private _sendApiRequest;
    private _sendWebsocketRequest;
    send(req: APIRequestCommand | WebSocketRequestCommand): Promise<APIResponseCommand | WebSocketEventCommand>;
    cancel(requestId: string): void;
    cancelAll(): void;
}

export declare interface CommandRouterParams {
    auth: Auth;
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
}

export declare class Config {
    readonly cacheLimit: number;
    /** @ignore */
    readonly itemSizeLimit: number;
    /** @ignore */
    readonly blockHashBase: number;
    /** @ignore */
    readonly blockHashMultiplier: number;
    /** @ignore */
    readonly blockHashConstant: number;
    /** @ignore */
    readonly transactionApplyDelay: number;
    /** @ignore */
    readonly disableLogger: boolean;
    constructor({ dbname, itemSizeLimit, cacheLimit, blockHashBase, blockHashMultiplier, blockHashConstant, transactionApplyDelay, disableLogger, }: ConfigParams);
    /** @ignore */
    static get(dbname: string): Config;
}

export declare interface ConfigParams {
    dbname: string;
    cacheLimit?: number;
    itemSizeLimit?: number;
    blockHashBase?: number;
    blockHashMultiplier?: number;
    blockHashConstant?: number;
    transactionApplyDelay?: number;
    disableLogger?: boolean;
}

export declare class ConnectionHandler {
    onConnected: (userId: string) => void;
    onReconnectStarted: () => void;
    onReconnectSucceeded: () => void;
    onReconnectFailed: () => void;
    onDisconnected: (userId: string) => void;
}

export declare enum ConnectionState {
    CONNECTING = "CONNECTING",
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export declare class Deferred<T> {
    readonly promise: Promise<T>;
    resolve: (value?: (T | PromiseLike<T>)) => void;
    reject: (reason?: any) => void;
    constructor();
}

export declare interface DoNotDisturbPreference {
    doNotDisturbOn: boolean;
    startHour?: number;
    startMin?: number;
    endHour?: number;
    endMin?: number;
    timezone?: string;
}

export declare class Emoji {
    readonly key: string;
    readonly url: string;
    constructor(payload: EmojiPayload);
}

export declare class EmojiCategory {
    readonly id: number;
    readonly name: string;
    readonly url: string;
    readonly emojis: Emoji[];
    constructor(payload: EmojiCategoryPayload);
}

export declare interface EmojiCategoryPayload {
    "id": number;
    "name": string;
    "url": string;
    "emojis": EmojiPayload[];
}

export declare class EmojiContainer {
    readonly emojiHash: string;
    readonly emojiCategories: EmojiCategory[];
    constructor(payload: EmojiContainerPayload);
}

export declare interface EmojiContainerPayload {
    "emoji_hash": string;
    "emoji_categories": EmojiCategoryPayload[];
}

export declare interface EmojiPayload {
    "key": string;
    "url": string;
}

export declare interface Encryption {
    encrypt: (obj: object) => object;
    decrypt: (encrypted: object) => object;
}

export declare class EventDispatcher<T extends EventMap> {
    private _container;
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    dispatch<K extends keyof T>(event: K, args?: T[K]): void;
}

export declare class EventDispatcherContext<T extends EventMap> {
    private _container;
    readonly key: string;
    constructor({ container }: {
        container: any;
    });
    private _register;
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    close(): void;
}

export declare type EventHandler<T> = (args?: T) => void;

export declare interface EventMap {
    [key: string]: unknown;
}

export declare type FileCompat = File | Blob | FileInfo;

export declare interface FileInfo {
    name: string;
    uri: string;
    type: string;
}

export declare class FileMessage extends SendableMessage {
    readonly plainUrl: string;
    readonly requireAuth: boolean;
    readonly name: string;
    readonly size: number;
    readonly type: string;
    readonly thumbnails: Thumbnail[];
    readonly messageSurvivalSeconds: number;
    constructor(_iid: string, payload: FileMessagePayload);
    static payloadify(obj: FileMessage): FileMessagePayload;
    get url(): string;
    getThreadedMessagesByTimestamp(ts: number, params: ThreadedMessageListParams): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
}

export declare interface FileMessagePayload extends SendableMessagePayload {
    "url": string;
    "require_auth"?: boolean;
    "file": {
        "name"?: string;
        "size"?: number;
        "type"?: string;
        "data"?: string;
    };
    "custom"?: string;
    "thumbnails"?: ThumbnailPayload[];
    "message_survival_seconds"?: number;
}

export declare interface FriendChangelogs {
    addedUsers: User[];
    updatedUsers: User[];
    deletedUserIds: string[];
    hasMore: boolean;
    token: string;
}

export declare interface FriendDiscovery {
    friendDiscoveryKey: string;
    friendName: string;
}

export declare class FriendListQuery extends BaseListQuery {
    constructor(iid: string, params: FriendListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}

export declare interface FriendListQueryParams extends BaseListQueryParams {
}

export declare class Indexer {
    readonly indexerKey: string;
    readonly dbname: string;
    readonly collectionName: string;
    readonly keyName: string;
    readonly fields: string[];
    /** what's difference between origin and indextable?
     *  - origin: pointing to cache item value, updated on commit.
     *  - indextable: copy of origin, updated on request.
     *
     *  why is the separation necessary?
     *  - if it updates the origin directly on request,
     *    it's getting impossible to revert it.
     *    if transaction operation fails, it should recover to the origin.
     */
    private _origin;
    private _table;
    private _transaction;
    private _store;
    constructor({ dbname, collectionName, keyName, fields, transaction, store, }: IndexerParams);
    static createKey(index: string[]): string;
    static parseKey(key: string): string[];
    private _addItem;
    private _removeItem;
    get origin(): IndexerItem[];
    get table(): IndexerItem[];
    getColumnValues(item: object): ColumnValues;
    diff(a: ColumnValues, b: ColumnValues): number;
    indexOf(columnValues: ColumnValues): [
        number,
        boolean
    ];
    ensure(): Promise<void>;
    drop(): Promise<void>;
    addItem(item: object): Promise<void>;
    removeItem(item: object): Promise<void>;
    clear(): Promise<void>;
    commit(): void;
    abort(): void;
}

export declare interface IndexerItem {
    columnValues: ColumnValues;
    keys: string[];
}

export declare interface IndexerParams {
    dbname: string;
    collectionName: string;
    keyName: string;
    fields: string[];
    transaction: Transaction;
    store: BaseStore;
}

export /**
 * HOW TO PROPAGATE INSTANCE ID (a.k.a iid):
 *  In constructor of every class which extends InstancedObject, it should use _iid to create an instanced object property.
 *  e.g. this.inviter = new User({ _iid: this._iid, ...payload['invited_by'] })
 */
declare abstract class InstancedObject {
    readonly _iid: string;
    constructor(_iid: string);
    static payloadify(obj: InstancedObject): InstancedObjectPayload;
}

export declare interface InstancedObjectPayload {
    "_iid"?: string;
}

export declare interface InvitationPreference {
    autoAccept: boolean;
}

export declare enum LogLevel {
    NONE = 0,
    VERBOSE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5
}

export declare class MemoryStore implements BaseStore {
    private _encryption;
    dbname: string;
    itemSizeLimit: number;
    delay: number;
    observer: Record<string, unknown>;
    constructor(params?: MemoryStoreParams);
    get rawData(): object;
    set rawData(value: object);
    observe(key: string, ops: string[], handler: () => Error): void;
    init(dbname: string): Promise<void>;
    getAllKeys(): Promise<string[]>;
    get(key: string): Promise<object>;
    set(item: StoreItem): Promise<object>;
    setMany(items: StoreItem[]): Promise<object[]>;
    remove(key: string): Promise<string>;
    removeMany(keys: string[]): Promise<string[]>;
    clear(): Promise<void>;
}

export declare interface MemoryStoreParams {
    itemSizeLimit?: number;
    delay?: number;
    encryption?: Encryption;
}

export declare enum MentionType {
    USERS = "users",
    CHANNEL = "channel"
}

export declare class MessageMetaArray {
    readonly key: string;
    readonly value: string[];
    constructor(payload: MessageMetaArrayPayload);
    static payloadify(obj: MessageMetaArray): MessageMetaArrayPayload;
}

export declare interface MessageMetaArrayPayload {
    "key": string;
    "value"?: string[];
}

export declare class MessageModule extends Module {
    name: "message";
    private _manager;
    init(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    }): void;
    buildMessageFromSerializedData(serialized: object): UserMessage | FileMessage | AdminMessage;
    buildSenderFromSerializedData(serialized: object): Sender;
    getMessage(params: MessageRetrievalParams): Promise<BaseMessage>;
}

export declare class MessageRetrievalParams extends MessageRetrievalParamsProperties {
    constructor(props?: MessageRetrievalParamsProperties);
    validate(): boolean;
}

export declare class MessageRetrievalParamsProperties {
    channelUrl: string;
    channelType: ChannelType;
    messageId: number;
    includeReactions?: boolean;
    includeMetaArray?: boolean;
    includeParentMessageInfo?: boolean;
    includeThreadInfo?: boolean;
    includePollDetails?: boolean;
}

export declare enum MessageSearchOrder {
    SCORE = "score",
    TIMESTAMP = "ts"
}

export declare class MessageSearchQuery extends BaseListQuery {
    readonly keyword: string;
    readonly reverse: boolean;
    readonly exactMatch: boolean;
    readonly channelUrl: string;
    readonly channelCustomType: string;
    readonly messageTimestampFrom: number;
    readonly messageTimestampTo: number;
    readonly order: MessageSearchOrder;
    readonly advancedQuery: boolean;
    readonly targetFields: string[];
    private _nextToken;
    constructor(iid: string, params: MessageSearchQueryParams);
    protected _validate(): boolean;
    next(): Promise<BaseMessage[]>;
}

export declare interface MessageSearchQueryParams extends BaseListQueryParams {
    keyword: string;
    reverse?: boolean;
    exactMatch?: boolean;
    channelUrl?: string;
    channelCustomType?: string;
    messageTimestampFrom?: number;
    messageTimestampTo?: number;
    order?: MessageSearchOrder;
    advancedQuery?: boolean;
    targetFields?: string[];
}

export declare enum MessageType {
    BASE = "base",
    USER = "user",
    FILE = "file",
    ADMIN = "admin"
}

export declare enum MessageTypeFilter {
    ALL = "",
    USER = "MESG",
    FILE = "FILE",
    ADMIN = "ADMM"
}

export declare type MetaCounter = {
    [key: string]: number;
};

export declare type MetaData = {
    [key: string]: string;
};

export declare abstract class Module {
    protected _iid: string;
    protected _cacheContext: CacheContext;
    protected _sdkState: SDKState;
    protected _dispatcher: CommandDispatcher;
    protected _sessionManager: SessionManager;
    protected _requestQueue: RequestQueue;
    readonly name: string;
    init(_iid: string, { sdkState, dispatcher, sessionManager, requestQueue, cacheContext }: ModuleParams): void;
}

export declare type ModuleNamespaces<T extends Module[], M extends T[number] = T[number]> = {
    [key in M["name"]]: M extends {
        name: key;
    } ? Omit<M, keyof Module> : never;
};

export declare interface ModuleParams {
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
    sessionManager: SessionManager;
    requestQueue: RequestQueue;
    cacheContext?: CacheContext;
}

export declare class MutedUserListQuery extends ChannelDataListQuery {
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: MutedUserListQueryParams);
    next(): Promise<RestrictedUser[]>;
}

export declare interface MutedUserListQueryParams extends ChannelDataListQueryParams {
}

export declare class Mutex {
    readonly id: string;
    readonly key: string;
    private _locked;
    private _resolvers;
    constructor(key: string);
    get locked(): boolean;
    wait(): Promise<void>;
    lock(): Promise<void>;
    unlock(): void;
}

export declare class NestDB {
    readonly name: string;
    private _version;
    private _state;
    private _config;
    private _store;
    private _event;
    private _collections;
    private _globalMutex;
    constructor({ name, version, store, config, }: NestDBParams);
    get version(): number;
    get state(): NestDBState;
    commitSchema(schemas: Array<NestDBSchema>): Promise<void>;
    open(): Promise<void>;
    close(): void;
    reset(): Promise<void>;
    on(eventType: string, handler: Function): void;
    off(eventType: string): void;
    collection(collectionName: string): Collection;
}

export declare interface NestDBParams {
    name: string;
    version: number;
    store: BaseStore;
    config?: Config;
}

export declare interface NestDBSchema {
    collectionName: string;
    keyName: string;
    keyHash?: BlockKeyHash;
    index?: string[][];
}

export declare enum NestDBState {
    INIT = "INIT",
    OPENING = "OPENING",
    OPENED = "OPENED",
    CLOSED = "CLOSED"
}

export declare class OGImage {
    readonly url: string;
    readonly secureUrl: string;
    readonly type: string;
    readonly width: number;
    readonly height: number;
    readonly alt: string;
    constructor(payload: OGImagePayload);
    static payloadify(obj: OGImage): OGImagePayload;
}

export declare interface OGImagePayload {
    "url": string;
    "secure_url"?: string;
    "type"?: string;
    "width"?: number;
    "height"?: number;
    "alt"?: string;
}

export declare class OGMetaData {
    readonly title: string;
    readonly url: string;
    readonly description: string;
    readonly defaultImage: OGImage;
    constructor(payload: OGMetaDataPayload);
    static payloadify(obj: OGMetaData): OGMetaDataPayload;
}

export declare interface OGMetaDataPayload {
    "og:title"?: string;
    "og:url"?: string;
    "og:description"?: string;
    "og:image"?: OGImagePayload;
}

export declare class OperatorListQuery extends ChannelDataListQuery {
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: OperatorListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}

export declare interface OperatorListQueryParams extends ChannelDataListQueryParams {
}

export declare class Plugin_2 {
    readonly type: string;
    readonly vendor: string;
    readonly detail: object;
    constructor(payload: PluginPayload);
    static payloadify(obj: Plugin_2): PluginPayload;
}

export declare interface PluginPayload {
    "type"?: string;
    "vendor"?: string;
    "detail"?: object;
}

export declare type PrimitiveType = boolean | number | string;

export declare enum PushTemplate {
    ALTERNATIVE = "alternative",
    DEFAULT = "default"
}

export declare enum PushTokenRegistrationState {
    SUCCESS = "success",
    PENDING = "pending",
    ERROR = "error"
}

export declare interface PushTokens {
    deviceTokens: string[];
    type: PushTokenType;
    hasMore: boolean;
    token: string;
}

export declare enum PushTokenType {
    FCM = "gcm",
    APNS = "apns",
    UNKNOWN = "unknown"
}

export declare enum PushTriggerOption {
    DEFAULT = "default",
    ALL = "all",
    MENTION_ONLY = "mention_only",
    OFF = "off"
}

export declare class Query {
    private _iterator;
    private _mutex;
    constructor({ condition, backward, mutex, blockManager, indexer, }: QueryParams);
    fetch(params?: QueryFetchParams): Promise<object[]>;
    count(): Promise<number>;
}

export declare type QueryCondition = QueryPropertyCondition | QueryGroupCondition | QueryFunction;

export declare interface QueryFetchParams {
    offset?: number;
    limit?: number;
}

export declare type QueryFunction = (item: unknown) => boolean;

export declare type QueryGroupCondition = {
    "/and"?: QueryCondition[];
    "&&"?: QueryCondition[];
    "/or"?: QueryCondition[];
    "||"?: QueryCondition[];
    "/where"?: QueryFunction;
};

export declare interface QueryParams {
    condition?: QueryCondition;
    backward?: boolean;
    mutex: Mutex;
    blockManager: BlockManager;
    indexer: Indexer;
}

export declare type QueryPropertyCondition = {
    [key: string]: QueryGroupCondition | QueryValueCondition | QueryFunction | PrimitiveType;
};

export declare type QueryValueCondition = {
    "/eq"?: PrimitiveType;
    "="?: PrimitiveType;
    "/neq"?: PrimitiveType;
    "!="?: PrimitiveType;
    "/gt"?: PrimitiveType;
    ">"?: PrimitiveType;
    "/gte"?: PrimitiveType;
    ">="?: PrimitiveType;
    "/lt"?: PrimitiveType;
    "<"?: PrimitiveType;
    "/lte"?: PrimitiveType;
    "<="?: PrimitiveType;
    "/in"?: PrimitiveType[];
    "/nin"?: PrimitiveType[];
    "/contain"?: PrimitiveType;
    "/regex"?: RegExp;
    "/where"?: QueryFunction;
};

export declare class Reaction {
    private _version;
    readonly key: string;
    readonly userIds: string[];
    updatedAt: number;
    constructor(payload: ReactionPayload);
    get isEmpty(): boolean;
    static payloadify(obj: Reaction): ReactionPayload;
    applyEvent(reactionEvent: ReactionEvent): void;
}

export declare class ReactionEvent {
    readonly messageId: number;
    readonly userId: string;
    readonly key: string;
    readonly operation: ReactionEventOperation;
    readonly updatedAt: number;
    constructor(payload: ReactionEventPayload);
}

export declare enum ReactionEventOperation {
    ADD = "add",
    DELETE = "delete"
}

export declare interface ReactionEventPayload {
    "msg_id": string | number;
    "user_id": string;
    "operation": string;
    "reaction": string;
    "updated_at": number;
}

export declare interface ReactionPayload {
    "key": string;
    "user_ids": string[];
    "updated_at": number;
}

export declare enum ReportCategory {
    SPAM = "spam",
    HARASSING = "harassing",
    SUSPICIOUS = "suspicious",
    INAPPROPRIATE = "inappropriate"
}

export declare class RequestQueue {
    readonly commandRouter: CommandRouter;
    private _auth;
    private _currentConnectionStateType;
    private _dispatcher;
    private _lazyCallQueue;
    constructor(_iid: string, { auth, sdkState, dispatcher, }: RequestQueueParams);
    get isReady(): boolean;
    get isLazyCallActivated(): boolean;
    send(command: WebSocketRequestCommand | APIRequestCommand): Promise<WebSocketEventCommand | APIResponseCommand>;
    forceSend(command: WebSocketRequestCommand | APIRequestCommand): Promise<WebSocketEventCommand | APIResponseCommand>;
    cancel(requestId: string): void;
    cancelAll(): void;
}

export declare interface RequestQueueParams {
    auth: Auth;
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
}

export declare enum RequestState {
    PENDING = "pending",
    FAILED = "failed",
    CANCELED = "canceled",
    SUCCEEDED = "succeeded"
}

export declare class RestrictedUser extends User {
    readonly restrictionInfo: RestrictionInfo;
    constructor(_iid: string, payload: RestrictedUserPayload);
    static payloadify(obj: RestrictedUser): RestrictedUserPayload;
}

export declare interface RestrictedUserPayload extends UserPayload, RestrictionInfoPayload {
}

export declare class RestrictionInfo {
    readonly restrictionType: RestrictionType;
    readonly description: string;
    readonly endAt: number;
    constructor(payload: RestrictionInfoPayload);
    static payloadify(obj: RestrictionInfo): RestrictionInfoPayload;
}

export declare interface RestrictionInfoPayload {
    "restriction_type"?: string;
    "description"?: string;
    "end_at"?: number;
    "muted_end_at"?: number;
}

export declare enum RestrictionType {
    MUTED = "muted",
    BANNED = "banned"
}

export declare interface RetryStrategy {
    calcTimeout: (count: number) => number;
}

export declare enum Role {
    OPERATOR = "operator",
    NONE = "none"
}

export declare interface SDKState {
    appId: string;
    appVersion?: string;
    userId: string;
    extensions?: object;
    api?: {
        host: string;
    };
    websocket?: {
        host: string;
        pingerDisabled?: boolean;
        pingInterval?: number;
        pongTimeout?: number;
        connectMaxRetry?: number;
        reconnectMaxRetry?: number;
        reconnectRetryStrategy?: RetryStrategy;
        responseTimeout?: number;
    };
}

export declare class SendableMessage extends BaseMessage {
    sender: Sender;
    reqId: string;
    requestState: RequestState;
    requestedMentionUserIds: string[];
    errorCode: number;
    constructor(_iid: string, payload: SendableMessagePayload);
    static payloadify(obj: SendableMessage): SendableMessagePayload;
    get isResendable(): boolean;
    isIdentical(message: SendableMessage): boolean;
}

export declare interface SendableMessagePayload extends BaseMessagePayload {
    "user": SenderPayload;
    "req_id"?: string;
    "request_state"?: string;
    "error_code"?: number;
    "requested_mention_user_ids"?: string[];
}

export declare class SendbirdChat {
    readonly _iid: string;
    private _appState;
    private _onlineDetector;
    private _fcmPushToken;
    private _apnsPushToken;
    readonly options: SendbirdChatOptions;
    readonly message: MessageModule;
    constructor(_iid: string, options: SendbirdChatOptions, modules: Module[]);
    static init<Modules extends Module[]>(params: SendbirdChatParams<Modules>): SendbirdChat & ModuleNamespaces<[
        ...Modules,
        MessageModule
    ]>;
    static get instance(): SendbirdChat;
    static get version(): string;
    get appId(): string;
    get appVersion(): string;
    get debugMode(): boolean;
    get logLevel(): LogLevel;
    set logLevel(val: LogLevel);
    get isCacheEnabled(): boolean;
    get ekey(): string;
    get currentUser(): User;
    get connectionState(): ConnectionState;
    get lastConnectedAt(): number;
    get fcmPushToken(): string;
    get apnsPushToken(): string;
    getMemoryStoreForDebugging(): MemoryStore;
    addExtension(key: string, version: string): void;
    initializeCache(userId: string): Promise<void>;
    clearCache(): Promise<void>;
    connect(userId: string, authToken?: string): Promise<User>;
    reconnect(): boolean;
    disconnect(): Promise<void>;
    setBackgroundState(): void;
    setForegroundState(): void;
    setSessionHandler(handler: SessionHandler): void;
    addUserEventHandler(key: string, handler: UserEventHandler): void;
    removeUserEventHandler(key: string): void;
    removeAllUserEventHandler(): void;
    addConnectionHandler(key: string, handler: ConnectionHandler): void;
    removeConnectionHandler(key: string): void;
    removeAllConnectionHandler(): void;
    createApplicationUserListQuery(params?: ApplicationUserListQueryParams): ApplicationUserListQuery;
    createBlockedUserListQuery(params?: BlockedUserListQueryParams): BlockedUserListQuery;
    createFriendListQuery(params?: FriendListQueryParams): FriendListQuery;
    createMessageSearchQuery(params: MessageSearchQueryParams): MessageSearchQuery;
    buildUserFromSerializedData(serialized: object): User;
    updateCurrentUserInfo(params: UserUpdateParams): Promise<User>;
    updateCurrentUserInfoWithPreferredLanguages(preferredLanguages: string[]): Promise<User>;
    registerFCMPushTokenForCurrentUser(token: string): Promise<PushTokenRegistrationState>;
    unregisterFCMPushTokenForCurrentUser(token: string): Promise<PushTokenRegistrationState>;
    unregisterFCMPushTokenAllForCurrentUser(): Promise<void>;
    registerAPNSPushTokenForCurrentUser(token: string): Promise<PushTokenRegistrationState>;
    unregisterAPNSPushTokenForCurrentUser(token: string): Promise<PushTokenRegistrationState>;
    unregisterAPNSPushTokenAllForCurrentUser(): Promise<void>;
    getChannelInvitationPreference(): Promise<InvitationPreference>;
    setChannelInvitationPreference(willAutoAccept: boolean): Promise<InvitationPreference>;
    getDoNotDisturb(): Promise<DoNotDisturbPreference>;
    setDoNotDisturb(doNotDisturbOn: boolean, startHour?: number, startMin?: number, endHour?: number, endMin?: number, timezone?: string): Promise<DoNotDisturbPreference>;
    getSnoozePeriod(): Promise<SnoozePeriod>;
    setSnoozePeriod(snoozeOn: boolean, startTs?: number, endTs?: number): Promise<SnoozePeriod>;
    getMyPushTokensByToken(token: string, type: PushTokenType): Promise<PushTokens>;
    getPushTriggerOption(): Promise<PushTriggerOption>;
    setPushTriggerOption(pushTriggerOption: PushTriggerOption): Promise<PushTriggerOption>;
    getPushTemplate(): Promise<PushTemplate>;
    setPushTemplate(templateName: PushTemplate): Promise<PushTemplate>;
    blockUser(userOrUserId: User | string): Promise<void>;
    blockUserWithUserId(userId: string): Promise<void>;
    unblockUser(userOrUserId: User | string): Promise<void>;
    unblockUserWithUserId(userId: string): Promise<void>;
    getFriendChangeLogsByToken(token: string): Promise<FriendChangelogs>;
    getAllowFriendDiscovery(): Promise<boolean>;
    setAllowFriendDiscovery(allowFriendDiscovery: boolean): Promise<boolean>;
    uploadFriendDiscoveries(discoveries: FriendDiscovery[]): Promise<string>;
    deleteFriendDiscovery(discoveryKey: string): Promise<void>;
    deleteFriendDiscoveries(discoveryKeys: string[]): Promise<void>;
    addFriends(userIds: string[]): Promise<User[]>;
    deleteFriend(userId: string): Promise<void>;
    deleteFriends(userIds: string[]): Promise<void>;
    getAllEmoji(): Promise<EmojiContainer>;
    getEmojiCategory(categoryId: number): Promise<EmojiCategory>;
    getEmoji(emojiKey: string): Promise<Emoji>;
    getUnreadItemCount(params: UnreadItemCountParams): Promise<UnreadItemCount>;
    getTotalUnreadChannelCount(): Promise<number>;
    getTotalUnreadMessageCount(params: TotalUnreadMessageCountParams): Promise<number>;
    getSubscribedTotalUnreadMessageCount(): number;
    getSubscribedCustomTypeTotalUnreadMessageCount(): number;
    getSubscribedCustomTypeUnreadMessageCount(customType: string): number;
}

export declare class SendbirdChatOptions {
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

export declare interface SendbirdChatParams<Modules extends Module[]> {
    appId: string;
    appVersion?: string;
    customApiHost?: string;
    customWebSocketHost?: string;
    newInstance?: boolean;
    modules?: Modules;
    options?: SendbirdChatOptions;
    logLevel?: LogLevel;
    debugMode?: boolean;
    localCacheEnabled?: boolean;
    localCacheEncryption?: Encryption;
    useAsyncStorageStore?: AsyncStorageStatic;
}

export declare class Sender extends User {
    role: Role;
    isBlockedByMe: boolean;
    constructor(_iid: string, payload: SenderPayload);
    static payloadify(obj: Sender): SenderPayload;
}

export declare interface SenderPayload extends UserPayload {
    "role"?: string;
    "is_blocked_by_me"?: boolean;
}

export declare class SessionHandler {
    onSessionExpired: () => void;
    onSessionTokenRequired: (resolve: SessionTokenRefreshResolve, reject: SessionTokenRefreshReject) => void;
    onSessionError: (err: Error) => void;
    onSessionRefreshed: () => void;
    onSessionClosed: () => void;
}

export declare class SessionManager {
    readonly auth: Auth;
    private _sdkState;
    private _dispatcher;
    private _requestQueue;
    private _currentConnectionStateType;
    currentUser: User;
    handler: SessionHandler;
    constructor({ auth, sdkState, dispatcher, requestQueue }: SessionManagerParams);
    createRefreshWebsocketCommand(authToken: string): SessionRefreshWebSocketCommand;
    _refreshSessionKey(authToken: string, deferred: Deferred<void>): Promise<void>;
    _handleError(deferred?: Deferred<void>): void;
    refresh(): Promise<void>;
}

export declare interface SessionManagerParams {
    auth: Auth;
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
    requestQueue: RequestQueue;
}

export declare class SessionRefreshWebSocketCommand extends WebSocketRequestCommand {
    constructor({ authToken, expiringSession }: {
        authToken: any;
        expiringSession?: boolean;
    });
}

export declare type SessionTokenRefreshReject = (err: Error) => void;

export declare type SessionTokenRefreshResolve = (authToken: string) => void;

export declare interface SnoozePeriod {
    isSnoozeOn: boolean;
    startTs?: number;
    endTs?: number;
}

export declare interface StoreItem {
    key: string;
    value: object;
    generation: number;
}

export declare enum SuperChannelFilter {
    ALL = "all",
    SUPER = "super",
    NON_SUPER = "nonsuper",
    BROADCAST_ONLY = "broadcast_only"
}

export declare class ThreadedMessageListParams extends ThreadedMessageListParamsProperties {
    constructor(props?: ThreadedMessageListParamsProperties);
    validate(): boolean;
}

export declare class ThreadedMessageListParamsProperties {
    prevResultSize: number;
    nextResultSize: number;
    isInclusive?: boolean;
    reverse?: boolean;
    messageTypeFilter?: MessageTypeFilter;
    customTypesFilter?: string[];
    senderUserIdsFilter?: string[];
    includeReactions?: boolean;
    includeMetaArray?: boolean;
    includeParentMessageInfo?: boolean;
}

export declare class ThreadInfo extends InstancedObject {
    readonly replyCount: number;
    readonly mostRepliedUsers: User[];
    readonly lastRepliedAt: number;
    readonly updatedAt: number;
    constructor(_iid: string, payload: ThreadInfoPayload);
    static payloadify(obj: ThreadInfo): ThreadInfoPayload;
}

export declare interface ThreadInfoPayload extends InstancedObjectPayload {
    "reply_count": number;
    "most_replies": UserPayload[];
    "last_replied_at": number;
    "updated_at": number;
}

export declare class ThreadInfoUpdateEvent extends InstancedObject {
    readonly threadInfo: ThreadInfo;
    readonly targetMessageId: number;
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    constructor(_iid: string, payload: ThreadInfoUpdateEventPayload);
}

export declare interface ThreadInfoUpdateEventPayload {
    "thread_info": ThreadInfoPayload;
    "root_message_id": number;
    "channel_url": string;
    "channel_type": ChannelType;
}

export declare class Thumbnail {
    readonly url: string;
    readonly width: number;
    readonly height: number;
    readonly realWidth: number;
    readonly realHeight: number;
    constructor(payload: ThumbnailPayload);
    static payloadify(obj: ThumbnailSize): ThumbnailPayload;
    get plainUrl(): string;
}

export declare interface ThumbnailPayload {
    "url": string;
    "width": number;
    "height": number;
    "real_width"?: number;
    "real_height"?: number;
}

export declare interface ThumbnailSize {
    maxWidth: number;
    maxHeight: number;
}

export declare class TotalUnreadMessageCountParams extends TotalUnreadMessageCountParamsProperties {
    constructor(props?: TotalUnreadMessageCountParamsProperties);
    validate(): boolean;
}

export declare class TotalUnreadMessageCountParamsProperties {
    channelCustomTypesFilter?: string[];
    superChannelFilter?: SuperChannelFilter;
}

export declare class Transaction {
    readonly dbname: string;
    readonly collectionName: string;
    readonly metadataKey: string;
    readonly recordsetKey: string;
    private _metadata;
    private _requests;
    private _store;
    private _onCommit;
    private _onWrite;
    private _onError;
    constructor({ dbname, collectionName, store, }: TransactionParams);
    get generation(): number;
    get requestCount(): number;
    private _getReducedRecordset;
    private _reduceRecordSet;
    private _applyRecord;
    init(): Promise<void>;
    on(eventType: TransactionEventType, key: string, handler: TransactionEventHandler<TransactionRequestData[] | Error>): void;
    requestWrite(item: TransactionRequestData, options?: TransactionRequestOptions): void;
    requestMultipleWrite(items: TransactionRequestData[], options?: TransactionRequestOptions): void;
    clear(): Promise<void>;
    commit(): Promise<void>;
}

export declare type TransactionEventHandler<T> = (event: T) => void;

export declare enum TransactionEventType {
    COMMIT = 0,
    WRITE = 1,
    ERROR = 2
}

export declare interface TransactionParams {
    dbname: string;
    collectionName: string;
    store: BaseStore;
    applyDelay?: number;
}

export declare interface TransactionRequestData {
    key: string;
    value: object;
}

export declare interface TransactionRequestOptions {
    persistent?: boolean;
}

export declare interface UnreadItemCount {
    groupChannelUnreadMentionCount?: number;
    groupChannelUnreadMessageCount?: number;
    groupChannelInvitationCount?: number;
    superGroupChannelUnreadMentionCount?: number;
    superGroupChannelUnreadMessageCount?: number;
    superGroupChannelInvitationCount?: number;
    nonSuperGroupChannelUnreadMentionCount?: number;
    nonSuperGroupChannelUnreadMessageCount?: number;
    nonSuperGroupChannelInvitationCount?: number;
}

export declare class UnreadItemCountParams extends UnreadItemCountParamsProperties {
    constructor(props?: UnreadItemCountParamsProperties);
    validate(): boolean;
}

export declare class UnreadItemCountParamsProperties {
    keys: UnreadItemKey[];
}

export declare enum UnreadItemKey {
    GROUP_CHANNEL_UNREAD_MENTION_COUNT = "group_channel_unread_mention_count",
    NONSUPER_UNREAD_MENTION_COUNT = "non_super_group_channel_unread_mention_count",
    SUPER_UNREAD_MENTION_COUNT = "super_group_channel_unread_mention_count",
    GROUP_CHANNEL_UNREAD_MESSAGE_COUNT = "group_channel_unread_message_count",
    NONSUPER_UNREAD_MESSAGE_COUNT = "non_super_group_channel_unread_message_count",
    SUPER_UNREAD_MESSAGE_COUNT = "super_group_channel_unread_message_count",
    GROUP_CHANNEL_INVITATION_COUNT = "group_channel_invitation_count",
    NONSUPER_INVITATION_COUNT = "non_super_group_channel_invitation_count",
    SUPER_INVITATION_COUNT = "super_group_channel_invitation_count"
}

export declare class User extends InstancedObject {
    readonly userId: string;
    readonly requireAuth: boolean;
    nickname: string;
    plainProfileUrl: string;
    metaData: object;
    connectionStatus: UserOnlineState;
    isActive: boolean;
    lastSeenAt: number;
    preferredLanguages: string[];
    friendDiscoveryKey: string;
    friendName: string;
    constructor(_iid: string, payload: UserPayload);
    static payloadify(obj: User): UserPayload;
    get profileUrl(): string;
    serialize(): object;
    private _isValidMetaData;
    private _applyMetaData;
    createMetaData(input: MetaData): Promise<object>;
    updateMetaData(input: MetaData, upsert?: boolean): Promise<object>;
    deleteMetaData(metadataKey: string): Promise<object>;
    deleteAllMetaData(): Promise<void>;
}

export declare class UserEventHandler {
    onFriendsDiscovered: (users: User[]) => void;
    onTotalUnreadMessageCountUpdated: (totalCount: number, countByCustomType: object) => void;
}

export declare class UserMessage extends SendableMessage {
    message: string;
    readonly translations: object;
    readonly messageSurvivalSeconds: number;
    readonly plugins: Plugin_2[];
    constructor(_iid: string, payload: UserMessagePayload);
    static payloadify(obj: UserMessage): UserMessagePayload;
    getThreadedMessagesByTimestamp(ts: number, params: ThreadedMessageListParams): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
}

export declare interface UserMessagePayload extends SendableMessagePayload {
    "message": string;
    "translations"?: object;
    "message_survival_seconds"?: number;
    "plugins"?: PluginPayload[];
}

export declare enum UserOnlineState {
    ONLINE = "online",
    OFFLINE = "offline",
    NON_AVAILABLE = "nonavailable"
}

export declare interface UserPayload extends InstancedObjectPayload {
    "guest_id"?: string;
    "user_id": string;
    "nickname"?: string;
    "profile_url"?: string;
    "image"?: string;
    "require_auth_for_profile_image"?: boolean;
    "last_seen_at"?: number;
    "is_online"?: boolean | string;
    "is_active"?: boolean;
    "metadata"?: object;
    "friend_discovery_key"?: string;
    "friend_name"?: string;
    "preferred_languages"?: string[];
}

export declare class UserUpdateParams extends UserUpdateParamsProperties {
    constructor(props?: UserUpdateParamsProperties);
    validate(): boolean;
}

export declare class UserUpdateParamsProperties {
    profileImage?: FileCompat;
    profileUrl?: string;
    nickname?: string;
}

export declare class WebSocketClient extends EventDispatcher<WebSocketEventType> {
    private _iid;
    private _sdkState;
    private _ws;
    private _pinger;
    private _dispatcher;
    lastActive: number;
    constructor(_iid: string, { sdkState, dispatcher, }: {
        sdkState: any;
        dispatcher: any;
    });
    get connectionState(): ConnectionState;
    connect(url: string): void;
    disconnect(): void;
    send(command: WebSocketRequestCommand): void;
    error(err: Error): void;
}

export declare class WebSocketEventCommand extends BaseCommand {
    readonly _iid: string;
    readonly code: string;
    readonly payload: object;
    readonly requestId: string;
    constructor(_iid: string, code: string, payload: object, requestId?: string);
    static createFromRawMessage(_iid: string, message: string): WebSocketEventCommand;
    convertToMessage(): string;
    as<T extends WebSocketEventCommand>(SpecifiedEventCommand: new (_iid: string, code: string, payload: object) => T): T;
}

export declare type WebSocketEventType = {
    "open": void;
    "message": WebSocketEventCommand;
    "error": Error;
    "close": void;
};

export declare class WebSocketRequestCommand extends BaseCommand {
    readonly code: string;
    readonly payload: object;
    readonly requestId: string;
    readonly ackRequired: boolean;
    constructor({ code, ackRequired, payload, }: WebSocketRequestCommandParams);
    convertToMessage(): string;
}

export declare interface WebSocketRequestCommandParams {
    code: string;
    ackRequired: boolean;
    payload?: object;
}

export declare class BaseChannel extends InstancedObject {
    private _cachedMetaData;
    url: string;
    channelType: ChannelType;
    name: string;
    coverUrl: string;
    customType: string;
    data: string;
    isFrozen: boolean;
    isEphemeral: boolean;
    creator: User;
    createdAt: number;
    constructor(_iid: string, payload: BaseChannelPayload);
    static payloadify(obj: BaseChannel): BaseChannelPayload;
    get isGroupChannel(): boolean;
    get isOpenChannel(): boolean;
    get cachedMetaData(): object;
    _upsertCachedMetaData(metaData: object, ts: number): void;
    _removeFromCachedMetaData(keys: string[], ts: number): void;
    protected _generateRequestId(): string;
    isIdentical(channel: BaseChannel): boolean;
    isEqual(channel: BaseChannel): boolean;
    createOperatorListQuery(params?: OperatorListQueryParams): OperatorListQuery;
    createMutedUserListQuery(params?: MutedUserListQueryParams): MutedUserListQuery;
    createBannedUserListQuery(params?: BannedUserListQueryParams): BannedUserListQuery;
    createPreviousMessageListQuery(params?: PreviousMessageListQueryParams): PreviousMessageListQuery;
    addOperators(userIds: string[]): Promise<void>;
    removeOperators(userIds: string[]): Promise<void>;
    getMyMutedInfo(): Promise<MutedInfo>;
    getMetaData(keys: string[]): Promise<MetaData>;
    getAllMetaData(): Promise<MetaData>;
    createMetaData(data: MetaData): Promise<MetaData>;
    updateMetaData(data: MetaData, upsert?: boolean): Promise<MetaData>;
    deleteMetaData(key: string): Promise<void>;
    deleteAllMetaData(): Promise<void>;
    getMetaCounters(keys: string[]): Promise<MetaCounter>;
    getAllMetaCounters(): Promise<MetaCounter>;
    createMetaCounters(data: MetaCounter): Promise<MetaCounter>;
    updateMetaCounters(data: MetaCounter, upsert?: boolean): Promise<MetaCounter>;
    increaseMetaCounters(data: MetaCounter): Promise<MetaCounter>;
    decreaseMetaCounters(data: MetaCounter): Promise<MetaCounter>;
    deleteMetaCounter(key: string): Promise<void>;
    deleteAllMetaCounters(): Promise<void>;
    muteUser(user: User, duration?: number, description?: string): Promise<void>;
    muteUserWithUserId(userId: string, duration?: number, description?: string): Promise<void>;
    unmuteUser(user: User): Promise<void>;
    unmuteUserWithUserId(userId: string): Promise<void>;
    banUser(user: User, duration?: number, description?: string): Promise<void>;
    banUserWithUserId(userId: string, duration?: number, description?: string): Promise<void>;
    unbanUser(user: User): Promise<void>;
    unbanUserWithUserId(userId: string): Promise<void>;
    freeze(): Promise<void>;
    unfreeze(): Promise<void>;
    getMessagesByTimestamp(ts: number, params: MessageListParams): Promise<BaseMessage[]>;
    getMessageChangeLogsSinceTimestamp(ts: number, params: MessageChangeLogsParams): Promise<MessageChangelogs>;
    getMessageChangeLogsSinceToken(token: string, params: MessageChangeLogsParams): Promise<MessageChangelogs>;
    private _createPendingSendableMessagePayload;
    private _createPendingUserMessage;
    private _createPendingFileMessage;
    private _markMessageAsFailed;
    sendUserMessage(params: UserMessageParams): MessageRequestHandler;
    resendUserMessage(failedMessage: UserMessage): Promise<UserMessage>;
    updateUserMessage(messageId: number, params: UserMessageUpdateParams): Promise<UserMessage>;
    copyUserMessage(targetChannel: BaseChannel, message: UserMessage): Promise<UserMessage>;
    translateUserMessage(targetMessage: UserMessage, languages: string[]): Promise<UserMessage>;
    sendFileMessage(params: FileMessageParams): MessageRequestHandler;
    sendFileMessages(paramsList: FileMessageParams[]): MessageRequestHandler;
    resendFileMessage(failedMessage: FileMessage, blob: Blob): Promise<FileMessage>;
    updateFileMessage(messageId: number, params: FileMessageUpdateParams): Promise<FileMessage>;
    cancelUploadingFileMessage(requestId: string): Promise<boolean>;
    copyFileMessage(targetChannel: BaseChannel, message: FileMessage): Promise<FileMessage>;
    deleteMessage(message: SendableMessage): Promise<void>;
    addReaction(message: BaseMessage, key: string): Promise<ReactionEvent>;
    deleteReaction(message: BaseMessage, key: string): Promise<ReactionEvent>;
    _updateMessageMetaArray(messageId: number, metaArrays: MessageMetaArray[], mode: "add" | "remove", upsert: boolean): Promise<BaseMessage>;
    createMessageMetaArrayKeys(message: SendableMessage, keys: string[]): Promise<BaseMessage>;
    deleteMessageMetaArrayKeys(message: SendableMessage, keys: string[]): Promise<BaseMessage>;
    addMessageMetaArrayValues(message: SendableMessage, metaArrays: MessageMetaArray[]): Promise<BaseMessage>;
    removeMessageMetaArrayValues(message: SendableMessage, metaArrays: MessageMetaArray[]): Promise<BaseMessage>;
    report(category: ReportCategory, description: string): Promise<void>;
    reportUser(user: User, category: ReportCategory, description: string): Promise<void>;
    reportMessage(message: SendableMessage, category: ReportCategory, description: string): Promise<void>;
}

export declare abstract class BaseChannelHandlerParams {
    onUserMuted?: (channel: BaseChannel, user: RestrictedUser) => void;
    onUserUnmuted?: (channel: BaseChannel, user: User) => void;
    onUserBanned?: (channel: BaseChannel, user: RestrictedUser) => void;
    onUserUnbanned?: (channel: BaseChannel, user: User) => void;
    onChannelChanged?: (channel: BaseChannel) => void;
    onChannelDeleted?: (channelUrl: string, channelType: ChannelType) => void;
    onChannelFrozen?: (channel: BaseChannel) => void;
    onChannelUnfrozen?: (channel: BaseChannel) => void;
    onOperatorUpdated?: (channel: BaseChannel, users: User[]) => void;
    onChannelMemberCountChanged?: (channels: BaseChannel[]) => void;
    onMetaDataCreated?: (channel: BaseChannel, metaData: MetaData) => void;
    onMetaDataUpdated?: (channel: BaseChannel, metaData: MetaData) => void;
    onMetaDataDeleted?: (channel: BaseChannel, metaDataKeys: string[]) => void;
    onMetaCounterCreated?: (channel: BaseChannel, metaCounter: MetaCounter) => void;
    onMetaCounterUpdated?: (channel: BaseChannel, metaCounter: MetaCounter) => void;
    onMetaCounterDeleted?: (channel: BaseChannel, metaCounterKeys: string[]) => void;
    onMessageReceived?: (channel: BaseChannel, message: BaseMessage) => void;
    onMessageUpdated?: (channel: BaseChannel, message: BaseMessage) => void;
    onMessageDeleted?: (channel: BaseChannel, messageId: number) => void;
    onMentionReceived?: (channel: BaseChannel, message: BaseMessage) => void;
    onReactionUpdated?: (channel: BaseChannel, reactionEvent: ReactionEvent) => void;
    onThreadInfoUpdated?: (channel: BaseChannel, threadInfoUpdateEvent: ThreadInfoUpdateEvent) => void;
}

export declare interface BaseChannelPayload extends InstancedObjectPayload {
    "channel_url": string;
    "name"?: string;
    "cover_url"?: string;
    "custom_type"?: string;
    "data"?: string;
    "freeze"?: boolean;
    "is_ephemeral"?: boolean;
    "metadata"?: object;
    "ts"?: number;
    "created_by"?: UserPayload;
    "created_at": number;
}

export declare class BaseMessageParamsProperties {
    data?: string;
    customType?: string;
    mentionType?: MentionType;
    mentionedUserIds?: string[];
    metaArrays?: MessageMetaArray[];
    parentMessageId?: number;
    isReplyToChannel?: boolean;
    pushNotificationDeliveryOption?: PushNotificationDeliveryOption;
    appleCriticalAlertOptions?: AppleCriticalAlertOptions;
}

export declare class BaseMessageUpdateParamsProperties {
    data?: string;
    customType?: string;
    mentionType?: MentionType;
    mentionedUserIds?: string[];
    appleCriticalAlertOptions?: AppleCriticalAlertOptions;
}

export declare type FailedMessageHandler = (err: Error, message: SendableMessage) => void;

export declare class FileMessageParams extends FileMessageParamsProperties {
    constructor(props?: FileMessageParamsProperties);
    get fileUrl(): string;
    set fileUrl(value: string);
    static fromFailedFileMessage(failedMessage: FileMessage, blob: Blob): FileMessageParams;
    validate(): boolean;
}

export declare class FileMessageParamsProperties extends BaseMessageParamsProperties {
    file: FileParams;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnailSizes?: ThumbnailSize[];
}

export declare class FileMessageUpdateParams extends FileMessageUpdateParamsProperties {
    constructor(props?: FileMessageUpdateParamsProperties);
    validate(): boolean;
}

export declare class FileMessageUpdateParamsProperties extends BaseMessageUpdateParamsProperties {
}

export declare type FileParams = FileCompat | string;

export declare interface MessageChangelogs {
    updatedMessages: BaseMessage[];
    deletedMessageIds: number[];
    hasMore: boolean;
    token: string;
}

export declare class MessageChangeLogsParams extends MessageChangeLogsParamsProperties {
    constructor(props?: MessageChangeLogsParamsProperties);
    validate(): boolean;
}

export declare class MessageChangeLogsParamsProperties {
    replyType?: ReplyType;
    includeReactions?: boolean;
    includeReplies?: boolean;
    includeThreadInfo?: boolean;
    includeMetaArray?: boolean;
    includeParentMessageInfo?: boolean;
    includePollDetails?: boolean;
}

export declare type MessageHandler = (message: SendableMessage) => void;

export declare class MessageListParams extends MessageListParamsProperties {
    constructor(props?: MessageListParamsProperties);
    validate(): boolean;
}

export declare class MessageListParamsProperties {
    prevResultSize: number;
    nextResultSize: number;
    isInclusive?: boolean;
    reverse?: boolean;
    messageTypeFilter?: MessageTypeFilter;
    customTypesFilter?: string[];
    senderUserIdsFilter?: string[];
    replyType?: ReplyType;
    includeReactions?: boolean;
    includeReplies?: boolean;
    includeMetaArray?: boolean;
    includeParentMessageInfo?: boolean;
    includeThreadInfo?: boolean;
    showSubchannelMessagesOnly?: boolean;
}

export declare class MessageRequestHandler {
    private _onPending;
    private _onFailed;
    private _onSucceeded;
    trigger(err: Error, message: SendableMessage): void;
    onPending(handler: MessageHandler): MessageRequestHandler;
    onFailed(handler: FailedMessageHandler): MessageRequestHandler;
    onSucceeded(handler: MessageHandler): MessageRequestHandler;
}

export declare interface MutedInfo {
    isMuted: boolean;
    startAt: number;
    endAt: number;
    remainingDuration: number;
    description: string;
}

export declare class PreviousMessageListQuery extends ChannelDataListQuery {
    readonly reverse: boolean;
    readonly messageTypeFilter: MessageTypeFilter;
    readonly customTypesFilter: string[];
    readonly senderUserIdsFilter: string[];
    readonly includeMetaArray: boolean;
    readonly includeReactions: boolean;
    readonly includeReplies: boolean;
    readonly includeParentMessageInfo: boolean;
    readonly includeThreadInfo: boolean;
    readonly showSubchannelMessagesOnly: boolean;
    private _edge;
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: PreviousMessageListQueryParams);
    protected _validate(): boolean;
    load(): Promise<BaseMessage[]>;
}

export declare interface PreviousMessageListQueryParams extends ChannelDataListQueryParams {
    reverse?: boolean;
    messageTypeFilter?: MessageTypeFilter;
    customTypesFilter?: string[];
    senderUserIdsFilter?: string[];
    includeMetaArray?: boolean;
    includeReactions?: boolean;
    includeReplies?: boolean;
    includeParentMessageInfo?: boolean;
    includeThreadInfo?: boolean;
    showSubchannelMessagesOnly?: boolean;
}

export declare enum PushNotificationDeliveryOption {
    DEFAULT = "default",
    SUPPRESS = "suppress"
}

export declare enum ReplyType {
    ALL = "all",
    NONE = "none",
    ONLY_REPLY_TO_CHANNEL = "only_reply_to_channel"
}

export declare interface Schedule {
    year: number;
    month: number;
    day: number;
    hour?: number;
    min?: number;
    timezone?: string;
}

export declare enum ScheduledStatus {
    SCHEDULED = "scheduled",
    SENT = "sent",
    CANCELED = "canceled",
    FAILED = "failed"
}

export declare class ScheduledUserMessage extends InstancedObject {
    scheduleId: number;
    scheduledDateTimeString: string;
    scheduledTimezone: string;
    status: ScheduledStatus;
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    readonly messageType: MessageType;
    readonly sender: Sender;
    message: string;
    customType: string;
    data: string;
    mentionType: MentionType;
    mentionedUsers: User[];
    metaArrays: MessageMetaArray[];
    translationTargetLanguages: string[];
    appleCriticalAlertOptions: AppleCriticalAlertOptions;
    pushNotificationDeliveryOption: PushNotificationDeliveryOption;
    createdAt: number;
    updatedAt: number;
    errorCode: number;
    errorMessage: string;
    constructor(_iid: string, payload: ScheduledUserMessagePayload);
}

export declare class ScheduledUserMessageParams extends ScheduledUserMessageParamsProperties {
    private _scheduledDateTimeString;
    constructor(props?: ScheduledUserMessageParamsProperties);
    get scheduledDateTimeString(): string;
    set scheduledDateTimeString(value: string);
    setSchedule(schedule: Schedule): void;
    validate(): boolean;
}

export declare class ScheduledUserMessageParamsProperties extends UserMessageParamsProperties {
    year: number;
    month: number;
    day: number;
    hour?: number;
    min?: number;
    timezone?: string;
}

export declare interface ScheduledUserMessagePayload extends InstancedObjectPayload {
    "scheduled_id": number;
    "scheduled_dt"?: string;
    "scheduled_utc_dt"?: string;
    "scheduled_timezone"?: string;
    "status"?: string;
    "channel_url": string;
    "channel_type": string;
    "user": SenderPayload;
    "message": string;
    "custom_type"?: string;
    "data"?: string;
    "mention_type"?: string;
    "mentioned_users"?: UserPayload[];
    "metaarray"?: object;
    "metaarray_key_order"?: string[];
    "translation_target_langs"?: string[];
    "push_option"?: PushNotificationDeliveryOption;
    "apple_critical_alert_options"?: AppleCriticalAlertOptionsPayload;
    "error"?: {
        "code": number;
        "message": string;
    };
    "created_at": number;
    "updated_at": number;
}

export declare class UserMessageParams extends UserMessageParamsProperties {
    constructor(props?: UserMessageParamsProperties);
    static fromFailedUserMessage(failedMessage: UserMessage): UserMessageParams;
    validate(): boolean;
}

export declare class UserMessageParamsProperties extends BaseMessageParamsProperties {
    message: string;
    translationTargetLanguages?: string[];
}

export declare class UserMessageUpdateParams extends UserMessageUpdateParamsProperties {
    constructor(props?: UserMessageUpdateParamsProperties);
    validate(): boolean;
}

export declare class UserMessageUpdateParamsProperties extends BaseMessageUpdateParamsProperties {
    message?: string;
}