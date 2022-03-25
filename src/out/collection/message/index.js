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
exports.MessageCollectionInitHandler = exports.MessageCollectionInitPolicy = void 0;
const vault_1 = require("../../vault");
const sync_1 = require("../sync");
const context_1 = require("../groupChannel/context");
const context_2 = require("./context");
const backgroundSync_1 = require("./backgroundSync");
const changelogSync_1 = require("./changelogSync");
const messageFilter_1 = require("../../cache/messageFilter");
const const_1 = require("../../cache/const");
const groupChannelManager_1 = require("../../manager/groupChannelManager");
const messageManager_1 = require("../../manager/messageManager");
const connectionStateChangeCommand_1 = require("../../comm/command/internal/connectionStateChangeCommand");
const stateType_1 = require("../../comm/connectionManager/stateType");
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const messageEventCommand_1 = require("../../comm/command/internal/messageEventCommand");
const checkMessageHugeGapCommand_1 = require("../../comm/command/message/checkMessageHugeGapCommand");
const utils_1 = require("../groupChannel/utils");
const utils_2 = require("./utils");
const uuid_1 = require("../../utils/uuid");
const retry_1 = require("../../utils/retry");
const timeRange_1 = require("../../utils/timeRange");
const HUGE_GAP_CHECK_RETRY = 3;
var MessageCollectionInitPolicy;
(function (MessageCollectionInitPolicy) {
    MessageCollectionInitPolicy["CACHE_AND_REPLACE_BY_API"] = "cache_and_replace_by_api";
    MessageCollectionInitPolicy["API_ONLY"] = "api_only";
})(MessageCollectionInitPolicy = exports.MessageCollectionInitPolicy || (exports.MessageCollectionInitPolicy = {}));
class MessageCollectionInitHandler {
    invokeResponse(source, err, messages) {
        try {
            switch (source) {
                case 'local':
                    this._onResponseFromLocal(err, messages);
                    break;
                case 'remote':
                    this._onResponseFromRemote(err, messages);
                    break;
            }
        }
        catch (err) { }
    }
    onResponseFromLocal(handler) {
        this._onResponseFromLocal = handler;
        return this;
    }
    ;
    onResponseFromRemote(handler) {
        this._onResponseFromRemote = handler;
        return this;
    }
}
exports.MessageCollectionInitHandler = MessageCollectionInitHandler;
class MessageCollection {
    constructor(_iid, { channel, filter, limit, }) {
        this._channel = null;
        this._messages = [];
        this._readReceiptMap = new Map();
        this._deliveryReceiptMap = new Map();
        this._hugeGapCheckTimer = null;
        this._iid = _iid;
        this._key = `mc-${(0, uuid_1.uuid)()}`;
        this.filter = filter !== null && filter !== void 0 ? filter : new messageFilter_1.default();
        this._channel = channel;
        this._syncRange = new timeRange_1.default({});
        this._hasPrevious = true;
        this._hasNext = true;
        this._limit = limit || const_1.DEFAULT_MESSAGE_LIMIT;
        const groupChannelManager = groupChannelManager_1.default.of(this._iid);
        groupChannelManager.subscribeGroupChannelEvent(this._key, {
            onUpdate: (channels, source) => {
                const index = (0, utils_1.indexOfChannel)(channels, this._channel);
                if (index >= 0) {
                    const context = new context_1.default(source);
                    this._channel = channels[index];
                    this._handler.onChannelUpdated(context, this.channel);
                    switch (source) {
                        case groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_READ: {
                            const updatedMessages = [];
                            for (const message of this._messages) {
                                const currentCount = this._readReceiptMap.get(message.messageId);
                                if (currentCount > 0) {
                                    const updatedCount = this._channel.getUnreadMemberCount(message);
                                    if (currentCount !== updatedCount)
                                        updatedMessages.push(message);
                                }
                            }
                            if (updatedMessages.length > 0)
                                this._updateMessagesToView(updatedMessages, messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_READ);
                            break;
                        }
                        case groupChannelEventCommand_1.GroupChannelEventSource.EVENT_CHANNEL_DELIVERED: {
                            const updatedMessages = [];
                            for (const message of this._messages) {
                                const currentCount = this._deliveryReceiptMap.get(message.messageId);
                                if (currentCount > 0) {
                                    const updatedCount = this._channel.getUndeliveredMemberCount(message);
                                    if (currentCount !== updatedCount)
                                        updatedMessages.push(message);
                                }
                            }
                            if (updatedMessages.length > 0)
                                this._updateMessagesToView(updatedMessages, messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_READ);
                            break;
                        }
                    }
                }
            },
            onRemove: (channelUrls, source) => {
                const index = channelUrls.indexOf(this.channel.url);
                if (index >= 0) {
                    const context = new context_1.default(source);
                    this._handler.onChannelRemoved(context, this.channel.url);
                }
            },
        });
        groupChannelManager.subscribeMessageEvent(this._key, {
            onUpdate: (messages, source) => {
                const matchedMessages = [];
                const unmatchedMessageIds = [];
                for (const message of messages) {
                    if (message.channelUrl === this._channel.url) {
                        this.filter.match(message) ?
                            matchedMessages.push(message) :
                            unmatchedMessageIds.push(message.messageId);
                    }
                }
                if ((0, messageEventCommand_1.shouldGiveEvent)(source)) {
                    if (matchedMessages.length > 0) {
                        switch (source) {
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_FAILED:
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_SUCCESS:
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_UPDATED:
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_THREADINFO_UPDATED:
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_REACTION_UPDATED:
                            case messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_CHANGELOGS:
                                this._updateMessagesToView(matchedMessages, source);
                                break;
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_SENT_PENDING:
                            case messageEventCommand_1.MessageEventSource.EVENT_MESSAGE_RECEIVED:
                                this._addMessagesToView(matchedMessages, source);
                                break;
                            case messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_FILL:
                                this._addMessagesToView(matchedMessages, source);
                                break;
                        }
                    }
                    if (unmatchedMessageIds.length > 0)
                        this._removeMessagesFromView(unmatchedMessageIds, source);
                }
            },
            onRemove: (messageIds, source) => {
                this._removeMessagesFromView(messageIds, source);
            },
        });
        backgroundSync_1.default.of(this._iid, this._channel).resume();
        changelogSync_1.default.of(this._iid, this._channel).resume();
        this._prevFill = new sync_1.default(this._key, (ts) => __awaiter(this, void 0, void 0, function* () {
            const messages = yield this._getRemoteMessages(ts, { prevLimit: this._limit, source: messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_FILL });
            if (messages.length > 0) {
                const currentOldestMessageTs = Math.min(...this._messages.map((message) => message.createdAt));
                this._syncRange.extends(currentOldestMessageTs);
                return {
                    hasNext: messages.length >= this._limit && this._syncRange.top > currentOldestMessageTs,
                    nextToken: this._syncRange.top,
                };
            }
            return {
                hasNext: false,
                nextToken: 0,
            };
        }));
        this._nextFill = new sync_1.default(this._key, (ts) => __awaiter(this, void 0, void 0, function* () {
            const messages = yield this._getRemoteMessages(ts, { nextLimit: this._limit, source: messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_FILL });
            if (messages.length > 0) {
                const currentLatestMessageTs = Math.max(...this._messages.map((message) => message.createdAt));
                this._syncRange.extends(currentLatestMessageTs);
                return {
                    hasNext: messages.length >= this._limit && this._syncRange.bottom < currentLatestMessageTs,
                    nextToken: this._syncRange.bottom,
                };
            }
            return {
                hasNext: false,
                nextToken: 0,
            };
        }));
        const { dispatcher } = vault_1.default.of(this._iid);
        dispatcher.on((command) => {
            if (command instanceof connectionStateChangeCommand_1.default) {
                switch (command.stateType) {
                    case stateType_1.ConnectionStateType.CONNECTED:
                        this._checkHugeGap();
                        break;
                    default:
                        this._prevFill.stop();
                        this._nextFill.stop();
                }
            }
        });
    }
    get channel() {
        return this._channel;
    }
    get messages() {
        return [...this._messages];
    }
    get hasPrevious() {
        return this._hasPrevious;
    }
    get hasNext() {
        return this._hasNext;
    }
    setEventHandler(handler) {
        this._handler = handler;
    }
    _addMessagesToView(messages, source) {
        const addedMessages = [];
        const updatedMessages = [];
        for (const message of messages) {
            if (message.messageId > 0) {
                const index = (0, utils_2.indexOfMessage)(this._messages, message);
                if (index < 0) {
                    const place = (0, utils_2.placeOfMessage)(this._messages, message);
                    addedMessages.push(message);
                    this._messages.splice(place, 0, message);
                }
                else {
                    updatedMessages.push(message);
                    this._messages[index] = message;
                }
                this._readReceiptMap.set(message.messageId, this._channel.getUnreadMemberCount(message));
                this._deliveryReceiptMap.set(message.messageId, this._channel.getUndeliveredMemberCount(message));
            }
            else {
                addedMessages.push(message);
            }
        }
        if ((0, messageEventCommand_1.shouldGiveEvent)(source)) {
            const context = new context_2.default(source);
            if (addedMessages.length > 0)
                this._handler.onMessageAdded(context, this.channel, addedMessages);
            if (updatedMessages.length > 0)
                this._handler.onMessageUpdated(context, this.channel, updatedMessages);
        }
    }
    _updateMessagesToView(messages, source) {
        const updatedMessages = [];
        for (const message of messages) {
            const index = (0, utils_2.indexOfMessage)(this._messages, message);
            if (index >= 0) {
                updatedMessages.push(message);
                this._messages[index] = message;
            }
        }
        if ((0, messageEventCommand_1.shouldGiveEvent)(source)) {
            const context = new context_2.default(source);
            if (updatedMessages.length > 0)
                this._handler.onMessageUpdated(context, this.channel, updatedMessages);
        }
        return updatedMessages;
    }
    _removeMessagesFromView(messageIds, source) {
        const removedMessageIds = [];
        for (const messageId of messageIds) {
            const index = this._messages.findIndex((message) => message.messageId === messageId);
            if (index >= 0) {
                removedMessageIds.push(this._messages[index].messageId);
                this._messages.splice(index, 1);
            }
        }
        if ((0, messageEventCommand_1.shouldGiveEvent)(source)) {
            if (removedMessageIds.length > 0) {
                const context = new context_2.default(source);
                if (removedMessageIds.length > 0)
                    this._handler.onMessageRemoved(context, this.channel, removedMessageIds);
            }
        }
        return removedMessageIds;
    }
    _getLocalMessages(ts, { prevLimit = 0, nextLimit = 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupChannelManager = groupChannelManager_1.default.of(this._iid);
            const prevMessages = (prevLimit > 0) ? yield groupChannelManager.getMessagesFromCache(this._channel.url, ts, 'prev', this.filter, this._limit) : [];
            const nextMessages = (nextLimit > 0) ? yield groupChannelManager.getMessagesFromCache(this._channel.url, ts, 'next', this.filter, this._limit) : [];
            if (prevMessages.length > 0 && nextMessages.length) {
                const prevMessageIds = prevMessages.map((m) => m.messageId);
                for (const i in nextMessages) {
                    if (prevMessageIds.includes(nextMessages[i].messageId)) {
                        nextMessages.splice(parseInt(i), 1);
                        break;
                    }
                }
            }
            return [...prevMessages, ...nextMessages]
                .sort((a, b) => b.createdAt - a.createdAt);
        });
    }
    _getRemoteMessages(ts, { prevLimit = 0, nextLimit = 0, source = messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageManager = messageManager_1.default.of(this._iid);
            return (prevLimit > 0 || nextLimit > 0) ?
                yield messageManager.getMessagesByTimestamp(this._channel.url, this._channel.channelType, ts, Object.assign(Object.assign({}, this.filter), { prevResultSize: prevLimit, nextResultSize: nextLimit }), source) : [];
        });
    }
    _checkHugeGap() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._messages.length > 0) {
                const prevStart = Math.min(...this._messages.map((m) => m.createdAt));
                const prevEnd = this._syncRange.top;
                const nextStart = this._syncRange.bottom;
                const nextEnd = this._hasNext ? Math.max(...this._messages.map((m) => m.createdAt)) : Number.MAX_SAFE_INTEGER;
                if (prevStart < prevEnd || nextStart < nextEnd) {
                    const groupChannelManager = groupChannelManager_1.default.of(this._iid);
                    const prevCount = yield groupChannelManager.getCachedMessageCountBetween(this._channel.url, this.filter, prevStart, prevEnd);
                    const nextCount = yield groupChannelManager.getCachedMessageCountBetween(this._channel.url, this.filter, nextStart, nextEnd);
                    yield (0, retry_1.asyncRetry)(() => __awaiter(this, void 0, void 0, function* () {
                        const { dispatcher, requestQueue } = vault_1.default.of(this._iid);
                        const request = new checkMessageHugeGapCommand_1.CheckMessageHugeGapRequestCommand(Object.assign({ channelUrl: this._channel.url, channelType: this._channel.channelType, prevStart,
                            prevEnd,
                            prevCount,
                            nextStart,
                            nextEnd,
                            nextCount }, this.filter));
                        const response = yield requestQueue.send(request);
                        const { isHugeGap, prevMessages = [], prevHasMore, nextMessages = [], nextHasmore, } = response.as(checkMessageHugeGapCommand_1.CheckMessageHugeGapResponseCommand);
                        if (!isHugeGap) {
                            this._hasPrevious = prevHasMore;
                            this._hasNext = nextHasmore;
                            const currentOldestMessageTs = Math.min(...this._messages.map((m) => m.createdAt));
                            const currentLatestMessageTs = Math.max(...this._messages.map((m) => m.createdAt));
                            const oldestPreviousMessageTs = Math.min(...prevMessages.map((m) => m.createdAt));
                            const latestNextMessageTs = Math.max(...nextMessages.map((m) => m.createdAt));
                            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                                messages: prevMessages,
                                source: messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_FILL,
                            }));
                            dispatcher.dispatch(new messageEventCommand_1.MessageUpdateEventCommand({
                                messages: nextMessages,
                                source: messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_FILL,
                            }));
                            this._syncRange.extends(oldestPreviousMessageTs, latestNextMessageTs);
                            if (currentOldestMessageTs < oldestPreviousMessageTs)
                                this._prevFill.start(oldestPreviousMessageTs);
                            if (currentLatestMessageTs > latestNextMessageTs)
                                this._nextFill.start(latestNextMessageTs);
                        }
                        else {
                            try {
                                this._handler.onHugeGapDetected();
                            }
                            catch (err) { }
                        }
                    }), HUGE_GAP_CHECK_RETRY);
                }
            }
            else {
                const limit = Math.floor(this._limit / 2);
                const messages = yield this._getRemoteMessages(Date.now(), {
                    prevLimit: limit,
                    nextLimit: limit,
                    source: messageEventCommand_1.MessageEventSource.SYNC_MESSAGE_FILL,
                });
                if (messages.length > 0) {
                    this._syncRange.extends(...messages.map((m) => m.createdAt));
                    if (messages.length < limit) {
                        this._hasPrevious = false;
                        this._hasNext = false;
                    }
                }
            }
        });
    }
    initialize(policy, ts) {
        const handler = new MessageCollectionInitHandler();
        this._messages = [];
        this._syncRange = new timeRange_1.default({});
        this._hasNext = true;
        this._hasPrevious = true;
        const initialLimit = Math.floor(this._limit / 2);
        switch (policy) {
            case MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API: {
                this._getLocalMessages(ts, { prevLimit: initialLimit, nextLimit: initialLimit })
                    .then((messages) => {
                    this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                    handler.invokeResponse('local', null, messages);
                })
                    .catch(err => handler.invokeResponse('local', err, null))
                    .finally(() => {
                    this._getRemoteMessages(ts, { prevLimit: initialLimit, nextLimit: initialLimit })
                        .then((messages) => {
                        this._messages = [];
                        if (messages.length < initialLimit) {
                            this._hasPrevious = false;
                            this._hasNext = false;
                        }
                        if (messages.length > 0) {
                            this._syncRange.extends(...messages.map((m) => m.createdAt));
                            this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                        }
                        handler.invokeResponse('remote', null, messages);
                    })
                        .catch(err => handler.invokeResponse('remote', err, null));
                });
                break;
            }
            case MessageCollectionInitPolicy.API_ONLY: {
                this._getRemoteMessages(ts, { prevLimit: initialLimit, nextLimit: initialLimit })
                    .then((messages) => {
                    if (messages.length < initialLimit) {
                        this._hasPrevious = false;
                        this._hasNext = false;
                    }
                    if (messages.length > 0) {
                        this._syncRange.extends(...this.messages.map((m) => m.createdAt));
                        this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                    }
                    handler.invokeResponse('remote', null, messages);
                })
                    .catch(err => handler.invokeResponse('remote', err, null));
            }
        }
        return handler;
    }
    loadPrevious() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._hasPrevious) {
                const ts = Math.min(...this._messages.map((m) => m.createdAt));
                let messages = yield this._getLocalMessages(ts, { prevLimit: this._limit });
                const backgroundSync = backgroundSync_1.default.of(this._iid, this._channel);
                if (messages.length === 0 || !backgroundSync.range.includes(...messages.map((m) => m.createdAt))) {
                    try {
                        messages = yield this._getRemoteMessages(ts, { prevLimit: this._limit });
                        if (messages.length > 0) {
                            this._syncRange.extends(...messages.map((m) => m.createdAt));
                            if (backgroundSync.range.overlap(this._syncRange)) {
                                backgroundSync.range.extends(this._syncRange.top);
                            }
                            this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                        }
                        this._hasPrevious = messages.length >= this._limit;
                    }
                    catch (err) {
                        this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                    }
                }
                else {
                    if (messages.length > 0) {
                        this._syncRange.extends(...messages.map((m) => m.createdAt));
                        this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                    }
                    this._hasPrevious = messages.length >= this._limit;
                }
                return messages;
            }
            return [];
        });
    }
    loadNext() {
        return __awaiter(this, void 0, void 0, function* () {
            const ts = Math.max(...this._messages.map((m) => m.createdAt));
            let messages = yield this._getLocalMessages(ts, { nextLimit: this._limit });
            const backgroundSync = backgroundSync_1.default.of(this._iid, this._channel);
            if (messages.length === 0 || !backgroundSync.range.includes(...messages.map((m) => m.createdAt))) {
                try {
                    messages = yield this._getRemoteMessages(ts, { nextLimit: this._limit });
                    if (messages.length > 0) {
                        this._syncRange.extends(...messages.map((m) => m.createdAt));
                        if (backgroundSync.range.overlap(this._syncRange)) {
                            backgroundSync.range.extends(this._syncRange.bottom);
                        }
                        this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                    }
                    this._hasNext = messages.length >= this._limit;
                }
                catch (err) {
                    this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                }
            }
            else {
                if (messages.length > 0) {
                    this._syncRange.extends(...messages.map((m) => m.createdAt));
                    this._addMessagesToView(messages, messageEventCommand_1.MessageEventSource.REQUEST_MESSAGE);
                }
                this._hasNext = messages.length >= this._limit;
            }
            return messages;
        });
    }
    dispose() {
        const manager = groupChannelManager_1.default.of(this._iid);
        manager.unsubscribeGroupChannelEvent(this._key);
        manager.unsubscribeMessageEvent(this._key);
    }
}
exports.default = MessageCollection;
//# sourceMappingURL=index.js.map