"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckMessageHugeGapResponseCommand = exports.CheckMessageHugeGapRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const messageParser_1 = require("../../../model/message/messageParser");
const deundefined_1 = require("../../../utils/deundefined");
const utils_1 = require("../utils");
class CheckMessageHugeGapRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        var _a, _b, _c, _d, _e, _f;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getChannelApiPathByType)(params.channelType)}/${params.channelUrl}/messages_gap`;
        this.params = (0, deundefined_1.deundefined)({
            prev_start_ts: params.prevStart,
            prev_end_ts: params.prevEnd,
            prev_cache_count: params.prevCount,
            next_start_ts: params.nextStart,
            next_end_ts: params.nextEnd,
            next_cache_count: params.nextCount,
            huge_gap_threshold: (_a = params.threshold) !== null && _a !== void 0 ? _a : null,
            reverse: true,
            custom_types: (_b = params.customTypes) !== null && _b !== void 0 ? _b : ['*'],
            message_type: (_c = params.messageType) !== null && _c !== void 0 ? _c : '',
            include_reactions: (_d = params.includeReactions) !== null && _d !== void 0 ? _d : true,
            with_sorted_meta_array: (_e = params.includeMetaArray) !== null && _e !== void 0 ? _e : false,
            show_subchannel_messages_only: (_f = params.showSubchannelMessagesOnly) !== null && _f !== void 0 ? _f : false,
        });
    }
}
exports.CheckMessageHugeGapRequestCommand = CheckMessageHugeGapRequestCommand;
class CheckMessageHugeGapResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        var _a, _b, _c, _d;
        super(_iid, payload);
        this.isHugeGap = payload.is_huge_gap;
        this.prevMessages = ((_a = payload.prev_messages) !== null && _a !== void 0 ? _a : []).map((payload) => (0, messageParser_1.parseMessagePayload)(_iid, payload));
        this.prevHasMore = (_b = payload.prev_hasmore) !== null && _b !== void 0 ? _b : false;
        this.nextMessages = ((_c = payload.next_messages) !== null && _c !== void 0 ? _c : []).map((payload) => (0, messageParser_1.parseMessagePayload)(_iid, payload));
        this.nextHasmore = (_d = payload.next_hasmore) !== null && _d !== void 0 ? _d : false;
    }
}
exports.CheckMessageHugeGapResponseCommand = CheckMessageHugeGapResponseCommand;
//# sourceMappingURL=checkMessageHugeGapCommand.js.map