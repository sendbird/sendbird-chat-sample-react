import BaseCommand from '../../../core/command/baseCommand';
import SendableMessage from '../../../model/message/sendableMessage';
export declare enum MessageEventSource {
    UNKNOWN = 0,
    EVENT_MESSAGE_SENT_SUCCESS = 1,
    EVENT_MESSAGE_SENT_FAILED = 2,
    EVENT_MESSAGE_SENT_PENDING = 3,
    EVENT_MESSAGE_RECEIVED = 4,
    EVENT_MESSAGE_UPDATED = 5,
    EVENT_MESSAGE_DELETED = 6,
    EVENT_MESSAGE_READ = 7,
    EVENT_MESSAGE_DELIVERED = 8,
    EVENT_MESSAGE_REACTION_UPDATED = 9,
    EVENT_MESSAGE_THREADINFO_UPDATED = 10,
    EVENT_BOTTOM = 11,
    REQUEST_MESSAGE = 12,
    REQUEST_THREADED_MESSAGE = 13,
    REQUEST_MESSAGE_CHANGELOGS = 14,
    SYNC_MESSAGE_FILL = 15,
    SYNC_MESSAGE_BACKGROUND = 16,
    SYNC_MESSAGE_CHANGELOGS = 17
}
/**
 * @internal
 */
export declare const shouldGiveEvent: (source: MessageEventSource) => boolean;
/**
 * @internal
 */
export declare class MessageUpdateEventCommand extends BaseCommand {
    readonly messages: SendableMessage[];
    readonly source: MessageEventSource;
    constructor({ messages, source }: {
        messages: any;
        source: any;
    });
}
/**
 * @internal
 */
export declare class MessageRemoveEventCommand extends BaseCommand {
    readonly messageIds: number[];
    readonly source: MessageEventSource;
    constructor({ messageIds, source }: {
        messageIds: any;
        source: any;
    });
}
/**
 * @internal
 */
export declare class UnsentMessageRemoveEventCommand extends BaseCommand {
    readonly reqId: string;
    readonly source: MessageEventSource;
    constructor({ reqId, source }: {
        reqId: any;
        source: any;
    });
}
