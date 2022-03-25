"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocketRequestCommand_1 = require("./websocketRequestCommand");
class PingCommand extends websocketRequestCommand_1.default {
    constructor() {
        super({
            code: 'PING',
            payload: {
                id: Date.now(),
                active: 1,
            },
            ackRequired: false,
        });
    }
}
exports.default = PingCommand;
//# sourceMappingURL=pingCommand.js.map