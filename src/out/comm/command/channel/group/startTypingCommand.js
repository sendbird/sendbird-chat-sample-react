"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartTypingEventCommand = exports.StartTypingRequestCommand = void 0;
const user_1 = require("../../../../model/user");
const websocketEventCommand_1 = require("../../../../core/command/websocket/websocketEventCommand");
const websocketRequestCommand_1 = require("../../../../core/command/websocket/websocketRequestCommand");
class StartTypingRequestCommand extends websocketRequestCommand_1.default {
    constructor({ channelUrl, time }) {
        super({
            code: 'TPST',
            ackRequired: false,
            payload: {
                channel_url: channelUrl,
                time,
            },
        });
    }
}
exports.StartTypingRequestCommand = StartTypingRequestCommand;
class StartTypingEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.user = new user_1.default(_iid, payload.data);
    }
}
exports.StartTypingEventCommand = StartTypingEventCommand;
//# sourceMappingURL=startTypingCommand.js.map