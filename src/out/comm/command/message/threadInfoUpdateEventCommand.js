"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadInfoUpdateEventCommand = void 0;
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const threadInfoUpdateEvent_1 = require("../../../model/event/threadInfoUpdateEvent");
class ThreadInfoUpdateEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'MTHD', payload);
        this.event = new threadInfoUpdateEvent_1.default(_iid, payload);
    }
}
exports.ThreadInfoUpdateEventCommand = ThreadInfoUpdateEventCommand;
//# sourceMappingURL=threadInfoUpdateEventCommand.js.map