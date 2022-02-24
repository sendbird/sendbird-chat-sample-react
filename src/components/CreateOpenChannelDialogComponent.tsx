import React, {useState} from 'react';
import {  OpenChannel} from 'sendbird';
import {createOpenChannel} from '../sendbird-actions/channel-actions/OpenChannelActions';
import { createChannelDialogStyle } from '../styles/styles';

const CreateChannelDialogComponent = (props: CreateChannelDialogProps) => {
  const {
    setCurrentChannel,
    setIsDialogOpen,
  } = props;

  const [channelName, setChannelName] = useState<string>('');

  const onChannelNameEntered = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const channelName: string = event.currentTarget.value;
    setChannelName(channelName);
  }

  const createChannel = async () => {
    try {
      const openChannel: OpenChannel = await createOpenChannel(channelName);
      setCurrentChannel(openChannel);
    } catch (e) {
      alert('Create open channel error: ' + e);
    } finally {
      setIsDialogOpen(false);
    }
  }

  return (
    <form className={createChannelDialogStyle} onSubmit={createChannel}>
      <label>
        Name:
        <input type='text' value={channelName} onChange={onChannelNameEntered} />
      </label>
      <input type='submit' value='Create' />
    </form>
  );
}

type CreateChannelDialogProps = {
  setCurrentChannel: (channel: OpenChannel) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export default CreateChannelDialogComponent;