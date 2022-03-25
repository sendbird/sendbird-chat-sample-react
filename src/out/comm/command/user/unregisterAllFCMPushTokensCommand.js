"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnregisterAllFCMPushTokensResponseCommand = exports.UnregisterAllFCMPushTokensRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const user_1 = require("../../../model/user");
const types_1 = require("../../../types");
class UnregisterAllFCMPushTokensRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push/gcm`;
    }
}
exports.UnregisterAllFCMPushTokensRequestCommand = UnregisterAllFCMPushTokensRequestCommand;
class UnregisterAllFCMPushTokensResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.type = payload.type ? types_1.PushTokenType[payload.type.toLowerCase()] : types_1.PushTokenType.UNKNOWN;
        this.user = new user_1.default(_iid, payload.user);
    }
}
exports.UnregisterAllFCMPushTokensResponseCommand = UnregisterAllFCMPushTokensResponseCommand;
//# sourceMappingURL=unregisterAllFCMPushTokensCommand.js.map