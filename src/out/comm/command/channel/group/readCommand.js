"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadEventCommand = exports.ReadRequestCommand = void 0;
const websocketEventCommand_1 = require("../../../../core/command/websocket/websocketEventCommand");
const websocketRequestCommand_1 = require("../../../../core/command/websocket/websocketRequestCommand");
const readStatus_1 = require("../../../../model/channel/readStatus");
class ReadRequestCommand extends websocketRequestCommand_1.default {
    constructor({ channelUrl }) {
        super({
            code: 'READ',
            ackRequired: true,
            payload: {
                channel_url: channelUrl,
            }
        });
    }
}
exports.ReadRequestCommand = ReadRequestCommand;
class ReadEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'READ', payload);
        this.readStatus = new readStatus_1.default(_iid, payload);
    }
}
exports.ReadEventCommand = ReadEventCommand;
//# sourceMappingURL=readCommand.js.map