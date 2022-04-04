import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../../core/command/websocket/websocketRequestCommand';
import User, { UserPayload } from '../../../../model/user';
/**
 * @internal
 */
export declare class EnterOpenChannelRequestCommand extends WebSocketRequestCommand {
    constructor({ channelUrl }: {
        channelUrl: any;
    });
}
interface EnterOpenChannelEventCommandPayload {
    data: {
        participant_count?: number;
        edge_ts?: number;
    } & UserPayload;
}
/**
 * @internal
 */
export declare class EnterOpenChannelEventCommand extends WebSocketEventCommand {
    participantCount: number;
    user: User;
    ts: number;
    constructor(_iid: string, _: string, payload: EnterOpenChannelEventCommandPayload);
}
export {};
