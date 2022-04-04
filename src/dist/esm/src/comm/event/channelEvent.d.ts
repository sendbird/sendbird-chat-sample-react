import { ChannelType } from '../../model/channel/types';
/**
 * @internal
 */
export declare enum ChannelEventCategory {
    NONE = 0,
    CHANNEL_ENTER = 10102,
    CHANNEL_EXIT = 10103,
    USER_CHANNEL_MUTE = 10201,
    USER_CHANNEL_UNMUTE = 10200,
    USER_CHANNEL_BAN = 10601,
    USER_CHANNEL_UNBAN = 10600,
    CHANNEL_FREEZE = 10701,
    CHANNEL_UNFREEZE = 10700,
    TYPING_START = 10900,
    TYPING_END = 10901,
    CHANNEL_JOIN = 10000,
    CHANNEL_LEAVE = 10001,
    CHANNEL_OPERATOR_UPDATE = 10002,
    CHANNEL_INVITE = 10020,
    CHANNEL_ACCEPT_INVITE = 10021,
    CHANNEL_DECLINE_INVITE = 10022,
    CHANNEL_PROP_CHANGED = 11000,
    CHANNEL_DELETED = 12000,
    CHANNEL_META_DATA_CHANGED = 11100,
    CHANNEL_META_COUNTERS_CHANGED = 11200,
    CHANNEL_HIDE = 13000,
    CHANNEL_UNHIDE = 13001
}
/**
 * @internal
 */
export interface ChannelEventPayload {
    channel_url: string;
    channel_type: string;
    cat: number;
    data?: object;
    ts: number;
}
/**
 * @internal
 */
export default class ChannelEvent {
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    readonly category: ChannelEventCategory;
    readonly data: object;
    readonly ts: number;
    constructor(payload: ChannelEventPayload);
    get isGroupChannelEvent(): boolean;
    get isOpenChannelEvent(): boolean;
}
