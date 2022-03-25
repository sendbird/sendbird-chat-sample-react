"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../../../core/command/baseCommand");
class DatabaseOpenCommand extends baseCommand_1.default {
    constructor(_iid, { userId }) {
        super();
        this._iid = _iid;
        this.userId = userId;
    }
}
exports.default = DatabaseOpenCommand;
//# sourceMappingURL=databaseOpenCommand.js.map