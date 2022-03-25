"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEventCategory = void 0;
const user_1 = require("../../model/user");
var UserEventCategory;
(function (UserEventCategory) {
    UserEventCategory[UserEventCategory["USER_BLOCK"] = 20001] = "USER_BLOCK";
    UserEventCategory[UserEventCategory["USER_UNBLOCK"] = 20000] = "USER_UNBLOCK";
    UserEventCategory[UserEventCategory["FRIEND_DISCOVERED"] = 20900] = "FRIEND_DISCOVERED";
})(UserEventCategory = exports.UserEventCategory || (exports.UserEventCategory = {}));
class UserEvent {
    constructor(payload) {
        this.category = payload.cat;
        this.data = payload.data;
    }
    static getDataAsUserBlockEvent(_iid, event) {
        const { blocker, blockee } = event.data;
        return {
            blocker: new user_1.default(_iid, blocker),
            blockee: new user_1.default(_iid, blockee),
        };
    }
    static getDataAsFriendDiscoveredEvent(_iid, event) {
        const { friend_discoveries } = event.data;
        return {
            friendDiscoveries: Array.isArray(friend_discoveries) ?
                friend_discoveries.map((payload) => new user_1.default(_iid, payload)) :
                [],
        };
    }
}
exports.default = UserEvent;
//# sourceMappingURL=userEvent.js.map