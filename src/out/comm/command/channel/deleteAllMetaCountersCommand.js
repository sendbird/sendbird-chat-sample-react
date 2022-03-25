"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAllMetaCountersResponseCommand = exports.DeleteAllMetaCountersRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class DeleteAllMetaCountersRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metacounter`;
        this.params = null;
    }
}
exports.DeleteAllMetaCountersRequestCommand = DeleteAllMetaCountersRequestCommand;
class DeleteAllMetaCountersResponseCommand extends apiResponseCommand_1.default {
}
exports.DeleteAllMetaCountersResponseCommand = DeleteAllMetaCountersResponseCommand;
//# sourceMappingURL=deleteAllMetaCountersCommand.js.map