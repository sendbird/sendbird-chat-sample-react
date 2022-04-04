import User from '../model/user';
import ChannelDataListQuery, { ChannelDataListQueryParams } from './channelDataListQuery';
export interface ParticipantListQueryParams extends ChannelDataListQueryParams {
}
export default class ParticipantListQuery extends ChannelDataListQuery {
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, params: ParticipantListQueryParams);
    protected _validate(): boolean;
    next(): Promise<User[]>;
}
