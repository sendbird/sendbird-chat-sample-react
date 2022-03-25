"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveOperatorsResponseCommand = exports.RemoveOperatorsRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class RemoveOperatorsRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, operatorUserIds, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/operators`;
        this.params = {
            operator_ids: operatorUserIds,
        };
    }
}
exports.RemoveOperatorsRequestCommand = RemoveOperatorsRequestCommand;
class RemoveOperatorsResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
    }
}
exports.RemoveOperatorsResponseCommand = RemoveOperatorsResponseCommand;
//# sourceMappingURL=removeOperatorsCommand.js.map