import React from 'react';
import { FaFilePdf, FaFileWord, FaUpload } from 'react-icons/fa';

const ResumeDocs = ({ t }) => {
    // This is placeholder data. You will eventually fetch this from your backend.
    const documents = [
        { name: 'My_Resume_2025.pdf', type: 'PDF', dateUploaded: '2025-09-01' },
        { name: 'Cover_Letter_Job_X.docx', type: 'DOCX', dateUploaded: '2025-08-25' },
    ];

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('resumeDocs')}</h1>
            <p className="text-lg mb-4">
                Here you can manage all your important documents, like resumes and cover letters.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Uploaded Documents</h2>
                <ul className="divide-y divide-gray-200">
                    {documents.map((doc, index) => (
                        <li key={index} className="py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                {doc.type === 'PDF' && <FaFilePdf className="text-red-500 text-2xl mr-3" />}
                                {doc.type === 'DOCX' && <FaFileWord className="text-blue-500 text-2xl mr-3" />}
                                <div>
                                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                                    <p className="text-sm text-gray-500">Uploaded on: {doc.dateUploaded}</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors">
                                Download
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors">
                        <FaUpload className="mr-2" />
                        Upload New Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeDocs;