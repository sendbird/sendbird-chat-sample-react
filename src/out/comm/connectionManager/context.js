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
const const_1 = require("../../const");
const error_1 = require("../../error");
const initializedState_1 = require("./state/initializedState");
const eventDispatcher_1 = require("../../core/eventDispatcher");
const loginCommand_1 = require("../command/auth/loginCommand");
const connectionStateChangeCommand_1 = require("../command/internal/connectionStateChangeCommand");
const sessionExpiredCommand_1 = require("../command/internal/sessionExpiredCommand");
const deferred_1 = require("../../utils/deferred");
class ConnectionStateContext extends eventDispatcher_1.default {
    constructor(_iid, { sdkState, connectionHandlers, sessionManager, websocketClient, dispatcher, entryState = new initializedState_1.default(), }) {
        super();
        this._currentState = null;
        this._iid = _iid;
        this.sdkState = sdkState;
        this.connectionHandlers = connectionHandlers;
        this._sessionManager = sessionManager;
        this._websocketClient = websocketClient;
        this._dispatcher = dispatcher;
        this._currentState = entryState;
    }
    get currentState() {
        return this._currentState;
    }
    changeState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            this._currentState = state;
            this._dispatcher.dispatch(new connectionStateChangeCommand_1.default({ stateType: state.type }));
            yield this._currentState.run(this);
        });
    }
    _url(authToken = '') {
        const { appId, appVersion, userId } = this.sdkState;
        const { auth } = this._sessionManager;
        const extraData = ['premium_feature_list', 'file_upload_size_limit', 'application_attributes', 'emoji_hash'];
        return `${this.sdkState.websocket.host}/?p=JS&pv=${encodeURIComponent(const_1.default.OS_VERSION)}&sv=${encodeURIComponent(const_1.default.SDK_VERSION)}&ai=${appId}${appVersion ? `&av=${appVersion}` : ''}${auth.hasSession ?
            `&key=${encodeURIComponent(auth.sessionKey)}` :
            `&user_id=${encodeURIComponent(userId)}&access_token=${encodeURIComponent(authToken)}`}&active=1&SB-User-Agent=${'FIXME'}&Request-Sent-Timestamp=${Date.now().toString()}&include_extra_data=${encodeURIComponent(String(extraData))}${this._sessionManager.handler ? `&expiring_session=1` : ''}&use_local_cache=1`;
    }
    connect(authToken = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = this._url(authToken);
            const deferred = new deferred_1.Deferred();
            let loginTimer = setTimeout(() => {
                loginTimer = null;
                this._dispatcher.dispatch(loginCommand_1.default.asError(error_1.default.loginTimeout));
            }, this.sdkState.websocket.responseTimeout);
            const websocketEventContext = this._websocketClient
                .on('message', (command) => {
                switch (command.code) {
                    case 'LOGI': {
                        websocketEventContext.close();
                        if (loginTimer) {
                            clearTimeout(loginTimer);
                            loginTimer = null;
                        }
                        const logi = command.as(loginCommand_1.default);
                        if (!logi.error) {
                            logi.applyTo(this._iid);
                            deferred.resolve();
                        }
                        else {
                            if (logi.error.isSessionKeyExpiredError) {
                                this._dispatcher.dispatch(new sessionExpiredCommand_1.default());
                            }
                            deferred.reject(logi.error);
                        }
                    }
                }
            })
                .on('close', () => {
                websocketEventContext.close();
                deferred.reject(error_1.default.networkError);
            });
            this._websocketClient.connect(endpoint);
            return deferred.promise;
        });
    }
    disconnect() {
        this._websocketClient.disconnect();
    }
    logout() {
        this.sdkState.userId = null;
        this._sessionManager.currentUser = null;
        this._sessionManager.auth.clear();
        this.disconnect();
    }
}
exports.default = ConnectionStateContext;
//# sourceMappingURL=context.js.map