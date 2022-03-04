import {useEffect, useReducer, useRef, useState} from 'react';
import SendBird, {
  BaseMessageInstance, FileMessage,
  GroupChannel,
  MessageCollection,
  SendBirdInstance,
  UserMessage,
} from 'sendbird';
import FileMessageComponent from './FileMessageComponent';
import UserMessageComponent from './UserMessageComponent';
import {messageListStyle} from '../styles/styles';
import {MessageListActionKinds, messageListReducer} from '../reducers/messageListReducer';
import {deleteUserMessage} from '../sendbird-actions/message-actions/UserMessageActions';
import {deleteFileMessage} from '../sendbird-actions/message-actions/FileMessageActions';

const ChatBodyComponent = (props: ChatBodyProps) => {
  const {
    channel,
  } = props;

  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(messageListReducer, { messageList: [] });
  const { messageList } = state;
  const messageListRef = useRef(null);

  const onScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      if (scrollTop === 0) { // Reached top.
        // loadMore();
      }
      // else if (scrollTop + clientHeight === scrollHeight) { // Reached bottom.
      //   console.log('reached bottom');
      // }
    }
  };

  useEffect(() => {
    const sb: SendBirdInstance = SendBird.getInstance();
    const filter = new sb.MessageFilter();
    const MESSAGE_FETCH_LIMIT = 10;
    const messageCollection: MessageCollection = channel.createMessageCollection()
      .setFilter(filter)
      .setStartingPoint(Date.now())
      .setLimit(MESSAGE_FETCH_LIMIT)
      .build();
    messageCollection.setMessageCollectionHandler({
      onMessagesAdded: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.upsertMessages, messageList: messages });
      },
      onMessagesUpdated: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.upsertMessages, messageList: messages });
      },
      onMessagesDeleted: function (context, channel, messages) {
        dispatch({ type: MessageListActionKinds.deleteMessages, messageList: messages });
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
        if (!err) dispatch({ type: MessageListActionKinds.setMessages, messageList: messages });
        setLoading(false);
        // goToBottom();
      })
      .onApiResult(function (err, messages) {
        console.log('MessageCollection.onApiResult: ', err, messages);
        if (!err) dispatch({ type: MessageListActionKinds.setMessages, messageList: messages });
        setLoading(false);
      });
  }, [channel]);

  return (
    <div
      className={messageListStyle}
      onScroll={onScroll}
      ref={messageListRef}
    >
      {
        loading
          ? null
          : messageList.map((message: BaseMessageInstance, i: number) => {
            return message.isFileMessage()
              ? <FileMessageComponent
                channel={channel}
                message={message}
                deleteMessage={(message: FileMessage) => deleteFileMessage(channel, message)}
                key={i}
              />
              : <UserMessageComponent
                channel={channel}
                message={message as UserMessage}
                deleteMessage={(message: UserMessage) => deleteUserMessage(channel, message)}
                key={i}
              />
          })
      }
    </div>
  );
}

type ChatBodyProps = {
  channel: GroupChannel,
};

export default ChatBodyComponent;