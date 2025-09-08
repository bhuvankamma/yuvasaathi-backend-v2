import React from 'react';
import { FaStar, FaBriefcase } from 'react-icons/fa';

const Recommendations = ({ t }) => {
    const recommendedJobs = [
        { title: 'UX Designer', company: 'Tech Solutions Inc.', location: 'Patna, Bihar', match: '95%' },
        { title: 'Project Manager', company: 'Global Innovators', location: 'New Delhi', match: '88%' },
        { title: 'Marketing Specialist', company: 'Creative Hub', location: 'Remote', match: '82%' },
    ];

    return (
        <div className="bg-gradient-to-br from-green-500 to-teal-600 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('recommendations')}</h1>
            <p className="text-lg mb-4">
                Based on your profile, here are some recommended jobs and skills.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Top Job Recommendations</h2>
                <ul className="divide-y divide-gray-200">
                    {recommendedJobs.map((job, index) => (
                        <li key={index} className="py-4 flex items-center justify-between">
                            <div className="flex items-start">
                                <FaBriefcase className="text-green-500 text-2xl mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-green-600">{job.match} Match</span>
                                <button className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                                    Apply
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Recommendations;