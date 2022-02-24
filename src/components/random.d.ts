// New enums
declare enum ScheduledStatus {
  PENDING = 'pending',
  IN_QUEUE = 'in queue',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REMOVED = 'removed',
}

declare enum ScheduledMessageListOrder {
  CREATED_AT = 'created_at', // default
  SCHEDULED_AT = 'scheduled_at',
}

// New types
type cancelScheduledMessageCallback = (error: SendBirdError) => void;

type getTotalScheduledMessageCountCallback = (totalCount: number, error: SendBirdError) => void;

type MessageTypeFilter = 0 | 1 | 2 | 3 | '' | 'MESG' | 'FILE' | 'ADMM';

// New interfaces
interface ScheduledInfo {
  scheduledMessageId: number;
  scheduledStatus: ScheduledStatus;
  scheduledAt: number;
}

interface ScheduledMessageRetrievalParams {
  channelUrl: string;
  scheduledMessageId: number;
}

type scheduledMessageCallback<T = UserMessage | FileMessage> = (message: T, error: SendBirdError) => void;
type scheduledMessagesCallback = (messages: Array<UserMessage | FileMessage>, error: SendBirdError) => void;

interface ScheduledMessageListQuery {
  token: string;
  limit: number;
  channelUrl: string;
  order: ScheduledMessageListOrder;
  reverse: boolean;
  scheduledStatus: ScheduledStatus[];
  messageType: MessageTypeFilter;

  next(callback?: messageListCallback): Promise<Array<UserMessage | FileMessage | AdminMessage>>;
}

// New properties
interface BaseMessageInstance {
  scheduledInfo: ScheduledInfo; // null for non-scheduled messages.
}

interface BaseMessageInstance {
  scheduledInfo: ScheduledInfo; // null for non-scheduled messages.
}

// New methods
interface SendBirdInstance {
  // Fetches a total scheduled message count.
  getTotalScheduledMessageCount(
    params: TotalScheduledMessageCountParams,
    callback?: getTotalScheduledMessageCountCallback,
  ): Promise<>;
}

interface TotalScheduledMessageCountParams {
  channelUrl: string;
  scheduledStatus: ScheduledStatus[];
  messageType: MessageTypeFilter | null;
}

interface Group {
  createScheduledMessageListQuery(): ScheduledMessageListQuery;
}

interface UserMessage extends BaseMessageInstance {
  getTranslations(): object | null; // return NULL if not translated yet (scheduled message).
  getTargetTranslations(): string[]; // returns translation keys as list (valid for both normal message & scheduled message).
}

interface UserMessageStatic {
  // Fetches a scheduled message.
  getScheduledMessage(
    params: ScheduledMessageRetrievalParams,
    callback?: messageCallback<UserMessage>,
  ): Promise<UserMessage>;
}

interface FileMessageStatic {
  // Fetches a scheduled message.
  getScheduledMessage(
    params: ScheduledMessageRetrievalParams,
    callback?: messageCallback<FileMessage>,
  ): Promise<FileMessage>;
}

// New methods
interface GroupChannel extends BaseChannel {
  // Creates a scheduled user message.
  createScheduledMessage(
    scheduledAt: number,
    userMessageParams: UserMessageParams,
    callback?: messageCallback<UserMessage>,
  ): Promise<UserMessage>;

  // Creates a scheduled file message.
  createScheduledMessage(
    scheduledAt: number,
    fileMessageParams: FileMessageParams,
    callback?: messageCallback<FileMessage>,
  ): Promise<FileMessage>;

  // Updates a scheduled user message.
  updateScheduledMessage(
    scheduledMessageId: number,
    userMessageParams: UserMessageParams,
    callback?: messageCallback<UserMessage>,
  ): Promise<UserMessage>;

  // Updates a scheduled file message.
  updateScheduledMessage(
    scheduledMessageId: number,
    fileMessageParams: FileMessageParams,
    callback?: messageCallback<FileMessage>,
  ): Promise<FileMessage>;

  // Cancels a scheduled message.
  cancelScheduledMessage(
    scheduledMessageId: number,
    callback?: cancelScheduledMessageCallback,
  ): Promise<number>;
}
