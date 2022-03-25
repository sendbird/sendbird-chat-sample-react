"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop_1 = require("../../utils/noop");
class SessionHandler {
    constructor() {
        this.onSessionExpired = noop_1.noop;
        this.onSessionTokenRequired = resolve => resolve(null);
        this.onSessionError = noop_1.noop;
        this.onSessionRefreshed = noop_1.noop;
        this.onSessionClosed = noop_1.noop;
    }
}
exports.default = SessionHandler;
//# sourceMappingURL=sessionHandler.js.map