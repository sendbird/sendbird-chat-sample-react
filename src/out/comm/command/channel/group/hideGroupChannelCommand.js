"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HideGroupChannelEventCommand = exports.HideGroupChannelResponseCommand = exports.HideGroupChannelRequestCommand = void 0;
const const_1 = require("../../const");
const apiRequestCommand_1 = require("../../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../../core/command/api/apiResponseCommand");
const websocketEventCommand_1 = require("../../../../core/command/websocket/websocketEventCommand");
class HideGroupChannelRequestCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, userId, hidePreviousMessages, allowAutoUnhide, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.PUT;
        this.path = `${const_1.API_PATH_GROUP_CHANNELS}/${encodeURIComponent(channelUrl)}/hide`;
        this.params = {
            user_id: userId,
            hide_previous_messages: hidePreviousMessages,
            allow_auto_unhide: allowAutoUnhide,
        };
    }
}
exports.HideGroupChannelRequestCommand = HideGroupChannelRequestCommand;
class HideGroupChannelResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.messageOffsetTimestamp = null;
        const { ts_message_offset } = payload;
        this.messageOffsetTimestamp = ts_message_offset !== null && ts_message_offset !== void 0 ? ts_message_offset : null;
    }
}
exports.HideGroupChannelResponseCommand = HideGroupChannelResponseCommand;
class HideGroupChannelEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'SYEV', payload);
        this.allowAutoUnhide = null;
        this.hidePreviousMessages = null;
        this.messageOffsetTimestamp = null;
        if (payload.data) {
            this.allowAutoUnhide = payload.data.allow_auto_unhide;
            this.hidePreviousMessages = payload.data.hide_previous_messages;
        }
        this.messageOffsetTimestamp = payload.ts_message_offset;
    }
}
exports.HideGroupChannelEventCommand = HideGroupChannelEventCommand;
//# sourceMappingURL=hideGroupChannelCommand.js.map