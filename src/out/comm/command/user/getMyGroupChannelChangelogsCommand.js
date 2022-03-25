"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMyGroupChannelChangelogsResponseCommand = exports.GetMyGroupChannelChangelogsRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../model/channel/groupChannel");
const groupChannelChangeLogsParams_1 = require("../../../model/params/groupChannelChangeLogsParams");
const deundefined_1 = require("../../../utils/deundefined");
class GetMyGroupChannelChangelogsRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, ts, token, filter = new groupChannelChangeLogsParams_1.default(), }) {
        super();
        const { customTypes, includeEmpty, includeFrozen } = filter;
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/my_group_channels/changelogs`;
        this.params = (0, deundefined_1.deundefined)({
            show_delivery_receipt: true,
            show_member: true,
            show_read_receipt: true,
            change_ts: ts,
            token: token,
            custom_types: customTypes,
            show_empty: includeEmpty,
            show_frozen: includeFrozen,
        });
    }
}
exports.GetMyGroupChannelChangelogsRequestCommand = GetMyGroupChannelChangelogsRequestCommand;
class GetMyGroupChannelChangelogsResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.updatedChannels = payload.updated.map((groupChannelPayload) => new groupChannel_1.default(_iid, groupChannelPayload));
        this.deletedChannelUrls = payload.deleted;
        this.hasMore = payload.has_more;
        this.token = payload.next;
    }
}
exports.GetMyGroupChannelChangelogsResponseCommand = GetMyGroupChannelChangelogsResponseCommand;
//# sourceMappingURL=getMyGroupChannelChangelogsCommand.js.map