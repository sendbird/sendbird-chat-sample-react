import BaseMessage, { BaseMessagePayload } from './baseMessage';
import Sender, { SenderPayload } from './sender';
import { RequestState } from './types';
/**
 * @internal
 */
export interface SendableMessagePayload extends BaseMessagePayload {
    'user': SenderPayload;
    'req_id'?: string;
    'request_state'?: string;
    'error_code'?: number;
    'requested_mention_user_ids'?: string[];
}
export default class SendableMessage extends BaseMessage {
    sender: Sender;
    reqId: string;
    requestState: RequestState;
    requestedMentionUserIds: string[];
    errorCode: number;
    /**
     * @private
     */
    constructor(_iid: string, payload: SendableMessagePayload);
    /**
     * @private
     */
    static payloadify(obj: SendableMessage): SendableMessagePayload;
    get isResendable(): boolean;
    isIdentical(message: SendableMessage): boolean;
}
