import {GroupChannel} from 'sendbird';
import {deleteGroupChannels, upsertGroupChannels} from '../utils/groupChannelListUtils';
import {resetSampleAction} from './sampleReducer';

export enum GroupChannelListActionKinds {
  SET_GROUP_CHANNELS = 'SET_GROUP_CHANNELS',
  UPSERT_GROUP_CHANNELS = 'UPSERT_GROUP_CHANNELS',
  DELETE_GROUP_CHANNELS = 'DELETE_GROUP_CHANNELS',
}

interface State {
  groupChannelList: GroupChannel[],
  order: string,
}

interface setChannelsAction {
  type: GroupChannelListActionKinds.SET_GROUP_CHANNELS,
  payload: {
    groupChannelList: GroupChannel[],
    order: string,
  }
}

interface upsertChannelsAction {
  type: GroupChannelListActionKinds.UPSERT_GROUP_CHANNELS,
  payload: GroupChannel[],
}

interface deleteChannelsAction {
  type: GroupChannelListActionKinds.DELETE_GROUP_CHANNELS,
  payload: string[],
}

type Action = resetSampleAction | setChannelsAction | upsertChannelsAction | deleteChannelsAction;

const initialState: State = {
  groupChannelList: [],
  order: 'latest_last_message',
};

export const groupChannelListReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case GroupChannelListActionKinds.SET_GROUP_CHANNELS:
      return {
        ...state,
        groupChannelList: action.payload.groupChannelList,
        order: action.payload.order,
      };
    case GroupChannelListActionKinds.UPSERT_GROUP_CHANNELS:
      return {
        ...state,
        groupChannelList: upsertGroupChannels(state.groupChannelList, action.payload, state.order),
      };
    case GroupChannelListActionKinds.DELETE_GROUP_CHANNELS:
      return {
        ...state,
        groupChannelList: deleteGroupChannels(state.groupChannelList, action.payload),
      };
    default:
      return state;
  }
}