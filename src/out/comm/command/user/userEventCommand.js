"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEventCommand = void 0;
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const userEvent_1 = require("../../event/userEvent");
class UserEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'USEV', payload);
        this.event = new userEvent_1.default(payload);
    }
}
exports.UserEventCommand = UserEventCommand;
//# sourceMappingURL=userEventCommand.js.map