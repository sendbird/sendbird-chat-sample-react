import BaseListQuery, { BaseListQueryParams } from './baseListQuery';
import GroupChannel from '../model/channel/groupChannel';
import { SuperChannelFilter } from '../model/channel/groupChannelFilter';
import { PublicGroupChannelListOrder } from '../model/channel/groupChannelListOrder';
export interface PublicGroupChannelListQueryParams extends BaseListQueryParams {
    includeEmpty?: boolean;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    channelUrlsFilter?: string[];
    customTypesFilter?: string[];
    customTypeStartsWithFilter?: string;
    channelNameContainsFilter?: string;
    membershipFilter?: MembershipFilter;
    superChannelFilter?: SuperChannelFilter;
    metadataKey?: string;
    metadataValues?: string[];
    metadataOrderKeyFilter?: string;
    metadataValueStartsWith?: string;
    order?: PublicGroupChannelListOrder;
}
export declare enum MembershipFilter {
    ALL = "all",
    JOINED = "joined"
}
export default class PublicGroupChannelListQuery extends BaseListQuery {
    readonly includeEmpty: boolean;
    readonly includeFrozen: boolean;
    readonly includeMetaData: boolean;
    readonly channelUrlsFilter: string[];
    readonly customTypesFilter: string[];
    readonly customTypeStartsWithFilter: string;
    readonly nicknameContainsFilter: string;
    readonly channelNameContainsFilter: string;
    readonly membershipFilter: MembershipFilter;
    readonly superChannelFilter: SuperChannelFilter;
    readonly metadataKey: string;
    readonly metadataValues: string[];
    readonly metadataOrderKeyFilter: string;
    readonly metadataValueStartsWith: string;
    readonly order: PublicGroupChannelListOrder;
    /**
     * @private
     */
    constructor(iid: string, params: PublicGroupChannelListQueryParams);
    protected _validate(): boolean;
    next(): Promise<GroupChannel[]>;
}
