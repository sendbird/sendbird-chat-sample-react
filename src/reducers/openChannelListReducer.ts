import {OpenChannel} from 'sendbird';
import {
  deleteOpenChannel,
  upsertOpenChannel,
} from '../utils/openChannelListUtils';
import {resetSampleAction} from './sampleReducer';

export enum OpenChannelListActionKinds {
  SET_OPEN_CHANNELS = 'SET_OPEN_CHANNELS',
  UPSERT_OPEN_CHANNEL = 'UPSERT_OPEN_CHANNEL',
  DELETE_OPEN_CHANNEL = 'DELETE_OPEN_CHANNEL',
}

interface State {
  openChannelList: OpenChannel[],
}

interface setChannelsAction {
  type: OpenChannelListActionKinds.SET_OPEN_CHANNELS,
  payload: OpenChannel[],
}

interface upsertChannelAction {
  type: OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL,
  payload: OpenChannel,

}

interface deleteChannelAction {
  type: OpenChannelListActionKinds.DELETE_OPEN_CHANNEL,
  payload: OpenChannel,

}

type Action = resetSampleAction | setChannelsAction | upsertChannelAction | deleteChannelAction;

const initialState: State = {
  openChannelList: [],
};

export const openChannelListReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case OpenChannelListActionKinds.SET_OPEN_CHANNELS:
      return {
        openChannelList: action.payload,
      };
    case OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL:
      return {
        openChannelList: upsertOpenChannel(state.openChannelList, action.payload),
      };
    case OpenChannelListActionKinds.DELETE_OPEN_CHANNEL:
      return {
        openChannelList: deleteOpenChannel(state.openChannelList, action.payload),
      };
    default:
      return state;
  }
}