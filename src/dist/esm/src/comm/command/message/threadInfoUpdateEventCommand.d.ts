import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import ThreadInfoUpdateEvent, { ThreadInfoUpdateEventPayload } from '../../../model/event/threadInfoUpdateEvent';
/**
 * @internal
 */
export interface ThreadInfoUpdateEventCommandPayload extends ThreadInfoUpdateEventPayload {
}
/**
 * @internal
 */
export declare class ThreadInfoUpdateEventCommand extends WebSocketEventCommand {
    readonly event: ThreadInfoUpdateEvent;
    constructor(_iid: string, _: string, payload: ThreadInfoUpdateEventCommandPayload);
}
