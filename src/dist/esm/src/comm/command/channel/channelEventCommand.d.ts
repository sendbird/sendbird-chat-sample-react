import ChannelEvent, { ChannelEventPayload } from '../../event/channelEvent';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
/**
 * @internal
 */
export interface ChannelEventCommandPayload extends ChannelEventPayload {
}
/**
 * @internal
 */
export declare class ChannelEventCommand extends WebSocketEventCommand {
    readonly event: ChannelEvent;
    constructor(_iid: string, _: string, payload: ChannelEventCommandPayload);
}
