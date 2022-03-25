"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileMessageQueue_1 = require("../comm/fileMessageQueue");
const userMessage_1 = require("../model/message/userMessage");
const fileMessage_1 = require("../model/message/fileMessage");
const adminMessage_1 = require("../model/message/adminMessage");
const sender_1 = require("../model/message/sender");
const types_1 = require("../model/message/types");
const messageEventCommand_1 = require("../comm/command/internal/messageEventCommand");
const getMessageCommand_1 = require("../comm/command/message/getMessageCommand");
const getMessagesCommand_1 = require("../comm/command/message/getMessagesCommand");
const getMessageChangeLogsCommand_1 = require("../comm/command/message/getMessageChangeLogsCommand");
const serializer_1 = require("../utils/serializer");
const deundefined_1 = require("../utils/deundefined");
const _managerMap = {};
class MessageManager {
    constructor(_iid, { sdkState, dispatcher, requestQueue, }) {
        this._iid = _iid;
        this._sdkState = sdkState;
        this._requestQueue = requestQueue;
        this._dispatcher = dispatcher;
        this.fileMessageQueue = new fileMessageQueue_1.default({
            sdkState,
            dispatcher,
            requestQueue,
        });
        _managerMap[_iid] = this;
    }
    static of(_iid) {
        return _managerMap[_iid];
    }
    buildMessageFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        switch (obj['messageType']) {
            case types_1.MessageType.USER: return new userMessage_1.default(this._iid, userMessage_1.default.payloadify(obj));
            case types_1.MessageType.FILE: return new fileMessage_1.default(this._iid, fileMessage_1.default.payloadify(obj));
            case types_1.MessageType.ADMIN: return new adminMessage_1.default(this._iid, adminMessage_1.default.payloadify(obj));
        }
        return null;
    }
    buildSenderFromSerializedData(serialized) {
        const obj = (0, serializer_1.deserialize)(serialized);
        return new sender_1.default(this._iid, sender_1.default.payloadify(obj));
    }
    getMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new getMessageCommand_1.GetMessageRequestCommand(params);
            const response = yield this._requestQueue.send(request);
            const { message } = response.as(getMessageCommand_1.GetMessageResponseCommand);
            return message;
        });
    }
    getMessagesByTimestamp(channelUrl, channelType, ts, params, source = messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new getMessagesCommand_1.GetMessagesRequestCommand(Object.assign({ channelType,
                channelUrl, timestamp: ts }, params));
            const response = yield this._requestQueue.send(request);
            const { messages } = response.as(getMessagesCommand_1.GetMessagesResponseCommand);
            this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({ messages, source }));
            return messages;
        });
    }
    getThreadedMessages(parentMessage, ts, params, source = messageEventCommand_1.MessageEventSource.REQUEST_THREADED_MESSAGE) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new getMessagesCommand_1.GetMessagesRequestCommand(Object.assign(Object.assign({ channelUrl: parentMessage.channelUrl, channelType: parentMessage.channelType, timestamp: ts }, params), { parentMessageId: parentMessage.messageId, includeReplies: true, includeThreadInfo: true }));
            const response = yield this._requestQueue.send(request);
            const { messages } = response.as(getMessagesCommand_1.GetMessagesResponseCommand);
            this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({ messages, source }));
            return {
                parentMessage,
                threadedMessages: messages.filter((message) => message.parentMessageId !== parentMessage.messageId),
            };
        });
    }
    getMessageChangelogs(channelUrl, channelType, token, params, source = messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE_CHANGELOGS) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new getMessageChangeLogsCommand_1.GetMessageChangeLogsRequestCommand((0, deundefined_1.deundefined)(Object.assign({ channelType,
                channelUrl, timestamp: (typeof token === 'number') ? token : null, token: (typeof token === 'string') ? token : null }, params)));
            const response = yield this._requestQueue.send(request);
            const { updatedMessages, deletedMessagesInfo, hasMore, nextToken, } = response.as(getMessageChangeLogsCommand_1.GetMessageChangeLogsResponseCommand);
            const deletedMessageIds = deletedMessagesInfo.map((info) => info.messageId);
            if (updatedMessages.length > 0) {
                this._dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({ messages: updatedMessages, source }));
            }
            if (deletedMessageIds.length > 0) {
                this._dispatcher.dispatch(new messageEventCommand_1.MessageRemoveEventCommand({ messageIds: deletedMessageIds, source }));
            }
            return {
                updatedMessages,
                deletedMessageIds,
                hasMore,
                token: nextToken,
            };
        });
    }
}
exports.default = MessageManager;
//# sourceMappingURL=messageManager.js.map