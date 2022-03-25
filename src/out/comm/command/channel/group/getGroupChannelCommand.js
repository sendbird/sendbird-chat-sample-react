"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupChannelResponseCommand = exports.GetGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const groupChannel_1 = require("../../../../model/channel/groupChannel");
class GetGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelUrl, isInternalCall }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${isInternalCall ? const_1.API_PATH_GROUP_CHANNELS_INTERNAL : const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}`;
        this.params = {
            show_member: true,
            show_read_receipt: true,
            show_delivery_receipt: true,
        };
    }
}
exports.GetGroupChannelRequestCommand = GetGroupChannelRequestCommand;
class GetGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = null;
        this.channel = new groupChannel_1.default(_iid, payload);
    }
}
exports.GetGroupChannelResponseCommand = GetGroupChannelResponseCommand;
//# sourceMappingURL=getGroupChannelCommand.js.map