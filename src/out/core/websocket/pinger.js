"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pingCommand_1 = require("../command/websocket/pingCommand");
class Pinger {
    constructor({ pingInterval, pongTimeout, pingDelegate, }) {
        this._pingTimer = null;
        this._pingTimeoutTimer = null;
        this.pingDelegate = pingDelegate;
        this.pingInterval = pingInterval;
        this.pongTimeout = pongTimeout;
    }
    get isWaiting() {
        return !!this._pingTimeoutTimer;
    }
    ping() {
        const pingCommand = new pingCommand_1.default();
        try {
            this._pingTimeoutTimer = setTimeout(() => {
                this.stop();
                this.pingDelegate.error(null);
            }, this.pongTimeout);
            this.pingDelegate.send(pingCommand);
        }
        catch (err) {
            this.stop();
            this.pingDelegate.error(null);
        }
        return pingCommand;
    }
    pong() {
        if (this._pingTimeoutTimer) {
            clearTimeout(this._pingTimeoutTimer);
            this._pingTimeoutTimer = null;
        }
    }
    refreshTimer() {
        this.stop();
        this._pingTimer = setInterval(() => {
            this.ping();
        }, this.pingInterval);
    }
    start() {
        this.refreshTimer();
        this.ping();
    }
    stop() {
        if (this._pingTimer) {
            clearInterval(this._pingTimer);
            this._pingTimer = null;
        }
        if (this._pingTimeoutTimer) {
            clearTimeout(this._pingTimeoutTimer);
            this._pingTimeoutTimer = null;
        }
    }
}
exports.default = Pinger;
//# sourceMappingURL=pinger.js.map