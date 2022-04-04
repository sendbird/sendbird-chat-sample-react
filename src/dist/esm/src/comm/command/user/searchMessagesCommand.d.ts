import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { BaseChannelPayload } from '../../../model/channel/baseChannel';
import BaseMessage, { BaseMessagePayload } from '../../../model/message/baseMessage';
import { MessageSearchOrder } from '../../../query/messageSearchQuery';
import { SortFieldPayload } from '../types';
/**
 * @internal
 */
export interface SearchMessagesRequestCommandParams {
    channelCustomType: string;
    keyword: string;
    limit: number;
    reverse: boolean;
    exactMatch?: boolean;
    channelUrl?: string;
    order?: MessageSearchOrder;
    messageTimestampFrom?: number;
    messageTimestampTo?: number;
    advancedQuery?: boolean;
    targetFields?: string[];
    nextToken?: string;
}
interface SearchMessagesRequestCommandPayload {
    custom_type: string;
    query: string;
    limit: number;
    reverse: boolean;
    exact_match?: boolean;
    channel_url?: string;
    sort_field?: SortFieldPayload;
    message_ts_from?: number;
    message_ts_to?: number;
    advanced_query?: boolean;
    target_fields?: string[];
    after?: string;
}
declare type BaseMessagePayloadWithChannel = BaseMessagePayload & {
    channel: BaseChannelPayload;
};
interface SearchMessagesResponseCommandPayload extends APIResponseCommandPayload {
    results: BaseMessagePayloadWithChannel[];
    has_next: boolean;
    end_cursor: string;
}
/**
 * @internal
 */
export declare class SearchMessagesRequestCommand extends APIRequestCommand {
    params: SearchMessagesRequestCommandPayload;
    constructor({ channelCustomType, keyword, limit, reverse, exactMatch, channelUrl, order, messageTimestampFrom, messageTimestampTo, advancedQuery, targetFields, nextToken, }: SearchMessagesRequestCommandParams);
}
/**
 * @internal
 */
export declare class SearchMessagesResponseCommand extends APIResponseCommand {
    readonly messages: BaseMessage[];
    readonly hasNext: boolean;
    readonly nextToken: string;
    constructor(_iid: string, payload: SearchMessagesResponseCommandPayload);
}
export {};
