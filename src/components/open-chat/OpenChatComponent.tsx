import {
  BaseMessageInstance,
  OpenChannel,
} from "sendbird";
import {ChatBodyStyle, chatStyle} from '../../styles/styles';
import ChatInputComponent from '../ChatInputComponent';
import OpenChatBodyComponent from './OpenChatBodyComponent';
import OpenChatHeaderComponent from './OpenChatHeaderComponent';
import {useEffect, useState} from 'react';
import {getPreviousMessagesByTimestamp} from '../../sendbird-actions/message-actions/MessagesActions';
import {UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT} from '../../constants/constants';
import {MessageListActionKinds} from '../../reducers/messageListReducer';
import {useDispatch} from 'react-redux';

const OpenChatComponent = (props: OpenChatProps) => {
  const {
    openChannel,
    openUpdateChannelNameDialog,
    isLoading,
    finishLoading,
  } = props;

  const [messageToUpdate, setMessageToUpdate] = useState<BaseMessageInstance | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getInitialMessages()
      .then((messages: BaseMessageInstance[]) => {
        dispatch({
          type: MessageListActionKinds.SET_MESSAGES,
          payload: {
            channelUrl: openChannel.url,
            messages,
          }
        });
      })
      .catch((error) => alert('OpenChat getInitialMessages error: ' + error));
  }, [openChannel]);

  const getInitialMessages = async (): Promise<BaseMessageInstance[]> => {
    const loadedPreviousMessages: BaseMessageInstance[] = await getPreviousMessagesByTimestamp(
      openChannel,
      Date.now(),
      UNIDIRECTIONAL_MESSAGE_FETCH_LIMIT,
    );
    return loadedPreviousMessages;
  }

  const unsetMessageToUpdate = () => {
    setMessageToUpdate(null);
  }

  return (
    <div className={chatStyle}>
      <OpenChatHeaderComponent openUpdateChannelNameDialog={openUpdateChannelNameDialog}/>
      <div className={ChatBodyStyle}>
        <div style={{ width: '100%', height: '100%' }}>
          <OpenChatBodyComponent
            channel={openChannel}
            setMessageToUpdate={setMessageToUpdate}
            isLoading={isLoading}
            finishLoading={finishLoading}
          />
          <ChatInputComponent
            channel={openChannel}
            messageToUpdate={messageToUpdate}
            unsetMessageToUpdate={unsetMessageToUpdate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

type OpenChatProps = {
  openChannel: OpenChannel,
  openUpdateChannelNameDialog: () => void,
  isLoading: boolean,
  finishLoading: () => void,
};

export default OpenChatComponent;