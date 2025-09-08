import React from 'react';
import { FaBookmark, FaTrashAlt } from 'react-icons/fa';

const SavedJobs = ({ t }) => {
    const savedJobs = [
        { title: 'Government Data Entry Operator', company: 'Bihar Rural Development', location: 'Gaya, Bihar', dateSaved: '2025-08-30' },
        { title: 'Junior Engineer (Civil)', company: 'Public Works Department', location: 'Patna, Bihar', dateSaved: '2025-08-25' },
        { title: 'Bank Probationary Officer', company: 'State Bank of India', location: 'Muzaffarpur, Bihar', dateSaved: '2025-08-22' },
    ];

    return (
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('savedJobs')}</h1>
            <p className="text-lg mb-4">
                Here are the jobs you've saved. You can apply for them later or remove them from your list.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                    {savedJobs.map((job, index) => (
                        <li key={index} className="py-4 flex items-center justify-between">
                            <div className="flex items-start">
                                <FaBookmark className="text-purple-500 text-2xl mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                                    <p className="text-xs text-gray-400">Saved on: {job.dateSaved}</p>
                                </div>
                            </div>
                            <button className="text-red-500 hover:text-red-700 transition-colors">
                                <FaTrashAlt />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SavedJobs;