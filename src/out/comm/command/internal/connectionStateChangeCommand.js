"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../../../core/command/baseCommand");
class ConnectionStateChangeCommand extends baseCommand_1.default {
    constructor({ stateType }) {
        super();
        this.stateType = stateType;
    }
}
exports.default = ConnectionStateChangeCommand;
//# sourceMappingURL=connectionStateChangeCommand.js.map