import React from 'react';

const ResumeTemplates = ({ t }) => {
    return (
        <div className="bg-gradient-to-tr from-purple-400 to-pink-500 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('resumeTemplates')}</h1>
            <p className="text-lg mb-4">
                Choose from a variety of professional and modern resume templates to make your profile stand out.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                    <img src="https://via.placeholder.com/300x400?text=Modern+Template" alt="Modern Resume Template" className="rounded-md" />
                    <h3 className="text-gray-800 font-semibold mt-2">Modern</h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                    <img src="https://via.placeholder.com/300x400?text=Classic+Template" alt="Classic Resume Template" className="rounded-md" />
                    <h3 className="text-gray-800 font-semibold mt-2">Classic</h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                    <img src="https://via.placeholder.com/300x400?text=Creative+Template" alt="Creative Resume Template" className="rounded-md" />
                    <h3 className="text-gray-800 font-semibold mt-2">Creative</h3>
                </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-white text-purple-600 font-semibold rounded-md hover:bg-gray-200 transition-colors">
                Explore All Templates
            </button>
        </div>
    );
};

export default ResumeTemplates;