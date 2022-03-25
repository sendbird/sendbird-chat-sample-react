"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../../../core/command/baseCommand");
class SubscribedUnreadMessageCountUpdateCommand extends baseCommand_1.default {
    constructor({ all, custom_types, ts }) {
        super();
        this.all = all;
        this.customTypes = custom_types;
        this.ts = ts;
    }
}
exports.default = SubscribedUnreadMessageCountUpdateCommand;
//# sourceMappingURL=subscribedUnreadMessageCountUpdateCommand.js.map