"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionState = void 0;
const error_1 = require("../../error");
const websocketEventCommand_1 = require("../command/websocket/websocketEventCommand");
const pinger_1 = require("./pinger");
const sessionExpiredCommand_1 = require("../../comm/command/internal/sessionExpiredCommand");
const eventDispatcher_1 = require("../eventDispatcher");
const validator_1 = require("../../utils/validator");
const noop_1 = require("../../utils/noop");
var ConnectionState;
(function (ConnectionState) {
    ConnectionState["CONNECTING"] = "CONNECTING";
    ConnectionState["OPEN"] = "OPEN";
    ConnectionState["CLOSED"] = "CLOSED";
})(ConnectionState = exports.ConnectionState || (exports.ConnectionState = {}));
class WebSocketClient extends eventDispatcher_1.default {
    constructor(_iid, { sdkState, dispatcher, }) {
        super();
        this._pinger = null;
        this.lastActive = 0;
        this._iid = _iid;
        this._sdkState = sdkState;
        this._dispatcher = dispatcher;
        if (!this._sdkState.websocket.pingerDisabled) {
            this._pinger = new pinger_1.default({
                pingDelegate: {
                    send: (command) => this.send(command),
                    error: (err) => this.error(err),
                },
                pingInterval: this._sdkState.websocket.pingInterval,
                pongTimeout: this._sdkState.websocket.pongTimeout,
            });
        }
    }
    get connectionState() {
        if (this._ws) {
            switch (this._ws.readyState) {
                case 0: return ConnectionState.CONNECTING;
                case 1: return ConnectionState.OPEN;
            }
        }
        return ConnectionState.CLOSED;
    }
    connect(url) {
        this._ws = new WebSocket(url);
        this._ws.onopen = () => {
            this.dispatch('open');
        };
        this._ws.onmessage = (event) => {
            const message = event.data;
            const rows = message.split('\n');
            rows.forEach((row) => {
                if (row && (0, validator_1.isTypeOf)('string', row)) {
                    const command = websocketEventCommand_1.default.createFromRawMessage(this._iid, row);
                    if (command.code === 'LOGI') {
                        if (command.payload && !command.payload['error']) {
                            if (this._pinger)
                                this._pinger.start();
                        }
                        this.dispatch('message', command);
                    }
                    else if (command.code === 'PONG') {
                        if (this._pinger)
                            this._pinger.pong();
                    }
                    else if (command.code === 'EXPR') {
                        if (command.payload && command.payload['expires_in'] > 0) {
                            this._dispatcher.dispatch(new sessionExpiredCommand_1.default());
                        }
                    }
                    else if (command.code === 'NOOP') {
                    }
                    else {
                        this.dispatch('message', command);
                    }
                }
            });
        };
        this._ws.onerror = () => {
            if (this._pinger)
                this._pinger.stop();
            this.dispatch('error', error_1.default.networkError);
        };
        this._ws.onclose = () => {
            if (this._pinger)
                this._pinger.stop();
            this.dispatch('close');
        };
        this.lastActive = Date.now();
    }
    disconnect() {
        if (this._pinger)
            this._pinger.stop();
        if (this._ws) {
            this._ws.onopen = noop_1.noop;
            this._ws.onmessage = noop_1.noop;
            this._ws.onerror = noop_1.noop;
            this._ws.onclose = () => {
                this.dispatch('close');
            };
            this._ws.close();
            this._ws = null;
        }
    }
    send(command) {
        if (this._ws) {
            if (command.code !== 'PING') {
                if (this._pinger)
                    this._pinger.refreshTimer();
            }
            this._ws.send(command.convertToMessage());
        }
        else {
            throw error_1.default.connectionClosed;
        }
    }
    error(err) {
        if (this._pinger)
            this._pinger.stop();
        this.dispatch('error', err);
    }
}
exports.default = WebSocketClient;
//# sourceMappingURL=websocketClient.js.map