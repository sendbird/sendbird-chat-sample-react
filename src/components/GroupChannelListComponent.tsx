import {
  channelListCategoryStyle,
  channelListItemNameStyle,
  channelListItemStyle,
  channelListStyle
} from '../styles/styles';
import {useEffect, useReducer, useState} from 'react';
import SendBird, {
  BaseChannel,
  GroupChannel,
  GroupChannelCollection,
  GroupChannelFilter, Member, SendBirdError,
  SendBirdInstance
} from 'sendbird';
import {deleteGroupChannel} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {GroupChannelListActionKinds, groupChannelListReducer} from '../reducers/groupChannelListReducer';
import {ChannelActionKinds, channelReducer} from '../reducers/channelReducer';

type GroupChannelCategoryProps = {
  openDialog: () => void,
}


type GroupChannelListItemProps = {
  channel: GroupChannel,
  index: number,
  setCurrentChannel: (channel: GroupChannel) => void,
  currentChannel: BaseChannel | null,
  deleteChannel: (channel: GroupChannel, index: number) => void,
}

const GroupChannelListItemComponent = (props: GroupChannelListItemProps) => {
  const {
    channel,
    index,
    setCurrentChannel,
    currentChannel,
    deleteChannel,
  } = props;

  const isSelected = (): boolean => {
    return currentChannel ? channel.url === currentChannel.url : false;
  }

  return (
    <div className={channelListItemStyle} key={index}>
      <div
        className={channelListItemNameStyle}
        style={isSelected() ? { color: 'green' } : {}}
        onClick={() => setCurrentChannel(channel)}
      >
        {`${channel.members.map((member: Member) => member.nickname).join(', ')}`}
      </div>
      <button
        style={{ padding: '0.2px 4px' }}
        onClick={() => deleteChannel(channel, index)}
      >x</button>
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
    currentChannel,
    setCurrentChannel,
    deleteCurrentChannel,
    updateCurrentChannel,
  } = props;

  const sb: SendBirdInstance = SendBird.getInstance();

  const [groupChannelListState, dispatchGroupChannelList] = useReducer(groupChannelListReducer, {
    groupChannelList: [],
    order: sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE,
    groupChannelCollection: null,
  });

  useEffect(() => {
    if (groupChannelListState.groupChannelCollection) return;
    // Setting up the group channel collection and its event handler.
    const channelFetchOrder = sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE;
    const groupChannelFilter: GroupChannelFilter = new sb.GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;
    const groupChannelCollection: GroupChannelCollection = sb.GroupChannel.createGroupChannelCollection()
      .setOrder(channelFetchOrder)
      .setLimit(100)
      .setFilter(groupChannelFilter)
      .build();

    groupChannelCollection.setGroupChannelCollectionHandler({
      onChannelsAdded: (context, channels) => {
        dispatchGroupChannelList({
          type: GroupChannelListActionKinds.upsertChannels,
          groupChannelList: channels as GroupChannel[]
        });
      },
      onChannelsUpdated: (context, channels) => {
        dispatchGroupChannelList({
          type: GroupChannelListActionKinds.upsertChannels,
          groupChannelList: channels as GroupChannel[]
        });
        updateCurrentChannel(channels);
      },
      onChannelsDeleted: (context, channelUrls) => {
        dispatchGroupChannelList({
          type: GroupChannelListActionKinds.deleteChannels,
          groupChannelUrls: channelUrls,
        });
        deleteCurrentChannel(channelUrls);
      },
    });

    groupChannelCollection.loadMore()
      .then((channels: GroupChannel[]) => {
        dispatchGroupChannelList({
          type: GroupChannelListActionKinds.setChannels,
          groupChannelList: channels,
          groupChannelCollection,
        });
      })
      .catch((error: SendBirdError) => alert('groupChannelCollection loadMore error: ' + error));
  }, [groupChannelListState.groupChannelCollection]);

  const deleteChannel = (channel: GroupChannel, index: number) => {
    deleteGroupChannel(channel)
      .catch((error: SendBirdError) => alert('GroupChat deleteChannel error: ' + error));
  }

  return (
    <div className={channelListStyle}>
      <GroupChannelCategoryComponent openDialog={openCreateChannelDialog}/>
      {
        groupChannelListState.groupChannelList.map((channel: GroupChannel, i: number) => {
          return (
            <GroupChannelListItemComponent
              channel={channel}
              key={i}
              index={i}
              setCurrentChannel={setCurrentChannel}
              currentChannel={currentChannel}
              deleteChannel={deleteChannel}
            />
          );
        })
      }
    </div>
  );
};

interface GroupChannelListProps {
  openCreateChannelDialog: () => void;
  currentChannel: GroupChannel | null;
  setCurrentChannel: (channel: GroupChannel | null) => void;
  deleteCurrentChannel: (deletedChannelUrls: string[]) => void;
  updateCurrentChannel: (updatedChannels: BaseChannel[]) => void;
}

export default GroupChannelListComponent;