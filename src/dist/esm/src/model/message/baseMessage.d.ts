import InstancedObject, { InstancedObjectPayload } from '../instancedObject';
import User, { UserPayload } from '../user';
import { MentionType, MessageType } from './types';
import ThreadInfo, { ThreadInfoPayload } from './threadInfo';
import Reaction, { ReactionPayload } from './reaction';
import MessageMetaArray, { MessageMetaArrayPayload } from './messageMetaArray';
import OGMetaData, { OGMetaDataPayload } from './ogMetaData';
import AppleCriticalAlertOptions, { AppleCriticalAlertOptionsPayload } from './appleCriticalAlertOptions';
import { ChannelType } from '../channel/types';
import ReactionEvent from '../event/reactionEvent';
import ThreadInfoUpdateEvent from '../event/threadInfoUpdateEvent';
/**
 * @internal
 */
export interface BaseMessagePayload extends InstancedObjectPayload {
    'type': string;
    'channel_url'?: string;
    'channel_type'?: string;
    'channel'?: {
        'channel_url': string;
        'channelType': string;
    };
    'msg_id'?: number;
    'message_id'?: number;
    'parent_message_id'?: number;
    'data'?: string;
    'custom_type'?: string;
    'mention_type'?: string;
    'mentioned_users'?: UserPayload[];
    'thread_info'?: ThreadInfoPayload;
    'reactions'?: ReactionPayload[];
    'metaarray'?: object;
    'metaarray_key_order'?: string[];
    'sorted_metaarray'?: MessageMetaArrayPayload[];
    'og_tag'?: OGMetaDataPayload;
    'silent'?: boolean;
    'is_op_msg'?: boolean;
    'apple_critical_alert_options'?: AppleCriticalAlertOptionsPayload;
    'ts'?: number;
    'created_at'?: number;
    'updated_at'?: number;
}
/**
 * @internal
 */
export declare const messageTypeToPayloadType: (messageType: MessageType) => string;
export default class BaseMessage extends InstancedObject {
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
    /**
     * @private
     */
    constructor(_iid: string, payload: BaseMessagePayload);
    /**
     * @private
     */
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
