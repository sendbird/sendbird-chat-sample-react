import {
  channelListItemNameStyle,
  channelListItemStyle, channelListItemTitleStyle,
  channelListStyle, smallButtonStyle
} from '../../styles/styles';
import {
  BaseChannel,
  OpenChannel,
  SendBirdError,
} from 'sendbird';
import {deleteOpenChannel} from '../../sendbird-actions/channel-actions/OpenChannelActions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import ChannelListCategoryComponent from '../ChannelListCategoryComponent';
import {OpenChannelListActionKinds} from '../../reducers/openChannelListReducer';

type OpenChannelListItemProps = {
  index: number,
  channel: OpenChannel,
  setCurrentChannel: (channel: OpenChannel) => void,
  currentChannel: BaseChannel | null,
  deleteChannel: (channel: OpenChannel) => void,
}

const OpenChannelListItemComponent = (props: OpenChannelListItemProps) => {
  const {
    index,
    channel,
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
        className={channelListItemTitleStyle}
        onClick={() => setCurrentChannel(channel)}
      >
        <div
          className={channelListItemNameStyle}
          style={isSelected() ? { color: 'green' } : {}}
        >
          {channel.name}
        </div>
      </div>
      <button
        className={smallButtonStyle}
        onClick={() => deleteChannel(channel)}
      >x</button>
    </div>
  )
}

const OpenChannelListComponent = (props: OpenChannelListProps) => {
  const {
    openCreateChannelDialog,
    currentChannel,
    setCurrentChannel,
    deleteCurrentChannel,
  } = props;

  const openChannelList: OpenChannel[] = useSelector((state: RootState) => state.openChannelListReducer.openChannelList);
  const dispatch = useDispatch();

  const deleteChannel = (channel: OpenChannel) => {
    deleteOpenChannel(channel)
      .then(() => {
        dispatch({
          type: OpenChannelListActionKinds.DELETE_OPEN_CHANNEL,
          payload: channel,
        });
        deleteCurrentChannel(channel.url);
      })
      .catch((error: SendBirdError) => alert('OpenChat deleteChannel error: ' + error));
  }

  return (
    <div className={channelListStyle}>
      <ChannelListCategoryComponent openDialog={openCreateChannelDialog} categoryName='Open Channel'/>
      {
        openChannelList.map((channel: OpenChannel, i: number) => {
          return (
            <OpenChannelListItemComponent
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

interface OpenChannelListProps {
  openCreateChannelDialog: () => void;
  currentChannel: OpenChannel | null;
  setCurrentChannel: (channel: OpenChannel | null) => void;
  deleteCurrentChannel: (deletedChannelUrl: string) => void;
}

export default OpenChannelListComponent;