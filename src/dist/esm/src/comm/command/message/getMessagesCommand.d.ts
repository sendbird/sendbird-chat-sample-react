import { ChannelType } from '../../../model/channel/types';
import BaseMessage, { BaseMessagePayload } from '../../../model/message/baseMessage';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { MessageListParamsProperties } from '../../../model/params/messageListParams';
/**
 * @internal
 */
export interface GetMessagesRequestCommandParams extends MessageListParamsProperties {
    channelType: ChannelType;
    channelUrl: string;
    timestamp?: number;
    token?: string;
    parentMessageId?: number;
    includePollDetails?: boolean;
}
interface GetMessagesRequestCommandPayload {
    is_sdk: boolean;
    prev_limit: number;
    next_limit: number;
    include: boolean;
    reverse: boolean;
    message_ts?: number;
    message_id?: string;
    message_type?: string;
    custom_types?: string[];
    sender_ids?: string[];
    with_sorted_meta_array?: boolean;
    include_reactions?: boolean;
    parent_message_id?: number;
    include_thread_info?: boolean;
    include_reply_type?: string;
    include_parent_message_info?: boolean;
    show_subchannel_message_only?: boolean;
    include_poll_details?: boolean;
}
interface GetMessagesResponseCommandPayload extends APIResponseCommandPayload {
    messages: BaseMessagePayload[];
}
/**
 * @internal
 */
export declare class GetMessagesRequestCommand extends APIRequestCommand {
    params: GetMessagesRequestCommandPayload;
    constructor({ channelType, channelUrl, timestamp, token, prevResultSize, nextResultSize, isInclusive, reverse, messageTypeFilter, customTypesFilter, senderUserIdsFilter, includeMetaArray, includeReactions, parentMessageId, includeThreadInfo, replyType, includeParentMessageInfo, showSubchannelMessagesOnly, includePollDetails, }: GetMessagesRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMessagesResponseCommand extends APIResponseCommand {
    readonly messages: BaseMessage[];
    constructor(_iid: string, payload: GetMessagesResponseCommandPayload);
}
export {};
