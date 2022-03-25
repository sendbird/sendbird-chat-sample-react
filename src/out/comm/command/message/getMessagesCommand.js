"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessagesResponseCommand = exports.GetMessagesRequestCommand = void 0;
const messageParser_1 = require("../../../model/message/messageParser");
const utils_1 = require("../utils");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const deundefined_1 = require("../../../utils/deundefined");
class GetMessagesRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelType, channelUrl, timestamp = null, token = null, prevResultSize, nextResultSize, isInclusive, reverse, messageType, customTypes, senderUserIds, includeMetaArray, includeReactions, parentMessageId, includeThreadInfo, replyType, includeParentMessageInfo, showSubchannelMessagesOnly, includePollDetails, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/messages`;
        this.params = (0, deundefined_1.deundefined)({
            is_sdk: true,
            prev_limit: prevResultSize,
            next_limit: nextResultSize,
            include: isInclusive,
            reverse,
            message_ts: timestamp,
            message_id: token,
            message_type: messageType,
            custom_types: customTypes,
            sender_ids: senderUserIds,
            with_sorted_meta_array: includeMetaArray,
            include_reactions: includeReactions,
            parent_message_id: parentMessageId,
            include_thread_info: includeThreadInfo,
            include_reply_type: replyType,
            include_parent_message_info: includeParentMessageInfo,
            show_subchannel_message_only: showSubchannelMessagesOnly,
            include_poll_details: includePollDetails,
        });
    }
}
exports.GetMessagesRequestCommand = GetMessagesRequestCommand;
class GetMessagesResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.messages = payload.messages.map((baseMessagePayload) => (0, messageParser_1.parseMessagePayload)(_iid, baseMessagePayload));
    }
}
exports.GetMessagesResponseCommand = GetMessagesResponseCommand;
//# sourceMappingURL=getMessagesCommand.js.map