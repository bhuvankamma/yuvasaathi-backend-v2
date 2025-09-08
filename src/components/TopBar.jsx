import React from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const TopBar = ({ t }) => {
    const userName = "John Doe"; 

    return (
        <header className="bg-white p-4 md:p-6 shadow-md flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-2xl font-bold text-slate-800">
                {t('dashboard')}
            </h1>

            <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <FaBell size={24} />
                </button>
                
                <div className="flex items-center space-x-2">
                    <FaUserCircle size={32} className="text-blue-500" />
                    <span className="font-semibold text-slate-700 hidden md:block">{userName}</span>
                </div>
            </div>
        </header>
    );
};

export default TopBar;