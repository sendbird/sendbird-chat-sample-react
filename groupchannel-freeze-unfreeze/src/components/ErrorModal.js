import '../styles/ErrorModal.css'

function ErrorModal({ message, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Error</h2>
        <div className="modal-message-container">
          <pre className="modal-message">{message}</pre>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ErrorModal;