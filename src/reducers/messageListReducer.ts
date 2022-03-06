import {BaseMessageInstance} from 'sendbird';
import {deleteMessagesFromMessageList, upsertMessagesToMessageList} from '../utils/messageUtils';

export enum MessageListActionKinds {
  SET_MESSAGES = 'SET_MESSAGES',
  UPSERT_MESSAGES = 'UPSERT_MESSAGES',
  DELETE_MESSAGES = 'DELETE_MESSAGES',
}

interface State {
  messageList: BaseMessageInstance[],
}

interface setMessagesAction {
  type: MessageListActionKinds.SET_MESSAGES,
  payload: BaseMessageInstance[],
}

interface upsertMessagesAction {
  type: MessageListActionKinds.UPSERT_MESSAGES,
  payload: BaseMessageInstance[],
}

interface deleteMessagesAction {
  type: MessageListActionKinds.DELETE_MESSAGES,
  payload: BaseMessageInstance[],
}

type Action = setMessagesAction | upsertMessagesAction | deleteMessagesAction;

const initialState: State = {
  messageList: [],
};

export const messageListReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case MessageListActionKinds.SET_MESSAGES:
      return {
        messageList: action.payload,
      };
    case MessageListActionKinds.UPSERT_MESSAGES:
      return {
        messageList: upsertMessagesToMessageList(state.messageList, action.payload),
      };
    case MessageListActionKinds.DELETE_MESSAGES:
      return {
        messageList: deleteMessagesFromMessageList(state.messageList, action.payload),
      };
    default:
      return state;
  }
}