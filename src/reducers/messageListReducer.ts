import {BaseMessageInstance, FileMessage, MessageCollection, UserMessage} from 'sendbird';
import {
  addLoadedNextMessagesToMessageList,
  addLoadedPreviousMessagesToMessageList,
  addMessagesToMessageList,
  deleteMessagesFromMessageList, updateMessagesToMessageList,
  upsertSentMessagesToMessageList
} from '../utils/messageUtils';

export enum MessageListActionKinds {
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGES = 'ADD_MESSAGES',
  UPSERT_SENT_MESSAGES = 'UPSERT_SENT_MESSAGES',
  UPDATE_MESSAGES = 'UPDATE_MESSAGES',
  DELETE_MESSAGES = 'DELETE_MESSAGES',
  ADD_PREVIOUS_MESSAGES = 'ADD_PREVIOUS_MESSAGES',
  ADD_NEXT_MESSAGES = 'ADD_NEXT_MESSAGES',
}

interface State {
  messageList: BaseMessageInstance[],
  messageCollection: MessageCollection | null,
  isInitialized: boolean,
}

interface setMessagesAction {
  type: MessageListActionKinds.SET_MESSAGES,
  payload: {
    messages: BaseMessageInstance[],
    messageCollection: MessageCollection,
  }
}

interface addMessagesAction {
  type: MessageListActionKinds.ADD_MESSAGES,
  payload: BaseMessageInstance[],
}

interface upsertSentMessagesAction {
  type: MessageListActionKinds.UPSERT_SENT_MESSAGES,
  payload: (UserMessage | FileMessage)[],
}

interface updateMessagesAction {
  type: MessageListActionKinds.UPDATE_MESSAGES,
  payload: BaseMessageInstance[],
}

interface deleteMessagesAction {
  type: MessageListActionKinds.DELETE_MESSAGES,
  payload: BaseMessageInstance[],
}

interface addPreviousMessagesAction {
  type: MessageListActionKinds.ADD_PREVIOUS_MESSAGES,
  payload: BaseMessageInstance[],
}

interface addNextMessagesAction {
  type: MessageListActionKinds.ADD_NEXT_MESSAGES,
  payload: BaseMessageInstance[],
}


type Action = setMessagesAction | addMessagesAction | upsertSentMessagesAction | updateMessagesAction
  | deleteMessagesAction | addPreviousMessagesAction | addNextMessagesAction;

const initialState: State = {
  messageList: [],
  messageCollection: null,
  isInitialized: false,
};

export const messageListReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case MessageListActionKinds.SET_MESSAGES:
      if (state.messageCollection) state.messageCollection.dispose();
      return {
        messageList: action.payload.messages,
        messageCollection: action.payload.messageCollection,
        isInitialized: true,
      };
    case MessageListActionKinds.ADD_MESSAGES:
      return {
        ...state,
        messageList: addMessagesToMessageList(state.messageList, action.payload),
      };
    case MessageListActionKinds.UPSERT_SENT_MESSAGES:
      return {
        ...state,
        messageList: upsertSentMessagesToMessageList(state.messageList, action.payload),
      };
    case MessageListActionKinds.UPDATE_MESSAGES:
      return {
        ...state,
        messageList: updateMessagesToMessageList(state.messageList, action.payload),
      };
    case MessageListActionKinds.DELETE_MESSAGES:
      return {
        ...state,
        messageList: deleteMessagesFromMessageList(state.messageList, action.payload),
      };
    case MessageListActionKinds.ADD_PREVIOUS_MESSAGES:
      return {
        ...state,
        messageList: addLoadedPreviousMessagesToMessageList(state.messageList, action.payload),
      };
    case MessageListActionKinds.ADD_NEXT_MESSAGES:
      return {
        ...state,
        messageList: addLoadedNextMessagesToMessageList(state.messageList, action.payload),
      };
    default:
      return state;
  }
}