"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactionEvent_1 = require("../event/reactionEvent");
const deundefined_1 = require("../../utils/deundefined");
const validator_1 = require("../../utils/validator");
class Reaction {
    constructor(payload) {
        var _a;
        const key = payload['key'];
        const userIds = (_a = [...payload['user_ids']]) !== null && _a !== void 0 ? _a : [];
        const updatedAt = payload['updated_at'];
        if ((0, validator_1.isTypeOf)('string', key) &&
            key &&
            (0, validator_1.isArrayOf)('string', userIds) &&
            userIds.length > 0 &&
            (0, validator_1.isTypeOf)('number', updatedAt)) {
            this.key = key;
            this.userIds = userIds;
            this.updatedAt = updatedAt;
        }
        const initialVersion = {};
        for (const userId of this.userIds) {
            initialVersion[userId] = this.updatedAt;
        }
        this._version = initialVersion;
    }
    get isEmpty() {
        return this.userIds.length === 0;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)({
            'key': obj.key,
            'user_ids': obj.userIds,
            'updated_at': obj.updatedAt,
        }) : null;
    }
    applyEvent(reactionEvent) {
        if (reactionEvent.key === this.key) {
            if (this.updatedAt <= reactionEvent.updatedAt) {
                if (!this._version[reactionEvent.userId] || this._version[reactionEvent.userId] <= reactionEvent.updatedAt) {
                    const index = this.userIds.indexOf(reactionEvent.userId);
                    switch (reactionEvent.operation) {
                        case reactionEvent_1.ReactionEventOperation.ADD:
                            if (index < 0) {
                                this.userIds.push(reactionEvent.userId);
                            }
                            break;
                        case reactionEvent_1.ReactionEventOperation.DELETE:
                            if (index >= 0) {
                                this.userIds.splice(index, 1);
                            }
                            break;
                    }
                    this._version[reactionEvent.userId] = reactionEvent.updatedAt;
                }
                this.updatedAt = Math.max(this.updatedAt, reactionEvent.updatedAt);
            }
        }
    }
}
exports.default = Reaction;
//# sourceMappingURL=reaction.js.map