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
import {createGroupChannel, leaveGroupChannel} from '../../../sendbird-actions/channel-actions/GroupChannelActions';
import {samplePageStyle} from '../../../styles/styles';
import {ChannelActionKinds} from '../../../reducers/channelReducer';
import {RootState} from '../../../reducers';

const BasicGroupChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [user, setUser] = useState<SendBirdInstance>();
  const currentChannel: BaseChannel | null = useSelector((state: RootState) => state.channelReducer.channel);
  const dispatch = useDispatch();

  const openCreateChannelDialog = () => {
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (!user) {
      const sb: SendBirdInstance = SendBird.getInstance();
      setUser(sb);
    }
  }, []);

  const createChannel = async (userIdsToInvite: string[]) => {
    try {
      const groupChannel: GroupChannel = await createGroupChannel(userIdsToInvite);
      setIsDialogOpen(false);
      setCurrentChannel(groupChannel);
    } catch (e) {
      alert('Create open channel error: ' + e);
    }
  }

  const setCurrentChannel = (channel: GroupChannel | null): void => {
    dispatch({
      type: ChannelActionKinds.SET_CHANNEL,
      payload: channel,
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

  const inviteMembersToCurrentChannel = (userIdsToInvite: string[]): void => {
    dispatch({
      type: ChannelActionKinds.INVITE_USERS,
      payload: userIdsToInvite,
    });
  }

  const openInviteUsersDialog = () => {

  }

  return (
    <div className={samplePageStyle}>
      { isDialogOpen
        ? <InviteMembersDialogComponent
          isDialogOpen={isDialogOpen}
          inviteUserIds={createChannel}
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
          />
          : null
      }
    </div>
  );
};

type BasicGroupChannelSampleProps = {};

export default BasicGroupChannelSample;