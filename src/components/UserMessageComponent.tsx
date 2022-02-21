import moment from "moment";
import { useEffect } from "react";
import {BaseChannel, BaseMessageInstance, UserMessage } from "sendbird";
import { userMessageStyle } from "../styles/styles";

const UserMessageComponent = (props: UserMessageProps) => {
  const {
    channel,
    message,
    deleteMessage,
  } = props;

  return (
    <div className={userMessageStyle}>
      <img src={message.sender ? message.sender.profileUrl : undefined} alt='Profile' />
      <div style={{ display: 'inline-block' }}>
        <div>${message.sender ? message.sender.nickname : null}</div>
        <div>${message.message}</div>
        <div>${moment(message.createdAt).fromNow()}</div>
      </div>
      <button onClick={() => deleteMessage(message)}>x</button>
    </div>
  );
}

type UserMessageProps = {
  channel: BaseChannel,
  message: UserMessage,
  deleteMessage: (message: BaseMessageInstance) => void,
};

export default UserMessageComponent;
