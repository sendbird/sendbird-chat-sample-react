"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGroupChannelResponseCommand = exports.DeleteGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
;
class DeleteGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}`;
    }
}
exports.DeleteGroupChannelRequestCommand = DeleteGroupChannelRequestCommand;
class DeleteGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.DeleteGroupChannelResponseCommand = DeleteGroupChannelResponseCommand;
//# sourceMappingURL=deleteGroupChannelCommand.js.map