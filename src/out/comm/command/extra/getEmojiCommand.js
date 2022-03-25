"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmojiResponseCommand = exports.GetEmojiRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const emoji_1 = require("../../../model/emoji");
class GetEmojiRequestCommand extends apiRequestCommand_1.default {
    constructor({ key }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_EMOJIS}/${key}`;
    }
}
exports.GetEmojiRequestCommand = GetEmojiRequestCommand;
class GetEmojiResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.emoji = new emoji_1.default(payload);
    }
}
exports.GetEmojiResponseCommand = GetEmojiResponseCommand;
//# sourceMappingURL=getEmojiCommand.js.map