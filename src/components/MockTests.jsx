import React from 'react';
import { FaPlayCircle, FaBookOpen } from 'react-icons/fa';

const MockTests = ({ t }) => {
    const tests = [
        { name: 'Bihar Police Constable Exam', questions: 100, duration: '2 hours' },
        { name: 'SSC CGL Tier 1', questions: 200, duration: '2 hours' },
        { name: 'Railway Group D Test', questions: 100, duration: '90 mins' },
    ];

    return (
        <div className="bg-gradient-to-br from-red-500 to-pink-600 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('mockTests')}</h1>
            <p className="text-lg mb-4">
                Prepare for government and public sector exams with our full-length mock tests.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Available Mock Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-lg">{test.name}</h3>
                            <p className="text-sm text-gray-500">
                                {test.questions} Questions | {test.duration}
                            </p>
                            <button className="mt-4 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors">
                                <FaPlayCircle className="inline-block mr-2" />
                                Start Test
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MockTests;