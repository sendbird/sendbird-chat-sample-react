import { GroupChannel } from "sendbird";
import {chatStyle} from '../styles/styles';
import ChatInputComponent from './ChatInputComponent';
import GroupChatBodyComponent from './GroupChatBodyComponent';

const GroupChatComponent = (props: GroupChatProps) => {
  const {
    groupChannel,
  } = props;

  console.log('## current groupChannel: ', groupChannel);

  return (
    <div className={chatStyle}>
      <GroupChatBodyComponent channel={groupChannel}/>
      <ChatInputComponent channel={groupChannel}/>
    </div>
  );
}

type GroupChatProps = {
  groupChannel: GroupChannel,
};

export default GroupChatComponent;