"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFriendsResponseCommand = exports.GetFriendsRequestCommand = void 0;
const user_1 = require("../../../model/user");
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
class GetFriendsRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, limit, token }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/friends`;
        this.params = {
            limit: limit,
            token: token,
        };
    }
}
exports.GetFriendsRequestCommand = GetFriendsRequestCommand;
class GetFriendsResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.hasMore = payload.has_more;
        this.users = payload.users.map((userPayload) => new user_1.default(_iid, userPayload));
        this.next = payload.next;
    }
}
exports.GetFriendsResponseCommand = GetFriendsResponseCommand;
//# sourceMappingURL=getFriendsCommand.js.map