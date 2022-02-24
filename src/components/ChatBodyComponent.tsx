import {useEffect, useRef, useState} from 'react';
import {
  BaseChannel,
  BaseMessageInstance,
  SendBirdError,
  UserMessage,
} from 'sendbird';
import { getMessagesByTimestamp } from '../sendbird-actions/message-actions/MessagesActions';
import FileMessageComponent from './FileMessageComponent';
import UserMessageComponent from './UserMessageComponent';
import {messageListStyle} from '../styles/styles';

const ChatBodyComponent = (props: ChatBodyProps) => {
  const {
    channel,
  } = props;

  const [loading, setLoading] = useState(true);
  const [messageList, setMessageList] = useState<BaseMessageInstance[]>([]);

  const messageListRef = useRef(null);

  const onScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      if (scrollTop === 0) { // Reached top.
        loadMore();
      }
      // else if (scrollTop + clientHeight === scrollHeight) { // Reached bottom.
      //   console.log('reached bottom');
      // }
    }
  };

  useEffect(() => {
    getMessagesByTimestamp(channel)
      .then((messages: BaseMessageInstance[]) => setMessageList(messages))
      .catch((error: SendBirdError) => alert('OpenChat getMessagesByTimestamp error: ' + error))
      .finally(() => setLoading(false));
  }, []);
  
  const deleteMessage = (message: BaseMessageInstance) => {
    let index = -1;
    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].messageId === message.messageId) index = i;
    }
    if (index >= 0) setMessageList(messageList.splice(index, 1));
  }

  const loadMore = () => {
    setLoading(true);
    getMessagesByTimestamp(channel, messageList[0].createdAt)
      .then((messages: BaseMessageInstance[]) => setMessageList(messages.concat(messageList)))
      .catch((error: SendBirdError) => alert('OpenChat getMessagesByTimestamp error: ' + error))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <div
        className={messageListStyle}
        onScroll={onScroll}
        ref={messageListRef}
      >
        {
          messageList.map((message: BaseMessageInstance, i: number) => {
            return message.isFileMessage()
              ? <FileMessageComponent
                channel={channel}
                message={message}
                deleteMessage={deleteMessage}
                key={i}
              />
              : <UserMessageComponent
                channel={channel}
                message={message as UserMessage}
                deleteMessage={deleteMessage}
                key={i}
              />
          })
        }
      </div>
    </div>
  );
}

type ChatBodyProps = {
  channel: BaseChannel,
};

export default ChatBodyComponent;