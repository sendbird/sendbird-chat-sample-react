"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlockedUsersResponseCommand = exports.GetBlockedUsersRequestCommand = void 0;
const user_1 = require("../../../model/user");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
const deundefined_1 = require("../../../utils/deundefined");
class GetBlockedUsersRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, limit, token, userIdsFilter }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${userId}/block`;
        this.params = (0, deundefined_1.deundefined)({
            limit: limit,
            token: token,
            user_ids: userIdsFilter,
        });
    }
}
exports.GetBlockedUsersRequestCommand = GetBlockedUsersRequestCommand;
class GetBlockedUsersResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.users = payload.users.map((userPayload) => new user_1.default(_iid, userPayload));
        this.next = payload.next;
    }
}
exports.GetBlockedUsersResponseCommand = GetBlockedUsersResponseCommand;
//# sourceMappingURL=getBlockedUsersCommand.js.map