import {channelListCategoryStyle, channelListItemStyle, channelListStyle} from '../styles/styles';
import {useEffect, useState} from 'react';
import SendBird, {
  BaseChannel,
  GroupChannel,
  GroupChannelCollection,
  GroupChannelFilter,
  SendBirdInstance
} from 'sendbird';
import {upsertGroupChannel} from '../utils/groupChannelUtils';

type GroupChannelCategoryProps = {
  openDialog: () => void,
}


type GroupChannelListItemProps = {
  channel: GroupChannel,
  isSelected: boolean,
  setCurrentChannel: (channel: GroupChannel) => void,
}

const GroupChannelListItemComponent = (props: GroupChannelListItemProps) => {
  const {
    channel,
    isSelected,
    setCurrentChannel,
  } = props;

  console.log('## isSelected: ', isSelected);

  return (
    <div
      className={channelListItemStyle}
      onClick={() => setCurrentChannel(channel)}
    >
      {`${channel.name }`}
    </div>
  )
}

const GroupChannelCategoryComponent = (props: GroupChannelCategoryProps) => {
  const {
    openDialog,
  } = props;

  return (
    <div className={channelListCategoryStyle}>
      <p style={{ marginRight: '10px' }}>Group Channels</p>
      <button
        style={{ padding: '0.5px 3px' }}
        onClick={() => openDialog()}
      >+</button>
    </div>
  )
}

const GroupChannelListComponent = (props: GroupChannelListProps) => {
  const {
    openCreateChannelDialog,
    setCurrentChannel,
    currentChannel,
  } = props;

  const [groupChannels, setGroupChannels] = useState<GroupChannel[]>([]);

  console.log('## groupChannels: ', groupChannels);

  useEffect(() => {
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
  }, []);

  return (
    <div className={channelListStyle}>
      <GroupChannelCategoryComponent openDialog={openCreateChannelDialog}/>
      {
        groupChannels.map((channel: GroupChannel, i: number) => {
          return (
            <GroupChannelListItemComponent
              key={i}
              channel={channel}
              setCurrentChannel={setCurrentChannel}
              isSelected={!!currentChannel && channel.url === currentChannel.url}
            />
          );
        })
      }
    </div>
  );
};

interface GroupChannelListProps {
  openCreateChannelDialog: () => void;
  currentChannel: GroupChannel | undefined,
  setCurrentChannel: (channel: GroupChannel) => void;
}

export default GroupChannelListComponent;