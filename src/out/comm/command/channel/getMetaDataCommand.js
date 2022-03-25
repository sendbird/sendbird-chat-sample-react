"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMetaDataResponseCommand = exports.GetMetaDataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class GetMetaDataRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, keys, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metadata`;
        this.params = {
            keys,
            include_ts: true,
        };
    }
}
exports.GetMetaDataRequestCommand = GetMetaDataRequestCommand;
class GetMetaDataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.ts = null;
        const { metadata, ts } = payload;
        this.metadata = metadata;
        this.ts = ts !== null && ts !== void 0 ? ts : null;
    }
}
exports.GetMetaDataResponseCommand = GetMetaDataResponseCommand;
//# sourceMappingURL=getMetaDataCommand.js.map