import { GroupChannelSearchFilter, GroupChannelUserIdsFilter, HiddenChannelFilter, MemberStateFilter, PublicChannelFilter, SuperChannelFilter, UnreadChannelFilter } from '../channel/groupChannelFilter';
import { GroupChannelListOrder } from '../../model/channel/groupChannelListOrder';
export default interface GroupChannelListParams {
    includeEmpty?: boolean;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    channelUrlsFilter?: string[];
    customTypesFilter?: string[];
    customTypeStartsWithFilter?: string;
    nicknameContainsFilter?: string;
    channelNameContainsFilter?: string;
    memberStateFilter?: MemberStateFilter;
    unreadChannelFilter?: UnreadChannelFilter;
    superChannelFilter?: SuperChannelFilter;
    publicChannelFilter?: PublicChannelFilter;
    hiddenChannelFilter?: HiddenChannelFilter;
    userIdsFilter?: GroupChannelUserIdsFilter;
    searchFilter?: GroupChannelSearchFilter;
    metadataKey?: string;
    metadataValues?: string[];
    metadataOrderKeyFilter?: string;
    metadataValueStartsWith?: string;
    order?: GroupChannelListOrder;
}
