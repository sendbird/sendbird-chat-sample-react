import SendBird, {
  BaseChannel,
  FileMessage, messageCallback,
  SendBirdError,
  SendBirdInstance, UserMessage
} from 'sendbird';

export const sendFileMessage = (channel: BaseChannel, file: Blob): Promise<FileMessage> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const fileMessageParams = new sb.FileMessageParams();
  fileMessageParams.file = file;

  return new Promise((resolve, reject) => {
    // FIXME: Message type should be FileMessage.
    channel.sendFileMessage(fileMessageParams, (message, err: SendBirdError) => {
      if (err) reject(err);
      resolve(message as FileMessage);
    });
  });
}

export const sendFileMessageWithCallback = (
  channel: BaseChannel,
  file: Blob,
  callback: messageCallback<FileMessage>,
): FileMessage => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const fileMessageParams = new sb.FileMessageParams();
  fileMessageParams.file = file;
  // @ts-ignore
  const pendingMessage: FileMessage = channel.sendFileMessage(fileMessageParams, callback);
  return pendingMessage;
}

export const updateFileMessage = async (
  channel: BaseChannel,
  messageId: number,
  file: Blob,
  fileName: string,
): Promise<FileMessage> => {
  const sb: SendBirdInstance = SendBird.getInstance();
  const fileMessageParams = new sb.FileMessageParams();
  fileMessageParams.file = file;
  fileMessageParams.fileName = fileName;

  const updatedFileMessage: FileMessage = await channel.updateFileMessage(messageId, fileMessageParams);
  return updatedFileMessage;
}

export const copyFileMessage = (channel: BaseChannel, fileMessage: FileMessage): Promise<FileMessage> => {
  return new Promise((resolve, reject) => {
    channel.copyFileMessage(channel, fileMessage, (copiedFileMessage: FileMessage, err: SendBirdError) => {
      if (err) reject(err);
      resolve(copiedFileMessage);
    });
  });
}

export const deleteFileMessage = async (channel: BaseChannel, fileMessage: FileMessage): Promise<Object> => {
  return await channel.deleteMessage(fileMessage);
}