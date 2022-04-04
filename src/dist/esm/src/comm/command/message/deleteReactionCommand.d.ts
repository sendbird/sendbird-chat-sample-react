import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
import { ReactionEvent } from '../../../module/messageModule';
import { ReactionPayload } from '../types';
/**
 * @internal
 */
export interface DeleteReactionRequestCommandParams {
    channelType: ChannelType;
    channelUrl: string;
    messageId: number;
    reactionKey: string;
}
interface DeleteReactionRequestCommandPayload {
    reaction: string;
}
interface DeleteReactionResponseCommandPayload extends ReactionPayload {
}
/**
 * @internal
 */
export declare class DeleteReactionRequestCommand extends APIRequestCommand {
    params: DeleteReactionRequestCommandPayload;
    constructor({ channelType, channelUrl, messageId, reactionKey }: DeleteReactionRequestCommandParams);
}
export declare class DeleteReactionResponseCommand extends APIResponseCommand {
    reactionEvent: ReactionEvent;
    constructor(_iid: string, payload: DeleteReactionResponseCommandPayload);
}
export {};
