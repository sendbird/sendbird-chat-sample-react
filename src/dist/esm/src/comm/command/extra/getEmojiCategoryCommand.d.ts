import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import EmojiCategory, { EmojiCategoryPayload } from '../../../model/emojiCategory';
/**
 * @internal
 */
export interface GetEmojiCategoryRequestCommandParams {
    categoryId: number;
}
/**
 * @internal
 */
export declare class GetEmojiCategoryRequestCommand extends APIRequestCommand {
    constructor({ categoryId }: GetEmojiCategoryRequestCommandParams);
}
/**
 * @internal
 */
export interface GetEmojiCategoryResponseCommandPayload extends EmojiCategoryPayload {
}
/**
 * @internal
 */
export declare class GetEmojiCategoryResponseCommand extends APIResponseCommand {
    readonly emojiCategory: EmojiCategory;
    constructor(_iid: string, payload: GetEmojiCategoryResponseCommandPayload);
}
