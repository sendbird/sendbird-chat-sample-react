"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllowFriendDiscoveryResponseCommand = exports.GetAllowFriendDiscoveryRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetAllowFriendDiscoveryRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${userId}/allow_friend_discovery`;
        this.params = {};
    }
}
exports.GetAllowFriendDiscoveryRequestCommand = GetAllowFriendDiscoveryRequestCommand;
class GetAllowFriendDiscoveryResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.allowFriendDiscovery = payload.allow_friend_discovery;
    }
}
exports.GetAllowFriendDiscoveryResponseCommand = GetAllowFriendDiscoveryResponseCommand;
//# sourceMappingURL=getAllowFriendDiscoveryCommand.js.map