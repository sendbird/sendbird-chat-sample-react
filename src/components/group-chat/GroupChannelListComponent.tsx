import {
  channelListItemLastMessageStyle,
  channelListItemNameStyle,
  channelListItemStyle, channelListItemTitleStyle,
  channelListStyle, smallButtonStyle
} from '../../styles/styles';
import {useEffect, useState} from 'react';
import {
  BaseChannel,
  GroupChannel,
  SendBirdError,
} from 'sendbird';
import {deleteGroupChannel} from '../../sendbird-actions/channel-actions/GroupChannelActions';
import {GroupChannelListActionKinds} from '../../reducers/groupChannelListReducer';
import {getGroupChannelTitle} from '../../utils/channelUtils';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import OpenChannelListCategoryComponent from '../open-chat/OpenChannelListCategoryComponent';
import GroupChannelListCategoryComponent from './GroupChannelListCategoryComponent';

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

  const [title, setTitle] = useState('');

  const isSelected = (): boolean => {
    return currentChannel ? channel.url === currentChannel.url : false;
  }

  useEffect(() => {
    if (channel.members) {
      setTitle(getGroupChannelTitle(channel));
    }
  }, [channel.members]);

  return (
    <div className={channelListItemStyle} key={index}>
      <div
        className={channelListItemTitleStyle}
        onClick={() => setCurrentChannel(channel)}
      >
        <div
          className={channelListItemNameStyle}
          style={isSelected() ? { color: 'green' } : {}}
        >
          {title}
        </div>
        <div className={channelListItemLastMessageStyle}>
          {
            channel.lastMessage && channel.lastMessage.isUserMessage()
              ? channel.lastMessage.message
              : null
          }
        </div>
      </div>
      <button
        className={smallButtonStyle}
        onClick={() => deleteChannel(channel, index)}
      >x</button>
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
  
  const groupChannelListReducerState = useSelector((state: RootState) => state.groupChannelListReducer);
  const sampleReducerState = useSelector((state: RootState) => state.sampleReducer);

  const { groupChannelList } = groupChannelListReducerState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (sampleReducerState.groupChannelCollection && sampleReducerState.channelFetchOrder) {
      // Setting up the group channel collection and its event handler.
      const groupChannelCollection = sampleReducerState.groupChannelCollection;
      groupChannelCollection.setGroupChannelCollectionHandler({
        onChannelsAdded: (context, channels) => {
          dispatch({
            type: GroupChannelListActionKinds.UPSERT_GROUP_CHANNELS,
            payload: channels as GroupChannel[]
          });
        },
        onChannelsUpdated: (context, channels) => {
          dispatch({
            type: GroupChannelListActionKinds.UPSERT_GROUP_CHANNELS,
            payload: channels as GroupChannel[]
          });
          updateCurrentChannel(channels);
        },
        onChannelsDeleted: (context, channelUrls) => {
          dispatch({
            type: GroupChannelListActionKinds.DELETE_GROUP_CHANNELS,
            payload: channelUrls,
          });
          deleteCurrentChannel(channelUrls);
        },
      });

      groupChannelCollection.loadMore()
        .then((channels: GroupChannel[]) => {
          dispatch({
            type: GroupChannelListActionKinds.SET_GROUP_CHANNELS,
            payload: {
              groupChannelList: channels,
              order: sampleReducerState.channelFetchOrder as string,
            },
          });
        })
        .catch((error: SendBirdError) => alert('groupChannelCollection loadMore error: ' + error));
    }
  }, [sampleReducerState.groupChannelCollection]);

  const deleteChannel = (channel: GroupChannel, index: number) => {
    deleteGroupChannel(channel)
      .catch((error: SendBirdError) => alert('GroupChat deleteChannel error: ' + error));
  }

  return (
    <div className={channelListStyle}>
      <GroupChannelListCategoryComponent
        categoryName='Group Channels'
        openDialog={openCreateChannelDialog}
      />
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