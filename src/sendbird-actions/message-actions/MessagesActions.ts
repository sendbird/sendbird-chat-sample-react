import SendBird, {
  BaseChannel,
  BaseMessageInstance,
  MessageListParams,
  SendBirdInstance
} from 'sendbird';

export const getMessagesByTimestamp = async (
  channel: BaseChannel,
  ts: number = 0,
): Promise<BaseMessageInstance[]> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const messageListParams: MessageListParams = new sb.MessageListParams();
  messageListParams.isInclusive = true;
  messageListParams.prevResultSize = 20;
  messageListParams.nextResultSize = 20;

  const messages: BaseMessageInstance[] = await channel.getMessagesByTimestamp(ts, messageListParams);
  return messages;
}

export const getMessagesByMessageId = async (
  channel: BaseChannel,
  messageId: number,
): Promise<BaseMessageInstance[]> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const messageListParams: MessageListParams = new sb.MessageListParams();
  messageListParams.isInclusive = true;
  messageListParams.prevResultSize = 20;
  messageListParams.nextResultSize = 20;

  const messages: BaseMessageInstance[] = await channel.getMessagesByMessageId(messageId, messageListParams);
  return messages;
}