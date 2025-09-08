import React from 'react';
import { FaUserEdit, FaLock, FaBell } from 'react-icons/fa';

const Settings = ({ t }) => {
    return (
        <div className="bg-gradient-to-br from-gray-700 to-slate-900 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('settings')}</h1>
            <p className="text-lg mb-4">
                Manage your profile, security, and preferences.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                    <FaUserEdit className="text-3xl text-blue-500 mr-4" />
                    <div>
                        <h2 className="font-semibold text-lg">Edit Profile Information</h2>
                        <p className="text-sm text-gray-500">Update your name, contact details, and other personal information.</p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                    <FaLock className="text-3xl text-red-500 mr-4" />
                    <div>
                        <h2 className="font-semibold text-lg">Change Password</h2>
                        <p className="text-sm text-gray-500">Secure your account by changing your password periodically.</p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                    <FaBell className="text-3xl text-yellow-500 mr-4" />
                    <div>
                        <h2 className="font-semibold text-lg">Notification Preferences</h2>
                        <p className="text-sm text-gray-500">Choose which alerts you want to receive via email or SMS.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;