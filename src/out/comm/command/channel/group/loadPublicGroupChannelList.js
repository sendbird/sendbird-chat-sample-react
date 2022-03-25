"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadPublicGroupChannelListResponseCommand = exports.LoadPublicGroupChannelListRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
const groupChannelFilter_1 = require("../../../../model/channel/groupChannelFilter");
const deundefined_1 = require("../../../../utils/deundefined");
class LoadPublicGroupChannelListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { token, limit, order, includeEmpty, membershipFilter, channelNameContainsFilter, channelUrlsFilter, customTypesFilter, customTypeStartsWithFilter, superChannelFilter, metadataOrderKeyFilter, metadataKey, metadataValues, metadataValueStartsWith, includeFrozen, includeMetaData, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = const_1.API_PATH_GROUP_CHANNELS;
        this.params = (0, deundefined_1.deundefined)({
            token,
            limit,
            order,
            show_member: true,
            show_read_receipt: true,
            show_delivery_receipt: true,
            show_empty: includeEmpty,
            public_mode: groupChannelFilter_1.PublicChannelFilter.PUBLIC,
            public_membership_mode: membershipFilter,
            name_contains: channelNameContainsFilter,
            channel_urls: channelUrlsFilter,
            custom_types: customTypesFilter,
            custom_type_startswith: customTypeStartsWithFilter,
            super_mode: superChannelFilter,
            metadata_order_key: metadataOrderKeyFilter,
            metadata_key: metadataKey,
            metadata_values: metadataValues,
            metadata_value_startswith: metadataValueStartsWith,
            show_frozen: includeFrozen,
            show_metadata: includeMetaData,
        });
    }
}
exports.LoadPublicGroupChannelListRequestCommand = LoadPublicGroupChannelListRequestCommand;
class LoadPublicGroupChannelListResponseCommand extends apiResponseCommand_1.default {
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
        this.ts = typeof ts === 'number' ? ts : null;
    }
}
exports.LoadPublicGroupChannelListResponseCommand = LoadPublicGroupChannelListResponseCommand;
//# sourceMappingURL=loadPublicGroupChannelList.js.map