"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetMyHistoryResponseCommand = exports.ResetMyHistoryRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
class ResetMyHistoryRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/reset_user_history`;
    }
}
exports.ResetMyHistoryRequestCommand = ResetMyHistoryRequestCommand;
class ResetMyHistoryResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.messageOffsetTimestamp = null;
        const { ts_message_offset } = payload;
        this.messageOffsetTimestamp = ts_message_offset !== null && ts_message_offset !== void 0 ? ts_message_offset : null;
    }
}
exports.ResetMyHistoryResponseCommand = ResetMyHistoryResponseCommand;
//# sourceMappingURL=resetMyHistoryCommand.js.map