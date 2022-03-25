"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUserResponseCommand = exports.BlockUserRequestCommand = void 0;
const user_1 = require("../../../model/user");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class BlockUserRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, blockedUserId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/block`;
        this.params = {
            target_id: blockedUserId,
        };
    }
}
exports.BlockUserRequestCommand = BlockUserRequestCommand;
class BlockUserResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.user = new user_1.default(_iid, payload);
    }
}
exports.BlockUserResponseCommand = BlockUserResponseCommand;
//# sourceMappingURL=blockUserCommand.js.map