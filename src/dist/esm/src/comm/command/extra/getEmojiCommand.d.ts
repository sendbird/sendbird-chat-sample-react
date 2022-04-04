import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import Emoji, { EmojiPayload } from '../../../model/emoji';
/**
 * @internal
 */
export interface GetEmojiRequestCommandParams {
    key: string;
}
/**
 * @internal
 */
export declare class GetEmojiRequestCommand extends APIRequestCommand {
    constructor({ key }: GetEmojiRequestCommandParams);
}
/**
 * @internal
 */
export interface GetEmojiResponseCommandPayload extends EmojiPayload {
}
/**
 * @internal
 */
export declare class GetEmojiResponseCommand extends APIResponseCommand {
    readonly emoji: Emoji;
    constructor(_iid: string, payload: GetEmojiResponseCommandPayload);
}
