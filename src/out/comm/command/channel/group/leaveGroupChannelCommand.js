"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveGroupChannelEventCommand = exports.LeaveGroupChannelResponseCommand = exports.LeaveGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const member_1 = require("../../../../model/channel/member");
const channelEventCommand_1 = require("../channelEventCommand");
;
class LeaveGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, userId, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/leave`;
        this.params = {
            user_id: userId,
        };
    }
}
exports.LeaveGroupChannelRequestCommand = LeaveGroupChannelRequestCommand;
class LeaveGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.LeaveGroupChannelResponseCommand = LeaveGroupChannelResponseCommand;
class LeaveGroupChannelEventCommand extends channelEventCommand_1.ChannelEventCommand {
    constructor(_iid, code, payload) {
        super(_iid, code, payload);
        const { member_count = null, joined_member_count = null, } = payload.data;
        this.memberCount = member_count;
        this.joinedMemberCount = joined_member_count;
        this.member = new member_1.default(this._iid, payload.data);
    }
}
exports.LeaveGroupChannelEventCommand = LeaveGroupChannelEventCommand;
//# sourceMappingURL=leaveGroupChannelCommand.js.map