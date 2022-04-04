import User, { UserPayload } from '../../../../model/user';
import { ChannelEventCommandPayload } from '../channelEventCommand';
import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../../core/command/websocket/websocketRequestCommand';
/**
 * @internal
 */
export interface EndTypingRequestCommandParams {
    channelUrl: string;
    time: number;
}
/**
 * @internal
 */
export declare class EndTypingRequestCommand extends WebSocketRequestCommand {
    constructor({ channelUrl, time }: EndTypingRequestCommandParams);
}
/**
 * @internal
 */
export interface EndTypingEventCommandPayload extends ChannelEventCommandPayload {
    data: UserPayload;
}
/**
 * @internal
 */
export declare class EndTypingEventCommand extends WebSocketEventCommand {
    readonly user: User;
    constructor(_iid: string, _: string, payload: EndTypingEventCommandPayload);
}
