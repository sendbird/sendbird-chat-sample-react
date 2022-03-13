import SendBird, {
  BaseChannel, messageCallback,
  SendBirdError,
  SendBirdInstance,
  UserMessage
} from 'sendbird';
import {MessageListActionKinds} from '../../reducers/messageListReducer';

export const sendUserMessage = (channel: BaseChannel, message: string, callback?: () => void): Promise<UserMessage> => {
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

export const sendUserMessageWithCallback = (
  channel: BaseChannel,
  message: string,
  callback: messageCallback<UserMessage>,
): UserMessage => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const userMessageParams = new sb.UserMessageParams();
  userMessageParams.message = message;

  const pendingMessage: UserMessage = channel.sendUserMessage(userMessageParams, callback);
  return pendingMessage;
}

export const updateUserMessage = async (
  channel: BaseChannel,
  messageId: number,
  message: string
): Promise<UserMessage> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const userMessageParams = new sb.UserMessageParams();
  userMessageParams.message = message;

  return new Promise((resolve, reject) => {
    channel.updateUserMessage(messageId, userMessageParams, (updatedMessage: UserMessage, err: SendBirdError) => {
      if (err) reject(err);
      resolve(updatedMessage);
    });
  });
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