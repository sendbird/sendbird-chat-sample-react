"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTypeToPayloadType = void 0;
const instancedObject_1 = require("../instancedObject");
const user_1 = require("../user");
const types_1 = require("./types");
const threadInfo_1 = require("./threadInfo");
const reaction_1 = require("./reaction");
const messageMetaArray_1 = require("./messageMetaArray");
const ogMetaData_1 = require("./ogMetaData");
const appleCriticalAlertOptions_1 = require("./appleCriticalAlertOptions");
const types_2 = require("../channel/types");
const serializer_1 = require("../../utils/serializer");
const validator_1 = require("../../utils/validator");
const deundefined_1 = require("../../utils/deundefined");
const messageTypeToPayloadType = (messageType) => {
    switch (messageType) {
        case types_1.MessageType.BASE: return '';
        case types_1.MessageType.USER: return 'MESG';
        case types_1.MessageType.FILE: return 'FILE';
        case types_1.MessageType.ADMIN: return 'ADMM';
    }
};
exports.messageTypeToPayloadType = messageTypeToPayloadType;
class BaseMessage extends instancedObject_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        super(_iid);
        this.channelUrl = null;
        this.channelType = types_2.ChannelType.BASE;
        this.messageId = 0;
        this.parentMessageId = null;
        this.silent = false;
        this.isOperatorMessage = false;
        this.messageType = types_1.MessageType.BASE;
        this.data = null;
        this.customType = null;
        this.mentionType = null;
        this.mentionedUsers = [];
        this.threadInfo = null;
        this.reactions = [];
        this.metaArrays = [];
        this.ogMetaData = null;
        this.appleCriticalAlertOptions = null;
        this.createdAt = 0;
        this.updatedAt = 0;
        this.messageId = (_b = (_a = payload['msg_id']) !== null && _a !== void 0 ? _a : payload['message_id']) !== null && _b !== void 0 ? _b : 0;
        this.channelUrl = payload['channel_url'];
        this.channelType = (0, validator_1.isEnumOf)(types_2.ChannelType, payload['channel_type']) ?
            payload['channel_type'] :
            types_2.ChannelType.GROUP;
        if (payload['channel']) {
            this.channelUrl = payload['channel'].url;
            this.channelType = payload['channel'].channelType;
        }
        this.parentMessageId = (_c = payload['parent_message_id']) !== null && _c !== void 0 ? _c : 0;
        this.data = (_d = payload['data']) !== null && _d !== void 0 ? _d : '';
        this.customType = (_e = payload['custom_type']) !== null && _e !== void 0 ? _e : '';
        this.mentionType = (0, validator_1.isEnumOf)(types_1.MentionType, payload['mention_type']) ?
            payload['mention_type'] :
            null;
        this.mentionedUsers = payload['mentioned_users'] ?
            payload['mentioned_users'].map((payload) => new user_1.default(this._iid, payload)) :
            [];
        this.threadInfo = payload['thread_info'] ? new threadInfo_1.default(this._iid, payload['thread_info']) : null;
        this.reactions = payload['reactions'] ?
            payload['reactions'].map((payload) => new reaction_1.default(payload)) :
            [];
        const metaArrayBody = (_f = payload['metaarray']) !== null && _f !== void 0 ? _f : {};
        const metaArrayKeyOrder = (_g = payload['metaarray_key_order']) !== null && _g !== void 0 ? _g : Object.keys(metaArrayBody).sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < metaArrayKeyOrder.length; i++) {
            const metaArrayKey = metaArrayKeyOrder[i];
            this.metaArrays.push(new messageMetaArray_1.default({
                key: metaArrayKey,
                value: metaArrayBody[metaArrayKey] || []
            }));
        }
        if (payload['sorted_metaarray']) {
            this.metaArrays = payload['sorted_metaarray']
                .map((payload) => new messageMetaArray_1.default(payload));
        }
        this.ogMetaData = payload['og_tag'] ? new ogMetaData_1.default(payload['og_tag']) : null;
        this.silent = (_h = payload['silent']) !== null && _h !== void 0 ? _h : false;
        this.isOperatorMessage = (_j = payload['is_op_msg']) !== null && _j !== void 0 ? _j : false;
        this.appleCriticalAlertOptions = payload['apple_critical_alert_options'] ?
            new appleCriticalAlertOptions_1.default(payload['apple_critical_alert_options']) :
            null;
        this.createdAt = (_l = (_k = payload['created_at']) !== null && _k !== void 0 ? _k : payload['ts']) !== null && _l !== void 0 ? _l : 0;
        this.updatedAt = (_m = payload['updated_at']) !== null && _m !== void 0 ? _m : 0;
    }
    static payloadify(obj) {
        return obj ? (0, deundefined_1.deundefined)(Object.assign(Object.assign({}, super.payloadify(obj)), { 'channel_url': obj.channelUrl, 'channel_type': obj.channelType, 'message_id': obj.messageId, 'type': (0, exports.messageTypeToPayloadType)(obj.messageType), 'parent_message_id': obj.parentMessageId, 'data': obj.data, 'custom_type': obj.customType, 'mention_type': obj.mentionType, 'mentioned_users': obj.mentionedUsers.map((user) => user_1.default.payloadify(user)), 'thread_info': obj.threadInfo ? threadInfo_1.default.payloadify(obj.threadInfo) : null, 'reactions': obj.reactions.map((reaction) => reaction_1.default.payloadify(reaction)), 'sorted_metaarray': obj.metaArrays.map((metaArray) => messageMetaArray_1.default.payloadify(metaArray)), 'og_tag': ogMetaData_1.default.payloadify(obj.ogMetaData), 'silent': obj.silent, 'is_op_msg': obj.isOperatorMessage, 'apple_critical_alert_options': appleCriticalAlertOptions_1.default.payloadify(obj.appleCriticalAlertOptions), 'created_at': obj.createdAt, 'updated_at': obj.updatedAt })) : null;
    }
    isIdentical(message) {
        return this.messageId === message.messageId;
    }
    isEqual(message) {
        return (0, validator_1.deepEqual)(this, message);
    }
    isUserMessage() {
        return this.messageType === types_1.MessageType.USER;
    }
    isFileMessage() {
        return this.messageType === types_1.MessageType.FILE;
    }
    isAdminMessage() {
        return this.messageType === types_1.MessageType.ADMIN;
    }
    serialize() {
        return (0, serializer_1.serialize)(this);
    }
    getMetaArraysByKeys(keys) {
        return this.metaArrays.filter((metaArray) => keys.includes(metaArray.key));
    }
    applyThreadInfoUpdateEvent(threadInfoUpdateEvent) {
        if (this.parentMessageId === threadInfoUpdateEvent.targetMessageId) {
            this.threadInfo = threadInfoUpdateEvent.threadInfo;
        }
        return false;
    }
    applyReactionEvent(reactionEvent) {
        if (this.messageId === reactionEvent.messageId) {
            let isKeyFound = false;
            for (let i = 0; i < this.reactions.length; i++) {
                if (this.reactions[i].key === reactionEvent.key) {
                    this.reactions[i].applyEvent(reactionEvent);
                    if (this.reactions[i].isEmpty) {
                        this.reactions.splice(i, 1);
                    }
                    isKeyFound = true;
                    break;
                }
            }
            if (!isKeyFound && reactionEvent.operation === 'add') {
                this.reactions.push(new reaction_1.default(reaction_1.default.payloadify({
                    key: reactionEvent.key,
                    userIds: [reactionEvent.userId],
                    updatedAt: reactionEvent.updatedAt,
                })));
            }
        }
    }
}
exports.default = BaseMessage;
//# sourceMappingURL=baseMessage.js.map