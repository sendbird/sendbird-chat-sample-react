import SendBird, {GroupChannel, MessageCollection, SendBirdInstance} from "sendbird";
import {chatStyle} from '../styles/styles';
import ChatInputComponent from './ChatInputComponent';
import GroupChatBodyComponent from './GroupChatBodyComponent';
import GroupChatHeaderComponent from './GroupChatHeaderComponent';
import {useEffect, useState} from 'react';
import {MessageListActionKinds} from '../reducers/messageListReducer';
import {useDispatch} from 'react-redux';

const GroupChatComponent = (props: GroupChatProps) => {
  const {
    groupChannel,
    openInviteUsersDialog,
  } = props;

  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const sb: SendBirdInstance = SendBird.getInstance();
    const filter = new sb.MessageFilter();
    const MESSAGE_FETCH_LIMIT = 10;
    const messageCollection: MessageCollection = groupChannel.createMessageCollection()
      .setFilter(filter)
      .setStartingPoint(Date.now())
      .setLimit(MESSAGE_FETCH_LIMIT)
      .build();
    messageCollection.setMessageCollectionHandler({
      onMessagesAdded: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.UPSERT_MESSAGES, payload: messages });
      },
      onMessagesUpdated: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.UPSERT_MESSAGES, payload: messages });
      },
      onMessagesDeleted: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.DELETE_MESSAGES, payload: messages });
      },
      onChannelUpdated: function (context, channel) {
        // title.innerHTML = `${channel.name}`;
      },
      onChannelDeleted: function (context, channelUrl) {
        messageCollection.dispose();
        // clearView();
      },
      onHugeGapDetected: function () {
        // refresh
        messageCollection.dispose();
        // createMessageCollection(sb, channel);
      },
    });

    messageCollection
      .initialize(sb.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
      .onCacheResult(function (err, messages) {
        console.log('MessageCollection.onCacheResult: ', err, messages);
        if (!err) dispatch({ type: MessageListActionKinds.SET_MESSAGES, payload: messages });
        setLoading(false);
        // goToBottom();
      })
      .onApiResult(function (err, messages) {
        console.log('MessageCollection.onApiResult: ', err, messages);
        if (!err) dispatch({ type: MessageListActionKinds.SET_MESSAGES, payload: messages });
        setLoading(false);
      });
  }, [groupChannel]);

  return (
    <div className={chatStyle}>
      <GroupChatHeaderComponent openInviteUsersDialog={openInviteUsersDialog}/>
      <GroupChatBodyComponent channel={groupChannel} isLoading={isLoading}/>
      <ChatInputComponent channel={groupChannel}/>
    </div>
  );
}

type GroupChatProps = {
  groupChannel: GroupChannel,
  openInviteUsersDialog: () => void,
};

export default GroupChatComponent;