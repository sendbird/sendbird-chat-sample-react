"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAckCommand = void 0;
const websocketRequestCommand_1 = require("../../../core/command/websocket/websocketRequestCommand");
class MessageAckCommand extends websocketRequestCommand_1.default {
    constructor({ channelUrl, messageId }) {
        super({
            code: 'MACK',
            ackRequired: false,
            payload: {
                channel_url: channelUrl,
                msg_id: messageId,
            },
        });
    }
}
exports.MessageAckCommand = MessageAckCommand;
//# sourceMappingURL=messageAckCommand.js.map