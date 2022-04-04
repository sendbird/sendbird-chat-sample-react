import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
interface DeliverRequestCommandParams {
    channelUrl: string;
    userId: string;
}
/**
 * @internal
 */
export declare class DeliverRequestCommand extends APIRequestCommand {
    constructor({ channelUrl, userId }: DeliverRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeliverResponseCommand extends APIResponseCommand {
}
interface DeliverEventCommandPayload {
    channel_url: string;
    updated: {
        [userId: string]: number;
    };
}
/**
 * @internal
 */
export declare class DeliverEventCommand extends WebSocketEventCommand {
    readonly channelUrl: string;
    readonly deliveredStateUpdate: {
        [userId: string]: number;
    };
    constructor(_iid: string, _: string, payload: DeliverEventCommandPayload);
}
export {};
