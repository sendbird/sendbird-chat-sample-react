import BaseCommand from '../baseCommand';
/**
 * @internal
 */
export interface WebSocketRequestCommandParams {
    code: string;
    ackRequired: boolean;
    payload?: object;
}
/**
 * @internal
 */
export default class WebSocketRequestCommand extends BaseCommand {
    readonly code: string;
    readonly payload: object;
    readonly requestId: string;
    readonly ackRequired: boolean;
    constructor({ code, ackRequired, payload, }: WebSocketRequestCommandParams);
    convertToMessage(): string;
}
