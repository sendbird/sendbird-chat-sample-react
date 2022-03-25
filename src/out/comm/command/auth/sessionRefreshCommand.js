"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRefreshWebSocketResponseCommand = exports.SessionRefreshAPIResponseCommand = exports.SessionRefreshWebSocketCommand = exports.SessionRefreshAPICommand = void 0;
const error_1 = require("../../../error");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
const websocketRequestCommand_1 = require("../../../core/command/websocket/websocketRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
class SessionRefreshAPICommand extends apiRequestCommand_1.default {
    constructor(userId, authToken) {
        super();
        this.path = `/users/${userId}/session_key`;
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.params = {
            'token': authToken,
        };
        this.requireAuth = false;
    }
}
exports.SessionRefreshAPICommand = SessionRefreshAPICommand;
class SessionRefreshWebSocketCommand extends websocketRequestCommand_1.default {
    constructor(authToken) {
        super({
            code: 'LOGI',
            payload: {
                'token': authToken,
            },
            ackRequired: true,
        });
    }
}
exports.SessionRefreshWebSocketCommand = SessionRefreshWebSocketCommand;
class SessionRefreshAPIResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        const { key } = payload;
        this.key = key;
    }
}
exports.SessionRefreshAPIResponseCommand = SessionRefreshAPIResponseCommand;
class SessionRefreshWebSocketResponseCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'LOGI', payload);
        this.error = null;
        this.payload = payload;
        this.newKey = payload['new_key'];
        this.error = payload['error'] ? new error_1.default(payload['error']) : null;
    }
}
exports.SessionRefreshWebSocketResponseCommand = SessionRefreshWebSocketResponseCommand;
//# sourceMappingURL=sessionRefreshCommand.js.map