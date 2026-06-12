import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Modal.css';

const Modal = ({ isOpen, onClose, onSelectOption }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!isOpen) return null;

  const handleClose = () => {
    navigate('/'); // Redirect to home page
    onClose(); // Optionally call onClose if needed for other actions
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Choose an Option</h2>
        <button className="modal-button" onClick={() => onSelectOption('register')}>Register</button>
        <button className="modal-button" onClick={() => onSelectOption('login')}>Login</button>
        <button className="modal-close" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
