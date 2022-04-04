import { ChannelType } from '../../../model/channel/types';
import UserMessage, { UserMessagePayload } from '../../../model/message/userMessage';
import { UserMessageParamsProperties } from '../../../model/params/userMessageParams';
import WebSocketRequestCommand from '../../../core/command/websocket/websocketRequestCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
/**
 * @internal
 */
export interface SendUserMessageRequestParams extends UserMessageParamsProperties {
    channelType: ChannelType;
    channelUrl: string;
    requestId: string;
    silent?: boolean;
}
/**
 * @internal
 */
export declare class SendUserMessageRequestCommand extends WebSocketRequestCommand {
    constructor(params: SendUserMessageRequestParams);
}
interface UserMessageEventPayload extends UserMessagePayload {
    force_update_last_message?: boolean;
}
/**
 * @internal
 */
export declare class UserMessageEventCommand extends WebSocketEventCommand {
    readonly message: UserMessage;
    readonly isMentioned: boolean;
    readonly forceUpdateLastMessage: boolean;
    constructor(_iid: string, _: string, payload: UserMessageEventPayload);
}
export {};
