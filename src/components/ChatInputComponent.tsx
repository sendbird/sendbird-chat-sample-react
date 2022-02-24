import {BaseChannel, SendBirdError} from 'sendbird';
import { sendFileMessage } from '../sendbird-actions/message-actions/FileMessageActions';
import React, {ChangeEvent, useState} from 'react';
import {markChannelAsRead} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {KEY_ENTER} from '../constants/constants';
import {sendUserMessage} from '../sendbird-actions/message-actions/UserMessageActions';
import {
  fileInputStyle,
  messageInputStyle, textInputAreaStyle,
  textInputStyle,
} from '../styles/styles';

const ChatInputComponent = (props: ChatInputProps) => {
  const {
    channel,
  } = props;

  const [textMessage, setTextMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const onFileInputChange = async (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      setFile(e.currentTarget.files[0]);
      if (file) await sendFileMessage(channel, file);
    }
  }

  const onChannelRead = async () => {
    if (channel.isGroupChannel()) {
      try {
        await markChannelAsRead(channel);
      } catch (e) {
        alert('Mark group channel as read error: ' + e);
      }
    }
  }

  const onTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const textInput: string = e.currentTarget.value;
    setTextMessage(textInput);
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY_ENTER && !e.shiftKey && textMessage) {
      e.preventDefault();
      console.log('## entered: ', textMessage);
      sendUserMessage(channel, textMessage)
        .then(() => {
          if (channel.isGroupChannel()) channel.endTyping();
          setTextMessage('');
        })
        .catch((error: SendBirdError) => alert('sendUserMessage error: ' + error))
    } else {
      if (channel.isGroupChannel()) channel.startTyping();
    }
  }

  return (
    <div className={messageInputStyle}>
      <div className={textInputStyle}>
        <input
          className={textInputAreaStyle}
          placeholder='Write a chat...'
          onClick={onChannelRead}
          onKeyPress={onKeyPress}
          onChange={onTextInputChange}
          value={textMessage}
        />
      </div>
      <label className={fileInputStyle}>
        <input
          type='file'
          style={{ display: 'none' }}
          onChange={onFileInputChange}
          onClick={onChannelRead}
        />
      </label>
    </div>
  );
}

type ChatInputProps = {
  channel: BaseChannel,
};

export default ChatInputComponent;