import {
  channelListCategoryStyle,
  channelListItemNameStyle,
  channelListItemStyle,
  channelListStyle
} from '../styles/styles';
import {useEffect} from 'react';
import SendBird, {
  BaseChannel,
  GroupChannel,
  GroupChannelCollection,
  GroupChannelFilter, SendBirdError,
  SendBirdInstance
} from 'sendbird';
import {deleteGroupChannel} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {GroupChannelListActionKinds} from '../reducers/groupChannelListReducer';
import {getGroupChannelTitle} from '../utils/channelUtils';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../reducers';

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
        {`${getGroupChannelTitle(channel)}`}
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
  
  const groupChannelListReducerState = useSelector((state: RootState) => state.groupChannelListReducer);
  const { groupChannelCollection, groupChannelList } = groupChannelListReducerState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (groupChannelCollection) return;
    // Setting up the group channel collection and its event handler.
    const channelFetchOrder = sb.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE;
    const groupChannelFilter: GroupChannelFilter = new sb.GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;
    const newGroupChannelCollection: GroupChannelCollection = sb.GroupChannel.createGroupChannelCollection()
      .setOrder(channelFetchOrder)
      .setLimit(100)
      .setFilter(groupChannelFilter)
      .build();

    newGroupChannelCollection.setGroupChannelCollectionHandler({
      onChannelsAdded: (context, channels) => {
        dispatch({
          type: GroupChannelListActionKinds.UPSERT_CHANNELS,
          payload: channels as GroupChannel[]
        });
      },
      onChannelsUpdated: (context, channels) => {
        dispatch({
          type: GroupChannelListActionKinds.UPSERT_CHANNELS,
          payload: channels as GroupChannel[]
        });
        updateCurrentChannel(channels);
      },
      onChannelsDeleted: (context, channelUrls) => {
        dispatch({
          type: GroupChannelListActionKinds.DELETE_CHANNELS,
          payload: channelUrls,
        });
        deleteCurrentChannel(channelUrls);
      },
    });

    newGroupChannelCollection.loadMore()
      .then((channels: GroupChannel[]) => {
        dispatch({
          type: GroupChannelListActionKinds.SET_CHANNELS,
          payload: {
            groupChannelList: channels,
            groupChannelCollection: newGroupChannelCollection,
          },
        });
      })
      .catch((error: SendBirdError) => alert('groupChannelCollection loadMore error: ' + error));
  }, [groupChannelCollection]);

  const deleteChannel = (channel: GroupChannel, index: number) => {
    deleteGroupChannel(channel)
      .catch((error: SendBirdError) => alert('GroupChat deleteChannel error: ' + error));
  }

  return (
    <div className={channelListStyle}>
      <GroupChannelCategoryComponent openDialog={openCreateChannelDialog}/>
      {
        groupChannelList.map((channel: GroupChannel, i: number) => {
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