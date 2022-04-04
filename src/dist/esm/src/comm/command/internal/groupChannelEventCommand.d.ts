import BaseCommand from '../../../core/command/baseCommand';
import BaseChannel from '../../../model/channel/baseChannel';
export declare enum GroupChannelEventSource {
    UNKNOWN = 0,
    EVENT_CHANNEL_CREATED = 1,
    EVENT_CHANNEL_UPDATED = 2,
    EVENT_CHANNEL_DELETED = 3,
    EVENT_CHANNEL_READ = 4,
    EVENT_CHANNEL_DELIVERED = 5,
    EVENT_CHANNEL_INVITED = 6,
    EVENT_CHANNEL_JOINED = 7,
    EVENT_CHANNEL_LEFT = 8,
    EVENT_CHANNEL_ACCEPTED_INVITE = 9,
    EVENT_CHANNEL_DECLINED_INVITE = 10,
    EVENT_CHANNEL_OPERATOR_UPDATED = 11,
    EVENT_CHANNEL_MUTED = 12,
    EVENT_CHANNEL_UNMUTED = 13,
    EVENT_CHANNEL_FROZEN = 14,
    EVENT_CHANNEL_UNFROZEN = 15,
    EVENT_CHANNEL_HIDDEN = 16,
    EVENT_CHANNEL_UNHIDDEN = 17,
    EVENT_CHANNEL_RESET_HISTORY = 18,
    EVENT_CHANNEL_TYPING_STATUS_UPDATE = 19,
    EVENT_CHANNEL_MEMBER_COUNT_UPDATED = 20,
    EVENT_MESSAGE_SENT = 21,
    EVENT_MESSAGE_RECEIVED = 22,
    EVENT_MESSAGE_UPDATED = 23,
    EVENT_BOTTOM = 24,
    REQUEST_CHANNEL = 25,
    REQUEST_CHANNEL_CHANGELOGS = 26,
    SYNC_CHANNEL_BACKGROUND = 27,
    SYNC_CHANNEL_CHANGELOGS = 28
}
/**
 * @internal
 */
export declare const shouldGiveEvent: (source: GroupChannelEventSource) => boolean;
/**
 * @internal
 */
export declare class GroupChannelUpdateEventCommand extends BaseCommand {
    readonly channels: BaseChannel[];
    readonly source: GroupChannelEventSource;
    constructor({ channels, source }: {
        channels: any;
        source: any;
    });
}
/**
 * @internal
 */
export declare class GroupChannelRemoveEventCommand extends BaseCommand {
    readonly channelUrls: string[];
    readonly source: GroupChannelEventSource;
    constructor({ channelUrls, source }: {
        channelUrls: any;
        source: any;
    });
}
