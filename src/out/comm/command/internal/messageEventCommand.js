"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRemoveEventCommand = exports.MessageUpdateEventCommand = exports.shouldGiveEvent = exports.MessageEventSource = void 0;
const baseCommand_1 = require("../../../core/command/baseCommand");
var MessageEventSource;
(function (MessageEventSource) {
    MessageEventSource[MessageEventSource["UNKNOWN"] = 0] = "UNKNOWN";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_SENT_SUCCESS"] = 1] = "EVENT_MESSAGE_SENT_SUCCESS";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_SENT_FAILED"] = 2] = "EVENT_MESSAGE_SENT_FAILED";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_SENT_PENDING"] = 3] = "EVENT_MESSAGE_SENT_PENDING";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_RECEIVED"] = 4] = "EVENT_MESSAGE_RECEIVED";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_UPDATED"] = 5] = "EVENT_MESSAGE_UPDATED";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_DELETED"] = 6] = "EVENT_MESSAGE_DELETED";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_READ"] = 7] = "EVENT_MESSAGE_READ";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_DELIVERED"] = 8] = "EVENT_MESSAGE_DELIVERED";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_REACTION_UPDATED"] = 9] = "EVENT_MESSAGE_REACTION_UPDATED";
    MessageEventSource[MessageEventSource["EVENT_MESSAGE_THREADINFO_UPDATED"] = 10] = "EVENT_MESSAGE_THREADINFO_UPDATED";
    MessageEventSource[MessageEventSource["EVENT_BOTTOM"] = 11] = "EVENT_BOTTOM";
    MessageEventSource[MessageEventSource["REQUEST_MESSAGE"] = 12] = "REQUEST_MESSAGE";
    MessageEventSource[MessageEventSource["REQUEST_THREADED_MESSAGE"] = 13] = "REQUEST_THREADED_MESSAGE";
    MessageEventSource[MessageEventSource["REQUEST_MESSAGE_CHANGELOGS"] = 14] = "REQUEST_MESSAGE_CHANGELOGS";
    MessageEventSource[MessageEventSource["SYNC_MESSAGE_FILL"] = 15] = "SYNC_MESSAGE_FILL";
    MessageEventSource[MessageEventSource["SYNC_MESSAGE_BACKGROUND"] = 16] = "SYNC_MESSAGE_BACKGROUND";
    MessageEventSource[MessageEventSource["SYNC_MESSAGE_CHANGELOGS"] = 17] = "SYNC_MESSAGE_CHANGELOGS";
})(MessageEventSource = exports.MessageEventSource || (exports.MessageEventSource = {}));
const shouldGiveEvent = (source) => {
    return source < MessageEventSource.EVENT_BOTTOM ||
        source === MessageEventSource.SYNC_MESSAGE_FILL ||
        source === MessageEventSource.SYNC_MESSAGE_CHANGELOGS;
};
exports.shouldGiveEvent = shouldGiveEvent;
class MessageUpdateEventCommand extends baseCommand_1.default {
    constructor({ messages, source }) {
        super();
        this.messages = messages;
        this.source = source;
    }
}
exports.MessageUpdateEventCommand = MessageUpdateEventCommand;
class MessageRemoveEventCommand extends baseCommand_1.default {
    constructor({ messageIds, source }) {
        super();
        this.messageIds = messageIds;
        this.source = source;
    }
}
exports.MessageRemoveEventCommand = MessageRemoveEventCommand;
//# sourceMappingURL=messageEventCommand.js.map