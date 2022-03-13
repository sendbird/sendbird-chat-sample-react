import SendBird, {
  BaseChannel,
  BaseMessageInstance,
  MessageListParams,
  SendBirdInstance
} from 'sendbird';

export const getPreviousMessagesByTimestamp = async (
  channel: BaseChannel,
  ts: number = 0,
  limit: number = 20,
): Promise<BaseMessageInstance[]> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const messageListParams: MessageListParams = new sb.MessageListParams();
  messageListParams.prevResultSize = limit;

  const messages: BaseMessageInstance[] = await channel.getMessagesByTimestamp(ts, messageListParams);
  return messages;
}

export const getNextMessagesByTimestamp = async (
  channel: BaseChannel,
  ts: number = 0,
  limit: number = 20,
): Promise<BaseMessageInstance[]> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const messageListParams: MessageListParams = new sb.MessageListParams();
  messageListParams.nextResultSize = limit;

    const messages: BaseMessageInstance[] = await channel.getMessagesByTimestamp(ts, messageListParams);
  return messages;
}