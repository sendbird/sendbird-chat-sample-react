import ThreadedMessageListParams from '../params/threadedMessageListParams';
import BaseMessage from './baseMessage';
import SendableMessage, { SendableMessagePayload } from './sendableMessage';
import Thumbnail, { ThumbnailPayload } from './thumbnail';
/**
 * @internal
 */
export interface FileMessagePayload extends SendableMessagePayload {
    'url': string;
    'require_auth'?: boolean;
    'file'?: {
        'name'?: string;
        'size'?: number;
        'type'?: string;
        'data'?: string;
    };
    'name'?: string;
    'size'?: number;
    'custom'?: string;
    'thumbnails'?: ThumbnailPayload[];
    'message_survival_seconds'?: number;
}
export default class FileMessage extends SendableMessage {
    readonly plainUrl: string;
    readonly requireAuth: boolean;
    readonly name: string;
    readonly size: number;
    readonly type: string;
    readonly thumbnails: Thumbnail[];
    readonly messageSurvivalSeconds: number;
    /**
     * @private
     */
    constructor(_iid: string, payload: FileMessagePayload);
    /**
     * @private
     */
    static payloadify(obj: FileMessage): FileMessagePayload;
    get url(): string;
    getThreadedMessagesByTimestamp(ts: number, params: ThreadedMessageListParams): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
}
