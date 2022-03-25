"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emoji_1 = require("./emoji");
class EmojiCategory {
    constructor(payload) {
        var _a, _b, _c;
        this.id = 0;
        this.name = null;
        this.url = null;
        this.emojis = [];
        this.id = (_a = payload['id']) !== null && _a !== void 0 ? _a : 0;
        this.name = (_b = payload['name']) !== null && _b !== void 0 ? _b : '';
        this.url = (_c = payload['url']) !== null && _c !== void 0 ? _c : '';
        this.emojis = payload['emojis'] ? payload['emojis'].map((emoji) => new emoji_1.default(emoji)) : [];
    }
}
exports.default = EmojiCategory;
//# sourceMappingURL=emojiCategory.js.map