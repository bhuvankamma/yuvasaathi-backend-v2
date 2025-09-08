import React from 'react';

const MyApplications = ({ t }) => {
    return (
        <div className="bg-gradient-to-br from-green-400 to-cyan-500 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('myApplications')}</h1>
            <p className="text-lg mb-4">
                Track the status of your job applications. See which ones are pending, reviewed, or rejected.
            </p>
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                    <li className="py-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Web Developer Intern</h3>
                            <p className="text-sm text-gray-500">Applied on 12/03/2025</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold">Pending</span>
                    </li>
                    <li className="py-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Data Analyst</h3>
                            <p className="text-sm text-gray-500">Applied on 10/02/2025</p>
                        </div>
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">Reviewed</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MyApplications;