"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMentionCountChange = exports.checkIfMentioned = exports.getReportApiPathByType = exports.getChannelApiPathByType = void 0;
const types_1 = require("../../model/channel/types");
const types_2 = require("../../model/message/types");
const const_1 = require("./const");
const getChannelApiPathByType = (channelType) => {
    switch (channelType) {
        case types_1.ChannelType.GROUP:
            return const_1.API_PATH_GROUP_CHANNELS;
        case types_1.ChannelType.OPEN:
            return const_1.API_PATH_OPEN_CHANNELS;
        default:
            return null;
    }
};
exports.getChannelApiPathByType = getChannelApiPathByType;
const getReportApiPathByType = (channelType) => {
    switch (channelType) {
        case types_1.ChannelType.GROUP:
            return `${const_1.API_PATH_REPORT}/group_channels`;
        case types_1.ChannelType.OPEN:
            return `${const_1.API_PATH_REPORT}/open_channels`;
        default:
            return null;
    }
};
exports.getReportApiPathByType = getReportApiPathByType;
const checkIfMentioned = (mentionType, mentionedUserIds, userId) => {
    switch (mentionType) {
        case types_2.MentionType.CHANNEL:
            return true;
        case types_2.MentionType.USERS:
            for (const mentionedUserId of mentionedUserIds) {
                if (mentionedUserId === userId) {
                    return true;
                }
            }
            break;
    }
    return false;
};
exports.checkIfMentioned = checkIfMentioned;
const calculateMentionCountChange = (prev, curr, userId) => {
    const isPreviouslyMentioned = (0, exports.checkIfMentioned)(prev.mentionType, prev.mentionedUserIds, userId);
    const isNowMentioned = (0, exports.checkIfMentioned)(curr.mentionType, curr.mentionedUserIds, userId);
    if (!isPreviouslyMentioned && isNowMentioned)
        return 1;
    else if (isPreviouslyMentioned && !isNowMentioned)
        return -1;
    else
        return 0;
};
exports.calculateMentionCountChange = calculateMentionCountChange;
//# sourceMappingURL=utils.js.map