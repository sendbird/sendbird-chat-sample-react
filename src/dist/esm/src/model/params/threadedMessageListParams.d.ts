import { MessageTypeFilter } from '../message/types';
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
export default class ThreadedMessageListParams extends ThreadedMessageListParamsProperties {
    constructor(props?: ThreadedMessageListParamsProperties);
    validate(): boolean;
}
