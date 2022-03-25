"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteUserEventCommand = exports.MuteUserResponseCommand = exports.MuteUserRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const restrictedUser_1 = require("../../../model/restrictedUser");
const utils_1 = require("../utils");
class MuteUserRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, userId, seconds, description, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/mute`;
        this.params = {
            user_id: userId,
            seconds,
            description,
        };
    }
}
exports.MuteUserRequestCommand = MuteUserRequestCommand;
class MuteUserResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.MuteUserResponseCommand = MuteUserResponseCommand;
class MuteUserEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.user = new restrictedUser_1.default(_iid, payload.data);
    }
}
exports.MuteUserEventCommand = MuteUserEventCommand;
//# sourceMappingURL=muteUserCommand.js.map