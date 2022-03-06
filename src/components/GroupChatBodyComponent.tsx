import {useEffect, useRef, useState} from 'react';
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
import {MessageListActionKinds} from '../reducers/messageListReducer';
import {deleteUserMessage} from '../sendbird-actions/message-actions/UserMessageActions';
import {deleteFileMessage} from '../sendbird-actions/message-actions/FileMessageActions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../reducers';

const ChatBodyComponent = (props: ChatBodyProps) => {
  const {
    channel,
    isLoading,
  } = props;

  const messageList: BaseMessageInstance[] = useSelector((state: RootState) => {
    return state.messageListReducer.messageList
  });
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

  return (
    <div
      className={messageListStyle}
      onScroll={onScroll}
      ref={messageListRef}
    >
      {
        isLoading
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
  isLoading: boolean,
};

export default ChatBodyComponent;