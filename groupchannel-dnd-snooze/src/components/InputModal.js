import React, { useState } from 'react';

function InputModal({ isOpen, title, selectedItem, onRequestClose, onConfirm }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    width: '80%',
    maxWidth: '400px',
  };

  const inputStyles = {
    width: '100px',
  };

  const handleSubmit = () => {
    let currentTime = new Date();
    let startHour = parseInt(startTime.split(':')[0], 10);
    let startMin = parseInt(startTime.split(':')[1], 10);
    let endHour = parseInt(endTime.split(':')[0], 10);
    let endMin = parseInt(endTime.split(':')[1], 10);
    let startTimestamp = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), startHour, startMin).getTime();
    let endTimestamp = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), endHour, endMin).getTime();
    onConfirm(startTimestamp, endTimestamp);
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <h2>{title}</h2>
        <div>
          <label>Start Time: </label>
          <input style={inputStyles} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div>
          <label>End Time: </label>
          <input style={inputStyles} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>
        <button onClick={handleSubmit}>Confirm</button>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </div>
  );
}

export default InputModal;
