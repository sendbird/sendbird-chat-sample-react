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
exports.UserMessageUpdateParams = exports.UserMessageParams = exports.UserMessage = exports.Thumbnail = exports.ThreadedMessageListParams = exports.ThreadInfoUpdateEvent = exports.ThreadInfo = exports.Sender = exports.ScheduledUserMessageParams = exports.ScheduledUserMessage = exports.ScheduledStatus = exports.RequestState = exports.ReactionEventOperation = exports.ReactionEvent = exports.Reaction = exports.PreviousMessageListQuery = exports.OGMetaData = exports.OGImage = exports.MessageSearchQuery = exports.MessageSearchOrder = exports.MessageRetrievalParams = exports.MessageRequestHandler = exports.MessageModule = exports.MessageMetaArray = exports.MessageListParams = exports.MessageChangeLogsParams = exports.MentionType = exports.FileMessageUpdateParams = exports.FileMessageParams = exports.FileMessage = exports.AppleCriticalAlertOptions = exports.AdminMessage = void 0;
const baseModule_1 = require("./baseModule");
const error_1 = require("../error");
const messageManager_1 = require("../manager/messageManager");
const types_1 = require("../model/message/types");
Object.defineProperty(exports, "MentionType", { enumerable: true, get: function () { return types_1.MentionType; } });
Object.defineProperty(exports, "RequestState", { enumerable: true, get: function () { return types_1.RequestState; } });
const messageRequestHandler_1 = require("../model/message/messageRequestHandler");
exports.MessageRequestHandler = messageRequestHandler_1.default;
const userMessage_1 = require("../model/message/userMessage");
exports.UserMessage = userMessage_1.default;
const fileMessage_1 = require("../model/message/fileMessage");
exports.FileMessage = fileMessage_1.default;
const adminMessage_1 = require("../model/message/adminMessage");
exports.AdminMessage = adminMessage_1.default;
const sender_1 = require("../model/message/sender");
exports.Sender = sender_1.default;
const reaction_1 = require("../model/message/reaction");
exports.Reaction = reaction_1.default;
const threadInfo_1 = require("../model/message/threadInfo");
exports.ThreadInfo = threadInfo_1.default;
const messageMetaArray_1 = require("../model/message/messageMetaArray");
exports.MessageMetaArray = messageMetaArray_1.default;
const ogMetaData_1 = require("../model/message/ogMetaData");
exports.OGMetaData = ogMetaData_1.default;
const ogImage_1 = require("../model/message/ogImage");
exports.OGImage = ogImage_1.default;
const thumbnail_1 = require("../model/message/thumbnail");
exports.Thumbnail = thumbnail_1.default;
const appleCriticalAlertOptions_1 = require("../model/message/appleCriticalAlertOptions");
exports.AppleCriticalAlertOptions = appleCriticalAlertOptions_1.default;
const scheduledUserMessage_1 = require("../model/message/scheduledUserMessage");
exports.ScheduledUserMessage = scheduledUserMessage_1.default;
Object.defineProperty(exports, "ScheduledStatus", { enumerable: true, get: function () { return scheduledUserMessage_1.ScheduledStatus; } });
const reactionEvent_1 = require("../model/event/reactionEvent");
exports.ReactionEvent = reactionEvent_1.default;
Object.defineProperty(exports, "ReactionEventOperation", { enumerable: true, get: function () { return reactionEvent_1.ReactionEventOperation; } });
const threadInfoUpdateEvent_1 = require("../model/event/threadInfoUpdateEvent");
exports.ThreadInfoUpdateEvent = threadInfoUpdateEvent_1.default;
const messageRetrievalParams_1 = require("../model/params/messageRetrievalParams");
exports.MessageRetrievalParams = messageRetrievalParams_1.default;
const messageListParams_1 = require("../model/params/messageListParams");
exports.MessageListParams = messageListParams_1.default;
const messageChangeLogsParams_1 = require("../model/params/messageChangeLogsParams");
exports.MessageChangeLogsParams = messageChangeLogsParams_1.default;
const userMessageParams_1 = require("../model/params/userMessageParams");
exports.UserMessageParams = userMessageParams_1.default;
const userMessageUpdateParams_1 = require("../model/params/userMessageUpdateParams");
exports.UserMessageUpdateParams = userMessageUpdateParams_1.default;
const fileMessageParams_1 = require("../model/params/fileMessageParams");
exports.FileMessageParams = fileMessageParams_1.default;
const fileMessageUpdateParams_1 = require("../model/params/fileMessageUpdateParams");
exports.FileMessageUpdateParams = fileMessageUpdateParams_1.default;
const scheduledUserMessageParams_1 = require("../model/params/scheduledUserMessageParams");
exports.ScheduledUserMessageParams = scheduledUserMessageParams_1.default;
const threadedMessageListParams_1 = require("../model/params/threadedMessageListParams");
exports.ThreadedMessageListParams = threadedMessageListParams_1.default;
const messageSearchQuery_1 = require("../query/messageSearchQuery");
exports.MessageSearchQuery = messageSearchQuery_1.default;
Object.defineProperty(exports, "MessageSearchOrder", { enumerable: true, get: function () { return messageSearchQuery_1.MessageSearchOrder; } });
const previousMessageListQuery_1 = require("../query/previousMessageListQuery");
exports.PreviousMessageListQuery = previousMessageListQuery_1.default;
const unless_1 = require("../utils/unless");
class MessageModule extends baseModule_1.default {
    constructor() {
        super(...arguments);
        this.name = 'message';
    }
    init(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }) {
        super.init(_iid, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue });
        this._manager = new messageManager_1.default(_iid, {
            sdkState,
            dispatcher,
            requestQueue,
        });
    }
    buildMessageFromSerializedData(serialized) {
        return this._manager.buildMessageFromSerializedData(serialized);
    }
    buildSenderFromSerializedData(serialized) {
        return this._manager.buildSenderFromSerializedData(serialized);
    }
    getMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, unless_1.unless)(params instanceof messageRetrievalParams_1.default && params.validate())
                .throw(error_1.default.invalidParameters);
            return this._manager.getMessage(params);
        });
    }
}
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.js.map