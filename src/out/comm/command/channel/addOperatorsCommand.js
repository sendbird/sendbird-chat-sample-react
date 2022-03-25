"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOperatorsResponseCommand = exports.AddOperatorsRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class AddOperatorsRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, operatorUserIds, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/operators`;
        this.params = {
            operator_ids: operatorUserIds,
        };
    }
}
exports.AddOperatorsRequestCommand = AddOperatorsRequestCommand;
class AddOperatorsResponseCommand extends apiResponseCommand_1.default {
}
exports.AddOperatorsResponseCommand = AddOperatorsResponseCommand;
//# sourceMappingURL=addOperatorsCommand.js.map