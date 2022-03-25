"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBannedUserListResponseCommand = exports.LoadBannedUserListRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const restrictedUser_1 = require("../../../model/restrictedUser");
const utils_1 = require("../utils");
const deundefined_1 = require("../../../utils/deundefined");
class LoadBannedUserListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, limit, token, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/ban`;
        this.params = (0, deundefined_1.deundefined)({
            limit,
            token,
        });
    }
}
exports.LoadBannedUserListRequestCommand = LoadBannedUserListRequestCommand;
class LoadBannedUserListResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = null;
        this.bannedUsers = [];
        const { next, banned_list } = payload;
        this.token = next;
        if (banned_list && banned_list.length > 0) {
            this.bannedUsers = banned_list.map((bannedUserPayload) => {
                return new restrictedUser_1.default(_iid, bannedUserPayload.user);
            });
        }
    }
}
exports.LoadBannedUserListResponseCommand = LoadBannedUserListResponseCommand;
//# sourceMappingURL=loadBannedUserListCommand.js.map