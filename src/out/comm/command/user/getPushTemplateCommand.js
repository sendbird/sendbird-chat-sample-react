"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPushTemplateResponseCommand = exports.GetPushTemplateRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class GetPushTemplateRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push/template`;
    }
}
exports.GetPushTemplateRequestCommand = GetPushTemplateRequestCommand;
class GetPushTemplateResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.name = payload.name;
    }
}
exports.GetPushTemplateResponseCommand = GetPushTemplateResponseCommand;
//# sourceMappingURL=getPushTemplateCommand.js.map