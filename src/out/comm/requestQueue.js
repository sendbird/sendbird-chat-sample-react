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
const commandRouter_1 = require("../core/commandRouter");
const apiRequestCommand_1 = require("../core/command/api/apiRequestCommand");
const websocketRequestCommand_1 = require("../core/command/websocket/websocketRequestCommand");
const stateType_1 = require("./connectionManager/stateType");
const connectionStateChangeCommand_1 = require("./command/internal/connectionStateChangeCommand");
const deferred_1 = require("../utils/deferred");
class RequestQueue {
    constructor(_iid, { auth, sdkState, dispatcher, }) {
        this._currentConnectionStateType = stateType_1.ConnectionStateType.INITIALIZED;
        this._lazyCallQueue = [];
        this.commandRouter = new commandRouter_1.default(_iid, {
            auth,
            sdkState,
            dispatcher,
        });
        this._auth = auth;
        this._dispatcher = dispatcher;
        this._dispatcher.on((command) => {
            if (command instanceof connectionStateChangeCommand_1.default) {
                const { stateType } = command;
                this._currentConnectionStateType = stateType;
                switch (stateType) {
                    case stateType_1.ConnectionStateType.CONNECTED: {
                        const queueToFlush = this._lazyCallQueue;
                        this._lazyCallQueue = [];
                        queueToFlush.forEach((lazyCallItem) => __awaiter(this, void 0, void 0, function* () {
                            const { command, deferred } = lazyCallItem;
                            try {
                                const res = yield this.send(command);
                                deferred.resolve(res);
                            }
                            catch (err) {
                                deferred.reject(err);
                            }
                        }));
                        break;
                    }
                    case stateType_1.ConnectionStateType.INITIALIZED:
                    case stateType_1.ConnectionStateType.DISCONNECTED:
                    case stateType_1.ConnectionStateType.LOGOUT: {
                        const queueToFlush = this._lazyCallQueue;
                        this._lazyCallQueue = [];
                        queueToFlush.forEach((lazyCallItem) => __awaiter(this, void 0, void 0, function* () {
                            const { deferred } = lazyCallItem;
                            deferred.reject(error_1.default.connectionRequired);
                        }));
                        break;
                    }
                }
            }
        });
    }
    get isReady() {
        return this._currentConnectionStateType === stateType_1.ConnectionStateType.CONNECTED;
    }
    get isLazyCallActivated() {
        return this._currentConnectionStateType === stateType_1.ConnectionStateType.CONNECTING ||
            this._currentConnectionStateType === stateType_1.ConnectionStateType.RECONNECTING;
    }
    send(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command instanceof websocketRequestCommand_1.default) {
                if (this.isReady) {
                    return yield this.commandRouter.send(command);
                }
                else if (this.isLazyCallActivated) {
                    const deferred = new deferred_1.Deferred();
                    this._lazyCallQueue.push({
                        command,
                        deferred,
                    });
                    return deferred.promise;
                }
                else {
                    throw error_1.default.connectionRequired;
                }
            }
            else if (command instanceof apiRequestCommand_1.default) {
                if (this._auth.hasSession) {
                    return yield this.commandRouter.send(command);
                }
                else if (this.isLazyCallActivated) {
                    const deferred = new deferred_1.Deferred();
                    this._lazyCallQueue.push({
                        command,
                        deferred,
                    });
                    return deferred.promise;
                }
                else {
                    throw error_1.default.connectionRequired;
                }
            }
        });
    }
    forceSend(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commandRouter.send(command);
        });
    }
    cancel(requestId) {
        this.commandRouter.cancel(requestId);
    }
    cancelAll() {
        this.commandRouter.cancelAll();
    }
}
exports.default = RequestQueue;
//# sourceMappingURL=requestQueue.js.map