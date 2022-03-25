"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOperatorsResponseCommand = exports.GetOperatorsRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const user_1 = require("../../../model/user");
const utils_1 = require("../utils");
class GetOperatorsRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelUrl, channelType, token, limit }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/operators`;
        this.params = { token, limit };
    }
}
exports.GetOperatorsRequestCommand = GetOperatorsRequestCommand;
class GetOperatorsResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.operators = payload.operators.map((userPayload) => new user_1.default(_iid, userPayload));
        this.token = payload.next;
    }
}
exports.GetOperatorsResponseCommand = GetOperatorsResponseCommand;
//# sourceMappingURL=getOperatorsCommand.js.map