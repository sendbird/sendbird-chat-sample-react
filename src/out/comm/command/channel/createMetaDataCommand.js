"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMetaDataResponseCommand = exports.CreateMetaDataRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class CreateMetaDataRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, metadata, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metadata`;
        this.params = {
            metadata,
            include_ts: true,
        };
    }
}
exports.CreateMetaDataRequestCommand = CreateMetaDataRequestCommand;
class CreateMetaDataResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.metaData = payload !== null && payload !== void 0 ? payload : {};
    }
}
exports.CreateMetaDataResponseCommand = CreateMetaDataResponseCommand;
//# sourceMappingURL=createMetaDataCommand.js.map