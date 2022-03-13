import {useEffect, useState} from "react";
import {BaseChannel, BaseMessageInstance, UserMessage} from "sendbird";
import {
  messageButtonStyle,
  messageContentStyle,
  messageNickNameStyle,
  messageRootStyle,
  messageSentTimeStyle,
  messageUnreadCountStyle
} from "../styles/styles";
import {getReadReceipt} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {timestampToTime} from '../utils/messageUtils';

const UserMessageComponent = (props: UserMessageProps) => {
  const {
    channel,
    message,
    deleteMessage,
    setMessageToUpdate,
  } = props;

  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (channel.isGroupChannel()) {
      setUnreadCount(getReadReceipt(channel, message));
    }
  }, []);

  return (
    <div
      className={messageRootStyle}
      id={message.messageId ? message.messageId.toString() : message.reqId}
      style={ message.sendingStatus === 'pending' ? { backgroundColor: 'hsla(0, 100%, 50%, 0.3)' } : {}}
    >
      {
        message.sender
          ? <div className={messageNickNameStyle}>
            {message.sender ? message.sender.nickname : null}:&nbsp;
          </div>
          : null
      }
      <div className={messageContentStyle}>
        {message.message}
      </div>
      <div className={messageSentTimeStyle}>
        {timestampToTime(message.createdAt)}
      </div>
      <div
        className={messageUnreadCountStyle}
        style={unreadCount === 0 ? { display: 'none' } : {}}
      >
        {unreadCount}
      </div>
      {
        message.sender
          ? <div>
            <div
              className={messageButtonStyle}
              style={{ color: 'green' }}
              onClick={() => setMessageToUpdate(message)}
            >
              UPDATE
            </div>
            <div
              className={messageButtonStyle}
              style={{ color: 'red' }}
              onClick={() => deleteMessage(message)}
            >
              DELETE
            </div>
          </div>
          : null
      }
    </div>
  );
}

type UserMessageProps = {
  channel: BaseChannel,
  message: UserMessage,
  deleteMessage: (message: UserMessage) => void,
  setMessageToUpdate: (message: BaseMessageInstance) => void,
};

export default UserMessageComponent;
