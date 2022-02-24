import SendBird, {
  OpenChannel,
  SendBirdInstance,
} from 'sendbird';
import {useState} from 'react';
import CreateOpenChannelDialogComponent from '../../../components/CreateOpenChannelDialogComponent';
import OpenChatComponent from '../../../components/OpenChatComponent';
import ChannelListComponent from '../../../components/ChannelListComponent';
import {CHANNEL_TYPE} from '../../../constants/enums';

const BasicOpenChannelSample = (props: BasicOpenChannelSampleProps) => {
  const {} = props;

  const [openChannels, setOpenChannels] = useState<OpenChannel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<OpenChannel>();

  const openCreateChannelDialog = () => {
    setIsDialogOpen(true);
  }

  const sb: SendBirdInstance = SendBird.getInstance();

  return (
    <div>
      { isDialogOpen
        ? <CreateOpenChannelDialogComponent
          setCurrentChannel={setCurrentChannel}
          setIsDialogOpen={setIsDialogOpen}
        />
        : null
      }
      <ChannelListComponent
        channelType={CHANNEL_TYPE.OPEN}
        channels={openChannels}
        openCreateChannelDialog={openCreateChannelDialog}
        setCurrentChannel={(channel: OpenChannel) => setCurrentChannel(channel)}
      />
      {
        currentChannel
          ? <OpenChatComponent openChannel={currentChannel}/>
          : null
      }
    </div>
  );
};

type BasicOpenChannelSampleProps = {};

export default BasicOpenChannelSample;