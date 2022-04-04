import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import EmojiContainer, { EmojiContainerPayload } from '../../../model/emojiContainer';
/**
 * @internal
 */
export declare class GetAllEmojiRequestCommand extends APIRequestCommand {
    constructor();
}
/**
 * @internal
 */
export interface GetAllEmojiResponseCommandPayload extends EmojiContainerPayload {
}
/**
 * @internal
 */
export declare class GetAllEmojiResponseCommand extends APIResponseCommand {
    readonly emojiContainer: EmojiContainer;
    constructor(_iid: string, payload: GetAllEmojiResponseCommandPayload);
}
