import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Globe,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Award,
  LayoutDashboard,
  UserPlus,
  LogIn,
  Sun,
  Moon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo.png";

const Header = () => {
  const { i18n, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t("nav_home"), to: "/", icon: <LayoutDashboard size={18} /> },
    { name: t("nav_jobs"), to: "/jobs", icon: <Briefcase size={18} /> },
    { name: t("nav_skills"), to: "/skills", icon: <GraduationCap size={18} /> },
    { name: t("nav_assessments"), to: "/assessments", icon: <CheckCircle size={18} /> },
    { name: t("nav_about_us"), to: "/about", icon: <Award size={18} /> },
    { name: t("nav_login"), to: "/login", icon: <LogIn size={18} /> },
    { name: t("nav_register"), to: "/register", icon: <UserPlus size={18} /> },
  ];

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-xl sticky top-0 z-50 rounded-b-lg py-4 transition-all duration-500">
      <style>
        {`
          @keyframes slideInFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideInFromLeft 1.5s ease-in-out forwards; }
          .dark { background-color: #1a202c; color: #e2e8f0; }
          .dark .bg-gradient-to-r { background-image: linear-gradient(to right, #1f2937, #111827); }
        `}
      </style>

      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4 animate-slideIn">
          <img
            src={Logo}
            alt="Bihar Government Logo"
            className="h-12 w-12 md:h-16 md:w-16 object-cover"
          />
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-tight text-blue-100 hover:text-white transition-colors"
          >
            {t("header_title")}
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-6 items-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  className="relative group flex items-center space-x-2 text-sm font-medium transition-colors duration-300 text-blue-200 hover:text-white"
                >
                  {link.icon}
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Selector + Dark Mode */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="p-2 pr-8 text-xs font-semibold rounded-full bg-white bg-opacity-20 text-white border border-transparent focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer"
              >
                <option value="en" className="bg-gray-800 text-white">English</option>
                <option value="hi" className="bg-gray-800 text-white">हिन्दी</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                <Globe size={16} />
              </div>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors duration-300 shadow-lg"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full text-white transition-colors duration-300 transform active:scale-95"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            onClick={handleMenuToggle}
            className="text-white focus:outline-none transition-transform duration-300 transform active:scale-95"
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full shadow-lg transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        } ${isDarkMode ? "bg-gray-800" : "bg-blue-900"}`}
      >
        <ul className="flex flex-col p-4 space-y-2 text-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.to}
                className="block py-3 text-lg font-medium text-white hover:bg-blue-800 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center space-x-2">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
              </Link>
            </li>
          ))}

          {/* Mobile Language Selector */}
          <div className="flex justify-center space-x-2 mt-4 pt-4 border-t border-blue-700">
            <div className="relative">
              <select
                value={i18n.language}
                onChange={(e) => {
                  changeLanguage(e.target.value);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 pr-8 text-sm font-semibold rounded-full bg-white bg-opacity-20 text-white border border-transparent focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer"
              >
                <option value="en" className="bg-gray-800 text-white">English</option>
                <option value="hi" className="bg-gray-800 text-white">हिन्दी</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                <Globe size={16} />
              </div>
            </div>
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Header;