import { ThumbnailSize } from '../params/fileMessageParams';
/**
 * @internal
 */
export interface ThumbnailPayload {
    'url': string;
    'width': number;
    'height': number;
    'real_width'?: number;
    'real_height'?: number;
}
export default class Thumbnail {
    readonly url: string;
    readonly width: number;
    readonly height: number;
    readonly realWidth: number;
    readonly realHeight: number;
    /**
     * @private
     */
    constructor(payload: ThumbnailPayload);
    /**
     * @private
     */
    static payloadify(obj: ThumbnailSize): ThumbnailPayload;
    get plainUrl(): string;
}
