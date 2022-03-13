import SendBird, {
  BaseChannel,
  GroupChannel, GroupChannelCollection, GroupChannelFilter,
  SendBirdInstance,
} from 'sendbird';
import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InviteMembersDialogComponent from '../../../components/group-chat/InviteMembersDialogComponent';
import GroupChatComponent from '../../../components/group-chat/GroupChatComponent';
import GroupChannelListComponent from '../../../components/group-chat/GroupChannelListComponent';
import {
  createGroupChannel,
  inviteUserIdsToGroupChannel,
} from '../../../sendbird-actions/channel-actions/GroupChannelActions';
import {samplePageStyle} from '../../../styles/styles';
import {ChannelActionKinds} from '../../../reducers/channelReducer';
import {RootState} from '../../../reducers';
import {MessageListActionKinds} from '../../../reducers/messageListReducer';
import {DialogState} from '../../../constants/enums';
import {SampleActionKinds} from '../../../reducers/sampleReducer';

const BasicGroupChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [dialogState, setDialogState] = useState<DialogState>(DialogState.CLOSED);
  const [user, setUser] = useState<SendBirdInstance>();
  const currentChannel: BaseChannel | null = useSelector((state: RootState) => state.channelReducer.channel);
  const sampleReducerState = useSelector((state: RootState) => state.sampleReducer);
  const [isSampleReset, setIsSampleReset] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const openCreateChannelDialog = () => {
    setDialogState(DialogState.CREATE);
  }

  useEffect(() => {
    const sb: SendBirdInstance = SendBird.getInstance();
    const CHANNEL_FETCH_ORDER = sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE;
    const groupChannelFilter: GroupChannelFilter = new sb.GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;
    const groupChannelCollection: GroupChannelCollection = sb.GroupChannel.createGroupChannelCollection()
      .setOrder(CHANNEL_FETCH_ORDER)
      .setLimit(100)
      .setFilter(groupChannelFilter)
      .build();

    // Clear old channel handler or group channel collection if exists.
    dispatch({
      type: SampleActionKinds.RESET_SAMPLE,
      payload: {
        groupChannelCollection,
        channelFetchOrder: CHANNEL_FETCH_ORDER,
      },
    });

    if (!user) {
      const sb: SendBirdInstance = SendBird.getInstance();
      setUser(sb);
    }
  }, []);

  useEffect(() => {
    if (sampleReducerState.groupChannelCollection) {
      setIsSampleReset(true);
    }
  }, [sampleReducerState.groupChannelCollection]);

  const setCurrentChannel = (channel: GroupChannel | null): void => {
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

  const deleteCurrentChannel = (deletedChannelUrls: string[]): void => {
    dispatch({
      type: ChannelActionKinds.DELETE_CHANNEL,
      payload: deletedChannelUrls,
    });
    dispatch({
      type: MessageListActionKinds.SET_MESSAGES,
      payload: {
        channelUrl: null,
        messages: [],
      }
    });
  }

  const updateCurrentChannel = (updatedChannels: BaseChannel[]): void => {
    dispatch({
      type: ChannelActionKinds.UPDATE_CHANNEL,
      payload: updatedChannels,
    });
  }

  const openInviteUsersDialog = () => {
    setDialogState(DialogState.INVITE);
  }

  const createChannel = async (userIdsToInvite: string[]) => {
    try {
      const groupChannel: GroupChannel = await createGroupChannel(userIdsToInvite);
      setCurrentChannel(groupChannel);
    } catch (e) {
      alert('Create group channel error: ' + e);
    } finally {
      setDialogState(DialogState.CLOSED);
    }
  }

  const inviteUsers = async (userIdsToInvite: string[]) => {
    try {
      const groupChannel: GroupChannel = await inviteUserIdsToGroupChannel(currentChannel as GroupChannel,
        userIdsToInvite);
      setDialogState(DialogState.CLOSED);
      setCurrentChannel(groupChannel);
    } catch (e) {
      alert('Invite userIds to group channel error: ' + e);
    }
  }

  const closeDialog = () => {
    setDialogState(DialogState.CLOSED);
  }

  const finishLoading = () => {
    setIsLoading(false);
  }

  return (
    isSampleReset
      ? <div className={samplePageStyle}>
        { dialogState !== DialogState.CLOSED
          ? <InviteMembersDialogComponent
            dialogState={dialogState}
            createChannel={createChannel}
            inviteUsers={inviteUsers}
            closeDialog={closeDialog}
          />
          : null
        }
        <GroupChannelListComponent
          openCreateChannelDialog={openCreateChannelDialog}
          setCurrentChannel={setCurrentChannel}
          currentChannel={currentChannel as GroupChannel}
          deleteCurrentChannel={deleteCurrentChannel}
          updateCurrentChannel={updateCurrentChannel}
        />
        {
          currentChannel
            ? <GroupChatComponent
              groupChannel={currentChannel as GroupChannel}
              openInviteUsersDialog={openInviteUsersDialog}
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

export default BasicGroupChannelSample;