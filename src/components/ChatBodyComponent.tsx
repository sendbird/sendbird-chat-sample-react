import { useEffect, useState } from "react";
import {
  BaseChannel,
  BaseMessageInstance,
  OpenChannel,
  SendBirdError,
  UserMessage,
} from "sendbird";
import { getMessagesByTimestamp } from "../sendbird-actions/message-actions/MessagesActions";
import { chatBodyStyle } from "../styles/styles";
import FileMessageComponent from "./FileMessageComponent";
import UserMessageComponent from "./UserMessageComponent";

const ChatBodyComponent = (props: ChatBodyProps) => {
  const {
    channel,
  } = props;

  const [loading, setLoading] = useState(true);
  const [messageList, setMessageList] = useState<BaseMessageInstance[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    getMessagesByTimestamp(channel)
      .then((messages: BaseMessageInstance[]) => setMessageList(messages))
      .catch((error: SendBirdError) => alert('OpenChat getMessagesByTimestamp error: ' + error))
      .finally(() => setLoading(false));
  }, []);
  
  const deleteMessage = (message: BaseMessageInstance) => {
    let index = -1;
    for (let i = 0; i < messageList.length; i++) {
      if (messageList[i].messageId === message.messageId) index = i;
    }
    if (index >= 0) setMessageList(messageList.splice(index, 1));
  }

  const loadMore = () => {
    setLoading(true);
    getMessagesByTimestamp(channel, messageList[0].createdAt)
      .then((messages: BaseMessageInstance[]) => setMessageList(messages.concat(messageList)))
      .catch((error: SendBirdError) => alert('OpenChat getMessagesByTimestamp error: ' + error))
      .finally(() => setLoading(false));
  }

  return (
    <div className={chatBodyStyle}>
      {
        messageList.map((message: BaseMessageInstance, i: number) => {
          return message.isFileMessage() 
            ? <FileMessageComponent
              channel={channel}
              message={message}
              deleteMessage={deleteMessage}
              key={i}
            />
            : <UserMessageComponent
              channel={channel}
              message={message as UserMessage}
              deleteMessage={deleteMessage}
              key={i}
            />
        })
      }
    </div>
  );
}

type ChatBodyProps = {
  channel: BaseChannel,
};

export default ChatBodyComponent;