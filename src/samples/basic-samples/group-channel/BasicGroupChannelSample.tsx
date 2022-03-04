import SendBird, {
  BaseChannel,
  GroupChannel,
  SendBirdInstance,
} from 'sendbird';
import {useEffect, useReducer, useState} from 'react';
import CreateGroupChannelDialogComponent from '../../../components/CreateGroupChannelDialogComponent';
import GroupChatComponent from '../../../components/GroupChatComponent';
import GroupChannelListComponent from '../../../components/GroupChannelListComponent';
import {createGroupChannel} from '../../../sendbird-actions/channel-actions/GroupChannelActions';
import {samplePageStyle} from '../../../styles/styles';
import {ChannelActionKinds, channelReducer} from '../../../reducers/channelReducer';

const BasicGroupChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [user, setUser] = useState<SendBirdInstance>();
  const [channelState, dispatchChannel] = useReducer(channelReducer, { channel: null });

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
    dispatchChannel({
      type: ChannelActionKinds.setChannel,
      channel: channel as BaseChannel,
    });
  }

  const deleteCurrentChannel = (deletedChannelUrls: string[]): void => {
    dispatchChannel({
      type: ChannelActionKinds.deleteChannel,
      deletedChannelUrls,
    });
  }

  const updateCurrentChannel = (updatedChannels: BaseChannel[]): void => {
    dispatchChannel({
      type: ChannelActionKinds.updateChannel,
      updatedChannels,
    });
  }

  return (
    <div className={samplePageStyle}>
      { isDialogOpen
        ? <CreateGroupChannelDialogComponent
          isDialogOpen={isDialogOpen}
          createChannel={createChannel}
        />
        : null
      }
      <GroupChannelListComponent
        openCreateChannelDialog={openCreateChannelDialog}
        setCurrentChannel={setCurrentChannel}
        currentChannel={channelState.channel as GroupChannel}
        deleteCurrentChannel={deleteCurrentChannel}
        updateCurrentChannel={updateCurrentChannel}
      />
      {
        channelState.channel
          ? <GroupChatComponent groupChannel={channelState.channel as GroupChannel}/>
          : null
      }
    </div>
  );
};

type BasicGroupChannelSampleProps = {};

export default BasicGroupChannelSample;