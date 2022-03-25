"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMessagesResponseCommand = exports.SearchMessagesRequestCommand = void 0;
const const_1 = require("../const");
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const messageParser_1 = require("../../../model/message/messageParser");
class SearchMessagesRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelCustomType, keyword, limit, reverse, exactMatch, channelUrl, order, messageTimestampFrom, messageTimestampTo, advancedQuery, targetFields, nextToken, }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.GET;
        this.path = `${const_1.API_PATH_SEARCH}/messages`;
        this.params = {
            custom_type: channelCustomType,
            query: keyword,
            limit: limit,
            reverse: reverse,
            exact_match: exactMatch,
            channel_url: channelUrl,
            message_ts_from: messageTimestampFrom,
            message_ts_to: messageTimestampTo,
            sort_field: order,
            advanced_query: advancedQuery,
            target_fields: targetFields,
            after: nextToken,
        };
    }
}
exports.SearchMessagesRequestCommand = SearchMessagesRequestCommand;
class SearchMessagesResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.messages = payload.results.map((baseMessagePayload) => (0, messageParser_1.parseMessagePayload)(_iid, baseMessagePayload));
        this.hasNext = payload.has_next;
        this.nextToken = payload.end_cursor;
    }
}
exports.SearchMessagesResponseCommand = SearchMessagesResponseCommand;
//# sourceMappingURL=searchMessagesCommand.js.map