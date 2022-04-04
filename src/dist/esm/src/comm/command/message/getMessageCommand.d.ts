import BaseMessage, { BaseMessagePayload } from '../../../model/message/baseMessage';
import { MessageRetrievalParamsProperties } from '../../../model/params/messageRetrievalParams';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetMessageRequestCommandParams extends MessageRetrievalParamsProperties {
}
interface GetMessageRequestCommandPayload {
    is_sdk: boolean;
    with_sorted_meta_array?: boolean;
    include_reactions?: boolean;
    include_thread_info?: boolean;
    include_parent_message_info?: boolean;
    include_poll_details?: boolean;
}
interface GetMessageResponseCommandPayload extends BaseMessagePayload {
}
/**
 * @internal
 */
export declare class GetMessageRequestCommand extends APIRequestCommand {
    params: GetMessageRequestCommandPayload;
    constructor({ channelType, channelUrl, messageId, includeMetaArray, includeReactions, includeThreadInfo, includeParentMessageInfo, includePollDetails, }: GetMessageRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMessageResponseCommand extends APIResponseCommand {
    message: BaseMessage;
    constructor(_iid: string, payload: GetMessageResponseCommandPayload);
}
export {};
