"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelRemoveEventCommand = exports.GroupChannelUpdateEventCommand = exports.shouldGiveEvent = exports.GroupChannelEventSource = void 0;
const baseCommand_1 = require("../../../core/command/baseCommand");
var GroupChannelEventSource;
(function (GroupChannelEventSource) {
    GroupChannelEventSource[GroupChannelEventSource["UNKNOWN"] = 0] = "UNKNOWN";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_CREATED"] = 1] = "EVENT_CHANNEL_CREATED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_UPDATED"] = 2] = "EVENT_CHANNEL_UPDATED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_DELETED"] = 3] = "EVENT_CHANNEL_DELETED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_READ"] = 4] = "EVENT_CHANNEL_READ";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_DELIVERED"] = 5] = "EVENT_CHANNEL_DELIVERED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_INVITED"] = 6] = "EVENT_CHANNEL_INVITED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_JOINED"] = 7] = "EVENT_CHANNEL_JOINED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_LEFT"] = 8] = "EVENT_CHANNEL_LEFT";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_ACCEPTED_INVITE"] = 9] = "EVENT_CHANNEL_ACCEPTED_INVITE";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_DECLINED_INVITE"] = 10] = "EVENT_CHANNEL_DECLINED_INVITE";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_OPERATOR_UPDATED"] = 11] = "EVENT_CHANNEL_OPERATOR_UPDATED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_MUTED"] = 12] = "EVENT_CHANNEL_MUTED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_UNMUTED"] = 13] = "EVENT_CHANNEL_UNMUTED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_FROZEN"] = 14] = "EVENT_CHANNEL_FROZEN";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_UNFROZEN"] = 15] = "EVENT_CHANNEL_UNFROZEN";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_HIDDEN"] = 16] = "EVENT_CHANNEL_HIDDEN";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_UNHIDDEN"] = 17] = "EVENT_CHANNEL_UNHIDDEN";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_RESET_HISTORY"] = 18] = "EVENT_CHANNEL_RESET_HISTORY";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_CHANNEL_MEMBER_COUNT_UPDATED"] = 19] = "EVENT_CHANNEL_MEMBER_COUNT_UPDATED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_MESSAGE_SENT"] = 20] = "EVENT_MESSAGE_SENT";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_MESSAGE_RECEIVED"] = 21] = "EVENT_MESSAGE_RECEIVED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_MESSAGE_UPDATED"] = 22] = "EVENT_MESSAGE_UPDATED";
    GroupChannelEventSource[GroupChannelEventSource["EVENT_BOTTOM"] = 23] = "EVENT_BOTTOM";
    GroupChannelEventSource[GroupChannelEventSource["REQUEST_CHANNEL"] = 24] = "REQUEST_CHANNEL";
    GroupChannelEventSource[GroupChannelEventSource["REQUEST_CHANNEL_CHANGELOGS"] = 25] = "REQUEST_CHANNEL_CHANGELOGS";
    GroupChannelEventSource[GroupChannelEventSource["SYNC_CHANNEL_BACKGROUND"] = 26] = "SYNC_CHANNEL_BACKGROUND";
    GroupChannelEventSource[GroupChannelEventSource["SYNC_CHANNEL_CHANGELOGS"] = 27] = "SYNC_CHANNEL_CHANGELOGS";
})(GroupChannelEventSource = exports.GroupChannelEventSource || (exports.GroupChannelEventSource = {}));
const shouldGiveEvent = (source) => {
    return source < GroupChannelEventSource.EVENT_BOTTOM ||
        source === GroupChannelEventSource.SYNC_CHANNEL_BACKGROUND ||
        source === GroupChannelEventSource.SYNC_CHANNEL_CHANGELOGS;
};
exports.shouldGiveEvent = shouldGiveEvent;
class GroupChannelUpdateEventCommand extends baseCommand_1.default {
    constructor({ channels, source }) {
        super();
        this.channels = channels;
        this.source = source;
    }
}
exports.GroupChannelUpdateEventCommand = GroupChannelUpdateEventCommand;
class GroupChannelRemoveEventCommand extends baseCommand_1.default {
    constructor({ channelUrls, source }) {
        super();
        this.channelUrls = channelUrls;
        this.source = source;
    }
}
exports.GroupChannelRemoveEventCommand = GroupChannelRemoveEventCommand;
//# sourceMappingURL=groupChannelEventCommand.js.map