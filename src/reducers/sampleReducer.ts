import SendBird, {GroupChannelCollection, SendBirdInstance} from 'sendbird';

export enum SampleActionKinds {
  RESET_SAMPLE = 'SET_SAMPLE',
}

interface State {
  channelHandlerKey: string | null,
  groupChannelCollection: GroupChannelCollection | null,
  channelFetchOrder: string | null,
}

export interface resetSampleAction {
  type: SampleActionKinds.RESET_SAMPLE,
  payload: {
    channelHandlerKey?: string,
    groupChannelCollection?: GroupChannelCollection,
    channelFetchOrder?: string,
  }
}
type Action = resetSampleAction;

const initialState: State = {
  channelHandlerKey: null,
  groupChannelCollection: null,
  channelFetchOrder: null,
};

export const sampleReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SampleActionKinds.RESET_SAMPLE:
      if (state.channelHandlerKey) {
        const sb: SendBirdInstance = SendBird.getInstance();
        sb.removeChannelHandler(state.channelHandlerKey);
      }
      if (state.groupChannelCollection) {
        state.groupChannelCollection.dispose();
      }
      return {
        channelHandlerKey: action.payload.channelHandlerKey ?? null,
        groupChannelCollection: action.payload.groupChannelCollection ?? null,
        channelFetchOrder: action.payload.channelFetchOrder ?? null,
      };
    default:
      return state;
  }
}