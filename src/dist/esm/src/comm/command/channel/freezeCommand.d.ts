import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelEventCommandPayload } from './channelEventCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelType } from '../../../model/channel/types';
interface FreezeRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    freezing: boolean;
}
interface FreezeRequestCommandPayload {
    freeze: boolean;
}
/**
 * @internal
 */
export declare class FreezeRequestCommand extends APIRequestCommand {
    params: FreezeRequestCommandPayload;
    constructor(params: FreezeRequestCommandParams);
}
/**
 * @internal
 */
export declare class FreezeResponseCommand extends APIResponseCommand {
}
/**
 * @internal
 */
export interface FreezeEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        freeze: boolean;
    };
}
/**
 * @internal
 */
export declare class FreezeEventCommand extends WebSocketEventCommand {
    readonly freeze: boolean;
    constructor(_iid: string, _: string, payload: FreezeEventCommandPayload);
}
export {};
