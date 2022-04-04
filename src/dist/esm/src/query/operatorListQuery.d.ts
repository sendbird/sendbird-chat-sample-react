import User from '../model/user';
import { ChannelType } from '../model/channel/types';
import ChannelDataListQuery, { ChannelDataListQueryParams } from './channelDataListQuery';
export interface OperatorListQueryParams extends ChannelDataListQueryParams {
}
export default class OperatorListQuery extends ChannelDataListQuery {
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: OperatorListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}
