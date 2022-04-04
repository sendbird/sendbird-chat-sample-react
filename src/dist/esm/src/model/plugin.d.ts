/**
 * @internal
 */
export interface PluginPayload {
    'type'?: string;
    'vendor'?: string;
    'detail'?: object;
}
export default class Plugin {
    readonly type: string;
    readonly vendor: string;
    readonly detail: object;
    /**
     * @private
     */
    constructor(payload: PluginPayload);
    /**
     * @private
     */
    static payloadify(obj: Plugin): PluginPayload;
}
