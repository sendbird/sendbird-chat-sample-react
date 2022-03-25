"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOpenChannelResponseCommand = exports.GetOpenChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const openChannel_1 = require("../../../../model/channel/openChannel");
class GetOpenChannelRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelUrl, isInternalCall }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${isInternalCall ? const_1.API_PATH_OPEN_CHANNELS_INTERNAL : const_1.API_PATH_OPEN_CHANNELS}/${encodeURIComponent(channelUrl)}`;
    }
}
exports.GetOpenChannelRequestCommand = GetOpenChannelRequestCommand;
class GetOpenChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.channel = null;
        this.channel = new openChannel_1.default(_iid, payload);
    }
}
exports.GetOpenChannelResponseCommand = GetOpenChannelResponseCommand;
//# sourceMappingURL=getOpenChannelCommand.js.map