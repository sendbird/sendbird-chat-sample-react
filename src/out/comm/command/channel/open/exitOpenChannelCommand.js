"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitOpenChannelEventCommand = exports.ExitOpenChannelRequestCommand = void 0;
const websocketEventCommand_1 = require("../../../../core/command/websocket/websocketEventCommand");
const websocketRequestCommand_1 = require("../../../../core/command/websocket/websocketRequestCommand");
const user_1 = require("../../../../model/user");
class ExitOpenChannelRequestCommand extends websocketRequestCommand_1.default {
    constructor({ channelUrl }) {
        super({
            code: 'EXIT',
            payload: {
                channel_url: channelUrl,
            },
            ackRequired: true,
        });
    }
}
exports.ExitOpenChannelRequestCommand = ExitOpenChannelRequestCommand;
class ExitOpenChannelEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        var _a, _b;
        super(_iid, 'EXIT', payload);
        if (payload.data) {
            this.participantCount = (_a = payload.data.participant_count) !== null && _a !== void 0 ? _a : 0;
            this.user = new user_1.default(_iid, payload.data);
            this.ts = (_b = payload.data.edge_ts) !== null && _b !== void 0 ? _b : 0;
        }
    }
}
exports.ExitOpenChannelEventCommand = ExitOpenChannelEventCommand;
//# sourceMappingURL=exitOpenChannelCommand.js.map