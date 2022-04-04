import ChannelDataListQuery, { ChannelDataListQueryParams } from './channelDataListQuery';
import { ChannelType } from '../model/channel/types';
import RestrictedUser from '../model/restrictedUser';
export interface MutedUserListQueryParams extends ChannelDataListQueryParams {
}
export default class MutedUserListQuery extends ChannelDataListQuery {
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, channelType: ChannelType, params: MutedUserListQueryParams);
    next(): Promise<RestrictedUser[]>;
}
