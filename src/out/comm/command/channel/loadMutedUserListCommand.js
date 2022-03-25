"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMutedUserListResponseCommand = exports.LoadMutedUserListRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const restrictedUser_1 = require("../../../model/restrictedUser");
const utils_1 = require("../utils");
class LoadMutedUserListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, limit, token, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/mute`;
        this.params = {
            limit,
            token,
        };
    }
}
exports.LoadMutedUserListRequestCommand = LoadMutedUserListRequestCommand;
class LoadMutedUserListResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = null;
        this.mutedUsers = [];
        const { next, muted_list } = payload;
        this.token = next;
        if (muted_list && muted_list.length > 0) {
            this.mutedUsers = muted_list.map((userPayload) => new restrictedUser_1.default(_iid, userPayload));
        }
    }
}
exports.LoadMutedUserListResponseCommand = LoadMutedUserListResponseCommand;
//# sourceMappingURL=loadMutedUserListCommand.js.map