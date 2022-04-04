import BaseMessage, { BaseMessagePayload } from './baseMessage';
import ThreadedMessageListParams from '../params/threadedMessageListParams';
/**
 * @internal
 */
export interface AdminMessagePayload extends BaseMessagePayload {
    'message': string;
    'translations'?: object;
}
export default class AdminMessage extends BaseMessage {
    message: string;
    translations: object;
    /**
     * @private
     */
    constructor(_iid: string, payload: AdminMessagePayload);
    /**
     * @private
     */
    static payloadify(obj: AdminMessage): AdminMessagePayload;
    getThreadedMessagesByTimestamp(ts: number, params: ThreadedMessageListParams): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
}
