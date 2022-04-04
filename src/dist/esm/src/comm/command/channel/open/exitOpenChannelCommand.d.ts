import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../../core/command/websocket/websocketRequestCommand';
import User, { UserPayload } from '../../../../model/user';
/**
 * @internal
 */
export declare class ExitOpenChannelRequestCommand extends WebSocketRequestCommand {
    constructor({ channelUrl }: {
        channelUrl: any;
    });
}
interface ExitOpenChannelEventCommandPayload {
    data: {
        participant_count?: number;
        edge_ts?: number;
    } & UserPayload;
}
/**
 * @internal
 */
export declare class ExitOpenChannelEventCommand extends WebSocketEventCommand {
    participantCount: number;
    user: User;
    ts: number;
    constructor(_iid: string, _: string, payload: ExitOpenChannelEventCommandPayload);
}
export {};
