import { ChannelType } from '../../../model/channel/types';
import FileMessage, { FileMessagePayload } from '../../../model/message/fileMessage';
import { FileMessageParamsProperties } from '../../../model/params/fileMessageParams';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import WebSocketRequestCommand from '../../../core/command/websocket/websocketRequestCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
/**
 * @internal
 */
export interface SendFileMessageRequestParams extends FileMessageParamsProperties {
    channelType: ChannelType;
    channelUrl: string;
    url: string;
    requireAuth?: boolean;
    silent?: boolean;
    reqId?: string;
}
/**
 * @internal
 */
export interface SendFileMessageAPIRequestParams extends SendFileMessageRequestParams {
    userId: string;
}
/**
 * @internal
 */
export declare class SendFileMessageRequestCommand extends WebSocketRequestCommand {
    constructor(params: SendFileMessageRequestParams);
}
/**
 * @internal
 */
export declare class SendFileMessageAPIRequestCommand extends APIRequestCommand {
    constructor(params: SendFileMessageAPIRequestParams);
}
interface FileMessageEventPayload extends FileMessagePayload {
    force_update_last_message?: boolean;
}
interface FileMessageAPIResponsePayload extends FileMessageEventPayload {
}
/**
 * @internal
 */
export declare class FileMessageEventCommand extends WebSocketEventCommand {
    readonly message: FileMessage;
    readonly isMentioned: boolean;
    readonly forceUpdateLastMessage: boolean;
    constructor(_iid: string, _: string, payload: FileMessageEventPayload);
}
/**
 * @internal
 */
export declare class SendFileMessageAPIResponseCommand extends APIResponseCommand {
    readonly message: FileMessage;
    readonly isMentioned: boolean;
    readonly forceUpdateLastMessage: boolean;
    constructor(_iid: string, payload: FileMessageAPIResponsePayload);
}
export {};
