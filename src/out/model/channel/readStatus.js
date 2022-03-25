"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instancedObject_1 = require("../instancedObject");
const user_1 = require("../user");
const types_1 = require("./types");
class ReadStatus extends instancedObject_1.default {
    constructor(_iid, payload) {
        var _a, _b;
        super(_iid);
        this.channelUrl = (_a = payload['channel_url']) !== null && _a !== void 0 ? _a : '';
        this.channelType = (_b = payload['channel_type']) !== null && _b !== void 0 ? _b : types_1.ChannelType.GROUP;
        this.reader = new user_1.default(this._iid, payload['user']);
        this.readAt = payload['ts'];
    }
}
exports.default = ReadStatus;
//# sourceMappingURL=readStatus.js.map