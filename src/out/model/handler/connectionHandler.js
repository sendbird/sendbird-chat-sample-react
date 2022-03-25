"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop_1 = require("../../utils/noop");
class ConnectionHandler {
    constructor() {
        this.onConnected = noop_1.noop;
        this.onReconnectStarted = noop_1.noop;
        this.onReconnectSucceeded = noop_1.noop;
        this.onReconnectFailed = noop_1.noop;
        this.onDisconnected = noop_1.noop;
    }
}
exports.default = ConnectionHandler;
//# sourceMappingURL=connectionHandler.js.map