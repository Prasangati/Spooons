import React from 'react';
import './StressorsDetected.css';
import api from "../../utils/axiosConfig";
import {useEffect, useState} from "react";
const StressorsDetected = ({ visible, onClose, stressors }) => {
  const [stressors, setStressors] = useState([]);
   if (!visible) return null;

    const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>AI Stressor Detection from Recent Journal Entries</h2>

        {stressors.length === 0 ? (
          <p>No stressors detected from your recent journal entries.</p>
        ) : (
          <div className="stressor-cards">
            {stressors.map((s) => (
              <div key={s.id} className="stressor-card">
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

};

export default StressorsDetected;
