import SendBird, {
  BaseChannel,
  GroupChannel,
  SendBirdInstance,
} from 'sendbird';
import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InviteMembersDialogComponent from '../../../components/InviteMembersDialogComponent';
import GroupChatComponent from '../../../components/GroupChatComponent';
import GroupChannelListComponent from '../../../components/GroupChannelListComponent';
import {
  createGroupChannel,
  inviteUserIdsToGroupChannel,
} from '../../../sendbird-actions/channel-actions/GroupChannelActions';
import {samplePageStyle} from '../../../styles/styles';
import {ChannelActionKinds} from '../../../reducers/channelReducer';
import {RootState} from '../../../reducers';
import {MessageListActionKinds} from '../../../reducers/messageListReducer';

export enum DialogState {
  CREATE = 'CREATE',
  INVITE = 'INVITE',
  CLOSED = 'CLOSED',
}

const BasicGroupChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [dialogState, setDialogState] = useState<DialogState>(DialogState.CLOSED);
  const [user, setUser] = useState<SendBirdInstance>();
  const currentChannel: BaseChannel | null = useSelector((state: RootState) => state.channelReducer.channel);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const openCreateChannelDialog = () => {
    setDialogState(DialogState.CREATE);
  }

  useEffect(() => {
    if (!user) {
      const sb: SendBirdInstance = SendBird.getInstance();
      setUser(sb);
    }
  }, []);

  const setCurrentChannel = (channel: GroupChannel | null): void => {
    setIsLoading(true);
    dispatch({
      type: ChannelActionKinds.SET_CHANNEL,
      payload: channel,
    });
    dispatch({
      type: MessageListActionKinds.SET_MESSAGES,
      payload: {
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
      setDialogState(DialogState.CLOSED);
      setCurrentChannel(groupChannel);
    } catch (e) {
      alert('Create group channel error: ' + e);
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
    <div className={samplePageStyle}>
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
  );
};

type BasicGroupChannelSampleProps = {};

export default BasicGroupChannelSample;