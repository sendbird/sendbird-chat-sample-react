import SendBird, {
  BaseChannel,
  SendBirdError,
  SendBirdInstance,
  UserMessage
} from 'sendbird';

/**
 * Creates and returns a pending user message and then makes a send request to the server.
 * Sent message will be received by a handler.
 * @param channel base channel.
 * @param message pending user message.
 */
export const sendUserMessage = (channel: BaseChannel, message: string): Promise<UserMessage> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const userMessageParams = new sb.UserMessageParams();
  userMessageParams.message = message;

  return new Promise((resolve, reject) => {
    channel.sendUserMessage(userMessageParams, (message: UserMessage, err: SendBirdError) => {
      if (err) reject(err);
      resolve(message);
    });
  });
}

export const updateUserMessage = async (
  channel: BaseChannel,
  messageId: number,
  message: string
): Promise<UserMessage> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const userMessageParams = new sb.UserMessageParams();
  userMessageParams.message = message;

  const updatedUserMessage: UserMessage = await channel.updateUserMessage(messageId, userMessageParams);
  return updatedUserMessage;
}

export const copyUserMessage = (channel: BaseChannel, userMessage: UserMessage): Promise<UserMessage> => {
  return new Promise((resolve, reject) => {
    channel.copyUserMessage(channel, userMessage, (copiedUserMessage: UserMessage, err: SendBirdError) => {
      if (err) reject(err);
      resolve(copiedUserMessage);
    });
  });
}

export const deleteUserMessage = async (channel: BaseChannel, userMessage: UserMessage): Promise<Object> => {
  return await channel.deleteMessage(userMessage);
}