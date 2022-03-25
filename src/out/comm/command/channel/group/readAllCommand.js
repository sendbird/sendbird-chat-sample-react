"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadAllResponseCommand = exports.ReadAllRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
class ReadAllRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, channelUrls }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/mark_as_read_all`;
        this.params = {
            channel_urls: channelUrls,
        };
    }
}
exports.ReadAllRequestCommand = ReadAllRequestCommand;
class ReadAllResponseCommand extends apiResponseCommand_1.default {
}
exports.ReadAllResponseCommand = ReadAllResponseCommand;
//# sourceMappingURL=readAllCommand.js.map