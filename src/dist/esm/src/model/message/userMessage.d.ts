import BaseMessage from './baseMessage';
import SendableMessage, { SendableMessagePayload } from './sendableMessage';
import Plugin, { PluginPayload } from '../plugin';
import ThreadedMessageListParams from '../params/threadedMessageListParams';
/**
 * @internal
 */
export interface UserMessagePayload extends SendableMessagePayload {
    'message': string;
    'translations'?: object;
    'message_survival_seconds'?: number;
    'plugins'?: PluginPayload[];
}
export default class UserMessage extends SendableMessage {
    message: string;
    readonly translations: object;
    readonly messageSurvivalSeconds: number;
    readonly plugins: Plugin[];
    /**
     * @private
     */
    constructor(_iid: string, payload: UserMessagePayload);
    /**
     * @private
     */
    static payloadify(obj: UserMessage): UserMessagePayload;
    getThreadedMessagesByTimestamp(ts: number, params: ThreadedMessageListParams): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
}
