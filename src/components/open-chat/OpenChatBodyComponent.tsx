import {useEffect, useRef, useState} from 'react';
import {
  BaseMessageInstance,
  OpenChannel,
  UserMessage,
} from 'sendbird';
import FileMessageComponent from '../FileMessageComponent';
import UserMessageComponent from '../UserMessageComponent';
import {messageListStyle} from '../../styles/styles';
import {deleteUserMessage} from '../../sendbird-actions/message-actions/UserMessageActions';
import {deleteFileMessage} from '../../sendbird-actions/message-actions/FileMessageActions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {MessageListActionKinds} from '../../reducers/messageListReducer';
import {
  getNextMessagesByTimestamp,
  getPreviousMessagesByTimestamp
} from '../../sendbird-actions/message-actions/MessagesActions';
import {UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT} from '../../constants/constants';

const OpenChatBodyComponent = (props: OpenChatBodyProps) => {
  const {
    channel,
    setMessageToUpdate,
    isLoading,
    finishLoading,
  } = props;

  const messageListReducerState = useSelector((state: RootState) => {
    return state.messageListReducer
  });
  const { messageList, channelUrl } = messageListReducerState;
  const channelHandlerKey = useSelector((state: RootState) => state.sampleReducer.channelHandlerKey);
  const dispatch = useDispatch();
  const messageListEndRef = useRef<null | HTMLDivElement>(null);
  const [wasAtBottom, setWasAtBottom] = useState(false);

  const scrollToBottom = () => {
    if (messageListEndRef.current) {
      const {scrollHeight, clientHeight} = messageListEndRef.current;
      const bottomScrollPosition = scrollHeight - clientHeight;
      messageListEndRef.current.scrollTo(0, bottomScrollPosition);
      if (!wasAtBottom) setWasAtBottom(true);
    }
  }

  useEffect(() => {
    if (channelHandlerKey && channelUrl) {
      scrollToBottom();
      if (isLoading) finishLoading();
    }
  }, [channelHandlerKey, channelUrl]);

  useEffect(() => {
    if (!isLoading && messageListEndRef.current && wasAtBottom) {
      scrollToBottom();
    }
  }, [messageList]);

  const onScroll = async () => {
    if (messageListEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListEndRef.current;
      if (scrollTop === 0) { // Reached top.
        const oldestMessageTimestamp: number = messageList.length > 0 ? messageList[0].createdAt : Date.now();
        const loadedPreviousMessages: BaseMessageInstance[] = await getPreviousMessagesByTimestamp(
          channel,
          oldestMessageTimestamp,
          UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT,
        );
        dispatch({ type: MessageListActionKinds.ADD_PREVIOUS_MESSAGES, payload: loadedPreviousMessages });
      } else if (scrollTop === scrollHeight - clientHeight) { // Reached bottom.
        setWasAtBottom(true);
        const newestMessageTimestamp: number = messageList.length > 0
          ? messageList[messageList.length - 1].createdAt
          : Date.now();
        const loadedPreviousMessages: BaseMessageInstance[] = await getNextMessagesByTimestamp(
          channel,
          newestMessageTimestamp,
          UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT,
        );
        dispatch({ type: MessageListActionKinds.ADD_NEXT_MESSAGES, payload: loadedPreviousMessages });
      } else {
        setWasAtBottom(false);
      }
    }
  };

  const deleteMessage = async (message: BaseMessageInstance) => {
    try {
      if (message.isFileMessage()) {
        await deleteFileMessage(channel, message);
        dispatch({ type: MessageListActionKinds.DELETE_MESSAGES, payload: [message] });
      } else if (message.isUserMessage()) {
        await deleteUserMessage(channel, message);
        dispatch({ type: MessageListActionKinds.DELETE_MESSAGES, payload: [message] });
      }
    } catch (e) {
      alert('deleteMessage error: ' + e);
    }
  }

  return (
    <div
      className={messageListStyle}
      onScroll={onScroll}
      ref={messageListEndRef}
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
              setMessageToUpdate={setMessageToUpdate}
              key={i}
            />
        })
      }
    </div>
  );
}

type OpenChatBodyProps = {
  channel: OpenChannel,
  setMessageToUpdate: (message: BaseMessageInstance) => void,
  isLoading: boolean,
  finishLoading: () => void,
};

export default OpenChatBodyComponent;