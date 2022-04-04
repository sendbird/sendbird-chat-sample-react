import BaseCommand from '../baseCommand';
/**
 * @internal
 */
export default class WebSocketEventCommand extends BaseCommand {
    readonly _iid: string;
    readonly code: string;
    readonly payload: object;
    readonly requestId: string;
    constructor(_iid: string, code: string, payload: object, requestId?: string);
    static createFromRawMessage(_iid: string, message: string): WebSocketEventCommand;
    convertToMessage(): string;
    as<T extends WebSocketEventCommand>(SpecifiedEventCommand: new (_iid: string, code: string, payload: object) => T): T;
}
