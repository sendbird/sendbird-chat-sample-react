import {
  BaseChannel,
  GroupChannel,
  OpenChannel
} from 'sendbird';
import {channelListCategoryStyle, channelListStyle} from '../styles/styles';

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

const ChannelListComponent = (props: ChannelListProps) => {
  const {
    groupChannels,
    openChannels,
    openCreateGroupChannelDialog,
    openCreateOpenChannelDialog,
    setCurrentChannel,
  } = props;

  return (
    <div className={channelListStyle}>
      <ChannelCategoryComponent categoryName='Group Channels' openDialog={openCreateGroupChannelDialog}/>
      {
        groupChannels.map((groupChannel: GroupChannel, index) => {
          return (
            <div onClick={() => setCurrentChannel(groupChannel)} key={ index }/>
          );
        })
      }
      <ChannelCategoryComponent categoryName='Open Channels' openDialog={openCreateOpenChannelDialog}/>
      {
        openChannels.map((openChannel: OpenChannel, index) => {
          return (
            <div onClick={() => setCurrentChannel(openChannel)} key={ index }/>
          );
        })
      }
    </div>
  );
};

type ChannelListProps = {
  groupChannels: GroupChannel[],
  openChannels: OpenChannel[],
  openCreateGroupChannelDialog: () => void,
  openCreateOpenChannelDialog: () => void,
  setCurrentChannel: (channel: BaseChannel) => void,
};

export default ChannelListComponent;