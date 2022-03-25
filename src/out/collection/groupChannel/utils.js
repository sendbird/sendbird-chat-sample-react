"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareByOrder = exports.placeOfChannel = exports.indexOfChannel = void 0;
const groupChannelListOrder_1 = require("../../model/channel/groupChannelListOrder");
const indexOfChannel = (channels, channelToFind) => {
    return channels.findIndex((channel) => channel.isIdentical(channelToFind));
};
exports.indexOfChannel = indexOfChannel;
const placeOfChannel = (channels, channelToFind, order) => {
    if (channels.length > 0) {
        const index = (0, exports.indexOfChannel)(channels, channelToFind);
        if (index < 0) {
            let start = 0, end = channels.length - 1, pivot = Math.floor((start + end) / 2);
            while (start < end) {
                const compared = (0, exports.compareByOrder)(channels[pivot], channelToFind, order);
                if (compared > 0) {
                    end = pivot;
                    pivot = Math.floor((start + end) / 2);
                }
                else if (compared < 0) {
                    start = pivot + 1;
                    pivot = Math.floor((start + end) / 2);
                }
                else
                    return { place: pivot, contains: channels[pivot].isIdentical(channelToFind) };
            }
            const place = (0, exports.compareByOrder)(channels[pivot], channelToFind, order) > 0 ? pivot : pivot + 1;
            return { place, contains: false };
        }
        else
            return { place: index, contains: true };
    }
    return { place: channels.length, contains: false };
};
exports.placeOfChannel = placeOfChannel;
const compareByOrder = (channel1, channel2, order) => {
    switch (order) {
        case groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE: {
            if (channel1.lastMessage && channel2.lastMessage)
                return channel2.lastMessage.createdAt - channel1.lastMessage.createdAt;
            else if (channel1.lastMessage)
                return -1;
            else if (channel2.lastMessage)
                return 1;
            else
                return channel2.createdAt - channel1.createdAt;
        }
        case groupChannelListOrder_1.GroupChannelListOrder.CHRONOLOGICAL:
            return channel2.createdAt - channel1.createdAt;
        case groupChannelListOrder_1.GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL:
            return channel1.name.localeCompare(channel2.name);
    }
};
exports.compareByOrder = compareByOrder;
//# sourceMappingURL=utils.js.map