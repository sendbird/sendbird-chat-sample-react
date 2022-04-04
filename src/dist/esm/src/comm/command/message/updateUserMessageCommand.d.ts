import { ChannelType } from '../../../model/channel/types';
import { MentionType } from '../../../model/message/types';
import UserMessage, { UserMessagePayload } from '../../../model/message/userMessage';
import { MessageMetaArrayUpdateParams } from '../../../model/message/messageMetaArray';
import { UserMessageUpdateParamsProperties } from '../../../model/params/userMessageUpdateParams';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../core/command/websocket/websocketRequestCommand';
/**
 * @internal
 */
export interface UpdateUserMessageRequestParams extends UserMessageUpdateParamsProperties {
    channelType: ChannelType;
    channelUrl: string;
    messageId: number;
    metaArrayParams?: MessageMetaArrayUpdateParams;
}
/**
 * @internal
 */
export declare class UpdateUserMessageRequestCommand extends WebSocketRequestCommand {
    constructor(params: UpdateUserMessageRequestParams);
}
interface UpdateUserMessageEventPayload extends UserMessagePayload {
    old_values?: {
        mention_type: MentionType;
        mentioned_user_ids: string[];
    };
}
/**
 * @internal
 */
export declare class UpdateUserMessageEventCommand extends WebSocketEventCommand {
    readonly message: UserMessage;
    readonly mentionCountChange: number;
    constructor(_iid: string, _: string, payload: UpdateUserMessageEventPayload);
}
export {};
