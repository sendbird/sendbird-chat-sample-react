import { combineReducers } from 'redux';
import {channelReducer} from './channelReducer';
import {groupChannelListReducer} from './groupChannelListReducer';
import {messageListReducer} from './messageListReducer';

const rootReducer = combineReducers({
  channelReducer,
  groupChannelListReducer,
  messageListReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;