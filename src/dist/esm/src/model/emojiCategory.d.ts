import Emoji, { EmojiPayload } from './emoji';
/**
 * @internal
 */
export interface EmojiCategoryPayload {
    'id': number;
    'name': string;
    'url': string;
    'emojis': EmojiPayload[];
}
export default class EmojiCategory {
    readonly id: number;
    readonly name: string;
    readonly url: string;
    readonly emojis: Emoji[];
    /**
     * @private
     */
    constructor(payload: EmojiCategoryPayload);
}
