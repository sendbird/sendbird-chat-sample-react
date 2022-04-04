/**
 * @internal
 */
export interface OGImagePayload {
    'url': string;
    'secure_url'?: string;
    'type'?: string;
    'width'?: number;
    'height'?: number;
    'alt'?: string;
}
export default class OGImage {
    readonly url: string;
    readonly secureUrl: string;
    readonly type: string;
    readonly width: number;
    readonly height: number;
    readonly alt: string;
    /**
     * @private
     */
    constructor(payload: OGImagePayload);
    /**
     * @private
     */
    static payloadify(obj: OGImage): OGImagePayload;
}
