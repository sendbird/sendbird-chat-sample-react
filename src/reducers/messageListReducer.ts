import {BaseMessageInstance} from 'sendbird';
import {deleteMessagesFromMessageList, upsertMessagesToMessageList} from '../utils/messageUtils';

interface State {
  messageList: BaseMessageInstance[],
}

interface Action {
  type: string,
  messageList: BaseMessageInstance[],
}

export enum MessageListActionKinds {
  upsertMessages = 'UPSERT_MESSAGES',
  deleteMessages = 'DELETE_MESSAGES',
}

export const messageListReducer = (state: State, action: Action) => {
  switch (action.type) {
    case MessageListActionKinds.upsertMessages:
      return {
        messageList: upsertMessagesToMessageList(state.messageList, action.messageList),
      };
    case MessageListActionKinds.deleteMessages:
      return {
        messageList: deleteMessagesFromMessageList(state.messageList, action.messageList),
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}