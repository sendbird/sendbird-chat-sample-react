"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../../utils/deundefined");
class OGImage {
    constructor(payload) {
        this.url = null;
        this.secureUrl = null;
        this.type = null;
        this.width = 0;
        this.height = 0;
        this.alt = null;
        this.url = payload['url'];
        if (payload.hasOwnProperty('secure_url')) {
            this.secureUrl = payload['secure_url'];
        }
        if (payload.hasOwnProperty('type')) {
            this.type = payload['type'];
        }
        if (payload.hasOwnProperty('width')) {
            this.width = payload['width'];
        }
        if (payload.hasOwnProperty('height')) {
            this.height = payload['height'];
        }
        if (payload.hasOwnProperty('alt')) {
            this.alt = payload['alt'];
        }
    }
    static payloadify(obj) {
        var _a, _b;
        return obj ? (0, deundefined_1.deundefined)({
            'url': obj.url,
            'secure_url': obj.secureUrl,
            'type': obj.type,
            'width': (_a = obj.width) !== null && _a !== void 0 ? _a : 0,
            'height': (_b = obj.height) !== null && _b !== void 0 ? _b : 0,
            'alt': obj.alt,
        }) : null;
    }
}
exports.default = OGImage;
//# sourceMappingURL=ogImage.js.map