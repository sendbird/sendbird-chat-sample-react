import BaseCommand from '../baseCommand';
/**
 * @internal
 */
export interface APIResponseCommandPayload {
}
/**
 * @internal
 */
export default class APIResponseCommand extends BaseCommand {
    protected _iid: string;
    protected _payload: APIResponseCommandPayload;
    constructor(_iid: string, payload: APIResponseCommandPayload);
    get payload(): APIResponseCommandPayload;
    as<T extends APIResponseCommand, P extends APIResponseCommandPayload>(SpecifiedEventCommand: new (_iid: string, payload: P) => T): T;
}
