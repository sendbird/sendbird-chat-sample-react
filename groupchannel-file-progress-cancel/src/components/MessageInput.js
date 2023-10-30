import {useState} from "react";
import {ReactComponent as Attach} from '../assets/sendbird-icon-attach.svg';
import '../styles/MessageInput.css';

function MessageInput({sb, channel, messageList, setMessageList}) {
  const [textMessage, setTextMessage] = useState('');
  const [sendFileMessage, setSendFileMessage] = useState(null);

  async function handleCancel() {
    const isCanceled = await channel.cancelUploadingFileMessage(sendFileMessage.reqId)
    if (isCanceled) {
      console.log("canceled");
    } else {
      console.log("File already sent");
    }
    setSendFileMessage(null);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessage(textMessage);
      e.preventDefault();
    }
  }

  const onFileInputChange = async (e) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const fileMessageParams = {};
      fileMessageParams.file = e.currentTarget.files[0];
      channel.sendFileMessage(fileMessageParams)
        .onPending((message) => {
          console.log("pending: ", message);
          setSendFileMessage(message);
        })
        .onSucceeded((message) => {
          setMessageList([...messageList, message]);
          setSendFileMessage(null);
        })
        .onFailed((error) => {
          console.log(error)
          console.log("failed")
        });
    }
    e.currentTarget.value = null;
  }

  function sendMessage(messageText) {
    const UserMessageCreateParams = {};
    UserMessageCreateParams.message = messageText;
    UserMessageCreateParams.sender = {nickname: sb.currentUser.nickname, userId: sb.currentUser.userId};
    if (channel) {
      setTextMessage('');  // Reset the input state after sending the message
      channel.sendUserMessage(UserMessageCreateParams)
        .onPending((message) => {
          console.log("pending: ", message);
        })
        .onFailed((error) => {
          console.log("error: ", error);
        })
        .onSucceeded((message) => {
          setMessageList([...messageList, message]);
        });
    } else {
      console.log("no channel");
      return null;
    }
  }

  return (
    <div className="message-input">
      <Attach
        htmlFor="upload"
        style={{width: "2em", height: "2em", paddingRight: "5px"}}
        onClick={() => document.getElementById('upload').click()}
      />
      <input
        id="upload"
        className="file-upload-button"
        type='file'
        hidden={true}
        onChange={onFileInputChange}
      />
      <input
        id='textMessage'
        type="text"
        value={textMessage}
        onChange={e => setTextMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {sendFileMessage && <div className="message-pending">File Sending...<button onClick={handleCancel}>Cancel</button></div>}
    </div>
  );
}

export default MessageInput;