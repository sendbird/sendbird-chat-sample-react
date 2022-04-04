import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import { ChannelType } from '../model/channel/types';
export interface ChannelDataListQueryParams extends BaseListQueryParams {
}
export default abstract class ChannelDataListQuery extends BaseListQuery {
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: ChannelDataListQueryParams);
    protected _validate(): boolean;
}
