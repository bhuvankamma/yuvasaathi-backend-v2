import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Home, UserRound, Briefcase, GraduationCap, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 py-10 md:py-16 mt-12 rounded-t-2xl shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 border-b border-gray-700 pb-8">
          
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-semibold text-teal-400 mb-4 transform transition-transform duration-300 hover:scale-105">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <Home size={20} className="text-indigo-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <UserRound size={20} className="text-green-400" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <Mail size={20} className="text-red-400" />
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <Link to="/jobs" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <Briefcase size={20} className="text-blue-400" />
                  <span>Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/skills" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <GraduationCap size={20} className="text-purple-400" />
                  <span>Skills</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Government Portals */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-semibold text-teal-400 mb-4 transform transition-transform duration-300 hover:scale-105">
              Govt. Portals
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.digitalindia.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <ExternalLink size={20} className="text-green-400" />
                  <span>Digital India</span>
                </a>
              </li>
              <li>
                <a href="https://www.skillindia.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <ExternalLink size={20} className="text-indigo-400" />
                  <span>Skill India</span>
                </a>
              </li>
              <li>
                <a href="https://www.ncs.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <ExternalLink size={20} className="text-cyan-400" />
                  <span>National Career Service</span>
                </a>
              </li>
              <li>
                <a href="https://labour.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300">
                  <ExternalLink size={20} className="text-rose-400" />
                  <span>Ministry of Labour & Employment</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-semibold text-teal-400 mb-4 transform transition-transform duration-300 hover:scale-105">
              Contact Info
            </h3>
            <address className="not-italic space-y-3">
              <p className="flex items-center space-x-2 justify-center md:justify-start">
                <MapPin size={20} className="text-yellow-300" />
                <span>Patna, Bihar, India</span>
              </p>
              <p className="flex items-center space-x-2 justify-center md:justify-start">
                <Mail size={20} className="text-yellow-300" />
                <a href="mailto:contact@yuvasaathi.bih.nic.in" className="hover:text-yellow-300 transition-colors duration-300">
                  contact@yuvasaathi.bih.nic.in
                </a>
              </p>
              <p className="flex items-center space-x-2 justify-center md:justify-start">
                <Phone size={20} className="text-yellow-300" />
                <a href="tel:+911234567890" className="hover:text-yellow-300 transition-colors duration-300">
                  +91 12345 67890
                </a>
              </p>
            </address>
          </div>

          {/* Map */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-semibold text-teal-400 mb-4 transform transition-transform duration-300 hover:scale-105">
              Our Location
            </h3>
            <div className="w-full h-40 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.86807897126!2d85.0601614741427!3d25.6119857945037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f29937c52d80d1%3A0x7c83a73c0be16298!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Patna, Bihar Map"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Yuva Saathi, Bihar Government. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
