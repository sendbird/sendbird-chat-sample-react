"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllEmojiResponseCommand = exports.GetAllEmojiRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const emojiContainer_1 = require("../../../model/emojiContainer");
class GetAllEmojiRequestCommand extends apiRequestCommand_1.default {
    constructor() {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = const_1.API_PATH_EMOJI_CATEGORIES;
    }
}
exports.GetAllEmojiRequestCommand = GetAllEmojiRequestCommand;
class GetAllEmojiResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.emojiContainer = new emojiContainer_1.default(payload);
    }
}
exports.GetAllEmojiResponseCommand = GetAllEmojiResponseCommand;
//# sourceMappingURL=getAllEmojiCommand.js.map