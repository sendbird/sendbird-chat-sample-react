"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupChannelCountResponseCommand = exports.GetGroupChannelCountRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannelFilter_1 = require("../../../../model/channel/groupChannelFilter");
class GetGroupChannelCountRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, filter }) {
        super();
        const { memberStateFilter } = filter;
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/group_channel_count`;
        this.params = {
            state: memberStateFilter !== null && memberStateFilter !== void 0 ? memberStateFilter : groupChannelFilter_1.MemberStateFilter.ALL,
        };
    }
}
exports.GetGroupChannelCountRequestCommand = GetGroupChannelCountRequestCommand;
class GetGroupChannelCountResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.groupChannelCount = payload.group_channel_count;
    }
}
exports.GetGroupChannelCountResponseCommand = GetGroupChannelCountResponseCommand;
//# sourceMappingURL=groupChannelCountCommand.js.map