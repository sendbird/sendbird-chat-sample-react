"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMetaCounterResponseCommand = exports.DeleteMetaCounterRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class DeleteMetaCounterRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, key, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/metacounter/${key}`;
        this.params = null;
    }
}
exports.DeleteMetaCounterRequestCommand = DeleteMetaCounterRequestCommand;
class DeleteMetaCounterResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.DeleteMetaCounterResponseCommand = DeleteMetaCounterResponseCommand;
//# sourceMappingURL=deleteMetaCounterCommand.js.map