"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnhideGroupChannelResponseCommand = exports.UnhideGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
class UnhideGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/hide`;
    }
}
exports.UnhideGroupChannelRequestCommand = UnhideGroupChannelRequestCommand;
class UnhideGroupChannelResponseCommand extends apiResponseCommand_1.default {
}
exports.UnhideGroupChannelResponseCommand = UnhideGroupChannelResponseCommand;
//# sourceMappingURL=unhideGroupChannelCommand.js.map