import moment from "moment";
import { useEffect } from "react";
import {BaseChannel, BaseMessageInstance, FileMessage, UserMessage } from "sendbird";
import { fileMessageStyle } from "../styles/styles";

const FileMessageComponent = (props: FileMessageProps) => {
  const {
    channel,
    message,
    deleteMessage,
  } = props;

  return (
    <div className={fileMessageStyle}>
      <img src={message.sender ? message.sender.profileUrl : undefined} alt='Profile' />
      <div style={{ display: 'inline-block' }}>
        <div>${message.sender ? message.sender.nickname : null}</div>
        <div>${message.plainUrl}</div>
        <div>${moment(message.createdAt).fromNow()}</div>
      </div>
      <button onClick={() => deleteMessage(message)}>x</button>
    </div>
  );
}

type FileMessageProps = {
  channel: BaseChannel,
  message: FileMessage,
  deleteMessage: (message: BaseMessageInstance) => void,
};

export default FileMessageComponent;
