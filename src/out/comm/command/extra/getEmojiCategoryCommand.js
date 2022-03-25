"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmojiCategoryResponseCommand = exports.GetEmojiCategoryRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const emojiCategory_1 = require("../../../model/emojiCategory");
class GetEmojiCategoryRequestCommand extends apiRequestCommand_1.default {
    constructor({ categoryId }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_EMOJI_CATEGORIES}/${categoryId}`;
    }
}
exports.GetEmojiCategoryRequestCommand = GetEmojiCategoryRequestCommand;
class GetEmojiCategoryResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.emojiCategory = new emojiCategory_1.default(payload);
    }
}
exports.GetEmojiCategoryResponseCommand = GetEmojiCategoryResponseCommand;
//# sourceMappingURL=getEmojiCategoryCommand.js.map