"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionEventCommand = void 0;
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const reactionEvent_1 = require("../../../model/event/reactionEvent");
class ReactionEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'MRCT', payload);
        this.channelUrl = payload.channel_url;
        this.channelType = payload.channel_type;
        this.event = new reactionEvent_1.default(payload);
    }
}
exports.ReactionEventCommand = ReactionEventCommand;
//# sourceMappingURL=reactionCommand.js.map