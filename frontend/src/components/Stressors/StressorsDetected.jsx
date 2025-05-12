import React from 'react';
import './StressorsDetected.css';

const StressorsDetected = ({ visible, onClose }) => {
  if (!visible) return null;

  const handleBackdropClick = (e) => {
    // Prevent closing when clicking inside the modal box
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>Detected Stressors</h2>
        <p>No stressors detected from your recent journal entries.</p>
      </div>
    </div>
  );
};

export default StressorsDetected;
