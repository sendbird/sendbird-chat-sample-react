"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateUserMessageResponseCommand = exports.TranslateUserMessageRequestCommand = void 0;
const userMessage_1 = require("../../../model/message/userMessage");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class TranslateUserMessageRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelType, channelUrl, messageId, translationTargetLanguages, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/messages/${encodeURIComponent(messageId)}/translation`;
        this.params = {
            target_langs: translationTargetLanguages,
        };
    }
}
exports.TranslateUserMessageRequestCommand = TranslateUserMessageRequestCommand;
class TranslateUserMessageResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.message = new userMessage_1.default(_iid, payload);
    }
}
exports.TranslateUserMessageResponseCommand = TranslateUserMessageResponseCommand;
//# sourceMappingURL=translateUserMessageCommand.js.map