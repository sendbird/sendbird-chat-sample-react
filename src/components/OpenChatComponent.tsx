import { useEffect, useState } from "react";
import {BaseMessageInstance, OpenChannel, SendBirdError } from "sendbird";
import { getMessagesByTimestamp } from "../sendbird-actions/message-actions/MessagesActions";
import { chatStyle } from "../styles/styles";

const OpenChatComponent = (props: OpenChatProps) => {
  const {
    openChannel,
  } = props;
  
  return (
    <div className={chatStyle}>
    </div>
  );
}

type OpenChatProps = {
  openChannel: OpenChannel,
};

export default OpenChatComponent;