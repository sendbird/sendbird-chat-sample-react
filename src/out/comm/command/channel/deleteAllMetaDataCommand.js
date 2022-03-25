"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAllMetaDataResponseCommand = exports.DeleteAllMetaDataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class DeleteAllMetaDataRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metadata`;
        this.params = {
            include_ts: true,
        };
    }
}
exports.DeleteAllMetaDataRequestCommand = DeleteAllMetaDataRequestCommand;
class DeleteAllMetaDataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.ts = null;
        const { ts } = payload;
        this.ts = ts !== null && ts !== void 0 ? ts : null;
    }
}
exports.DeleteAllMetaDataResponseCommand = DeleteAllMetaDataResponseCommand;
//# sourceMappingURL=deleteAllMetaDataCommand.js.map