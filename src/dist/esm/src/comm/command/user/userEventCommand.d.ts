import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import UserEvent, { UserEventPayload } from '../../event/userEvent';
/**
 * @internal
 */
export interface UserEventCommandPayload extends UserEventPayload {
}
/**
 * @internal
 */
export declare class UserEventCommand extends WebSocketEventCommand {
    readonly event: UserEvent;
    constructor(_iid: string, _: string, payload: UserEventCommandPayload);
}
