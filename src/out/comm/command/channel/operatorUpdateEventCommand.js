"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorUpdateEventCommand = void 0;
const user_1 = require("../../../model/user");
const channelEventCommand_1 = require("./channelEventCommand");
class OperatorUpdateEventCommand extends channelEventCommand_1.ChannelEventCommand {
    constructor(_iid, code, payload) {
        super(_iid, code, payload);
        const { operators = [], } = payload.data;
        this.operators = operators.map((payload) => new user_1.default(this._iid, payload));
    }
}
exports.OperatorUpdateEventCommand = OperatorUpdateEventCommand;
//# sourceMappingURL=operatorUpdateEventCommand.js.map