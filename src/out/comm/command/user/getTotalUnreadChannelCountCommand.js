"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTotalUnreadChannelCountResponseCommand = exports.GetTotalUnreadChannelCountRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetTotalUnreadChannelCountRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/unread_channel_count`;
    }
}
exports.GetTotalUnreadChannelCountRequestCommand = GetTotalUnreadChannelCountRequestCommand;
class GetTotalUnreadChannelCountResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.unreadCount = payload.unread_count;
    }
}
exports.GetTotalUnreadChannelCountResponseCommand = GetTotalUnreadChannelCountResponseCommand;
//# sourceMappingURL=getTotalUnreadChannelCountCommand.js.map