"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deundefined_1 = require("../../utils/deundefined");
const ogImage_1 = require("./ogImage");
class OGMetaData {
    constructor(payload) {
        this.title = null;
        this.url = null;
        this.description = null;
        this.defaultImage = null;
        if (payload.hasOwnProperty('og:title')) {
            this.title = payload['og:title'];
        }
        if (payload.hasOwnProperty('og:url')) {
            this.url = payload['og:url'];
        }
        if (payload.hasOwnProperty('og:description')) {
            this.description = payload['og:description'];
        }
        if (payload.hasOwnProperty('og:image')) {
            this.defaultImage = new ogImage_1.default(payload['og:image']);
        }
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)({
            'og:title': obj.title,
            'og:url': obj.url,
            'og:description': obj.description,
            'og:image': obj.defaultImage ? ogImage_1.default.payloadify(obj.defaultImage) : null,
        }) : null;
    }
}
exports.default = OGMetaData;
//# sourceMappingURL=ogMetaData.js.map