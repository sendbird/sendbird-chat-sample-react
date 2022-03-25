"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instancedObject_1 = require("../instancedObject");
const user_1 = require("../user");
const deundefined_1 = require("../../utils/deundefined");
const validator_1 = require("../../utils/validator");
class ThreadInfo extends instancedObject_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c;
        super(_iid);
        this.replyCount = 0;
        this.mostRepliedUsers = null;
        this.lastRepliedAt = 0;
        this.updatedAt = 0;
        this.replyCount = (_a = payload['reply_count']) !== null && _a !== void 0 ? _a : 0;
        this.mostRepliedUsers = (payload.hasOwnProperty('most_replies')
            && (0, validator_1.isArrayOf)('object', payload['most_replies']))
            ? payload['most_replies'].map((userPayload) => new user_1.default(this._iid, userPayload))
            : [];
        this.lastRepliedAt = (_b = payload['last_replied_at']) !== null && _b !== void 0 ? _b : 0;
        this.updatedAt = (_c = payload['updated_at']) !== null && _c !== void 0 ? _c : 0;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'reply_count': obj.replyCount, 'most_replies': (Array.isArray(obj.mostRepliedUsers))
                ? obj.mostRepliedUsers.map(user => user_1.default.payloadify(user))
                : [], 'last_replied_at': obj.lastRepliedAt, 'updated_at': obj.updatedAt })) : null;
    }
}
exports.default = ThreadInfo;
//# sourceMappingURL=threadInfo.js.map