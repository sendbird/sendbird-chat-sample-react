import Module from './baseModule';
import { MentionType, RequestState } from '../model/message/types';
import MessageRequestHandler, { FailedMessageHandler, MessageHandler } from '../model/message/messageRequestHandler';
import BaseMessage from '../model/message/baseMessage';
import UserMessage from '../model/message/userMessage';
import FileMessage from '../model/message/fileMessage';
import AdminMessage from '../model/message/adminMessage';
import Sender from '../model/message/sender';
import Reaction from '../model/message/reaction';
import ThreadInfo from '../model/message/threadInfo';
import MessageMetaArray from '../model/message/messageMetaArray';
import OGMetaData from '../model/message/ogMetaData';
import OGImage from '../model/message/ogImage';
import Thumbnail from '../model/message/thumbnail';
import AppleCriticalAlertOptions from '../model/message/appleCriticalAlertOptions';
import ScheduledUserMessage, { ScheduledStatus } from '../model/message/scheduledUserMessage';
import ReactionEvent, { ReactionEventOperation } from '../model/event/reactionEvent';
import ThreadInfoUpdateEvent from '../model/event/threadInfoUpdateEvent';
import MessageRetrievalParams from '../model/params/messageRetrievalParams';
import MessageListParams from '../model/params/messageListParams';
import MessageChangeLogsParams from '../model/params/messageChangeLogsParams';
import UserMessageParams from '../model/params/userMessageParams';
import UserMessageUpdateParams from '../model/params/userMessageUpdateParams';
import FileMessageParams from '../model/params/fileMessageParams';
import FileMessageUpdateParams from '../model/params/fileMessageUpdateParams';
import ScheduledUserMessageParams from '../model/params/scheduledUserMessageParams';
import ThreadedMessageListParams from '../model/params/threadedMessageListParams';
import MessageSearchQuery, { MessageSearchOrder } from '../query/messageSearchQuery';
import PreviousMessageListQuery from '../query/previousMessageListQuery';
declare class MessageModule extends Module {
    name: 'message';
    private _manager;
    /**
     * @internal
     */
    init(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    }): void;
    buildMessageFromSerializedData(serialized: object): UserMessage | FileMessage | AdminMessage;
    buildSenderFromSerializedData(serialized: object): Sender;
    getMessage(params: MessageRetrievalParams): Promise<BaseMessage>;
}
export { AdminMessage, AppleCriticalAlertOptions, FailedMessageHandler, FileMessage, FileMessageParams, FileMessageUpdateParams, MentionType, MessageChangeLogsParams, MessageHandler, MessageListParams, MessageMetaArray, MessageModule, MessageRequestHandler, MessageRetrievalParams, MessageSearchOrder, MessageSearchQuery, OGImage, OGMetaData, PreviousMessageListQuery, Reaction, ReactionEvent, ReactionEventOperation, RequestState, ScheduledStatus, ScheduledUserMessage, ScheduledUserMessageParams, Sender, ThreadInfo, ThreadInfoUpdateEvent, ThreadedMessageListParams, Thumbnail, UserMessage, UserMessageParams, UserMessageUpdateParams, };
