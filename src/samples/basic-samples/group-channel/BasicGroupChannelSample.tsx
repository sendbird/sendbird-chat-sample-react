import SendBird, {
  GroupChannel,
  GroupChannelCollection,
  GroupChannelFilter,
  SendBirdInstance,
} from 'sendbird';
import {useState} from 'react';
import CreateGroupChannelDialogComponent from '../../../components/CreateGroupChannelDialogComponent';
import GroupChatComponent from '../../../components/GroupChatComponent';
import ChannelListComponent from '../../../components/ChannelListComponent';
import {upsertGroupChannel} from '../../../utils/groupChannelUtils';
import {CHANNEL_TYPE} from '../../../constants/enums';

const BasicGroupChannelSample = (props: BasicGroupChannelSampleProps) => {
  const {} = props;

  const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<GroupChannel>();

  const openCreateChannelDialog = () => {
    setIsDialogOpen(true);
  }

  const sb: SendBirdInstance = SendBird.getInstance();

  // Setting up the group channel collection and its event handler.
  const channelFetchOrder = sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE;
  const groupChannelFilter: GroupChannelFilter = new sb.GroupChannelFilter();
  groupChannelFilter.includeEmpty = true;
  const groupChannelCollection: GroupChannelCollection = sb.GroupChannel.createGroupChannelCollection()
    .setOrder(channelFetchOrder)
    .setLimit(8)
    .setFilter(groupChannelFilter)
    .build();

  groupChannelCollection.setGroupChannelCollectionHandler({
    onChannelsAdded: (context, channels) => {
      const mutableChannelList: GroupChannel[] = [...groupChannels];
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        upsertGroupChannel(mutableChannelList, channel as GroupChannel, channelFetchOrder);
      }
      setGroupChannels(mutableChannelList);
    },
    onChannelsUpdated: (context, channels) => {
      const mutableChannelList: GroupChannel[] = [...groupChannels];
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        upsertGroupChannel(mutableChannelList, channel as GroupChannel, channelFetchOrder);
      }
      setGroupChannels(mutableChannelList);
    },
    onChannelsDeleted: (context, channelUrls) => {
      const mutableChannelList: GroupChannel[] = [...groupChannels];
      const showingChannelUrls: string[] = mutableChannelList.map((channel: GroupChannel) => channel.url);
      for (let i = 0; i < channelUrls.length; i++) {
        const channelUrl = channelUrls[i];
        const index = showingChannelUrls.indexOf(channelUrl);
        if (index > -1) mutableChannelList.splice(index, 1);
      }
      setGroupChannels(mutableChannelList);
    },
  });

  return (
    <div>
      { isDialogOpen
        ? <CreateGroupChannelDialogComponent
          setCurrentChannel={setCurrentChannel}
          setIsDialogOpen={setIsDialogOpen}
        />
        : null
      }
      <ChannelListComponent
        channelType={CHANNEL_TYPE.GROUP}
        channels={groupChannels}
        openCreateChannelDialog={openCreateChannelDialog}
        setCurrentChannel={(channel: GroupChannel) => setCurrentChannel(channel)}
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