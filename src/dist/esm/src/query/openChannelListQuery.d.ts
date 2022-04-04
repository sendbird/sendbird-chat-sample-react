import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import OpenChannel from '../model/channel/openChannel';
export interface OpenChannelListQueryParams extends BaseListQueryParams {
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    nameKeyword?: string;
    urlKeyword?: string;
    customTypes?: string[];
}
export default class OpenChannelListQuery extends BaseListQuery {
    readonly includeFrozen: boolean;
    readonly includeMetaData: boolean;
    readonly nameKeyword: string;
    readonly urlKeyword: string;
    readonly customTypes: string[];
    /**
     * @private
     */
    constructor(iid: string, params: OpenChannelListQueryParams);
    protected _validate(): boolean;
    next(): Promise<OpenChannel[]>;
}
