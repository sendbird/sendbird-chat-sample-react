"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFriendDiscoveriesResponseCommand = exports.DeleteFriendDiscoveriesRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class DeleteFriendDiscoveriesRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, discoveryKeys }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/friend_discoveries`;
        this.params = {
            friend_discovery_keys: discoveryKeys,
        };
    }
}
exports.DeleteFriendDiscoveriesRequestCommand = DeleteFriendDiscoveriesRequestCommand;
class DeleteFriendDiscoveriesResponseCommand extends apiResponseCommand_1.default {
}
exports.DeleteFriendDiscoveriesResponseCommand = DeleteFriendDiscoveriesResponseCommand;
//# sourceMappingURL=deleteFriendDiscoveriesCommand.js.map