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
const context_1 = require("./context");
const stateType_1 = require("./stateType");
class ConnectionManager {
    constructor(_iid, { sdkState, connectionHandlers, sessionManager, websocketClient, dispatcher, }) {
        this._context = null;
        this._context = new context_1.default(_iid, {
            sdkState,
            connectionHandlers,
            sessionManager,
            websocketClient,
            dispatcher,
        });
    }
    get isConnected() {
        const { currentState } = this._context;
        return currentState.type === stateType_1.ConnectionStateType.CONNECTED;
    }
    get isConnecting() {
        const { currentState } = this._context;
        return currentState.type === stateType_1.ConnectionStateType.CONNECTING ||
            currentState.type === stateType_1.ConnectionStateType.RECONNECTING;
    }
    connect(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentState } = this._context;
            yield currentState.onConnect(this._context, authToken);
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentState } = this._context;
            yield currentState.onReconnect(this._context);
        });
    }
    background() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentState } = this._context;
            yield currentState.onDisconnect(this._context, { autoReconnect: false });
        });
    }
    disconnect(error = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentState } = this._context;
            yield currentState.onDisconnect(this._context, { error, autoReconnect: true });
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentState } = this._context;
            yield currentState.onLogout(this._context);
        });
    }
}
exports.default = ConnectionManager;
//# sourceMappingURL=index.js.map