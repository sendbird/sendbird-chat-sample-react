"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMessageEventCommand = exports.DeleteMessageResponseCommand = exports.DeleteMessageRequestCommand = void 0;
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const utils_1 = require("../utils");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
class DeleteMessageRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(params.channelType)}/${params.channelUrl}/messages/${params.messageId}`;
    }
}
exports.DeleteMessageRequestCommand = DeleteMessageRequestCommand;
class DeleteMessageResponseCommand extends apiResponseCommand_1.default {
}
exports.DeleteMessageResponseCommand = DeleteMessageResponseCommand;
class DeleteMessageEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'DELM', payload);
        this.channelUrl = payload.channel_url;
        this.channelType = payload.channel_type;
        this.messageId = Number(payload.msg_id);
    }
}
exports.DeleteMessageEventCommand = DeleteMessageEventCommand;
//# sourceMappingURL=deleteMessageCommand.js.map