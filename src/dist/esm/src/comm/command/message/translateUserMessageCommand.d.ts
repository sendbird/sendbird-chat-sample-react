import { ChannelType } from '../../../model/channel/types';
import UserMessage, { UserMessagePayload } from '../../../model/message/userMessage';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface TranslateUserMessageRequestCommandParams {
    channelType: ChannelType;
    channelUrl: string;
    messageId: number;
    translationTargetLanguages: string[];
}
interface TranslateUserMessageRequestCommandPayload {
    target_langs: string[];
}
interface TranslateUserMessageResponseCommandPayload extends UserMessagePayload {
}
/**
 * @internal
 */
export declare class TranslateUserMessageRequestCommand extends APIRequestCommand {
    params: TranslateUserMessageRequestCommandPayload;
    constructor({ channelType, channelUrl, messageId, translationTargetLanguages, }: TranslateUserMessageRequestCommandParams);
}
/**
 * @internal
 */
export declare class TranslateUserMessageResponseCommand extends APIResponseCommand {
    readonly message: UserMessage;
    constructor(_iid: string, payload: TranslateUserMessageResponseCommandPayload);
}
export {};
