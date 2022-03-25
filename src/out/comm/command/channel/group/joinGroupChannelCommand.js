"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGroupChannelEventCommand = exports.JoinGroupChannelResponseCommand = exports.JoinGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const channelEventCommand_1 = require("../channelEventCommand");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
const member_1 = require("../../../../model/channel/member");
;
class JoinGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, userId, accessCode, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/join`;
        this.params = {
            user_id: userId,
            access_code: accessCode,
        };
    }
}
exports.JoinGroupChannelRequestCommand = JoinGroupChannelRequestCommand;
class JoinGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = new groupChannel_1.default(_iid, payload);
    }
}
exports.JoinGroupChannelResponseCommand = JoinGroupChannelResponseCommand;
class JoinGroupChannelEventCommand extends channelEventCommand_1.ChannelEventCommand {
    constructor(_iid, code, payload) {
        super(_iid, code, payload);
        const { member_count = null, joined_member_count = null, users = null, } = payload.data;
        this.memberCount = member_count;
        this.joinedMemberCount = joined_member_count;
        this.members = Array.isArray(users) ?
            users.map((payload) => new member_1.default(_iid, payload)) :
            [new member_1.default(_iid, payload.data)];
    }
}
exports.JoinGroupChannelEventCommand = JoinGroupChannelEventCommand;
//# sourceMappingURL=joinGroupChannelCommand.js.map