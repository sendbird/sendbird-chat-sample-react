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
const error_1 = require("../../../error");
const stateType_1 = require("../stateType");
const baseState_1 = require("./baseState");
const initializedState_1 = require("./initializedState");
const connectedState_1 = require("./connectedState");
const logoutState_1 = require("./logoutState");
const deferred_1 = require("../../../utils/deferred");
const retry_1 = require("../../../utils/retry");
class ConnectionConnectingState extends baseState_1.default {
    constructor({ authToken }) {
        super();
        this.type = stateType_1.ConnectionStateType.CONNECTING;
        this._authToken = '';
        this._haltConnect = null;
        this._callbacks = [];
        this._authToken = authToken;
    }
    flushCallbacks(err = null) {
        this._callbacks.forEach((callback) => callback(err));
    }
    run(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const deferred = new deferred_1.Deferred();
            this._callbacks.push((err) => !err ? deferred.resolve() : deferred.reject(err));
            let error = null;
            try {
                yield (0, retry_1.asyncRetry)((halt) => __awaiter(this, void 0, void 0, function* () {
                    this._haltConnect = halt;
                    try {
                        yield context.connect(this._authToken);
                    }
                    catch (err) {
                        if (err instanceof error_1.default) {
                            switch (err.code) {
                                case error_1.SendbirdErrorCode.CONNECTION_CANCELED:
                                    halt(err);
                                    return;
                            }
                        }
                        throw err;
                    }
                }), context.sdkState.websocket.connectMaxRetry);
                yield context.changeState(new connectedState_1.default());
            }
            catch (err) {
                error = err;
                context.disconnect();
                yield context.changeState(new initializedState_1.default());
            }
            finally {
                if (!error) {
                    context.connectionHandlers.forEach(handler => handler.onConnected(context.sdkState.userId));
                }
                this.flushCallbacks(error);
            }
            return deferred.promise;
        });
    }
    onConnect(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const deferred = new deferred_1.Deferred();
            this._callbacks.push((err) => !err ? deferred.resolve() : deferred.reject(err));
            return deferred.promise;
        });
    }
    onDisconnect(context, { error = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._haltConnect)
                this._haltConnect(error !== null && error !== void 0 ? error : error_1.default.connectionCanceled);
            yield context.changeState(new logoutState_1.default());
        });
    }
    onLogout(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._haltConnect)
                this._haltConnect(error_1.default.connectionCanceled);
            yield context.changeState(new logoutState_1.default());
        });
    }
}
exports.default = ConnectionConnectingState;
//# sourceMappingURL=connectingState.js.map