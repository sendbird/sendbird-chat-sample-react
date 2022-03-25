"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFriendChangeLogsByTokenResponseCommand = exports.GetFriendChangeLogsByTokenRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const user_1 = require("../../../model/user");
class GetFriendChangeLogsByTokenRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, token }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/friends/changelogs`;
        this.params = {
            token: token,
        };
    }
}
exports.GetFriendChangeLogsByTokenRequestCommand = GetFriendChangeLogsByTokenRequestCommand;
class GetFriendChangeLogsByTokenResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.changelogs = {
            addedUsers: payload.added.map((userPayload) => new user_1.default(_iid, userPayload)),
            updatedUsers: payload.updated.map((userPayload) => new user_1.default(_iid, userPayload)),
            deletedUserIds: payload.deleted,
            hasMore: payload.has_more,
            token: payload.next,
        };
    }
}
exports.GetFriendChangeLogsByTokenResponseCommand = GetFriendChangeLogsByTokenResponseCommand;
//# sourceMappingURL=getFriendChangeLogsCommand.js.map