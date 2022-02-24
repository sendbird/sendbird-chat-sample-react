import SendBird, {
  BaseMessageInstance,
  FileMessage,
  GroupChannel,
  MessageCollection,
  SendBirdInstance,
  UserMessage
} from "sendbird";
import {ChatBodyStyle, chatStyle} from '../styles/styles';
import ChatInputComponent from './ChatInputComponent';
import GroupChatBodyComponent from './GroupChatBodyComponent';
import GroupChatHeaderComponent from './GroupChatHeaderComponent';
import {useEffect, useState} from 'react';
import {MessageListActionKinds} from '../reducers/messageListReducer';
import {useDispatch} from 'react-redux';
import MemberListComponent from './MemberListComponent';

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
    const MESSAGE_FETCH_LIMIT = 74;
    const messageCollection: MessageCollection = groupChannel.createMessageCollection()
      .setFilter(filter)
      .setStartingPoint(Date.now())
      .setLimit(MESSAGE_FETCH_LIMIT)
      .build();
    messageCollection.setMessageCollectionHandler({
      onMessagesAdded: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.ADD_MESSAGES, payload: messages });
      },
      onMessagesUpdated: function (context, channel, messages) {
        if (context.source === sb.CollectionEventSource.EVENT_MESSAGE_SENT) {
          dispatch({
            type: MessageListActionKinds.UPSERT_SENT_MESSAGES,
            payload: messages as (UserMessage | FileMessage)[],
          });
        } else {
          dispatch({ type: MessageListActionKinds.UPDATE_MESSAGES, payload: messages });
        }
      },
      onMessagesDeleted: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.DELETE_MESSAGES, payload: messages });
      },
      onChannelUpdated: function (context, channel) {},
      onChannelDeleted: function (context, channelUrl) {
        messageCollection.dispose();
        // clearView();
      },
      onHugeGapDetected: function () {
        messageCollection.dispose();
        // createMessageCollection(sb, channel);
      },
    });

    messageCollection
      .initialize(sb.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult(function (err, messages) {
        if (!err) {
          dispatch({
            type: MessageListActionKinds.SET_MESSAGES,
            payload: {
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