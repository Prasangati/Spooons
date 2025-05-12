import React from 'react';
import { Lightbulb } from 'lucide-react';
import './FloatingIcon.css';

const FloatingIcon = () => {
  const hasNew = false; // force pulse on for testing

  return (
    <button
      className={`floating-icon ${hasNew ? 'pulse' : ''}`}
      onClick={() => alert("Clicked!")}
      title="View suggested stressors"
    >
      <Lightbulb color="#ffffff" size={60} />
    </button>
  );
};

export default FloatingIcon;
