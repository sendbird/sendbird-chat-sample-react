"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEventCommand = void 0;
const channelEvent_1 = require("../../event/channelEvent");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
class ChannelEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.event = new channelEvent_1.default(payload);
    }
}
exports.ChannelEventCommand = ChannelEventCommand;
//# sourceMappingURL=channelEventCommand.js.map