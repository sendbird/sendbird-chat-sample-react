import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import '../styles/MessageList.css';

function MessageList({ sb, channel, messageList }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

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

    return (
      <div key={msg.messageId} className={`message-item ${messageSentByMe ? 'message-from-you' : ''}`}>
        <div className={`message ${messageSentByMe ? 'message-from-you' : ''}`}>
          <div className='message-info'>
            <div className="message-sender-name">{msg.sender?.nickname}</div>
            <div>{new Date(msg.createdAt).toLocaleString()}</div>
          </div>
          {msg.messageType === "file" && (
            <div>
              <div>{msg.name}</div>
              <div>{msg.plainUrl}</div>
            </div>
          )}
          {msg.messageType === "user" && (
            <div>{msg.message}</div>
          )}
        </div>
        {messageSentByMe && (
          <span style={{ marginRight: '8px' }}>
            <FiEdit2 onClick={() => handleUpdateMessage(msg)} style={{ cursor: 'pointer', marginRight: '4px' }} />
            <FiTrash2 onClick={() => handleDeleteMessage(msg)} style={{ cursor: 'pointer' }} />
          </span>
        )}
      </div>
    );
  });

  return (
    <div className='message-list'>
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
