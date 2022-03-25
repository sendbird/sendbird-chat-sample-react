"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocketEventCommand_1 = require("./websocketEventCommand");
class PongCommand extends websocketEventCommand_1.default {
    constructor() {
        super(null, 'PONG', {});
    }
}
exports.default = PongCommand;
//# sourceMappingURL=pongCommand.js.map