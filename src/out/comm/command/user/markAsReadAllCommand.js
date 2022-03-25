"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAsReadAllResponseCommand = exports.MarkAsReadAllRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class MarkAsReadAllRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, channelUrls }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/mark_as_read_all`;
        this.params = {
            channel_urls: channelUrls,
        };
    }
}
exports.MarkAsReadAllRequestCommand = MarkAsReadAllRequestCommand;
class MarkAsReadAllResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.MarkAsReadAllResponseCommand = MarkAsReadAllResponseCommand;
//# sourceMappingURL=markAsReadAllCommand.js.map