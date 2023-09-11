import React, {useState} from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '20%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const ConfirmationModal = ({isOpen, onRequestClose, onConfirm, title, message, isUpdateMessage = false}) => {
  const [updatedMessage, setUpdatedMessage] = useState(message);

  const handleConfirm = () => {
    if (isUpdateMessage) {
      onConfirm(updatedMessage);
    } else {
      onConfirm();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
      style={customStyles}
    >
      <h2>{title}</h2>
      {isUpdateMessage ? (
        <input
          type="text"
          value={updatedMessage}
          onChange={e => setUpdatedMessage(e.target.value)}
          style={{width: '100%', padding: '5px', height: '30px'}}
        />
      ) : (
        <p>{message}</p>
      )}
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
        <button onClick={handleConfirm} style={{marginRight: '10px'}}>Yes</button>
        <button onClick={onRequestClose}>No</button>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
