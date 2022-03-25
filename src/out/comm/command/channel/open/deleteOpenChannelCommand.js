"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteOpenChannelResponseCommand = exports.DeleteOpenChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
;
class DeleteOpenChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${const_1.API_PATH_OPEN_CHANNELS}/${encodeURIComponent(channelUrl)}`;
    }
}
exports.DeleteOpenChannelRequestCommand = DeleteOpenChannelRequestCommand;
class DeleteOpenChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.DeleteOpenChannelResponseCommand = DeleteOpenChannelResponseCommand;
//# sourceMappingURL=deleteOpenChannelCommand.js.map