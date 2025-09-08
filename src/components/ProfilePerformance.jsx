import React from 'react';
import { FaChartLine, FaEye, FaThumbsUp } from 'react-icons/fa';

const ProfilePerformance = ({ t }) => {
    return (
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('profilePerformance')}</h1>
            <p className="text-lg mb-4">
                Track your profile's performance and see key metrics.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                    <FaEye className="text-4xl text-orange-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Profile Views</p>
                        <p className="text-2xl font-bold">1,254</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                    <FaThumbsUp className="text-4xl text-green-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Recruiter Endorsements</p>
                        <p className="text-2xl font-bold">87</p>
                    </div>
                </div>
                <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                    <FaChartLine className="text-4xl text-blue-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-500">Profile Strength</p>
                        <p className="text-2xl font-bold">85%</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tips to Improve</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Add a professional profile picture.</li>
                    <li>Update your work experience with recent projects.</li>
                    <li>Add 3-5 key skills to your profile.</li>
                </ul>
            </div>
        </div>
    );
};

export default ProfilePerformance;