import {BaseChannel} from 'sendbird';
import {isCurrentChannelDeleted, updateCurrentChannel} from '../utils/channelUtils';
import {resetSampleAction, SampleActionKinds} from './sampleReducer';

export enum ChannelActionKinds {
  SET_CHANNEL = 'SET_CHANNEL',
  UPDATE_CHANNEL = 'UPDATE_CHANNEL',
  DELETE_CHANNEL = 'DELETE_CHANNEL',
  LEAVE_CHANNEL = 'LEAVE_CHANNEL',
}

interface State {
  channel: BaseChannel | null,
}

interface setChannelAction {
  type: ChannelActionKinds.SET_CHANNEL,
  payload: BaseChannel | null,
}

interface updateChannelAction {
  type: ChannelActionKinds.UPDATE_CHANNEL,
  payload: BaseChannel[],
}

interface deleteChannelAction {
  type: ChannelActionKinds.DELETE_CHANNEL,
  payload: string[],
}

interface leaveChannelAction {
  type: ChannelActionKinds.LEAVE_CHANNEL,
}

type Action = resetSampleAction | setChannelAction | updateChannelAction | deleteChannelAction | leaveChannelAction;

const initialState: State = {
  channel: null,
};

export const channelReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SampleActionKinds.RESET_SAMPLE:
      return initialState;
    case ChannelActionKinds.SET_CHANNEL:
      return {
        channel: action.payload,
      };
    case ChannelActionKinds.UPDATE_CHANNEL:
      if (state.channel) {
        const updatedChannel: BaseChannel | null = updateCurrentChannel(action.payload, state.channel);
        if (updatedChannel) {
          return {
            channel: updatedChannel,
          };
        }
      }
      return state;
    case ChannelActionKinds.DELETE_CHANNEL:
      if (state.channel && isCurrentChannelDeleted(action.payload, state.channel)) {
        return initialState;
      }
      return state;
    case ChannelActionKinds.LEAVE_CHANNEL:
      return initialState;
    default:
      return state;
  }
}