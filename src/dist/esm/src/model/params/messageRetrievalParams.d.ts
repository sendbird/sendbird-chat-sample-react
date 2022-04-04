import { ChannelType } from '../channel/types';
export declare class MessageRetrievalParamsProperties {
    channelUrl: string;
    channelType: ChannelType;
    messageId: number;
    includeReactions?: boolean;
    includeMetaArray?: boolean;
    includeParentMessageInfo?: boolean;
    includeThreadInfo?: boolean;
    includePollDetails?: boolean;
}
export default class MessageRetrievalParams extends MessageRetrievalParamsProperties {
    constructor(props?: MessageRetrievalParamsProperties);
    validate(): boolean;
}
