import { ChannelType } from '../../../model/channel/types';
import { MentionType } from '../../../model/message/types';
import FileMessage, { FileMessagePayload } from '../../../model/message/fileMessage';
import { FileMessageUpdateParamsProperties } from '../../../model/params/fileMessageUpdateParams';
import { MessageMetaArrayUpdateParams } from '../../../model/message/messageMetaArray';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../core/command/websocket/websocketRequestCommand';
/**
 * @internal
 */
export interface UpdateFileMessageRequestParams extends FileMessageUpdateParamsProperties {
    channelType: ChannelType;
    channelUrl: string;
    messageId: number;
    metaArrayParams?: MessageMetaArrayUpdateParams;
}
/**
 * @internal
 */
export declare class UpdateFileMessageRequestCommand extends WebSocketRequestCommand {
    constructor(params: UpdateFileMessageRequestParams);
}
interface UpdateFileMessageEventPayload extends FileMessagePayload {
    old_values?: {
        mention_type: MentionType;
        mentioned_user_ids: string[];
    };
}
/**
 * @internal
 */
export declare class UpdateFileMessageEventCommand extends WebSocketEventCommand {
    readonly message: FileMessage;
    readonly mentionCountChange: number;
    constructor(_iid: string, _: string, payload: UpdateFileMessageEventPayload);
}
export {};
