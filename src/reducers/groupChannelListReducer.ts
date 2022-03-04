import {GroupChannel, GroupChannelCollection} from 'sendbird';
import {deleteGroupChannels, upsertGroupChannels} from '../utils/groupChannelListUtils';

interface State {
  groupChannelList: GroupChannel[],
  groupChannelCollection: GroupChannelCollection | null,
  order: string,
}

interface Action {
  type: string,
  groupChannelList?: GroupChannel[],
  groupChannelUrls?: string[],
  groupChannelCollection?: GroupChannelCollection,
}

export enum GroupChannelListActionKinds {
  setChannels = 'SET_CHANNELS',
  upsertChannels = 'UPSERT_CHANNELS',
  deleteChannels = 'DELETE_CHANNELS',
}

export const groupChannelListReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case GroupChannelListActionKinds.setChannels:
      if (action.groupChannelList && action.groupChannelCollection) {
        return {
          ...state,
          groupChannelList: action.groupChannelList,
          groupChannelCollection: action.groupChannelCollection,
        };
      }
      return state;
    case GroupChannelListActionKinds.upsertChannels:
      if (action.groupChannelList) {
        return {
          ...state,
          groupChannelList: upsertGroupChannels(state.groupChannelList, action.groupChannelList, state.order),
        };
      }
      return state;
    case GroupChannelListActionKinds.deleteChannels:
      if (action.groupChannelUrls) {
        return {
          ...state,
          groupChannelList: deleteGroupChannels(state.groupChannelList, action.groupChannelUrls),
        };
      }
      return state;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}