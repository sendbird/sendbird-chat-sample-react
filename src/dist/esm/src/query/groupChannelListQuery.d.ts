import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import GroupChannel from '../model/channel/groupChannel';
import { GroupChannelSearchFilter, GroupChannelUserIdsFilter, HiddenChannelFilter, MemberStateFilter, PublicChannelFilter, SuperChannelFilter, UnreadChannelFilter } from '../model/channel/groupChannelFilter';
import { GroupChannelListOrder } from '../model/channel/groupChannelListOrder';
import GroupChannelListParams from '../model/params/groupChannelListParams';
export interface GroupChannelListQueryParams extends BaseListQueryParams, GroupChannelListParams {
}
export default class GroupChannelListQuery extends BaseListQuery {
    readonly includeEmpty: boolean;
    readonly includeFrozen: boolean;
    readonly includeMetaData: boolean;
    readonly channelUrlsFilter: string[];
    readonly customTypesFilter: string[];
    readonly customTypeStartsWithFilter: string;
    readonly nicknameContainsFilter: string;
    readonly channelNameContainsFilter: string;
    readonly memberStateFilter: MemberStateFilter;
    readonly unreadChannelFilter: UnreadChannelFilter;
    readonly superChannelFilter: SuperChannelFilter;
    readonly publicChannelFilter: PublicChannelFilter;
    readonly hiddenChannelFilter: HiddenChannelFilter;
    readonly searchFilter: GroupChannelSearchFilter;
    readonly userIdsFilter: GroupChannelUserIdsFilter;
    readonly metadataKey: string;
    readonly metadataValues: string[];
    readonly metadataOrderKeyFilter: string;
    readonly metadataValueStartsWith: string;
    readonly order: GroupChannelListOrder;
    /**
     * @private
     */
    constructor(iid: string, params: GroupChannelListQueryParams);
    protected _validate(): boolean;
    serialize(): object;
    next(): Promise<GroupChannel[]>;
}
