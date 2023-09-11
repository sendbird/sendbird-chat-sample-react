import React, { useRef } from 'react';
import Modal from 'react-modal';

function CreateChannelModal({ isOpen, handleCloseModal, handleCreateChannel }) {
  const channelNameRef = useRef("");

  const handleCreateButtonClick = () => {
    const channelName = channelNameRef.current.value;
    handleCreateChannel(channelName);
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Create Channel"
      style={styles.modal}
    >
      <h2>Create Channel</h2>
      <label htmlFor='channelName'>Channel Name</label>
      <input
        id='channelName'
        ref={channelNameRef}
        type="text"
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={handleCreateButtonClick} style={styles.button}>Create</button>
        <button onClick={handleCloseModal} style={styles.button}>Cancel</button>
      </div>
    </Modal>
  );
}

const styles = {
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
      color: 'lightsteelblue',
      width: '500px',
      height: 'auto',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
    }
  },
  input: {
    width: '50%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
    marginLeft: '10px',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    padding: '10px 20px',
    cursor: 'pointer'
  }
};

export default CreateChannelModal;
