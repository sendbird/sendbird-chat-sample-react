"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emojiCategory_1 = require("./emojiCategory");
class EmojiContainer {
    constructor(payload) {
        this.emojiHash = null;
        this.emojiCategories = [];
        this.emojiHash = payload['emoji_hash'] || '';
        this.emojiCategories = payload['emoji_categories']
            ? payload['emoji_categories'].map((emojiCategory) => new emojiCategory_1.default(emojiCategory))
            : [];
    }
}
exports.default = EmojiContainer;
//# sourceMappingURL=emojiContainer.js.map