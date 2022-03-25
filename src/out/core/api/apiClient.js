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
const apiRequestCommand_1 = require("../command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../command/api/apiResponseCommand");
const sessionExpiredCommand_1 = require("../../comm/command/internal/sessionExpiredCommand");
const apiRequestCancelCommand_1 = require("../command/api/apiRequestCancelCommand");
class ApiClient {
    constructor(_iid, { auth, sdkState, dispatcher, }) {
        this._abortControl = new Map();
        this._iid = _iid;
        this._auth = auth;
        this._sdkState = sdkState;
        this._dispatcher = dispatcher;
        this._dispatcher.on((command) => {
            if (command instanceof apiRequestCancelCommand_1.default) {
                this.cancel(command.requestId);
            }
        });
    }
    get _userAgentWithExtension() {
        const { extensions } = this._sdkState;
        const syncManagerVersion = extensions['sb_syncmanager'] ? `s${extensions['sb_syncmanager']}` : '';
        const uikitVersion = extensions['sb_uikit'] ? `u${extensions['sb_uikit']}` : '';
        return `JS/c${const_1.default.SDK_VERSION}/${syncManagerVersion}/${uikitVersion}`;
    }
    _createHeader(request, formData = null) {
        const { appId, appVersion } = this._sdkState;
        const headers = Object.assign(Object.assign({}, request.headers), { 'SendBird': `JS,${const_1.default.OS_VERSION},${const_1.default.SDK_VERSION},${appId}${appVersion ? `,${appVersion}` : ''}`, 'SB-User-Agent': encodeURIComponent(this._userAgentWithExtension), 'Request-Sent-Timestamp': Date.now().toString() });
        if (!formData)
            headers['Content-Type'] = 'application/json; charset=utf-8';
        if (request.requireAuth && this._auth.hasSession) {
            headers['Session-Key'] = this._auth.sessionKey;
        }
        if (this._auth && this._auth.authToken) {
            headers['App-Id'] = appId;
            headers['Access-Token'] = this._auth.authToken;
        }
        return headers;
    }
    send(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, method } = request;
            const bodyRequired = ![
                apiRequestCommand_1.APIRequestMethod.GET,
                apiRequestCommand_1.APIRequestMethod.DELETE,
            ].includes(method);
            const { api } = this._sdkState;
            const url = `${api.host}${path}${!bodyRequired ? request.query : ''}`;
            const body = bodyRequired ? request.payload : null;
            const headers = this._createHeader(request, body instanceof FormData ? body : null);
            const abortController = new AbortController();
            const { signal } = abortController;
            this._abortControl.set(request.requestId, abortController);
            try {
                const response = yield fetch(url, { method, body, headers, signal });
                const data = yield response.json();
                if (response.ok || response.redirected) {
                    return new apiResponseCommand_1.default(this._iid, data);
                }
                else {
                    if (data) {
                        const err = new error_1.default(data);
                        if (err.isSessionKeyExpiredError) {
                            this._dispatcher.dispatch(new sessionExpiredCommand_1.default());
                        }
                        throw err;
                    }
                    else
                        throw error_1.default.requestFailed;
                }
            }
            catch (err) {
                if (err instanceof error_1.default) {
                    throw err;
                }
                else {
                    throw (err.name === 'AbortError') ?
                        error_1.default.requestCanceled :
                        error_1.default.networkError;
                }
            }
        });
    }
    cancel(requestId) {
        if (this._abortControl.has(requestId)) {
            const abortController = this._abortControl.get(requestId);
            abortController.abort();
            this._abortControl.delete(requestId);
        }
    }
    cancelAll() {
        for (const abortController of this._abortControl.values()) {
            abortController.abort();
        }
        this._abortControl.clear();
    }
}
exports.default = ApiClient;
//# sourceMappingURL=apiClient.js.map