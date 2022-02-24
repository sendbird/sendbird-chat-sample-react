import {BaseChannel, FileMessage} from "sendbird";
import {
  imageStyle,
  messageButtonStyle,
  messageContentStyle,
  messageNickNameStyle,
  messageRootStyle,
  messageSentTimeStyle, messageUnreadCountStyle
} from "../styles/styles";
import {useEffect, useState} from 'react';
import {getReadReceipt} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {getCreatedAtFromNow, protectFromXSS} from '../utils/messageUtils';

const FileMessageComponent = (props: FileMessageProps) => {
  const {
    channel,
    message,
    deleteMessage,
  } = props;

  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (channel.isGroupChannel()) {
      setUnreadCount(getReadReceipt(channel, message));
    }
  }, []);

  const openLink = (messageUrl: string) => {
    window.open(messageUrl);
  }

  return (
    <div
      className={messageRootStyle}
      id={message.messageId ? message.messageId.toString() : message.reqId}
    >
      {
        message.sender
          ? <div className={messageNickNameStyle}>
            {message.sender ? message.sender.nickname : null}:&nbsp;
          </div>
          : null
      }
      <div
        className={messageContentStyle}
      >
        <a href={message.url}>
          {message.url}
          <img
            className={imageStyle}
            src={protectFromXSS(message.url)}
          />
        </a>
      </div>
      <div className={messageSentTimeStyle}>
        {getCreatedAtFromNow(message.createdAt)}
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

type FileMessageProps = {
  channel: BaseChannel,
  message: FileMessage,
  deleteMessage: (message: FileMessage) => void,
};

export default FileMessageComponent;
