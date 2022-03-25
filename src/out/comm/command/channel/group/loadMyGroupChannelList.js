"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMyGroupChannelListResponseCommand = exports.LoadMyGroupChannelListRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
const deundefined_1 = require("../../../../utils/deundefined");
class LoadMyGroupChannelListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { userId, token, limit, order, includeEmpty, memberStateFilter, superChannelFilter, publicChannelFilter, unreadChannelFilter, nicknameContainsFilter, channelNameContainsFilter, channelUrlsFilter, customTypesFilter, customTypeStartsWithFilter, hiddenChannelFilter, metadataOrderKeyFilter, metadataKey, metadataValues, metadataValueStartsWith, includeFrozen, includeMetaData, searchFilter, userIdsFilter, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/my_group_channels`;
        this.params = (0, deundefined_1.deundefined)({
            token,
            limit,
            order,
            show_member: true,
            show_read_receipt: true,
            show_delivery_receipt: true,
            show_empty: includeEmpty,
            member_state_filter: memberStateFilter,
            super_mode: superChannelFilter,
            public_mode: publicChannelFilter,
            unread_filter: unreadChannelFilter,
            members_nickname_contains: nicknameContainsFilter,
            name_contains: channelNameContainsFilter,
            channel_urls: channelUrlsFilter,
            custom_types: customTypesFilter,
            custom_type_startswith: customTypeStartsWithFilter,
            hidden_mode: hiddenChannelFilter,
            metadata_order_key: metadataOrderKeyFilter,
            metadata_key: metadataKey,
            metadata_values: metadataValues,
            metadata_value_startswith: metadataValueStartsWith,
            show_frozen: includeFrozen,
            show_metadata: includeMetaData,
        });
        if (searchFilter.query && searchFilter.fields) {
            this.params.search_query = searchFilter.query;
            this.params.search_fields = searchFilter.fields;
        }
        if (userIdsFilter.userIds && userIdsFilter.userIds.length > 0) {
            if (!userIdsFilter.includeMode) {
                this.params.members_exactly_in = userIdsFilter.userIds;
            }
            else {
                this.params.members_include_in = userIdsFilter.userIds;
                this.params.query_type = userIdsFilter.queryType.toUpperCase();
            }
        }
    }
}
exports.LoadMyGroupChannelListRequestCommand = LoadMyGroupChannelListRequestCommand;
class LoadMyGroupChannelListResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = null;
        this.channels = [];
        this.ts = null;
        const { next, channels, ts } = payload;
        this.token = next;
        if (channels && channels.length > 0) {
            this.channels = channels.map((payload) => {
                payload.ts = ts;
                return new groupChannel_1.default(_iid, payload);
            });
        }
        this.ts = ts !== null && ts !== void 0 ? ts : null;
    }
}
exports.LoadMyGroupChannelListResponseCommand = LoadMyGroupChannelListResponseCommand;
//# sourceMappingURL=loadMyGroupChannelList.js.map