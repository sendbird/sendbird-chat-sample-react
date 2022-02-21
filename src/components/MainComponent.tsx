import SendBird, {
  BaseChannel,
  GroupChannel,
  GroupChannelCollection,
  GroupChannelFilter,
  OpenChannel,
  SendBirdInstance
} from 'sendbird';
import {useState} from 'react';
import ChannelList from './ChannelListComponent';
import {upsertGroupChannel} from '../utils/groupChannelUtils';
import CreateGroupChannelDialog from './CreateGroupChannelDialogComponent';
import CreateOpenChannelDialog from './CreateOpenChannelDialogComponent';
import ChannelListComponent from './ChannelListComponent';
import CreateOpenChannelDialogComponent from './CreateOpenChannelDialogComponent';
import CreateGroupChannelDialogComponent from './CreateGroupChannelDialogComponent';

export enum CREATE_CHANNEL_DIALOG_STATE {
  OPEN_CHANNEL_OPENED,
  GROUP_CHANNEL_OPENED,
  CLOSED,
}

export enum CHANNEL_TYPE {
  GROUP,
  OPEN,
}

const MainComponent = (props: MainProps) => {
  const {} = props;

  const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);
  const [openChannels, setOpenChannels] = useState<OpenChannel[]>([]);
  const [createChannelDialogState, setCreateChannelDialogState] =
    useState<CREATE_CHANNEL_DIALOG_STATE>(CREATE_CHANNEL_DIALOG_STATE.CLOSED);
  const [currentChannel, setCurrentChannel] = useState<BaseChannel | null>(null);

  const openCreateGroupChannelDialog = () => {
    setCreateChannelDialogState(CREATE_CHANNEL_DIALOG_STATE.GROUP_CHANNEL_OPENED);
  }

  const openCreateOpenChannelDialog = () => {
    setCreateChannelDialogState(CREATE_CHANNEL_DIALOG_STATE.OPEN_CHANNEL_OPENED);
  }

  const renderCreateChannelDialogComponent = () => {
    switch (createChannelDialogState) {
      case CREATE_CHANNEL_DIALOG_STATE.GROUP_CHANNEL_OPENED:
        return <CreateGroupChannelDialogComponent
          setCurrentChannel={setCurrentChannel}
          setCreateChannelDialogState={setCreateChannelDialogState}
        />;
      case CREATE_CHANNEL_DIALOG_STATE.OPEN_CHANNEL_OPENED:
        return <CreateOpenChannelDialogComponent
          setCurrentChannel={setCurrentChannel}
          setCreateChannelDialogState={setCreateChannelDialogState}
        />;
      default:
        return null;
    }
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
      {renderCreateChannelDialogComponent()}
      <ChannelListComponent
        groupChannels={groupChannels}
        openChannels={openChannels}
        openCreateGroupChannelDialog={openCreateGroupChannelDialog}
        openCreateOpenChannelDialog={openCreateOpenChannelDialog}
        setCurrentChannel={setCurrentChannel}
      />
    </div>
  );
};

type MainProps = {};

export default MainComponent;