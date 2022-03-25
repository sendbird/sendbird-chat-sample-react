"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFriendDiscoveriesResponseCommand = exports.UploadFriendDiscoveriesRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class UploadFriendDiscoveriesRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, discoveries }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/friend_discoveries`;
        this.params = {
            friend_discoveries: discoveries.map((discovery) => ({
                friend_discovery_key: discovery.friendDiscoveryKey,
                friend_name: discovery.friendName,
            })),
        };
    }
}
exports.UploadFriendDiscoveriesRequestCommand = UploadFriendDiscoveriesRequestCommand;
class UploadFriendDiscoveriesResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.friendDiscoveryRequestId = payload.friend_discovery_request_id;
    }
}
exports.UploadFriendDiscoveriesResponseCommand = UploadFriendDiscoveriesResponseCommand;
//# sourceMappingURL=uploadFriendDiscoveriesCommand.js.map