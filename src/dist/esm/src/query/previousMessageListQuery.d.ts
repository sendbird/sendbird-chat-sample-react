import { ChannelType } from '../model/channel/types';
import BaseMessage from '../model/message/baseMessage';
import { MessageTypeFilter } from '../model/message/types';
import ChannelDataListQuery, { ChannelDataListQueryParams } from './channelDataListQuery';
export interface PreviousMessageListQueryParams extends ChannelDataListQueryParams {
    reverse?: boolean;
    messageTypeFilter?: MessageTypeFilter;
    customTypesFilter?: string[];
    senderUserIdsFilter?: string[];
    includeMetaArray?: boolean;
    includeReactions?: boolean;
    includeReplies?: boolean;
    includeParentMessageInfo?: boolean;
    includeThreadInfo?: boolean;
    showSubchannelMessagesOnly?: boolean;
}
export default class PreviousMessageListQuery extends ChannelDataListQuery {
    readonly reverse: boolean;
    readonly messageTypeFilter: MessageTypeFilter;
    readonly customTypesFilter: string[];
    readonly senderUserIdsFilter: string[];
    readonly includeMetaArray: boolean;
    readonly includeReactions: boolean;
    readonly includeReplies: boolean;
    readonly includeParentMessageInfo: boolean;
    readonly includeThreadInfo: boolean;
    readonly showSubchannelMessagesOnly: boolean;
    private _edge;
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: PreviousMessageListQueryParams);
    protected _validate(): boolean;
    load(): Promise<BaseMessage[]>;
}
