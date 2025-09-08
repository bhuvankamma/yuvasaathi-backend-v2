// src/components/Modal.jsx
import React from 'react';

const Modal = ({ title, description, isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full transform scale-100 opacity-100 transition-transform duration-300 ease-out">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">{description}</p>
        <div className="flex justify-center">
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;