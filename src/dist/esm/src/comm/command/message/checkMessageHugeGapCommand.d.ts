import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
import BaseMessage, { BaseMessagePayload } from '../../../model/message/baseMessage';
import { MessageTypeFilter } from '../../../model/message/types';
/**
 * @internal
 */
export interface CheckMessageHugeGapRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    prevStart: number;
    prevEnd: number;
    prevCount: number;
    nextStart: number;
    nextEnd: number;
    nextCount: number;
    messageType?: MessageTypeFilter;
    customTypes?: string[];
    senderUserIds?: string[];
    includeReactions?: boolean;
    includeMetaArray?: boolean;
    showSubchannelMessagesOnly?: boolean;
    threshold?: number;
}
/**
 * @internal
 */
export declare class CheckMessageHugeGapRequestCommand extends APIRequestCommand {
    constructor(params: CheckMessageHugeGapRequestCommandParams);
}
/**
 * @internal
 */
export interface CheckMessageHugeGapResponseCommandPayload extends APIResponseCommandPayload {
    is_huge_gap: boolean;
    prev_messages?: BaseMessagePayload[];
    prev_hasmore?: boolean;
    next_messages?: BaseMessagePayload[];
    next_hasmore?: boolean;
}
/**
 * @internal
 */
export declare class CheckMessageHugeGapResponseCommand extends APIResponseCommand {
    readonly isHugeGap: boolean;
    readonly prevMessages: BaseMessage[];
    readonly prevHasMore: boolean;
    readonly nextMessages: BaseMessage[];
    readonly nextHasmore: boolean;
    constructor(_iid: string, payload: CheckMessageHugeGapResponseCommandPayload);
}
