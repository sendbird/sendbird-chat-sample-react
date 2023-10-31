import React, { useState } from 'react';
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

const ChannelFilterConfirmationModal = ({ isOpen, onRequestClose, onConfirm, title }) => {
  const [selectedValue, setSelectedValue] = useState("UNHIDDEN");

  const handleConfirm = () => {
    onConfirm(selectedValue);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
      style={customStyles}
    >
      <h2>{title}</h2>
      <div style={{ flexDirection: 'column' }}>
        {["UNHIDDEN", "ARCHIVED", "HIDDEN"].map(value => (
          <label key={value} style={{ display: 'block', marginBottom: '10px' }}>
            <input
              type="radio"
              name="filterValue"
              value={value}
              checked={selectedValue === value}
              onChange={() => setSelectedValue(value)}
            />
            {value}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={handleConfirm} style={{ marginRight: '10px' }}>Yes</button>
        <button onClick={onRequestClose}>No</button>
      </div>
    </Modal>
  );
}

export default ChannelFilterConfirmationModal;
