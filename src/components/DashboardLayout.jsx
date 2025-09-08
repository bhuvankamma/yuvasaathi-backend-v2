// src/components/DashboardLayout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Sidebar from './Sidebar';
import Header from './Header';
import PopupPage from './PopupPage';
import Chatbot from './Chatbot';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupImage, setPopupImage] = React.useState('');

    const popupImages = [
        'https://via.placeholder.com/600x400?text=Popup+Image+1',
        'https://via.placeholder.com/600x400?text=Popup+Image+2',
        'https://via.placeholder.com/600x400?text=Popup+Image+3',
    ];

    React.useEffect(() => {
        const randomImage = popupImages[Math.floor(Math.random() * popupImages.length)];
        setPopupImage(randomImage);
        setShowPopup(true);

        const timer = setTimeout(() => setShowPopup(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    // FIX: ADD THE handleLogout FUNCTION HERE
    const handleLogout = () => {
        console.log("User logged out");
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {showPopup && <PopupPage imageUrl={popupImage} onClose={() => setShowPopup(false)} />}
            <Sidebar handleLogout={handleLogout} t={t} />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
              <Chatbot />
        </div>
    );
};

export default DashboardLayout;