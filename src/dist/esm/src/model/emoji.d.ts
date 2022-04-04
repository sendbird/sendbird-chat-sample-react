/**
 * @internal
 */
export interface EmojiPayload {
    'key': string;
    'url': string;
}
export default class Emoji {
    readonly key: string;
    readonly url: string;
    /**
     * @private
     */
    constructor(payload: EmojiPayload);
}
