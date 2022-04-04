import { MessageTypeFilter, ReplyType } from '../message/types';
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
export default class MessageListParams extends MessageListParamsProperties {
    constructor(props?: MessageListParamsProperties);
    validate(): boolean;
}
