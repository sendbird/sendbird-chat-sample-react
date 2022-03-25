"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMetaCountersResponseCommand = exports.CreateMetaCountersRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class CreateMetaCountersRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, metaCounter, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metacounter`;
        this.params = {
            metacounter: metaCounter,
        };
    }
}
exports.CreateMetaCountersRequestCommand = CreateMetaCountersRequestCommand;
class CreateMetaCountersResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.metaCounter = payload;
    }
}
exports.CreateMetaCountersResponseCommand = CreateMetaCountersResponseCommand;
//# sourceMappingURL=createMetaCountersCommand.js.map