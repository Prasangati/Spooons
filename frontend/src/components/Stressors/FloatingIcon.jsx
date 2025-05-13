import React from 'react';
import { Lightbulb } from 'lucide-react';
import './FloatingIcon.css';

const FloatingIcon = ({ hasNew = false, onClick }) => {
  return (
    <button
      className={`floating-icon ${hasNew ? 'pulse' : ''}`}
      onClick={onClick}
      title="View suggested stressors"
    >
      <Lightbulb color="#ffffff" size={60} />
    </button>
  );
};

export default FloatingIcon;
