"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEventCategory = void 0;
const types_1 = require("../../model/channel/types");
var ChannelEventCategory;
(function (ChannelEventCategory) {
    ChannelEventCategory[ChannelEventCategory["NONE"] = 0] = "NONE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_ENTER"] = 10102] = "CHANNEL_ENTER";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_EXIT"] = 10103] = "CHANNEL_EXIT";
    ChannelEventCategory[ChannelEventCategory["USER_CHANNEL_MUTE"] = 10201] = "USER_CHANNEL_MUTE";
    ChannelEventCategory[ChannelEventCategory["USER_CHANNEL_UNMUTE"] = 10200] = "USER_CHANNEL_UNMUTE";
    ChannelEventCategory[ChannelEventCategory["USER_CHANNEL_BAN"] = 10601] = "USER_CHANNEL_BAN";
    ChannelEventCategory[ChannelEventCategory["USER_CHANNEL_UNBAN"] = 10600] = "USER_CHANNEL_UNBAN";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_FREEZE"] = 10701] = "CHANNEL_FREEZE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_UNFREEZE"] = 10700] = "CHANNEL_UNFREEZE";
    ChannelEventCategory[ChannelEventCategory["TYPING_START"] = 10900] = "TYPING_START";
    ChannelEventCategory[ChannelEventCategory["TYPING_END"] = 10901] = "TYPING_END";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_JOIN"] = 10000] = "CHANNEL_JOIN";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_LEAVE"] = 10001] = "CHANNEL_LEAVE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_OPERATOR_UPDATE"] = 10002] = "CHANNEL_OPERATOR_UPDATE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_INVITE"] = 10020] = "CHANNEL_INVITE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_ACCEPT_INVITE"] = 10021] = "CHANNEL_ACCEPT_INVITE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_DECLINE_INVITE"] = 10022] = "CHANNEL_DECLINE_INVITE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_PROP_CHANGED"] = 11000] = "CHANNEL_PROP_CHANGED";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_DELETED"] = 12000] = "CHANNEL_DELETED";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_META_DATA_CHANGED"] = 11100] = "CHANNEL_META_DATA_CHANGED";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_META_COUNTERS_CHANGED"] = 11200] = "CHANNEL_META_COUNTERS_CHANGED";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_HIDE"] = 13000] = "CHANNEL_HIDE";
    ChannelEventCategory[ChannelEventCategory["CHANNEL_UNHIDE"] = 13001] = "CHANNEL_UNHIDE";
})(ChannelEventCategory = exports.ChannelEventCategory || (exports.ChannelEventCategory = {}));
class ChannelEvent {
    constructor(payload) {
        this.channelUrl = payload.channel_url;
        this.channelType = payload.channel_type;
        this.category = payload.cat;
        this.data = payload.data;
        this.ts = payload.ts;
    }
    get isGroupChannelEvent() {
        return this.channelType === types_1.ChannelType.GROUP;
    }
    get isOpenChannelEvent() {
        return this.channelType === types_1.ChannelType.OPEN;
    }
}
exports.default = ChannelEvent;
//# sourceMappingURL=channelEvent.js.map