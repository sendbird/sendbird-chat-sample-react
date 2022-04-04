import { ChannelType } from '../../../model/channel/types';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface DeleteMessageRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    messageId: number;
}
/**
 * @internal
 */
export declare class DeleteMessageRequestCommand extends APIRequestCommand {
    constructor(params: DeleteMessageRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteMessageResponseCommand extends APIResponseCommand {
}
interface DeleteMessageEventPayload {
    channel_url: string;
    channel_type: string;
    msg_id: number | string;
}
/**
 * @internal
 */
export declare class DeleteMessageEventCommand extends WebSocketEventCommand {
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    readonly messageId: number;
    constructor(_iid: string, _: string, payload: DeleteMessageEventPayload);
}
export {};
