"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbanUserEventCommand = exports.UnbanUserResponseCommand = exports.UnbanUserRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const restrictedUser_1 = require("../../../model/restrictedUser");
const utils_1 = require("../utils");
class UnbanUserRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, userId, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/ban/${encodeURIComponent(userId)}`;
    }
}
exports.UnbanUserRequestCommand = UnbanUserRequestCommand;
class UnbanUserResponseCommand extends apiResponseCommand_1.default {
}
exports.UnbanUserResponseCommand = UnbanUserResponseCommand;
class UnbanUserEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.user = new restrictedUser_1.default(_iid, payload.data);
    }
}
exports.UnbanUserEventCommand = UnbanUserEventCommand;
//# sourceMappingURL=unbanUserCommand.js.map