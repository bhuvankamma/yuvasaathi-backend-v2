import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome, FaSearch, FaFileAlt, FaBookmark, FaSignOutAlt, FaCog, FaChartBar,
  FaTasks, FaBullhorn, FaBook, FaRobot, FaChevronDown, FaChevronUp,
  FaFileSignature, FaGraduationCap, FaTools
} from 'react-icons/fa';

const Sidebar = ({ handleLogout, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-md focus:outline-none"
      >
        <FaBullhorn size={24} />
      </button>

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white p-4 shadow-lg lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo / Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-300 rounded-full mr-2 animate-pulse" />
            <h1 className="text-xl font-bold animate-pulse-slow">YuvaSaathi</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">

            <li>
              <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                }>
                <FaHome className="mr-3" />
                <span>{t('dashboard')}</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/job-search" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                }>
                <FaSearch className="mr-3" />
                <span>{t('jobSearch')}</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/my-applications" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                }>
                <FaFileAlt className="mr-3" />
                <span>{t('myApplications')}</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/saved-jobs" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                }>
                <FaBookmark className="mr-3" />
                <span>{t('savedJobs')}</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/resume-docs" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                }>
                <FaFileSignature className="mr-3" />
                <span>{t('resumeDocs')}</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/chatbot" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                }>
                <FaRobot className="mr-3" />
                <span>{t('aiChatbot')}</span>
              </NavLink>
            </li>

            {/* More Dropdown */}
            <li>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="w-full text-left flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <FaTools className="mr-3" />
                <span>{t('more')}</span>
                {isMoreOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
              </button>

              <ul className={`ml-8 mt-2 space-y-1 transition-all duration-300 overflow-hidden ${isMoreOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>

                <li>
                  <NavLink to="/dashboard/resume-templates" onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                    }>
                    <FaFileAlt className="mr-2" />
                    <span>{t('resumeTemplates')}</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/recommendations" onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                    }>
                    <FaChartBar className="mr-2" />
                    <span>{t('recommendations')}</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/profile-performance" onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                    }>
                    <FaTasks className="mr-2" />
                    <span>{t('profilePerformance')}</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/mock-tests" onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                    }>
                    <FaBook className="mr-2" />
                    <span>{t('mockTests')}</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/skill-development" onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                    }>
                    <FaGraduationCap className="mr-2" />
                    <span>{t('skillDevelopment')}</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/settings" onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-blue-600' : ''}`
                    }>
                    <FaCog className="mr-2" />
                    <span>{t('settings')}</span>
                  </NavLink>
                </li>

              </ul>
            </li>

            {/* Logout */}
            <li className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center p-3 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3" />
                <span>{t('logout')}</span>
              </button>
            </li>

          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
