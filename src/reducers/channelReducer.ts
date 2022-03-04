import {BaseChannel} from 'sendbird';
import {isCurrentChannelDeleted, updateCurrentChannel} from '../utils/channelUtils';

interface State {
  channel: BaseChannel | null,
}

interface Action {
  type: string,
  channel?: BaseChannel,
  updatedChannels?: BaseChannel[],
  deletedChannelUrls?: string[],
}

export enum ChannelActionKinds {
  setChannel = 'SET_CHANNEL',
  updateChannel = 'UPDATE_CHANNEL',
  deleteChannel = 'DELETE_CHANNEL',
}

export const channelReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ChannelActionKinds.setChannel:
      if (action.channel) {
        return {channel: action.channel};
      }
      return state;
    case ChannelActionKinds.updateChannel:
      if (state.channel && action.updatedChannels) {
        const updatedChannel: BaseChannel | null = updateCurrentChannel(action.updatedChannels, state.channel);
        if (updatedChannel) {
          return {channel: updatedChannel};
        }
      }
      return state;
    case ChannelActionKinds.deleteChannel:
      if (
        state.channel
        && action.deletedChannelUrls
        && isCurrentChannelDeleted(action.deletedChannelUrls, state.channel)
      ) {
        return {channel: null};
      }
      return state;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}