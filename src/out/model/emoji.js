"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emoji {
    constructor(payload) {
        this.key = null;
        this.url = null;
        this.key = payload['key'];
        this.url = payload['url'];
    }
}
exports.default = Emoji;
//# sourceMappingURL=emoji.js.map