/**
 * @internal
 */
export interface AppleCriticalAlertOptionsPayload {
    'name': string;
    'volume': number;
}
export default class AppleCriticalAlertOptions {
    readonly name: string;
    readonly volume: number;
    /**
     * @private
     */
    constructor(payload: AppleCriticalAlertOptionsPayload);
    /**
     * @private
     */
    static payloadify(obj: AppleCriticalAlertOptions): AppleCriticalAlertOptionsPayload;
}
