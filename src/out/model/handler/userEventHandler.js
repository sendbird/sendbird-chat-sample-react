"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop_1 = require("../../utils/noop");
class UserEventHandler {
    constructor() {
        this.onFriendsDiscovered = noop_1.noop;
        this.onTotalUnreadMessageCountUpdated = noop_1.noop;
    }
}
exports.default = UserEventHandler;
//# sourceMappingURL=userEventHandler.js.map