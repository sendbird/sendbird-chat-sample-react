"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersResponseCommand = exports.GetUsersRequestCommand = void 0;
const user_1 = require("../../../model/user");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
const deundefined_1 = require("../../../utils/deundefined");
class GetUsersRequestCommand extends apiRequestCommand_1.default {
    constructor({ limit, token, userIdsFilter, metaDataKeyFilter, metaDataValuesFilter, nicknameStartsWithFilter, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = const_1.API_PATH_USERS;
        this.params = (0, deundefined_1.deundefined)({
            limit: limit,
            token: token,
            user_ids: userIdsFilter,
            metadatakey: metaDataKeyFilter,
            metadatavalues_in: metaDataValuesFilter,
            nickname_startswith: nicknameStartsWithFilter,
        });
    }
}
exports.GetUsersRequestCommand = GetUsersRequestCommand;
class GetUsersResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.users = payload.users.map((userPayload) => new user_1.default(_iid, userPayload));
        this.next = payload.next;
    }
}
exports.GetUsersResponseCommand = GetUsersResponseCommand;
//# sourceMappingURL=getUsersCommand.js.map