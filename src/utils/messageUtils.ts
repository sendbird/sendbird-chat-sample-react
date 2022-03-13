import {BaseMessageInstance} from 'sendbird';
import moment from 'moment';

export const addMessagesToMessageList = (
  messageList: BaseMessageInstance[],
  messagesToAdd: BaseMessageInstance[],
): BaseMessageInstance[] => {
  const newMessageList = [...messageList];
  const messageIds = newMessageList.map((message: BaseMessageInstance) => message.messageId);
  for (let i = 0; i < messagesToAdd.length; i++) {
    const nextMessage: BaseMessageInstance = messagesToAdd[i];
    if (messageIds.indexOf(nextMessage.messageId) === -1) {
      newMessageList.push(nextMessage);
    }
  }
  return newMessageList;
};

export const addLoadedPreviousMessagesToMessageList = (
  messageList: BaseMessageInstance[],
  loadedPreviousMessages: BaseMessageInstance[]
): BaseMessageInstance[] => {
  return loadedPreviousMessages.concat(messageList);
};

export const addLoadedNextMessagesToMessageList = (
  messageList: BaseMessageInstance[],
  loadedNextMessages: BaseMessageInstance[]
): BaseMessageInstance[] => {
  const newMessageList = [...messageList];
  const messageIds = newMessageList.map((message: BaseMessageInstance) => message.messageId);
  for (let i = 0; i < loadedNextMessages.length; i++) {
    const nextMessage: BaseMessageInstance = loadedNextMessages[i];
    if (messageIds.indexOf(nextMessage.messageId) === -1) {
      newMessageList.push(nextMessage);
    }
  }
  return newMessageList;
};

export const updateMessagesToMessageList = (
  oldMessageList: BaseMessageInstance[],
  receivedMessages: BaseMessageInstance[],
): BaseMessageInstance[] => {
  /**
   * Case 1:
   *   Message to replace is a user/file message:
   *     Case 1.1: Sent by me.
   *       Replace by reqId in order to consider pending message.
   *     Case 1.2: Sent by others.
   *       Replace by messageId.
   * Case 2:
   *   Message to replace is an admin message:
   *     Replace by messageId.
   */
  let newMessageList: BaseMessageInstance[] = [];
  const messagesToUpdate: BaseMessageInstance[] = [...receivedMessages];
  let i = 0;
  while (messagesToUpdate.length > 0 && i < oldMessageList.length) {
    const currentMessage: BaseMessageInstance = oldMessageList[i];
    if ((currentMessage.isUserMessage() || currentMessage.isFileMessage()) && currentMessage.sendingStatus === 'pending') {
      const reqIdsToUpdate: string[] = messagesToUpdate.map((message: BaseMessageInstance) => {
        return (message.isUserMessage() || message.isFileMessage()) ? message.reqId : '';
      });
      const foundAt: number = reqIdsToUpdate.indexOf(currentMessage.reqId);
      if (foundAt >= 0) {
        const messageToUpdate = messagesToUpdate.splice(foundAt, 1)[0];
        newMessageList.push(messageToUpdate);
      } else {
        newMessageList.push(currentMessage);
      }
    } else {
      const messageIdsToUpdate: number[] = messagesToUpdate.map((message: BaseMessageInstance) => message.messageId);
      const foundAt: number = messageIdsToUpdate.indexOf(currentMessage.messageId);
      if (foundAt >= 0) {
        const messageToUpdate = messagesToUpdate.splice(foundAt, 1)[0];
        newMessageList.push(messageToUpdate);
      } else {
        newMessageList.push(currentMessage);
      }
    }
    i++;
  }
  if (i < oldMessageList.length) newMessageList = newMessageList.concat(oldMessageList.slice(i));
  return newMessageList;
}

export const deleteMessagesFromMessageList = (
  oldMessageList: BaseMessageInstance[],
  messages: BaseMessageInstance[],
): BaseMessageInstance[] => {
  const messageIdsToDelete: number[] = messages.map((message: BaseMessageInstance) => message.messageId);
  return deleteMessagesByMessageIdFromMessageList(oldMessageList, messageIdsToDelete);
}

export const deleteMessagesByMessageIdFromMessageList = (
  oldMessageList: BaseMessageInstance[],
  messageIds: number[],
): BaseMessageInstance[] => {
  const messageIdsToDelete: number[] = [...messageIds];
  let newMessageList: BaseMessageInstance[] = [];
  let i = 0;
  while (messageIdsToDelete.length > 0 && i < oldMessageList.length) {
    const currentMessage: BaseMessageInstance = oldMessageList[i];
    const foundAt: number = messageIdsToDelete.indexOf(currentMessage.messageId);
    if (foundAt >= 0) {
      messageIdsToDelete.splice(foundAt, 1);
    } else {
      newMessageList.push(currentMessage);
    }
    i++;
  }
  if (i < oldMessageList.length) newMessageList = newMessageList.concat(oldMessageList.slice(i));
  return newMessageList;
}

export const protectFromXSS = (text: string) => {
  return text
    .replace(/\&/g, '&amp;')
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&apos;');
};

export const timestampToTime = (timestamp: number) => {
  const now = new Date().getTime();
  const nowDate = moment.unix(now.toString().length === 13 ? now / 1000 : now).format('MM/DD');
  let date = moment.unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp).format('MM/DD');
  if (date === 'Invalid date') {
    date = '';
  }
  return nowDate === date
    ? moment.unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp).format('HH:mm:ss')
    : date;
};