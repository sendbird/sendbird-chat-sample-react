import { combineReducers } from 'redux';
import {channelReducer} from './channelReducer';
import {groupChannelListReducer} from './groupChannelListReducer';
import {messageListReducer} from './messageListReducer';
import {openChannelListReducer} from './openChannelListReducer';
import {sampleReducer} from './sampleReducer';

const rootReducer = combineReducers({
  channelReducer,
  groupChannelListReducer,
  openChannelListReducer,
  messageListReducer,
  sampleReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;