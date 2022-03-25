"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../../utils/deundefined");
class Thumbnail {
    constructor(payload) {
        var _a, _b;
        this.url = null;
        this.width = 0;
        this.height = 0;
        this.realWidth = 0;
        this.realHeight = 0;
        this.url = payload['url'];
        this.width = payload['width'];
        this.height = payload['height'];
        this.realWidth = (_a = payload['real_width']) !== null && _a !== void 0 ? _a : payload['width'];
        this.realHeight = (_b = payload['real_height']) !== null && _b !== void 0 ? _b : payload['height'];
    }
    static payloadify(obj) {
        return obj
            ? (0, deundefined_1.deundefined)({
                url: '',
                width: obj.maxWidth,
                height: obj.maxHeight,
                real_width: 0,
                real_height: 0,
            })
            : null;
    }
    get plainUrl() {
        return this.url.split('?auth=')[0];
    }
}
exports.default = Thumbnail;
//# sourceMappingURL=thumbnail.js.map