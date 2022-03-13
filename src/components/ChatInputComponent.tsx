import {BaseChannel, BaseMessageInstance, FileMessage, SendBirdError, UserMessage} from 'sendbird';
import {sendFileMessage, sendFileMessageWithCallback} from '../sendbird-actions/message-actions/FileMessageActions';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {markChannelAsRead} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {KEY_ENTER} from '../constants/constants';
import {
  sendUserMessage,
  sendUserMessageWithCallback,
  updateUserMessage
} from '../sendbird-actions/message-actions/UserMessageActions';
import {
  fileInputStyle,
  messageInputStyle,
  textInputAreaStyle,
  textInputStyle,
} from '../styles/styles';
import {MessageListActionKinds} from '../reducers/messageListReducer';
import {useDispatch} from 'react-redux';

const ChatInputComponent = (props: ChatInputProps) => {
  const {
    channel,
    messageToUpdate,
    unsetMessageToUpdate,
    isLoading,
  } = props;

  const [textMessage, setTextMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!isLoading) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  },[channel, isLoading]);

  useEffect(() => {
    if (messageToUpdate && messageToUpdate.isUserMessage() && messageToUpdate.message) {
      setTextMessage(messageToUpdate.message);
    } else {
      setTextMessage('');
    }
  }, [messageToUpdate]);

  useEffect(() => {
    if (file) {
      sendFileMessageByChannelType(file).catch((e) => {
        alert('file message send/update error: ' + e);
      });
    }
  }, [file]);

  const onFileInputChange = async (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      setFile(e.currentTarget.files[0]);
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

  const sendUserMessageByChannelType = async (): Promise<void> => {
    if (channel.isGroupChannel()) {
      await sendUserMessage(channel, textMessage);
      channel.endTyping();
    } else {
      const pendingMessage: UserMessage = sendUserMessageWithCallback(
        channel,
        textMessage,
        (message: UserMessage, error: SendBirdError) => {
          if (error) throw error;
          dispatch({ type: MessageListActionKinds.UPDATE_MESSAGES, payload: [message] });
        });
      dispatch({ type: MessageListActionKinds.ADD_MESSAGES, payload: [pendingMessage] });
    }
  }

  const sendFileMessageByChannelType = async (file: Blob): Promise<void> => {
    if (channel.isGroupChannel()) {
      await sendFileMessage(channel, file);
      setFile(null);
    } else {
      const pendingMessage: FileMessage = sendFileMessageWithCallback(
        channel,
        file,
        (message: FileMessage, error: SendBirdError) => {
          if (error) throw error;
          dispatch({type: MessageListActionKinds.UPDATE_MESSAGES, payload: [message]});
        });
      dispatch({type: MessageListActionKinds.ADD_MESSAGES, payload: [pendingMessage]});
    }
  }

  const onKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY_ENTER && !e.shiftKey && textMessage) {
      e.preventDefault();
      try {
        if (messageToUpdate && messageToUpdate.isUserMessage()) {
          const updatedMessage: UserMessage = await updateUserMessage(channel, messageToUpdate.messageId, textMessage);
          if (channel.isOpenChannel()) {
            dispatch({type: MessageListActionKinds.UPDATE_MESSAGES, payload: [updatedMessage]});
          }
          unsetMessageToUpdate();
        } else {
          await sendUserMessageByChannelType();
          setTextMessage('');
        }
      } catch (e) {
        alert('user message send/update error: ' + e);
      }
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
          ref={inputRef}
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
  messageToUpdate: BaseMessageInstance | null,
  unsetMessageToUpdate: () => void,
  isLoading: boolean,
};

export default ChatInputComponent;