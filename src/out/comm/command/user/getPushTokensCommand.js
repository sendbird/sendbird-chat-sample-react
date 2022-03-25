"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPushTokensResponseCommand = exports.GetPushTokensRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const types_1 = require("../../../types");
const const_1 = require("../const");
class GetPushTokensRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, type, token, ts }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push/${encodeURIComponent(type)}/device_tokens`;
        this.params = {
            created_ts: ts,
            token: token,
        };
    }
}
exports.GetPushTokensRequestCommand = GetPushTokensRequestCommand;
class GetPushTokensResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.pushTokens = {
            type: payload.type ? types_1.PushTokenType[payload.type.toLowerCase()] : types_1.PushTokenType.UNKNOWN,
            deviceTokens: payload.device_tokens,
            hasMore: payload.has_more,
            token: payload.token,
        };
    }
}
exports.GetPushTokensResponseCommand = GetPushTokensResponseCommand;
//# sourceMappingURL=getPushTokensCommand.js.map