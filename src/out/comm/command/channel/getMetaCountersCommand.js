"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMetaCountersResponseCommand = exports.GetMetaCountersRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class GetMetaCountersRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, keys, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/ban`;
        this.params = {
            keys,
        };
    }
}
exports.GetMetaCountersRequestCommand = GetMetaCountersRequestCommand;
class GetMetaCountersResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.metaCounter = payload;
    }
}
exports.GetMetaCountersResponseCommand = GetMetaCountersResponseCommand;
//# sourceMappingURL=getMetaCountersCommand.js.map