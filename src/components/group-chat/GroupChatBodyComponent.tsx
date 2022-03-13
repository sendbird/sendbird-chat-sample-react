import {useEffect, useRef, useState} from 'react';
import {
  BaseMessageInstance,
  GroupChannel,
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

const GroupChatBodyComponent = (props: GroupChatBodyProps) => {
  const {
    channel,
    setMessageToUpdate,
    isLoading,
    finishLoading,
  } = props;

  const messageListReducerState = useSelector((state: RootState) => {
    return state.messageListReducer
  });
  const { messageList, messageCollection, channelUrl } = messageListReducerState;
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
    if (messageCollection && channelUrl) {
      scrollToBottom();
      if (isLoading) finishLoading();
    }
  }, [messageCollection, channelUrl]);

  useEffect(() => {
    if (!isLoading && messageListEndRef.current && wasAtBottom) {
      scrollToBottom();
    }
  }, [messageList]);

  const onScroll = async () => {
    if (messageCollection && messageListEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListEndRef.current;
      if (scrollTop === 0) { // Reached top.
        const loadedPreviousMessages: BaseMessageInstance[] = await messageCollection?.loadPrevious();
        dispatch({ type: MessageListActionKinds.ADD_PREVIOUS_MESSAGES, payload: loadedPreviousMessages });
      } else if (scrollTop === scrollHeight - clientHeight) { // Reached bottom.
        setWasAtBottom(true);
        if (messageCollection.hasNext) {
          const loadedPreviousMessages: BaseMessageInstance[] = await messageCollection?.loadNext();
          dispatch({ type: MessageListActionKinds.ADD_NEXT_MESSAGES, payload: loadedPreviousMessages });
        }
      } else {
        setWasAtBottom(false);
      }
    }
  };

  const deleteMessage = async (message: BaseMessageInstance) => {
    try {
      if (message.isFileMessage()) {
        await deleteFileMessage(channel, message);
      } else if (message.isUserMessage()) {
        await deleteUserMessage(channel, message);
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

type GroupChatBodyProps = {
  channel: GroupChannel,
  setMessageToUpdate: (message: BaseMessageInstance) => void,
  isLoading: boolean,
  finishLoading: () => void,
};

export default GroupChatBodyComponent;