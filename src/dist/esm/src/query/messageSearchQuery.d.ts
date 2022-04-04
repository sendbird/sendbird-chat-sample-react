import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import BaseMessage from '../model/message/baseMessage';
export interface MessageSearchQueryParams extends BaseListQueryParams {
    keyword: string;
    reverse?: boolean;
    exactMatch?: boolean;
    channelUrl?: string;
    channelCustomType?: string;
    messageTimestampFrom?: number;
    messageTimestampTo?: number;
    order?: MessageSearchOrder;
    advancedQuery?: boolean;
    targetFields?: string[];
}
export declare enum MessageSearchOrder {
    SCORE = "score",
    TIMESTAMP = "ts"
}
export default class MessageSearchQuery extends BaseListQuery {
    readonly keyword: string;
    readonly reverse: boolean;
    readonly exactMatch: boolean;
    readonly channelUrl: string;
    readonly channelCustomType: string;
    readonly messageTimestampFrom: number;
    readonly messageTimestampTo: number;
    readonly order: MessageSearchOrder;
    readonly advancedQuery: boolean;
    readonly targetFields: string[];
    private _nextToken;
    /**
     * @private
     */
    constructor(iid: string, params: MessageSearchQueryParams);
    protected _validate(): boolean;
    next(): Promise<BaseMessage[]>;
}
