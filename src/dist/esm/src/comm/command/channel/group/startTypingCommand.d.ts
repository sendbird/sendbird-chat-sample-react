import User, { UserPayload } from '../../../../model/user';
import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../../core/command/websocket/websocketRequestCommand';
import { ChannelEventCommandPayload } from '../channelEventCommand';
/**
 * @internal
 */
export interface StartTypingRequestCommandParams {
    channelUrl: string;
    time: number;
}
/**
 * @internal
 */
export declare class StartTypingRequestCommand extends WebSocketRequestCommand {
    constructor({ channelUrl, time }: StartTypingRequestCommandParams);
}
/**
 * @internal
 */
export interface StartTypingEventCommandPayload extends ChannelEventCommandPayload {
    data: UserPayload;
}
/**
 * @internal
 */
export declare class StartTypingEventCommand extends WebSocketEventCommand {
    readonly user: User;
    constructor(_iid: string, _: string, payload: StartTypingEventCommandPayload);
}
