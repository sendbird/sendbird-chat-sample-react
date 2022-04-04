import EmojiCategory, { EmojiCategoryPayload } from './emojiCategory';
/**
 * @internal
 */
export interface EmojiContainerPayload {
    'emoji_hash': string;
    'emoji_categories': EmojiCategoryPayload[];
}
export default class EmojiContainer {
    readonly emojiHash: string;
    readonly emojiCategories: EmojiCategory[];
    /**
     * @private
     */
    constructor(payload: EmojiContainerPayload);
}
