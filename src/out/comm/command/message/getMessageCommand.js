"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessageResponseCommand = exports.GetMessageRequestCommand = void 0;
const messageParser_1 = require("../../../model/message/messageParser");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const utils_1 = require("../utils");
class GetMessageRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelType, channelUrl, messageId, includeMetaArray, includeReactions, includeThreadInfo, includeParentMessageInfo, includePollDetails, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/messages/${encodeURIComponent(messageId)}`;
        this.params = {
            is_sdk: true,
            with_sorted_meta_array: includeMetaArray,
            include_reactions: includeReactions,
            include_thread_info: includeThreadInfo,
            include_parent_message_info: includeParentMessageInfo,
            include_poll_details: includePollDetails,
        };
    }
}
exports.GetMessageRequestCommand = GetMessageRequestCommand;
class GetMessageResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.message = payload ? (0, messageParser_1.parseMessagePayload)(_iid, Object.assign({}, payload)) : null;
    }
}
exports.GetMessageResponseCommand = GetMessageResponseCommand;
//# sourceMappingURL=getMessageCommand.js.map