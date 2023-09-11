import React, {useState} from 'react';
import ConfirmationModal from './ConfirmationModal';
import {FiTrash2} from 'react-icons/fi';

const ChannelItem = ({channel, handleLoadChannel, handleDeleteChannel}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isOperator] = useState(channel.myRole === 'operator');
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteChannel(channel);
    closeModal();
  };

  return (
    <div className='channel-list-item'>
      <div
        className='channel-list-item-name'
        onClick={() => handleLoadChannel(channel)}
      >
        {channel.name}
      </div>
      {isOperator && (<div>
        <FiTrash2 className='control-button' size="1.2em" onClick={openModal}/>
        <ConfirmationModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          onConfirm={handleConfirmDelete}
          title="Delete Channel"
          message="Are you sure you want to delete this channel?"
        />
      </div>)}
    </div>
  );
};

export default ChannelItem;
