"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAllowFriendDiscoveryResponseCommand = exports.SetAllowFriendDiscoveryRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetAllowFriendDiscoveryRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, allowFriendDiscovery }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${userId}/allow_friend_discovery`;
        this.params = {
            allow_friend_discovery: allowFriendDiscovery,
        };
    }
}
exports.SetAllowFriendDiscoveryRequestCommand = SetAllowFriendDiscoveryRequestCommand;
class SetAllowFriendDiscoveryResponseCommand extends apiResponseCommand_1.default {
}
exports.SetAllowFriendDiscoveryResponseCommand = SetAllowFriendDiscoveryResponseCommand;
//# sourceMappingURL=setAllowFriendDiscoveryCommand.js.map