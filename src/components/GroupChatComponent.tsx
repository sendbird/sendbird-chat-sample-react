import { GroupChannel } from "sendbird";
import {chatStyle} from '../styles/styles';
import ChatBodyComponent from './ChatBodyComponent';
import ChatInputComponent from './ChatInputComponent';

const GroupChatComponent = (props: GroupChatProps) => {
  const {
    groupChannel,
  } = props;

  return (
    <div className={chatStyle}>
      <ChatBodyComponent channel={groupChannel}/>
      <ChatInputComponent channel={groupChannel}/>
    </div>
  );
}

type GroupChatProps = {
  groupChannel: GroupChannel,
};

export default GroupChatComponent;