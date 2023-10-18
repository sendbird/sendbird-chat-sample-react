import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import {ReactComponent as Edit} from '../assets/sendbird-icon-edit.svg';
import {ReactComponent as Delete} from '../assets/sendbird-icon-delete.svg';
import '../styles/MessageList.css';

function MessageList({ sb, channel, messageList, messageCollection, setMessageList }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const loadPreviousMessage = async () => {
    if (messageCollection.hasPrevious) {
      const prevMessageList = await messageCollection.loadPrevious();
      const newMessageList = prevMessageList.filter(
        (prevMsg) => !messageList.some((currentMsg) => currentMsg.messageId === prevMsg.messageId)
      );
      setMessageList((messageList) => [...newMessageList, ...messageList]);
    }
  };

  const handleUpdateMessage = (message) => {
    setIsUpdate(true);
    setCurrentMsg(message);
    setModalOpen(true);
  };

  const handleDeleteMessage = (message) => {
    setIsUpdate(false);
    setCurrentMsg(message);
    setModalOpen(true);
  };

  const confirmUpdate = async (newMessage) => {
    await channel.updateUserMessage(currentMsg.messageId, { message: newMessage });
    setModalOpen(false);
    currentMsg.message = newMessage;
  };

  const confirmDelete = async () => {
    await channel.deleteMessage(currentMsg);
    setModalOpen(false);
  };

  const renderMessageList = messageList.map((msg) => {
    const messageSentByMe = msg.sender?.userId === sb.currentUser.userId;
    const isAdminMessage = msg.messageType === "admin";

    return (
      <div key={msg.messageId} className={`message-item ${isAdminMessage ? 'message-admin' : messageSentByMe ? 'message-from-you' : ''}`}>
        <div className={`message ${isAdminMessage ? 'message-admin' : messageSentByMe ? 'message-from-you' : ''}`}>
          <div className='message-info'>
            <div className="message-sender-name">{msg.sender?.nickname}</div>
            <div>{new Date(msg.createdAt).toLocaleString()}</div>
          </div>
          {(msg.messageType === "user" || isAdminMessage ) && (
            <div>{msg.message}</div>
          )}
          {msg.messageType === "file" && (
            <div>
              <div>{msg.name}</div>
              <div>{msg.plainUrl}</div>
            </div>
          )}
        </div>
        {messageSentByMe && (
          <span style={{ marginRight: '8px' }}>
            <Edit onClick={() => handleUpdateMessage(msg)} style={{ cursor: 'pointer', marginRight: '4px' }} />
            <Delete onClick={() => handleDeleteMessage(msg)} style={{ cursor: 'pointer' }} />
          </span>
        )}
      </div>
    );
  });

  return (
    <div className='message-list'>
      {messageCollection?.hasPrevious && (
        <div  className='load-previous-btn'>
          <button onClick={loadPreviousMessage}>
            Load Previous
          </button>
        </div>
      )}
      {renderMessageList}
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onRequestClose={() => setModalOpen(false)}
          onConfirm={isUpdate ? confirmUpdate : confirmDelete}
          title={isUpdate ? "Update Message" : "Delete Message"}
          message={isUpdate ? currentMsg?.message : "Are you sure you want to delete this message?"}
          isUpdateMessage={isUpdate}
        />
      )}
    </div>
  );
}

export default MessageList;
