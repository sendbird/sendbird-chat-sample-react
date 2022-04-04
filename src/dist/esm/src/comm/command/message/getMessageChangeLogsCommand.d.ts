import { ChannelType } from '../../../model/channel/types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import BaseMessage, { BaseMessagePayload } from '../../../model/message/baseMessage';
import { MessageChangeLogsParamsProperties } from '../../../model/params/messageChangeLogsParams';
import { DeletedMessageInfo, DeletedMessagePayload, ReplyTypePayload } from '../types';
/**
 * @internal
 */
export interface GetMessageChangeLogsRequestCommandParams extends MessageChangeLogsParamsProperties {
    channelType: ChannelType;
    channelUrl: string;
    timestamp?: number;
    token?: string;
}
interface GetMessageChangeLogsRequestCommandPayload {
    change_ts?: number;
    token?: string;
    with_sorted_meta_array?: boolean;
    include_reactions?: boolean;
    include_thread_info?: boolean;
    include_reply_type?: ReplyTypePayload;
    include_parent_message_info?: boolean;
    include_poll_details?: boolean;
}
interface GetMessageChangeLogsResponseCommandPayload extends APIResponseCommandPayload {
    deleted: DeletedMessagePayload[];
    has_more: boolean;
    updated: BaseMessagePayload[];
    next: string;
}
/**
 * @internal
 */
export declare class GetMessageChangeLogsRequestCommand extends APIRequestCommand {
    params: GetMessageChangeLogsRequestCommandPayload;
    constructor({ channelType, channelUrl, timestamp, token, includeMetaArray, includeReactions, includeThreadInfo, replyType, includeParentMessageInfo, includePollDetails, }: GetMessageChangeLogsRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMessageChangeLogsResponseCommand extends APIResponseCommand {
    readonly updatedMessages: BaseMessage[];
    readonly deletedMessagesInfo: DeletedMessageInfo[];
    readonly hasMore: boolean;
    readonly nextToken: string;
    constructor(_iid: string, payload: GetMessageChangeLogsResponseCommandPayload);
}
export {};
