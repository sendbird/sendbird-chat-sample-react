"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPushTemplateResponseCommand = exports.SetPushTemplateRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const const_1 = require("../const");
class SetPushTemplateRequestCommand extends apiRequestCommand_1.default {
    constructor({ userId, templateName }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_USERS}/${encodeURIComponent(userId)}/push/template`;
        this.params = {
            name: templateName,
        };
    }
}
exports.SetPushTemplateRequestCommand = SetPushTemplateRequestCommand;
class SetPushTemplateResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.name = payload.name;
    }
}
exports.SetPushTemplateResponseCommand = SetPushTemplateResponseCommand;
//# sourceMappingURL=setPushTemplateCommand.js.map