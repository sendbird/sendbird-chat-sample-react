import {BaseMessageInstance, FileMessage, UserMessage} from 'sendbird';
import moment from 'moment';

const placeOfMessage = (messages: BaseMessageInstance[], message: BaseMessageInstance): number => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (message.createdAt > messages[i].createdAt) return i + 1;
  }
  return 0;
};

export const addMessagesToMessageList = (
  messageList: BaseMessageInstance[],
  messagesToAdd: BaseMessageInstance[],
): BaseMessageInstance[] => {
  return messageList.concat(messagesToAdd);
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
  return messageList.concat(loadedNextMessages);
};

export const upsertSentMessagesToMessageList = (
  oldMessageList: BaseMessageInstance[],
  sentMessages: (UserMessage | FileMessage)[],
): BaseMessageInstance[] => {
  const sentReqIds: string[] = sentMessages.map((message: UserMessage | FileMessage) => message.reqId);
  const filteredList: BaseMessageInstance[] = oldMessageList.filter((oldsMessage: BaseMessageInstance) => {
    return oldsMessage.isAdminMessage()
      || (
        (oldsMessage.isUserMessage() || oldsMessage.isFileMessage())
        && sentReqIds.indexOf(oldsMessage.reqId) === -1
      );
  });
  return filteredList.concat(sentMessages);

  // Alternative logic for better performance
  // for (let i = 0; i < sentMessages.length; i++) {
  //   const sentMessage: UserMessage | FileMessage = sentMessages[i];
  //   let j = oldMessageList.length - 1;
  //   let foundAt = -1;
  //   while (j >= 0 && foundAt === -1) {
  //     const oldMessage: BaseMessageInstance = oldMessageList[j];
  //     if (oldMessage.createdAt > sentMessage.createdAt) break;
  //     if (
  //       (oldMessage.isUserMessage() || oldMessage.isFileMessage())
  //       && oldMessage.reqId === sentMessage.reqId
  //     ) foundAt = j;
  //     j--;
  //   }
  //   if (foundAt >= 0) {
  //     oldMessageList.splice(foundAt, 1);
  //   }
  // }
  // return oldMessageList.concat(sentMessages);
}

export const updateMessagesToMessageList = (
  oldMessageList: BaseMessageInstance[],
  updatedMessages: BaseMessageInstance[],
): BaseMessageInstance[] => {
  let newMessageList: BaseMessageInstance[] = [];
  const messagesToUpdate: (UserMessage | FileMessage)[] = [...updatedMessages] as (UserMessage | FileMessage)[];

  for (let i = 0; i < oldMessageList.length; i++) {
    const currentMessage: BaseMessageInstance = oldMessageList[i];
    if (
      !currentMessage.isUserMessage() && !currentMessage.isFileMessage()
      || messagesToUpdate.length === 0
    ) {
      newMessageList.push(currentMessage);
      continue;
    }
    const currentMessageId: number = currentMessage.messageId;
    const messageIdsToUpsert: number[] = messagesToUpdate.map((message: BaseMessageInstance) => message.messageId);
    const foundAt = messageIdsToUpsert.indexOf(currentMessageId);
    if (foundAt >= 0) {
      const messageToUpdate = messagesToUpdate.splice(foundAt, 1)[0];
      newMessageList.splice(placeOfMessage(newMessageList, messageToUpdate), 0, messageToUpdate);
    } else {
      newMessageList.push(currentMessage);
    }
  }
  return newMessageList;
}

export const deleteMessagesFromMessageList = (
  messageList: BaseMessageInstance[],
  messages: BaseMessageInstance[],
): BaseMessageInstance[] => {
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

export const protectFromXSS = (text: string) => {
  return text
    .replace(/\&/g, '&amp;')
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&apos;');
};
