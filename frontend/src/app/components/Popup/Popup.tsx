// Popup.tsx
import React from 'react';
import './Popup.css';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>X</button>
        <div className="popup-text">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
