/**
 * @internal
 */
export interface MessageMetaArrayPayload {
    'key': string;
    'value'?: string[];
}
export interface MessageMetaArrayUpdateParams {
    metaArrays: MessageMetaArray[];
    mode: 'add' | 'remove';
    upsert: boolean;
}
export default class MessageMetaArray {
    readonly key: string;
    readonly value: string[];
    /**
     * @private
     */
    constructor(payload: MessageMetaArrayPayload);
    /**
     * @private
     */
    static payloadify(obj: MessageMetaArray): MessageMetaArrayPayload;
}
