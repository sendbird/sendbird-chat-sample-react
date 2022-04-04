import InstancedObject, { InstancedObjectPayload } from '../instancedObject';
import User, { UserPayload } from '../user';
import MutedInfo from './mutedInfo';
import { ChannelType, MetaCounter, MetaData } from './types';
import BaseMessage from '../message/baseMessage';
import UserMessage from '../message/userMessage';
import FileMessage from '../message/fileMessage';
import SendableMessage from '../message/sendableMessage';
import MessageMetaArray from '../message/messageMetaArray';
import MessageChangelogs from '../message/messageChangelogs';
import MessageRequestHandler from '../message/messageRequestHandler';
import ReactionEvent from '../event/reactionEvent';
import UserMessageParams from '../params/userMessageParams';
import FileMessageParams from '../params/fileMessageParams';
import UserMessageUpdateParams from '../params/userMessageUpdateParams';
import FileMessageUpdateParams from '../params/fileMessageUpdateParams';
import MessageListParams from '../params/messageListParams';
import MessageChangeLogsParams from '../params/messageChangeLogsParams';
import OperatorListQuery, { OperatorListQueryParams } from '../../query/operatorListQuery';
import PreviousMessageListQuery, { PreviousMessageListQueryParams } from '../../query/previousMessageListQuery';
import MutedUserListQuery, { MutedUserListQueryParams } from '../../query/mutedUserListQuery';
import BannedUserListQuery, { BannedUserListQueryParams } from '../../query/bannedUserListQuery';
import { ReportCategory } from '../report';
/**
 * @internal
 */
export interface BaseChannelPayload extends InstancedObjectPayload {
    'channel_url': string;
    'name'?: string;
    'cover_url'?: string;
    'custom_type'?: string;
    'data'?: string;
    'freeze'?: boolean;
    'is_ephemeral'?: boolean;
    'metadata'?: object;
    'ts'?: number;
    'created_by'?: UserPayload;
    'created_at': number;
}
export default class BaseChannel extends InstancedObject {
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
    /**
     * @private
     */
    constructor(_iid: string, payload: BaseChannelPayload);
    /**
     * @private
     */
    static payloadify(obj: BaseChannel): BaseChannelPayload;
    get isGroupChannel(): boolean;
    get isOpenChannel(): boolean;
    get cachedMetaData(): object;
    /**
     * @private
     */
    _upsertCachedMetaData(metaData: object, ts: number): void;
    /**
     * @private
     */
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
    /**
     * @private
     */
    _updateMessageMetaArray(messageId: number, metaArrays: MessageMetaArray[], mode: 'add' | 'remove', upsert: boolean): Promise<BaseMessage>;
    createMessageMetaArrayKeys(message: SendableMessage, keys: string[]): Promise<BaseMessage>;
    deleteMessageMetaArrayKeys(message: SendableMessage, keys: string[]): Promise<BaseMessage>;
    addMessageMetaArrayValues(message: SendableMessage, metaArrays: MessageMetaArray[]): Promise<BaseMessage>;
    removeMessageMetaArrayValues(message: SendableMessage, metaArrays: MessageMetaArray[]): Promise<BaseMessage>;
    report(category: ReportCategory, description: string): Promise<void>;
    reportUser(user: User, category: ReportCategory, description: string): Promise<void>;
    reportMessage(message: SendableMessage, category: ReportCategory, description: string): Promise<void>;
}
