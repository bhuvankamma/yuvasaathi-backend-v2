import React from 'react';
import { FaGraduationCap, FaCode, FaChartBar, FaGlobe } from 'react-icons/fa';

const SkillDevelopment = ({ t }) => {
    const courses = [
        { name: 'Full Stack Web Development', instructor: 'Online Course', icon: FaCode, color: 'text-blue-500' },
        { name: 'Data Analytics with Python', instructor: 'Expert Mentor', icon: FaChartBar, color: 'text-orange-500' },
        { name: 'Digital Marketing Fundamentals', instructor: 'E-Learning Platform', icon: FaGlobe, color: 'text-green-500' },
    ];

    return (
        <div className="bg-gradient-to-br from-blue-500 to-sky-600 min-h-full rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{t('skillDevelopment')}</h1>
            <p className="text-lg mb-4">
                Enhance your resume and career with these skill development resources.
            </p>

            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                                <course.icon className={`text-3xl mr-3 ${course.color}`} />
                                <h3 className="font-semibold text-lg">{course.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{course.instructor}</p>
                            <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors">
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillDevelopment;