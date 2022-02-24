import {channelListCategoryStyle, channelListStyle} from '../styles/styles';
import {CHANNEL_TYPE} from './MainComponent';

type ChannelCategoryProps = {
  categoryName: string,
  openDialog: () => void,
}

const ChannelCategoryComponent = (props: ChannelCategoryProps) => {
  const {
    categoryName,
    openDialog,
  } = props;

  return (
    <div className={channelListCategoryStyle}>
      <p>{categoryName}</p>
      <button onClick={() => openDialog()}></button>
    </div>
  )
}

const ChannelListComponent = <T extends unknown>(props: ChannelListProps<T>) => {
  const {
    channelType,
    channels,
    openCreateChannelDialog,
    setCurrentChannel,
  } = props;

  return (
    <div className={channelListStyle}>
      <ChannelCategoryComponent
        categoryName={channelType === CHANNEL_TYPE.GROUP ? 'Group Channels' : 'Open Channels'}
        openDialog={openCreateChannelDialog}
      />
      {
        channels.map((channel: T, index) => {
          return (
            <div onClick={() => setCurrentChannel(channel)} key={ index }/>
          );
        })
      }
    </div>
  );
};

interface ChannelListProps<T> {
  channelType: CHANNEL_TYPE,
  channels: T[],
  openCreateChannelDialog: () => void,
  setCurrentChannel: (channel: T) => void,
};

export default ChannelListComponent;