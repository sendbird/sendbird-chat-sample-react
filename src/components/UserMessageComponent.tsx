import {useEffect, useState} from "react";
import {BaseChannel, UserMessage } from "sendbird";
import {
  messageContentStyle,
  messageNickNameStyle,
  messageRootStyle,
  messageSentTimeStyle,
  messageUnreadCountStyle
} from "../styles/styles";
import {getCreatedAtFromNow} from '../utils/messageUtils';
import {getReadReceipt} from '../sendbird-actions/channel-actions/GroupChannelActions';

const UserMessageComponent = (props: UserMessageProps) => {
  const {
    channel,
    message,
    deleteMessage,
  } = props;

  const [hoveringText, setHoveringText] = useState(getCreatedAtFromNow(message.createdAt));
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (channel.isGroupChannel()) {
      setUnreadCount(getReadReceipt(channel, message));
    }
  }, []);

  const onHoverIn = () => {
    setHoveringText('DELETE');
  }

  const onHoverOut = () => {
    setHoveringText(getCreatedAtFromNow(message.createdAt));
  }

  return (
    <div
      className={messageRootStyle}
      id={message.messageId ? message.messageId.toString() : message.reqId}
    >
      <div className={messageNickNameStyle}>
        {message.sender ? message.sender.nickname : null}
      </div>
      <div className={messageContentStyle}>
        :&nbsp;{message.message}
      </div>
      <div
        className={messageSentTimeStyle}
        onMouseEnter={onHoverIn.bind(this)}
        onMouseLeave={onHoverOut.bind(this)}
        onClick={() => deleteMessage(message)}
      >
        {hoveringText}
      </div>
      <div
        className={messageUnreadCountStyle}
        style={unreadCount > 0 ? { display: 'none' } : {}}
      >
        {unreadCount}
      </div>
    </div>
  );
}

type UserMessageProps = {
  channel: BaseChannel,
  message: UserMessage,
  deleteMessage: (message: UserMessage) => void,
};

export default UserMessageComponent;
