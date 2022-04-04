import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../../core/command/websocket/websocketRequestCommand';
import ReadStatus, { ReadStatusPayload } from '../../../../model/channel/readStatus';
interface ReadEventCommandPayload extends ReadStatusPayload {
}
/**
 * @internal
 */
export declare class ReadRequestCommand extends WebSocketRequestCommand {
    constructor({ channelUrl }: {
        channelUrl: any;
    });
}
/**
 * @internal
 */
export declare class ReadEventCommand extends WebSocketEventCommand {
    readonly readStatus: ReadStatus;
    constructor(_iid: string, _: string, payload: ReadEventCommandPayload);
}
export {};
