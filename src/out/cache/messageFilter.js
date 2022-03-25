"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendableMessage_1 = require("../model/message/sendableMessage");
const types_1 = require("../model/message/types");
class MessageFilter {
    constructor() {
        this.messageType = types_1.MessageTypeFilter.ALL;
        this.customTypes = [];
        this.senderUserIds = [];
    }
    clone() {
        const filter = new MessageFilter();
        const cloned = JSON.parse(JSON.stringify(this));
        Object.keys(cloned).forEach((key) => {
            filter[key] = cloned[key];
        });
        return filter;
    }
    match(message) {
        switch (this.messageType) {
            case types_1.MessageTypeFilter.USER:
                if (message.messageType !== types_1.MessageType.USER)
                    return false;
                break;
            case types_1.MessageTypeFilter.FILE:
                if (message.messageType !== types_1.MessageType.FILE)
                    return false;
                break;
            case types_1.MessageTypeFilter.ADMIN:
                if (message.messageType !== types_1.MessageType.ADMIN)
                    return false;
                break;
        }
        if (this.customTypes.length > 0 && !this.customTypes.includes(message.customType))
            return false;
        if (this.senderUserIds.length > 0) {
            if (message instanceof sendableMessage_1.default) {
                if (!this.senderUserIds.includes(message.sender.userId)) {
                    return false;
                }
            }
            else
                return false;
        }
        return true;
    }
}
exports.default = MessageFilter;
//# sourceMappingURL=messageFilter.js.map