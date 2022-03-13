import React, {useEffect, useState} from 'react';
import {
  createChannelDialogStyle, DialogBodyStyle,
  DialogButtonContainer, DialogTextInputStyle,
  UserListCategoryStyle,
} from '../../styles/styles';
import {DialogState} from '../../constants/enums';
import {OpenChannel} from 'sendbird';

const CreateChannelDialogComponent = (props: CreateChannelDialogProps) => {
  const {
    dialogState,
    currentChannel,
    createChannel,
    updateChannelName,
    closeDialog,
  } = props;

  const [channelName, setChannelName] = useState<string>('');

  useEffect(() => {
    if (dialogState === DialogState.UPDATE_CHANNEL_NAME && currentChannel) {
      setChannelName(currentChannel.name);
    }
  }, [dialogState]);

  const onChannelNameEntered = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const channelName: string = event.currentTarget.value;
    setChannelName(channelName);
  }

  const onDialogSubmit = () => {
    switch (dialogState) {
      case DialogState.CREATE:
        createChannel(channelName);
        break;
      case DialogState.UPDATE_CHANNEL_NAME:
        if (currentChannel) updateChannelName(currentChannel, channelName);
        break;
      default:
        return;
    }
    closeDialog();
  }

  return (
    <div className={createChannelDialogStyle}>
      <div className={UserListCategoryStyle}>
        Create Open Channel
      </div>
      <div className={DialogBodyStyle}>
        Name:<br/>
        <input
          type='text'
          className={DialogTextInputStyle}
          value={channelName}
          onChange={onChannelNameEntered}
        />
      </div>
      <div className={DialogButtonContainer}>
        <button
          style={{ marginRight: '10px' }}
          onClick={onDialogSubmit}
        >
          Submit
        </button>
        <button onClick={closeDialog}>
          Close
        </button>
      </div>
    </div>
  );
}

type CreateChannelDialogProps = {
  dialogState: DialogState,
  currentChannel: OpenChannel | null,
  createChannel: (channelName: string) => void;
  updateChannelName: (channel: OpenChannel, channelName: string) => void;
  closeDialog: () => void;
}

export default CreateChannelDialogComponent;