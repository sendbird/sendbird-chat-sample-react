import FileMessageQueue from '../comm/fileMessageQueue';
import { ChannelType } from '../model/channel/types';
import BaseMessage from '../model/message/baseMessage';
import UserMessage from '../model/message/userMessage';
import FileMessage from '../model/message/fileMessage';
import AdminMessage from '../model/message/adminMessage';
import Sender from '../model/message/sender';
import MessageChangelogs from '../model/message/messageChangelogs';
import MessageRetrievalParams from '../model/params/messageRetrievalParams';
import { MessageListParamsProperties } from '../model/params/messageListParams';
import { ThreadedMessageListParamsProperties } from '../model/params/threadedMessageListParams';
import { MessageChangeLogsParamsProperties } from '../model/params/messageChangeLogsParams';
import { MessageEventSource } from '../comm/command/internal/messageEventCommand';
/**
 * @internal
 */
export default class MessageManager {
    private _iid;
    private _sdkState;
    private _requestQueue;
    private _dispatcher;
    readonly fileMessageQueue: FileMessageQueue;
    constructor(_iid: string, { sdkState, dispatcher, requestQueue, }: {
        sdkState: any;
        dispatcher: any;
        requestQueue: any;
    });
    static of(_iid: string): MessageManager;
    buildMessageFromSerializedData(serialized: object): UserMessage | FileMessage | AdminMessage;
    buildSenderFromSerializedData(serialized: object): Sender;
    getMessage(params: MessageRetrievalParams): Promise<BaseMessage>;
    getMessagesByTimestamp(channelUrl: string, channelType: ChannelType, ts: number, params: MessageListParamsProperties, source?: MessageEventSource): Promise<BaseMessage[]>;
    getThreadedMessagesByTimestamp(parentMessage: BaseMessage, ts: number, params: ThreadedMessageListParamsProperties, source?: MessageEventSource): Promise<{
        parentMessage: BaseMessage;
        threadedMessages: BaseMessage[];
    }>;
    getMessageChangelogs(channelUrl: string, channelType: ChannelType, token: string | number, params: MessageChangeLogsParamsProperties, source?: MessageEventSource): Promise<MessageChangelogs>;
}
