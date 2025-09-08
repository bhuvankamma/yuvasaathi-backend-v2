import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaChartLine, FaRobot, FaSignInAlt } from 'react-icons/fa';

const WelcomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-4 animate-fadeInDown">
                Welcome to YuvaSaathi
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fadeInUp">
                Your one-stop solution for career and government job guidance in Bihar. Empowering youth with the right tools and opportunities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fadeInLeft">
                    <FaLaptopCode className="text-4xl text-blue-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-slate-700">Job Search</h2>
                    <p className="text-gray-500">Find the perfect job that matches your skills and aspirations.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fadeInUp">
                    <FaChartLine className="text-4xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-slate-700">Profile Performance</h2>
                    <p className="text-gray-500">Track your application stats and see how you rank among others.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fadeInRight">
                    <FaRobot className="text-4xl text-purple-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-slate-700">AI Chatbot</h2>
                    <p className="text-gray-500">Get instant answers and career advice from our intelligent chatbot.</p>
                </div>
            </div>

            <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-once"
            >
                <FaSignInAlt className="inline-block mr-3" />
                Get Started
            </Link>
        </div>
    );
};

export default WelcomePage;