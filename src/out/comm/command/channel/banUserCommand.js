"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanUserEventCommand = exports.BanUserResponseCommand = exports.BanUserRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const restrictedUser_1 = require("../../../model/restrictedUser");
const utils_1 = require("../utils");
const deundefined_1 = require("../../../utils/deundefined");
class BanUserRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, userId, seconds, description, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/ban`;
        this.params = (0, deundefined_1.deundefined)({
            user_id: userId,
            seconds,
            description,
        });
    }
}
exports.BanUserRequestCommand = BanUserRequestCommand;
class BanUserResponseCommand extends apiResponseCommand_1.default {
}
exports.BanUserResponseCommand = BanUserResponseCommand;
class BanUserEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.memberCount = null;
        this.joinedMemberCount = null;
        this.user = new restrictedUser_1.default(_iid, payload.data);
        if (payload.data.member_count)
            this.memberCount = payload.data.member_count;
        if (payload.data.joined_member_count)
            this.joinedMemberCount = payload.data.joined_member_count;
    }
}
exports.BanUserEventCommand = BanUserEventCommand;
//# sourceMappingURL=banUserCommand.js.map