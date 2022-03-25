"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMessageEventCommand = void 0;
const vault_1 = require("../../../vault");
const adminMessage_1 = require("../../../model/message/adminMessage");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const utils_1 = require("../utils");
class AdminMessageEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        var _a;
        super(_iid, 'ADMM', payload);
        this.message = new adminMessage_1.default(_iid, payload);
        const { sdkState } = vault_1.default.of(_iid);
        this.isMentioned = (0, utils_1.checkIfMentioned)(this.message.mentionType, this.message.mentionedUsers.map((user) => user.userId), sdkState.userId);
        this.forceUpdateLastMessage = (_a = payload.force_update_last_message) !== null && _a !== void 0 ? _a : false;
    }
}
exports.AdminMessageEventCommand = AdminMessageEventCommand;
//# sourceMappingURL=adminMessageCommand.js.map