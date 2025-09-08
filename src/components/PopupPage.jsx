import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const PopupPage = ({ imageUrl, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Fade out animation
        const timer = setTimeout(() => {
            setIsVisible(false);
            // After fade out, remove from DOM
            setTimeout(onClose, 500); 
        }, 10000); // Closes after 10 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    // Handle clicking outside the popup
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleOutsideClick}
        >
            <div className="relative p-4 bg-white rounded-lg shadow-xl max-w-lg w-full transform scale-95 transition-transform duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <FaTimes size={20} />
                </button>
                <img src={imageUrl} alt="Pop-up" className="rounded-lg w-full h-auto" />
            </div>
        </div>
    );
};

export default PopupPage;