import {CHANNEL_TYPE, CREATE_CHANNEL_DIALOG_STATE} from './MainComponent';
import React, {useState} from 'react';
import {BaseChannel, OpenChannel} from 'sendbird';
import {createOpenChannel} from '../sendbird-actions/channel-actions/OpenChannelActions';
import { createChannelDialogStyle } from '../styles/styles';

const CreateChannelDialogComponent = (props: CreateChannelDialogProps) => {
  const {
    setCurrentChannel,
    setCreateChannelDialogState,
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
      setCreateChannelDialogState(CREATE_CHANNEL_DIALOG_STATE.CLOSED);
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
  setCurrentChannel: (channel: BaseChannel) => void;
  setCreateChannelDialogState: (state: CREATE_CHANNEL_DIALOG_STATE) => void;
}

export default CreateChannelDialogComponent;