import OGImage, { OGImagePayload } from './ogImage';
/**
 * @internal
 */
export interface OGMetaDataPayload {
    'og:title'?: string;
    'og:url'?: string;
    'og:description'?: string;
    'og:image'?: OGImagePayload;
}
export default class OGMetaData {
    readonly title: string;
    readonly url: string;
    readonly description: string;
    readonly defaultImage: OGImage;
    /**
     * @private
     */
    constructor(payload: OGMetaDataPayload);
    /**
     * @private
     */
    static payloadify(obj: OGMetaData): OGMetaDataPayload;
}
