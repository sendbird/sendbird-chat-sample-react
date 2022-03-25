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
const apiClient_1 = require("./api/apiClient");
const apiRequestCommand_1 = require("./command/api/apiRequestCommand");
const websocketClient_1 = require("./websocket/websocketClient");
const websocketRequestCommand_1 = require("./command/websocket/websocketRequestCommand");
const subscribedUnreadMessageCountUpdateCommand_1 = require("../comm/command/internal/subscribedUnreadMessageCountUpdateCommand");
const deferred_1 = require("../utils/deferred");
class CommandRouter {
    constructor(_iid, { auth, sdkState, dispatcher, }) {
        this._ackStateMap = new Map();
        this._sdkState = sdkState;
        this._dispatcher = dispatcher;
        this.apiClient = new apiClient_1.default(_iid, { auth, sdkState, dispatcher });
        this.websocketClient = new websocketClient_1.default(_iid, { sdkState, dispatcher });
        this.websocketClient
            .on('message', (command) => {
            if (command.payload['unread_cnt']) {
                this._dispatcher.dispatch(new subscribedUnreadMessageCountUpdateCommand_1.default(command.payload['unread_cnt']));
            }
            if (command.requestId) {
                if (this._ackStateMap.has(command.requestId)) {
                    const ackState = this._ackStateMap.get(command.requestId);
                    ackState.resolve(command);
                }
                else {
                }
            }
            else {
                this._dispatcher.dispatch(command);
            }
        })
            .on('close', () => {
            this._ackStateMap.forEach((ackState) => {
                ackState.reject(error_1.default.connectionClosed);
            });
            this._ackStateMap.clear();
        });
    }
    _sendApiRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiClient.send(request);
        });
    }
    _sendWebsocketRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deferred = new deferred_1.Deferred();
            if (request.ackRequired) {
                let responseTimeout = null;
                const complete = (err = null, res = null) => {
                    if (this._ackStateMap.has(request.requestId)) {
                        this._ackStateMap.delete(request.requestId);
                        if (responseTimeout) {
                            clearTimeout(responseTimeout);
                            responseTimeout = null;
                        }
                        !err ? deferred.resolve(res) : deferred.reject(err);
                    }
                };
                try {
                    responseTimeout = setTimeout(() => complete(error_1.default.noAckTimeout), this._sdkState.websocket.responseTimeout);
                    this._ackStateMap.set(request.requestId, {
                        resolve: (response) => complete(null, response),
                        reject: (err) => complete(err),
                    });
                    this.websocketClient.send(request);
                }
                catch (err) {
                    complete(err);
                }
            }
            else {
                try {
                    this.websocketClient.send(request);
                    deferred.resolve(null);
                }
                catch (err) {
                    deferred.reject(err);
                }
            }
            return deferred.promise;
        });
    }
    send(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req instanceof apiRequestCommand_1.default) {
                return yield this._sendApiRequest(req);
            }
            else if (req instanceof websocketRequestCommand_1.default) {
                return yield this._sendWebsocketRequest(req);
            }
            throw error_1.default.invalidParameters;
        });
    }
    cancel(requestId) {
        this.apiClient.cancel(requestId);
    }
    cancelAll() {
        this.apiClient.cancelAll();
    }
}
exports.default = CommandRouter;
//# sourceMappingURL=commandRouter.js.map