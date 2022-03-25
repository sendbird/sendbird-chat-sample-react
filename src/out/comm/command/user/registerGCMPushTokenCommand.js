"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterGCMPushTokenResponseCommand = exports.RegisterGCMPushTokenRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const user_1 = require("../../../model/user");
const types_1 = require("../../../types");
class RegisterGCMPushTokenRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, token }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push/gcm`;
        this.params = {
            gcm_reg_token: token,
            always_push: true,
        };
    }
}
exports.RegisterGCMPushTokenRequestCommand = RegisterGCMPushTokenRequestCommand;
class RegisterGCMPushTokenResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = payload.token;
        this.type = payload.type ? types_1.PushTokenType[payload.type.toLowerCase()] : types_1.PushTokenType.UNKNOWN;
        this.user = new user_1.default(_iid, Object.assign({}, payload.user));
    }
}
exports.RegisterGCMPushTokenResponseCommand = RegisterGCMPushTokenResponseCommand;
//# sourceMappingURL=registerGCMPushTokenCommand.js.map