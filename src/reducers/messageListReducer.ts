import {BaseMessageInstance, MessageCollection} from 'sendbird';
import {
  addLoadedNextMessagesToMessageList,
  addLoadedPreviousMessagesToMessageList,
  addMessagesToMessageList, deleteMessagesByMessageIdFromMessageList,
  deleteMessagesFromMessageList, updateMessagesToMessageList,
} from '../utils/messageUtils';
import {resetSampleAction, SampleActionKinds} from './sampleReducer';

export enum MessageListActionKinds {
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGES = 'ADD_MESSAGES',
  UPDATE_MESSAGES = 'UPDATE_MESSAGES',
  DELETE_MESSAGES = 'DELETE_MESSAGES',
  DELETE_MESSAGES_BY_MESSAGE_ID = 'DELETE_MESSAGES_BY_MESSAGE_ID',
  ADD_PREVIOUS_MESSAGES = 'ADD_PREVIOUS_MESSAGES',
  ADD_NEXT_MESSAGES = 'ADD_NEXT_MESSAGES',
}

interface State {
  channelUrl: string | null,
  messageList: BaseMessageInstance[],
  messageCollection: MessageCollection | null,
}

interface setMessagesAction {
  type: MessageListActionKinds.SET_MESSAGES,
  payload: {
    channelUrl: string,
    messages: BaseMessageInstance[],
    messageCollection?: MessageCollection,
  }
}

interface addMessagesAction {
  type: MessageListActionKinds.ADD_MESSAGES,
  payload: BaseMessageInstance[],
}

interface updateMessagesAction {
  type: MessageListActionKinds.UPDATE_MESSAGES,
  payload: BaseMessageInstance[],
}

interface deleteMessagesAction {
  type: MessageListActionKinds.DELETE_MESSAGES,
  payload: BaseMessageInstance[],
}

interface deleteMessagesByMessageIdAction {
  type: MessageListActionKinds.DELETE_MESSAGES_BY_MESSAGE_ID,
  payload: number[],
}

interface addPreviousMessagesAction {
  type: MessageListActionKinds.ADD_PREVIOUS_MESSAGES,
  payload: BaseMessageInstance[],
}

interface addNextMessagesAction {
  type: MessageListActionKinds.ADD_NEXT_MESSAGES,
  payload: BaseMessageInstance[],
}


type Action = resetSampleAction | setMessagesAction | addMessagesAction | updateMessagesAction | deleteMessagesAction
  | deleteMessagesByMessageIdAction | addPreviousMessagesAction | addNextMessagesAction;

const initialState: State = {
  channelUrl: null,
  messageList: [],
  messageCollection: null,
};

export const messageListReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SampleActionKinds.RESET_SAMPLE:
      if (state.messageCollection) state.messageCollection.dispose();
      return initialState;
    case MessageListActionKinds.SET_MESSAGES:
      if (state.messageCollection) state.messageCollection.dispose();
      return {
        channelUrl: action.payload.channelUrl,
        messageList: action.payload.messages,
        messageCollection: action.payload.messageCollection ?? null,
      };
    case MessageListActionKinds.ADD_MESSAGES:
      return {
        ...state,
        messageList: addMessagesToMessageList(state.messageList, action.payload),
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
    case MessageListActionKinds.DELETE_MESSAGES_BY_MESSAGE_ID:
      return {
        ...state,
        messageList: deleteMessagesByMessageIdFromMessageList(state.messageList, action.payload),
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