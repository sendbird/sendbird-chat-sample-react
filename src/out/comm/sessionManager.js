"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const stateType_1 = require("./connectionManager/stateType");
const sessionExpiredCommand_1 = require("./command/internal/sessionExpiredCommand");
const sessionRefreshCommand_1 = require("./command/auth/sessionRefreshCommand");
const connectionStateChangeCommand_1 = require("./command/internal/connectionStateChangeCommand");
const sessionRefreshFailedCommand_1 = require("./command/internal/sessionRefreshFailedCommand");
const retry_1 = require("../utils/retry");
const deferred_1 = require("../utils/deferred");
const SESSION_KEY_REFRESH_RETRY = 3;
class SessionManager {
    constructor({ auth, sdkState, dispatcher, requestQueue }) {
        this._currentConnectionStateType = stateType_1.ConnectionStateType.INITIALIZED;
        this.auth = auth;
        this._sdkState = sdkState;
        this._dispatcher = dispatcher;
        this._requestQueue = requestQueue;
        this._dispatcher = dispatcher;
        this._requestQueue = requestQueue;
        this._dispatcher.on((command) => {
            if (command instanceof connectionStateChangeCommand_1.default) {
                const { stateType } = command;
                this._currentConnectionStateType = stateType;
            }
            else if (command instanceof sessionExpiredCommand_1.default) {
                this.refresh();
            }
        });
    }
    _refreshSessionKey(authToken, deferred) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._currentConnectionStateType === stateType_1.ConnectionStateType.CONNECTED) {
                try {
                    const websocketCommand = new sessionRefreshCommand_1.SessionRefreshWebSocketCommand(authToken);
                    const response = yield this._requestQueue.forceSend(websocketCommand);
                    const { newKey, error } = response.as(sessionRefreshCommand_1.SessionRefreshWebSocketResponseCommand);
                    if (error)
                        throw error;
                    this.auth.sessionKey = newKey !== null && newKey !== void 0 ? newKey : this.auth.sessionKey;
                }
                catch (err) {
                    if (err.isSessionTokenExpiredError) {
                        this._handleError(deferred);
                        return;
                    }
                }
            }
            try {
                const apiCommand = new sessionRefreshCommand_1.SessionRefreshAPICommand(this._sdkState.userId, authToken);
                yield (0, retry_1.asyncRetry)((halt) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const response = yield this._requestQueue.forceSend(apiCommand);
                        const { key } = response.as(sessionRefreshCommand_1.SessionRefreshAPIResponseCommand);
                        this.auth.sessionKey = key;
                    }
                    catch (err) {
                        if (err.isSessionTokenExpiredError)
                            halt(error_1.default.sessionTokenRefreshFailed);
                    }
                }), SESSION_KEY_REFRESH_RETRY);
            }
            catch (err) {
                this._handleError(deferred);
                return;
            }
            if (deferred)
                deferred.resolve();
            this.handler.onSessionRefreshed();
        });
    }
    _handleError(deferred) {
        const err = error_1.default.sessionTokenRefreshFailed;
        if (deferred)
            deferred.reject(err);
        this.handler.onSessionError(err);
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.handler) {
                const deferred = new deferred_1.Deferred();
                const resolve = (token) => {
                    if (token) {
                        this.auth.authToken = token;
                        this._refreshSessionKey(token, deferred);
                    }
                    else {
                        this.handler.onSessionClosed();
                        deferred.resolve();
                    }
                };
                const reject = () => {
                    this._dispatcher.dispatch(new sessionRefreshFailedCommand_1.default());
                    const err = error_1.default.sessionTokenRequestFailed;
                    if (this.handler) {
                        this.handler.onSessionError(err);
                        deferred.reject(err);
                    }
                };
                this.handler.onSessionExpired();
                if (!this.auth.authToken) {
                    this.handler.onSessionTokenRequired(resolve, reject);
                }
                else {
                    this._refreshSessionKey(this.auth.authToken, deferred);
                }
                return deferred.promise;
            }
        });
    }
}
exports.default = SessionManager;
//# sourceMappingURL=sessionManager.js.map