"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnregisterFCMPushTokenResponseCommand = exports.UnregisterFCMPushTokenRequestCommand = void 0;
const user_1 = require("../../../model/user");
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
class UnregisterFCMPushTokenRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, token }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push/gcm/${encodeURIComponent(token)}`;
    }
}
exports.UnregisterFCMPushTokenRequestCommand = UnregisterFCMPushTokenRequestCommand;
class UnregisterFCMPushTokenResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = payload.token;
        this.user = new user_1.default(_iid, payload.user);
    }
}
exports.UnregisterFCMPushTokenResponseCommand = UnregisterFCMPushTokenResponseCommand;
//# sourceMappingURL=unregisterFCMPushTokenCommand.js.map