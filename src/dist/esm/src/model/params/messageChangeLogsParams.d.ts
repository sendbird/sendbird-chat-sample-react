import { ReplyType } from '../message/types';
export declare class MessageChangeLogsParamsProperties {
    replyType?: ReplyType;
    includeReactions?: boolean;
    includeReplies?: boolean;
    includeThreadInfo?: boolean;
    includeMetaArray?: boolean;
    includeParentMessageInfo?: boolean;
    includePollDetails?: boolean;
}
export default class MessageChangeLogsParams extends MessageChangeLogsParamsProperties {
    constructor(props?: MessageChangeLogsParamsProperties);
    validate(): boolean;
}
