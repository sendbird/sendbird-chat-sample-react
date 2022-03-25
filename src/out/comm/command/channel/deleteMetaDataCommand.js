"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMetaDataResponseCommand = exports.DeleteMetaDataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class DeleteMetaDataRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, key, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metadata/${key}`;
        this.params = {
            include_ts: true,
        };
    }
}
exports.DeleteMetaDataRequestCommand = DeleteMetaDataRequestCommand;
class DeleteMetaDataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.ts = null;
        const { ts } = payload;
        this.ts = ts !== null && ts !== void 0 ? ts : null;
    }
}
exports.DeleteMetaDataResponseCommand = DeleteMetaDataResponseCommand;
//# sourceMappingURL=deleteMetaDataCommand.js.map