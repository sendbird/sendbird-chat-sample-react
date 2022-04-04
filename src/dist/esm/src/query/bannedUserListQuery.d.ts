import ChannelDataListQuery, { ChannelDataListQueryParams } from './channelDataListQuery';
import RestrictedUser from '../model/restrictedUser';
import { ChannelType } from '../model/channel/types';
export interface BannedUserListQueryParams extends ChannelDataListQueryParams {
}
export default class BannedUserListQuery extends ChannelDataListQuery {
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: BannedUserListQueryParams);
    protected _validate(): boolean;
    next(): Promise<RestrictedUser[]>;
}
