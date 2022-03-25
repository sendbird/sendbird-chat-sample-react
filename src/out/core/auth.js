"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Auth {
    constructor() {
        this.sessionKey = null;
        this.authToken = null;
    }
    get hasSession() {
        return !!this.sessionKey;
    }
    clear() {
        this.authToken = null;
        this.sessionKey = null;
    }
}
exports.default = Auth;
//# sourceMappingURL=auth.js.map