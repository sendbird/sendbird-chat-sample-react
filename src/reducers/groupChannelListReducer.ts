import {GroupChannel, GroupChannelCollection} from 'sendbird';
import {deleteGroupChannels, upsertGroupChannels} from '../utils/groupChannelListUtils';

export enum GroupChannelListActionKinds {
  SET_CHANNELS = 'SET_CHANNELS',
  UPSERT_CHANNELS = 'UPSERT_CHANNELS',
  DELETE_CHANNELS = 'DELETE_CHANNELS',
}

interface State {
  groupChannelList: GroupChannel[],
  groupChannelCollection: GroupChannelCollection | null,
  order: string,
}

interface setChannelsAction {
  type: GroupChannelListActionKinds.SET_CHANNELS,
  payload: {
    groupChannelList: GroupChannel[],
    groupChannelCollection: GroupChannelCollection,
  }
}

interface upsertChannelsAction {
  type: GroupChannelListActionKinds.UPSERT_CHANNELS,
  payload: GroupChannel[],
}

interface deleteChannelsAction {
  type: GroupChannelListActionKinds.DELETE_CHANNELS,
  payload: string[],
}

type Action = setChannelsAction | upsertChannelsAction | deleteChannelsAction;

const initialState: State = {
  groupChannelList: [],
  groupChannelCollection: null,
  order: 'latest_last_message',
};

export const groupChannelListReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case GroupChannelListActionKinds.SET_CHANNELS:
      return {
        ...state,
        groupChannelList: action.payload.groupChannelList,
        groupChannelCollection: action.payload.groupChannelCollection,
      };
    case GroupChannelListActionKinds.UPSERT_CHANNELS:
      return {
        ...state,
        groupChannelList: upsertGroupChannels(state.groupChannelList, action.payload, state.order),
      };
    case GroupChannelListActionKinds.DELETE_CHANNELS:
      return {
        ...state,
        groupChannelList: deleteGroupChannels(state.groupChannelList, action.payload),
      };
    default:
      return state;
  }
}