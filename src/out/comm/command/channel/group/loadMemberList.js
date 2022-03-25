"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadMemberListResponseCommand = exports.LoadMemberListRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const member_1 = require("../../../../model/channel/member");
class LoadMemberListRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, token, limit, order, mutedMemberFilter, memberStateFilter, nicknameStartsWithFilter, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/members`;
        this.params = {
            token,
            limit,
            order,
            muted_member_filter: mutedMemberFilter,
            member_state_filter: memberStateFilter,
            nickname_startswith: nicknameStartsWithFilter,
            show_member_is_muted: true,
            show_read_receipt: true,
            show_delivery_receipt: true,
        };
    }
}
exports.LoadMemberListRequestCommand = LoadMemberListRequestCommand;
class LoadMemberListResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.token = null;
        this.members = [];
        const { next, members } = payload;
        this.token = next;
        if (members && members.length > 0) {
            this.members = members.map((memberPayload) => {
                return new member_1.default(_iid, memberPayload);
            });
        }
    }
}
exports.LoadMemberListResponseCommand = LoadMemberListResponseCommand;
//# sourceMappingURL=loadMemberList.js.map