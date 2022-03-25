"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFriendsResponseCommand = exports.DeleteFriendsRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class DeleteFriendsRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, userIds }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/friends`;
        this.params = {
            user_ids: userIds,
        };
    }
}
exports.DeleteFriendsRequestCommand = DeleteFriendsRequestCommand;
class DeleteFriendsResponseCommand extends apiResponseCommand_1.default {
}
exports.DeleteFriendsResponseCommand = DeleteFriendsResponseCommand;
//# sourceMappingURL=deleteFriendsCommand.js.map