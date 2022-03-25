"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTotalUnreadMessageCountResponseCommand = exports.GetTotalUnreadMessageCountRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const groupChannelFilter_1 = require("../../../model/channel/groupChannelFilter");
class GetTotalUnreadMessageCountRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, filter }) {
        super();
        const { channelCustomTypesFilter, superChannelFilter } = filter;
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/unread_message_count`;
        this.params = {
            super_mode: superChannelFilter !== null && superChannelFilter !== void 0 ? superChannelFilter : groupChannelFilter_1.SuperChannelFilter.ALL,
            custom_types: channelCustomTypesFilter,
        };
    }
}
exports.GetTotalUnreadMessageCountRequestCommand = GetTotalUnreadMessageCountRequestCommand;
class GetTotalUnreadMessageCountResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.unreadCount = payload.unread_count;
    }
}
exports.GetTotalUnreadMessageCountResponseCommand = GetTotalUnreadMessageCountResponseCommand;
//# sourceMappingURL=getTotalUnreadMessageCountCommand.js.map