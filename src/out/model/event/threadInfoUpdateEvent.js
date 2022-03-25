"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instancedObject_1 = require("../instancedObject");
const threadInfo_1 = require("../message/threadInfo");
const validator_1 = require("../../utils/validator");
class ThreadInfoUpdateEvent extends instancedObject_1.default {
    constructor(_iid, payload) {
        super(_iid);
        this.threadInfo = null;
        this.targetMessageId = 0;
        this.channelUrl = null;
        this.channelType = null;
        const threadInfo = payload['thread_info'];
        const targetMessageId = payload['root_message_id'];
        const channelUrl = payload['channel_url'];
        const channelType = payload['channel_type'];
        if (threadInfo &&
            (0, validator_1.isTypeOf)('object', threadInfo) &&
            (0, validator_1.isTypeOf)('number', targetMessageId) &&
            (0, validator_1.isTypeOf)('string', channelUrl) &&
            (0, validator_1.isTypeOf)('string', channelType)) {
            this.threadInfo = new threadInfo_1.default(_iid, threadInfo);
            this.targetMessageId = targetMessageId;
            this.channelUrl = channelUrl;
            this.channelType = channelType;
        }
    }
}
exports.default = ThreadInfoUpdateEvent;
//# sourceMappingURL=threadInfoUpdateEvent.js.map