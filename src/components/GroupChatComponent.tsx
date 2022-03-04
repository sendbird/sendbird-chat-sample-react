import { GroupChannel } from "sendbird";
import {chatStyle} from '../styles/styles';
import ChatInputComponent from './ChatInputComponent';
import GroupChatBodyComponent from './GroupChatBodyComponent';
import {useEffect} from 'react';

const GroupChatComponent = (props: GroupChatProps) => {
  const {
    groupChannel,
  } = props;

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