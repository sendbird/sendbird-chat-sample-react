import GroupChannel from '../model/channel/groupChannel';
import { GroupChannelSearchField, GroupChannelSearchFilter, GroupChannelUserIdsFilter, HiddenChannelFilter, MemberStateFilter, PublicChannelFilter, QueryType, SuperChannelFilter, UnreadChannelFilter } from '../model/channel/groupChannelFilter';
export default class GroupChannelFilter {
    private _searchFilter;
    private _userIdsFilter;
    includeEmpty: boolean;
    nicknameContainsFilter: string;
    channelNameContainsFilter: string;
    memberStateFilter: MemberStateFilter;
    customTypesFilter: string[];
    channelUrlsFilter: string[];
    superChannelFilter: SuperChannelFilter;
    publicChannelFilter: PublicChannelFilter;
    customTypeStartsWithFilter: string;
    unreadChannelFilter: UnreadChannelFilter;
    hiddenChannelFilter: HiddenChannelFilter;
    includeFrozen: boolean;
    private _isFriend;
    get searchFilter(): GroupChannelSearchFilter;
    setSearchFilter(fields: GroupChannelSearchField[], query: string): void;
    get userIdsFilter(): GroupChannelUserIdsFilter;
    setUserIdsFilter(userIds: string[], includeMode: boolean, queryType?: QueryType): void;
    clone(): GroupChannelFilter;
    match(channel: GroupChannel, currentUserId: string): boolean;
}
