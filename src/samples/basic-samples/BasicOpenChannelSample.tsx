import SendBird, {
  AdminMessage,
  ChannelHandler,
  FileMessage,
  OpenChannel,
  SendBirdInstance,
  User,
  UserMessage,
} from 'sendbird';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {samplePageStyle} from '../../styles/styles';
import {ChannelActionKinds} from '../../reducers/channelReducer';
import {RootState} from '../../reducers';
import {MessageListActionKinds} from '../../reducers/messageListReducer';
import CreateOpenChannelDialogComponent from '../../components/open-chat/CreateOpenChannelDialogComponent';
import {DialogState} from '../../constants/enums';
import {
  createOpenChannel, enterOpenChannel,
  updateOpenChannelName
} from '../../sendbird-actions/channel-actions/OpenChannelActions';
import OpenChannelListComponent from '../../components/open-chat/OpenChannelListComponent';
import OpenChatComponent from '../../components/open-chat/OpenChatComponent';
import {OpenChannelListActionKinds} from '../../reducers/openChannelListReducer';
import {SampleActionKinds} from '../../reducers/sampleReducer';
import {v4 as uuid} from 'uuid';
import OpenChannelListDialogComponent from '../../components/open-chat/OpenChannelListDialogComponent';

const BasicOpenChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [dialogState, setDialogState] = useState<DialogState>(DialogState.CLOSED);
  const channelReducerState = useSelector((state: RootState) => state.channelReducer);
  const [isLoading, setIsLoading] = useState(true);
  const sampleReducerState = useSelector((state: RootState) => state.sampleReducer);
  const [isSampleReset, setIsSampleReset] = useState(false);

  const dispatch = useDispatch();

  const openCreateChannelDialog = () => {
    setDialogState(DialogState.CREATE);
  }

  useEffect(() => {
    const sb: SendBirdInstance = SendBird.getInstance();
    const channelHandlerKey = uuid();

    // Clear old channel handler or group channel collection if exists.
    dispatch({
      type: SampleActionKinds.RESET_SAMPLE,
      payload: {channelHandlerKey},
    });

    // Create new channel handler.
    const openChannelHandler: ChannelHandler = new sb.ChannelHandler();

    // Channel list actions.
    openChannelHandler.onChannelChanged = (channel: OpenChannel) => {
      dispatch({
        type: OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL,
        payload: channel,
      });
      updateCurrentChannel(channel);
    };
    openChannelHandler.onUserEntered = (channel: OpenChannel, user: User) => {
      dispatch({
        type: OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL,
        payload: channel,
      });
      updateCurrentChannel(channel);
    };
    openChannelHandler.onUserExited = (channel: OpenChannel, user: User) => {
      dispatch({
        type: OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL,
        payload: channel,
      });
      updateCurrentChannel(channel);
    };

    // Channel message list actions.
    openChannelHandler.onMessageReceived = (
      channel: OpenChannel,
      message: AdminMessage | UserMessage | FileMessage,
    ) => {
      if (shouldUpdateCurrentChannel(channel)) {
        dispatch({ type: MessageListActionKinds.ADD_MESSAGES, payload: [message] });
      }
    };
    openChannelHandler.onMessageUpdated = () => (
      channel: OpenChannel,
      message: AdminMessage | UserMessage | FileMessage,
    ) => {
      if (shouldUpdateCurrentChannel(channel)) {
        dispatch({type: MessageListActionKinds.UPDATE_MESSAGES, payload: [message]});
      }
    };
    openChannelHandler.onMessageDeleted = () => (
      channel: OpenChannel,
      messageId: number,
    ) => {
      if (shouldUpdateCurrentChannel(channel)) {
        dispatch({type: MessageListActionKinds.DELETE_MESSAGES_BY_MESSAGE_ID, payload: [messageId]});
      }
    };
    sb.addChannelHandler(channelHandlerKey, openChannelHandler);
  }, []);

  useEffect(() => {
    if (sampleReducerState.channelHandlerKey) {
      setIsSampleReset(true);
    }
  }, [sampleReducerState.channelHandlerKey]);

  const setCurrentChannel = (channel: OpenChannel | null): void => {
    const currentChannel = channelReducerState.channel;
    if (currentChannel && currentChannel.url && channel && currentChannel.url === channel.url) return;
    setIsLoading(true);
    dispatch({
      type: ChannelActionKinds.SET_CHANNEL,
      payload: channel,
    });
    dispatch({
      type: MessageListActionKinds.SET_MESSAGES,
      payload: {
        channelUrl: channel ? channel.url : null,
        messages: [],
        messageCollection: null,
      }
    });
  }

  const deleteCurrentChannel = (deletedChannelUrl: string): void => {
    dispatch({
      type: ChannelActionKinds.DELETE_CHANNEL,
      payload: [deletedChannelUrl],
    });
    dispatch({
      type: MessageListActionKinds.SET_MESSAGES,
      payload: {
        channelUrl: null,
        messages: [],
      }
    });
  }

  const updateCurrentChannel = (updatedChannel: OpenChannel): void => {
    if (channelReducerState.channel && updatedChannel.url === channelReducerState.channel.url) {
      dispatch({
        type: ChannelActionKinds.UPDATE_CHANNEL,
        payload: [updatedChannel],
      });
    }
  }

  const shouldUpdateCurrentChannel = (updatedChannel: OpenChannel): boolean => {
    return channelReducerState.channel ? updatedChannel.url === channelReducerState.channel.url : false;
  }

  const openUpdateChannelNameDialog = () => {
    setDialogState(DialogState.UPDATE_CHANNEL_NAME);
  }

  const createChannel = async (channelName: string) => {
    try {
      const openChannel: OpenChannel = await createOpenChannel(channelName);
      await enterOpenChannel(openChannel);
      dispatch({
        type: OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL,
        payload: openChannel,
      });
      setCurrentChannel(openChannel);
    } catch (e) {
      alert('Create open channel error: ' + e);
    } finally {
      setDialogState(DialogState.CLOSED);
    }
  }

  const enterSelectedOpenChannel = async (openChannel: OpenChannel) => {
    try {
      await enterOpenChannel(openChannel);
      dispatch({
        type: OpenChannelListActionKinds.UPSERT_OPEN_CHANNEL,
        payload: openChannel,
      });
      setCurrentChannel(openChannel);
    } catch (e) {
      alert('Enter open channel error: ' + e);
    }
  }

  const updateChannelName = async (channel: OpenChannel, channelName: string) => {
    try {
      const openChannel: OpenChannel = await updateOpenChannelName(channel, channelName);
      dispatch({
        type: ChannelActionKinds.SET_CHANNEL,
        payload: openChannel,
      });
    } catch (e) {
      alert('Create open channel error: ' + e);
    } finally {
      setDialogState(DialogState.CLOSED);
    }
  }

  const closeDialog = () => {
    setDialogState(DialogState.CLOSED);
  }

  const finishLoading = () => {
    setIsLoading(false);
  }

  const openOpenChannelListDialog = () => {
    setDialogState(DialogState.OPEN_CHANNEL_LIST);
  }

  const getDialogComponent = () => {
    switch (dialogState) {
      case DialogState.CREATE:
      case DialogState.UPDATE_CHANNEL_NAME:
        return (
          <CreateOpenChannelDialogComponent
            dialogState={dialogState}
            currentChannel={channelReducerState.channel as OpenChannel}
            createChannel={createChannel}
            closeDialog={closeDialog}
            updateChannelName={updateChannelName}
          />
        )
      case DialogState.OPEN_CHANNEL_LIST:
        return (
          <OpenChannelListDialogComponent
            dialogState={dialogState}
            closeDialog={closeDialog}
            enterOpenChannel={enterSelectedOpenChannel}
          />
        )
      default:
        return null;
    }
    closeDialog();
  }

  return (
    isSampleReset
      ? <div className={samplePageStyle}>
        {getDialogComponent()}
        <OpenChannelListComponent
          openCreateChannelDialog={openCreateChannelDialog}
          openOpenChannelListDialog={openOpenChannelListDialog}
          setCurrentChannel={setCurrentChannel}
          currentChannel={channelReducerState.channel as OpenChannel}
          deleteCurrentChannel={deleteCurrentChannel}
        />
        {
          channelReducerState.channel
            ? <OpenChatComponent
              openChannel={channelReducerState.channel as OpenChannel}
              openUpdateChannelNameDialog={openUpdateChannelNameDialog}
              isLoading={isLoading}
              finishLoading={finishLoading}
            />
            : null
        }
      </div>
      : null
  );
};

type BasicGroupChannelSampleProps = {};

export default BasicOpenChannelSample;