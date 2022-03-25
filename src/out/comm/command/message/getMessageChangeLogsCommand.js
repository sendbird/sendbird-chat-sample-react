"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessageChangeLogsResponseCommand = exports.GetMessageChangeLogsRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const messageParser_1 = require("../../../model/message/messageParser");
const utils_1 = require("../utils");
class GetMessageChangeLogsRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelType, channelUrl, timestamp, token, includeMetaArray, includeReactions, includeThreadInfo, replyType, includeParentMessageInfo, includePollDetails, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/messages/changelogs`;
        this.params = {
            change_ts: timestamp,
            token: token,
            with_sorted_meta_array: includeMetaArray,
            include_reactions: includeReactions,
            include_thread_info: includeThreadInfo,
            include_reply_type: replyType,
            include_parent_message_info: includeParentMessageInfo,
            include_poll_details: includePollDetails,
        };
    }
}
exports.GetMessageChangeLogsRequestCommand = GetMessageChangeLogsRequestCommand;
class GetMessageChangeLogsResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.updatedMessages = payload.updated.map((baseMessagePayload) => (0, messageParser_1.parseMessagePayload)(_iid, baseMessagePayload));
        this.deletedMessagesInfo = payload.deleted.map((deletedMessagePayload) => ({
            messageId: deletedMessagePayload.message_id,
            deletedAt: deletedMessagePayload.deleted_at,
        }));
        this.hasMore = payload.has_more;
        this.nextToken = payload.next;
    }
}
exports.GetMessageChangeLogsResponseCommand = GetMessageChangeLogsResponseCommand;
//# sourceMappingURL=getMessageChangeLogsCommand.js.map