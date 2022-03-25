"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFriendsResponseCommand = exports.AddFriendsRequestCommand = void 0;
const user_1 = require("../../../model/user");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class AddFriendsRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, userIds }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/friends`;
        this.params = {
            user_ids: userIds,
        };
    }
}
exports.AddFriendsRequestCommand = AddFriendsRequestCommand;
class AddFriendsResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.users = payload.users.map((userPayload) => new user_1.default(_iid, userPayload));
    }
}
exports.AddFriendsResponseCommand = AddFriendsResponseCommand;
//# sourceMappingURL=addFriendsCommand.js.map