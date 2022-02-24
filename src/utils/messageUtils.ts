import {BaseMessageInstance} from 'sendbird';
import moment from 'moment';

const placeOfMessage = (messages: BaseMessageInstance[], message: BaseMessageInstance) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (message.createdAt > messages[i].createdAt) return i + 1;
  }
  return 0;
};


export const upsertMessagesToMessageList = (messageList: BaseMessageInstance[], messages: BaseMessageInstance[]): BaseMessageInstance[] => {
  const messagesToUpsert: BaseMessageInstance[] = [...messages];
  let newMessageList: BaseMessageInstance[] = [];

  // First loop updates existing messages.
  for (let i = 0; i < messageList.length; i++) {
    const currentMessage: BaseMessageInstance = messageList[i];
    if (messagesToUpsert.length > 0) {
      const currentMessageId: number = (currentMessage.isUserMessage() || currentMessage.isFileMessage())
        ? Number(currentMessage.reqId)
        : currentMessage.messageId;

      const idsToUpsert: number[] = messagesToUpsert.map((message: BaseMessageInstance) => {
        if (message.isUserMessage() || message.isFileMessage()) {
          return Number(message.reqId);
        }
        return message.messageId;
      });

      const foundAt = idsToUpsert.indexOf(currentMessageId);
      if (foundAt >= 0) {
        idsToUpsert.splice(foundAt, 1);
        newMessageList.push(messagesToUpsert.splice(foundAt, 1)[0]);
        continue;
      }
    }
    newMessageList.push(currentMessage);
  }

  // Second loop adds new messages.
  while (messagesToUpsert.length > 0) {
    const messageToUpsert: BaseMessageInstance = messagesToUpsert[0];
    newMessageList.splice(placeOfMessage(newMessageList, messageToUpsert), 0, messageToUpsert);
    messagesToUpsert.splice(0, 1);
  }
  return newMessageList;
}

export const deleteMessagesFromMessageList = (messageList: BaseMessageInstance[], messages: BaseMessageInstance[]): BaseMessageInstance[] => {
  const messagesToDelete: BaseMessageInstance[] = [...messages];
  const messageListCopy: BaseMessageInstance[] = [...messageList];
  while (messagesToDelete.length > 0) {
    const messageIds: number[] = messageListCopy.map((message: BaseMessageInstance) => message.messageId);
    const deleteAt: number = messageIds.indexOf(messagesToDelete[0].messageId);
    if (deleteAt >= 0) {
      messageIds.splice(deleteAt, 1);
      messageListCopy.splice(deleteAt, 1);
    }
    messagesToDelete.splice(0, 1);
  }
  return messageListCopy;
}

export const getCreatedAtFromNow = (createdAt: number) => {
  return moment(createdAt).fromNow();
};