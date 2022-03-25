"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupChannelIndexBy = exports.PublicGroupChannelListOrder = exports.GroupChannelListOrder = void 0;
var GroupChannelListOrder;
(function (GroupChannelListOrder) {
    GroupChannelListOrder["LATEST_LAST_MESSAGE"] = "latest_last_message";
    GroupChannelListOrder["CHRONOLOGICAL"] = "chronological";
    GroupChannelListOrder["CHANNEL_NAME_ALPHABETICAL"] = "channel_name_alphabetical";
    GroupChannelListOrder["METADATA_VALUE_ALPHABETICAL"] = "metadata_value_alphabetical";
})(GroupChannelListOrder = exports.GroupChannelListOrder || (exports.GroupChannelListOrder = {}));
var PublicGroupChannelListOrder;
(function (PublicGroupChannelListOrder) {
    PublicGroupChannelListOrder["CHRONOLOGICAL"] = "chronological";
    PublicGroupChannelListOrder["CHANNEL_NAME_ALPHABETICAL"] = "channel_name_alphabetical";
    PublicGroupChannelListOrder["METADATA_VALUE_ALPHABETICAL"] = "metadata_value_alphabetical";
})(PublicGroupChannelListOrder = exports.PublicGroupChannelListOrder || (exports.PublicGroupChannelListOrder = {}));
const getGroupChannelIndexBy = (order) => {
    switch (order) {
        case GroupChannelListOrder.LATEST_LAST_MESSAGE: return ['-lastMessageUpdatedAt', '-createdAt'];
        case GroupChannelListOrder.CHRONOLOGICAL: return ['-createdAt'];
        case GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL: return ['name'];
    }
};
exports.getGroupChannelIndexBy = getGroupChannelIndexBy;
//# sourceMappingURL=groupChannelListOrder.js.map