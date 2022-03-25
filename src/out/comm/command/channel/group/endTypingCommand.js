"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndTypingEventCommand = exports.EndTypingRequestCommand = void 0;
const user_1 = require("../../../../model/user");
const websocketEventCommand_1 = require("../../../../core/command/websocket/websocketEventCommand");
const websocketRequestCommand_1 = require("../../../../core/command/websocket/websocketRequestCommand");
class EndTypingRequestCommand extends websocketRequestCommand_1.default {
    constructor({ channelUrl, time }) {
        super({
            code: 'TPEN',
            ackRequired: false,
            payload: {
                channel_url: channelUrl,
                time,
            },
        });
    }
}
exports.EndTypingRequestCommand = EndTypingRequestCommand;
class EndTypingEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.user = new user_1.default(_iid, payload.data);
    }
}
exports.EndTypingEventCommand = EndTypingEventCommand;
//# sourceMappingURL=endTypingCommand.js.map