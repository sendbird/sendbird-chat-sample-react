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
const messageEventCommand_1 = require("../../comm/command/internal/messageEventCommand");
const sendableMessage_1 = require("../../model/message/sendableMessage");
class MessageBroadcast {
    constructor({ messageCache, unsentMessageCache, dispatcher }) {
        this._observers = new Map();
        dispatcher.on((command) => __awaiter(this, void 0, void 0, function* () {
            if (command instanceof messageEventCommand_1.MessageUpdateEventCommand) {
                const { messages, source } = command;
                const sentMessages = messages.filter((message) => message.messageId > 0);
                const unsentMessages = messages.filter((message) => message.messageId === 0);
                if (sentMessages.length > 0) {
                    yield messageCache.upsert(sentMessages);
                    yield unsentMessageCache.remove(sentMessages
                        .map((message) => (message instanceof sendableMessage_1.default) ? message.reqId : null)
                        .filter((reqId) => reqId !== null));
                    this._broadcastUpdateEvent(sentMessages, source);
                }
                if (unsentMessages.length > 0) {
                    yield unsentMessageCache.upsert(unsentMessages);
                    this._broadcastUpdateEvent(unsentMessages, source);
                }
            }
            else if (command instanceof messageEventCommand_1.MessageRemoveEventCommand) {
                const { messageIds, source } = command;
                yield messageCache.remove(messageIds);
                this._broadcastRemoveEvent(messageIds, source);
            }
        }));
    }
    _broadcastUpdateEvent(messages, source) {
        for (const observer of this._observers.values()) {
            observer.onUpdate(messages, source);
        }
    }
    _broadcastRemoveEvent(messageIds, source) {
        for (const observer of this._observers.values()) {
            observer.onRemove(messageIds, source);
        }
    }
    subscribe(key, observer) {
        this._observers.set(key, observer);
    }
    unsubscribe(key) {
        this._observers.delete(key);
    }
}
exports.default = MessageBroadcast;
//# sourceMappingURL=broadcast.js.map