"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnregisterAllPushTokensResponseCommand = exports.UnregisterAllPushTokensRequestCommand = void 0;
const user_1 = require("../../../model/user");
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
class UnregisterAllPushTokensRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push`;
    }
}
exports.UnregisterAllPushTokensRequestCommand = UnregisterAllPushTokensRequestCommand;
class UnregisterAllPushTokensResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.user = new user_1.default(_iid, payload.user);
    }
}
exports.UnregisterAllPushTokensResponseCommand = UnregisterAllPushTokensResponseCommand;
//# sourceMappingURL=unregisterAllPushTokensCommand.js.map