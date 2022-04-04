import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelType } from '../../../model/channel/types';
import ReactionEvent, { ReactionEventPayload } from '../../../model/event/reactionEvent';
/**
 * @internal
 */
export interface ReactionEventCommandPayload extends ReactionEventPayload {
    channel_url: string;
    channel_type: string;
}
/**
 * @internal
 */
export declare class ReactionEventCommand extends WebSocketEventCommand {
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    readonly event: ReactionEvent;
    constructor(_iid: string, _: string, payload: ReactionEventCommandPayload);
}
