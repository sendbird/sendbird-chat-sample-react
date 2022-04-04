import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
import { ReactionEvent } from '../../../module/messageModule';
import { ReactionPayload } from '../types';
/**
 * @internal
 */
export interface AddReactionRequestCommandParams {
    channelType: ChannelType;
    channelUrl: string;
    messageId: number;
    reactionKey: string;
}
interface AddReactionRequestCommandPayload {
    reaction: string;
}
interface AddReactionResponseCommandPayload extends ReactionPayload {
}
/**
 * @internal
 */
export declare class AddReactionRequestCommand extends APIRequestCommand {
    params: AddReactionRequestCommandPayload;
    constructor({ channelType, channelUrl, messageId, reactionKey }: AddReactionRequestCommandParams);
}
export declare class AddReactionResponseCommand extends APIResponseCommand {
    readonly reactionEvent: ReactionEvent;
    constructor(_iid: string, payload: AddReactionResponseCommandPayload);
}
export {};
