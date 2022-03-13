import SendBird, {
  BaseMessageInstance,
  GroupChannel,
  MessageCollection,
  SendBirdInstance,
} from "sendbird";
import {ChatBodyStyle, chatStyle} from '../../styles/styles';
import ChatInputComponent from '../ChatInputComponent';
import GroupChatBodyComponent from './GroupChatBodyComponent';
import GroupChatHeaderComponent from './GroupChatHeaderComponent';
import {useEffect, useState} from 'react';
import {MessageListActionKinds} from '../../reducers/messageListReducer';
import {useDispatch} from 'react-redux';
import MemberListComponent from '../MemberListComponent';
import {BIDIRECTIONAL_MESSAGE_FETCH_LIMIT} from '../../constants/constants';

const GroupChatComponent = (props: GroupChatProps) => {
  const {
    groupChannel,
    openInviteUsersDialog,
    isLoading,
    finishLoading,
  } = props;

  const [messageToUpdate, setMessageToUpdate] = useState<BaseMessageInstance | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const sb: SendBirdInstance = SendBird.getInstance();
    const filter = new sb.MessageFilter();
    const messageCollection: MessageCollection = groupChannel.createMessageCollection()
      .setFilter(filter)
      .setStartingPoint(Date.now())
      .setLimit(BIDIRECTIONAL_MESSAGE_FETCH_LIMIT)
      .build();
    messageCollection.setMessageCollectionHandler({
      onMessagesAdded: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.ADD_MESSAGES, payload: messages });
      },
      onMessagesUpdated: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.UPDATE_MESSAGES, payload: messages });
      },
      onMessagesDeleted: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.DELETE_MESSAGES, payload: messages });
      },
      onChannelUpdated: function (context, channel) {},
      onChannelDeleted: function (context, channelUrl) {
        // messageCollection.dispose();
      },
      onHugeGapDetected: function () {
        // messageCollection.dispose();
      },
    });

    messageCollection
      .initialize(sb.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult(function (err, messages) {
        if (!err) {
          dispatch({
            type: MessageListActionKinds.SET_MESSAGES,
            payload: {
              channelUrl: groupChannel.url,
              messages,
              messageCollection
            }
          });
        }
      })
      .onApiResult(function (err, messages) {
        if (!err) {
          dispatch({
            type: MessageListActionKinds.SET_MESSAGES,
            payload: {
              channelUrl: groupChannel.url,
              messages,
              messageCollection
            }
          });
        }
      });
  }, [groupChannel]);

  const unsetMessageToUpdate = () => {
    setMessageToUpdate(null);
  }

  return (
    <div className={chatStyle}>
      <GroupChatHeaderComponent openInviteUsersDialog={openInviteUsersDialog}/>
      <div className={ChatBodyStyle}>
        <div style={{ width: '100%', height: '100%' }}>
          <GroupChatBodyComponent
            channel={groupChannel}
            setMessageToUpdate={setMessageToUpdate}
            isLoading={isLoading}
            finishLoading={finishLoading}
          />
          <ChatInputComponent
            channel={groupChannel}
            messageToUpdate={messageToUpdate}
            unsetMessageToUpdate={unsetMessageToUpdate}
            isLoading={isLoading}
          />
        </div>
        <MemberListComponent groupChannel={groupChannel} />
      </div>
    </div>
  );
}

type GroupChatProps = {
  groupChannel: GroupChannel,
  openInviteUsersDialog: () => void,
  isLoading: boolean,
  finishLoading: () => void,
};

export default GroupChatComponent;