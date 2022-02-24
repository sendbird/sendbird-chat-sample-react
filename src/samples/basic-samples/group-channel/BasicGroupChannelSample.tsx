import SendBird, {
  BaseChannel,
  GroupChannel,
  GroupChannelCollection,
  GroupChannelFilter, SendBirdError,
  SendBirdInstance, User,
} from 'sendbird';
import {useCallback, useEffect, useState} from 'react';
import CreateGroupChannelDialogComponent from '../../../components/CreateGroupChannelDialogComponent';
import GroupChatComponent from '../../../components/GroupChatComponent';
import GroupChannelListComponent from '../../../components/GroupChannelListComponent';
import {upsertGroupChannel} from '../../../utils/groupChannelUtils';
import {CHANNEL_TYPE} from '../../../constants/enums';
import {createGroupChannel} from '../../../sendbird-actions/channel-actions/GroupChannelActions';
import {getUserList} from '../../../sendbird-actions/SendbirdActions';
import {samplePageStyle} from '../../../styles/styles';

const BasicGroupChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<GroupChannel>();
  const [user, setUser] = useState<SendBirdInstance>();

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
        setCurrentChannel={(channel: GroupChannel) => setCurrentChannel(channel)}
       currentChannel={currentChannel}
      />
      {
        currentChannel
          ? <GroupChatComponent groupChannel={currentChannel}/>
          : null
      }
    </div>
  );
};

type BasicGroupChannelSampleProps = {};

export default BasicGroupChannelSample;