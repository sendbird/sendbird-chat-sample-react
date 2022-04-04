import AdminMessage, { AdminMessagePayload } from '../../../model/message/adminMessage';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
interface AdminMessageEventPayload extends AdminMessagePayload {
    force_update_last_message?: boolean;
}
/**
 * @internal
 */
export declare class AdminMessageEventCommand extends WebSocketEventCommand {
    readonly message: AdminMessage;
    readonly isMentioned: boolean;
    readonly forceUpdateLastMessage: boolean;
    constructor(_iid: string, _: string, payload: AdminMessageEventPayload);
}
export {};
