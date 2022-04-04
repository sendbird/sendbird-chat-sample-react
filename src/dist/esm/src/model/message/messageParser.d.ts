import BaseMessage, { BaseMessagePayload } from './baseMessage';
/**
 * @internal
 */
export declare const payloadifyMessage: (obj: BaseMessage) => BaseMessagePayload;
/**
 * @internal
 */
export declare const parseMessagePayload: (_iid: string, payload: BaseMessagePayload) => BaseMessage;
