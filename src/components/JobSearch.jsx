import React from 'react';

const JobSearch = ({ t }) => {
    return (
        <div className="bg-gradient-to-r from-blue-400 to-indigo-600 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('jobSearch')}</h1>
            <p className="text-lg mb-4">
                Here you can search for the latest jobs in Bihar and across India. Use the powerful filters below to narrow down your search.
            </p>
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Job Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" placeholder="Job Title, Keyword..." className="p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                    <input type="text" placeholder="Location" className="p-3 rounded-md border border-gray-300" />
                    <select className="p-3 rounded-md border border-gray-300">
                        <option>Select Industry</option>
                    </select>
                </div>
                <button className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    Search Jobs
                </button>
            </div>
        </div>
    );
};

export default JobSearch;