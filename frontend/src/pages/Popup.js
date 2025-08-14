// Popup.js
import React from 'react';
import "../index.css";

const Popup = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                {/* <button className="close-button" onClick={onClose}>X</button> */}
                {children}
            </div>
        </div>
    );
};

export default Popup;