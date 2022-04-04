import AdminMessage, { AdminMessagePayload } from '../../../model/message/adminMessage';
import { MentionType } from '../../../model/message/types';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
interface UpdateAdminMessageEventPayload extends AdminMessagePayload {
    old_values?: {
        mention_type: MentionType;
        mentioned_user_ids: string[];
    };
}
/**
 * @internal
 */
export declare class UpdateAdminMessageEventCommand extends WebSocketEventCommand {
    readonly message: AdminMessage;
    readonly mentionCountChange: number;
    constructor(_iid: string, _: string, payload: UpdateAdminMessageEventPayload);
}
export {};
