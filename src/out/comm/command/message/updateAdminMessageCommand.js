"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminMessageEventCommand = void 0;
const vault_1 = require("../../../vault");
const adminMessage_1 = require("../../../model/message/adminMessage");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const utils_1 = require("../utils");
class UpdateAdminMessageEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        var _a, _b, _c, _d;
        super(_iid, 'AEDI', payload);
        this.message = new adminMessage_1.default(_iid, payload);
        const { sdkState } = vault_1.default.of(_iid);
        this.mentionCountChange = (0, utils_1.calculateMentionCountChange)({
            mentionType: (_b = (_a = payload.old_values) === null || _a === void 0 ? void 0 : _a.mention_type) !== null && _b !== void 0 ? _b : null,
            mentionedUserIds: (_d = (_c = payload.old_values) === null || _c === void 0 ? void 0 : _c.mentioned_user_ids) !== null && _d !== void 0 ? _d : [],
        }, {
            mentionType: this.message.mentionType,
            mentionedUserIds: this.message.mentionedUsers.map((user) => user.userId),
        }, sdkState.userId);
    }
}
exports.UpdateAdminMessageEventCommand = UpdateAdminMessageEventCommand;
//# sourceMappingURL=updateAdminMessageCommand.js.map