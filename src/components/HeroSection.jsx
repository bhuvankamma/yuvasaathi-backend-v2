import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import mini from '../assets/mini.webp'; 
import pm from '../assets/Pm.jpg';
import db from '../assets/db.jpeg'
import cool from '../assets/cool.jpg';
import ub from '../assets/ub.jpg';
import mms from '../assets/mms.jpeg'; 
import cmm from '../assets/cmm.jpg'; 
import mmm from '../assets/mmm.jpeg'; 
import Media from '../assets/Media.jpeg';

const carouselImages = [mini, pm, db, cool, ub];
const cmImages = [cmm,mms,mmm,Media]; 

const content = [
  {
    headingKey: 'Empowerment Of Bihar',
    subheadingKey: 'Supporting for enhancing skills and creating a skilled workforce',
  },
  {
    headingKey: ' A New Era of Opportunity',
    subheadingKey: 'The Bihar government is bridging the skills gap with targeted training programs',
  },
  {
    headingKey: 'Investing in Our Youth',
    subheadingKey: 'Highlighting the impact of skill development on employment and economic growth',
  },
  {
    headingKey: ' From Classroom to Career',
    subheadingKey: 'Transforming lives with practical, job-oriented skill development initiatives',
  },
  {
    headingKey: ' Driving Innovation',
    subheadingKey: 'Fostering a culture of innovation and entrepreneurship for a brighter future',
  },
];

const HeroSection = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // New state for the CM image popup and its animation
  const [showCmModal, setShowCmModal] = useState(true);
  const [currentCmImage, setCurrentCmImage] = useState(null);
  const [animateOut, setAnimateOut] = useState(false);

  // Effect to select a random CM image and set up auto-close on mount
  useEffect(() => {
    // Select a random image from the cmImages array
    const randomIndex = Math.floor(Math.random() * cmImages.length);
    setCurrentCmImage(cmImages[randomIndex]);

    // Set a timer to automatically close the modal after 10 seconds
    const timer = setTimeout(() => {
      handleCloseCmModal();
    }, 10000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  // Effect for the main carousel
  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, carouselImages.length]);
  
  // Function to handle dot clicks for the carousel
  const goToSlide = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex(index);
  };

  // Function to handle modal closing with animation
  const handleCloseCmModal = () => {
    setAnimateOut(true); // Trigger the fade-out animation
    setTimeout(() => {
      setShowCmModal(false); // Unmount the component after the animation
    }, 500); // Duration of the animation
  };

  return (
    <section className="relative h-[calc(100vh-200px)] md:h-[calc(100vh-160px)] overflow-hidden rounded-b-2xl shadow-xl">
      {/* CM Image Modal */}
      {showCmModal && currentCmImage && (
        <div 
          className={`absolute inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-1000 ease-in-out ${
            animateOut ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleCloseCmModal} // Click-to-close on the overlay
        >
          {/* Prevent clicks on the image itself from closing the modal */}
          <div 
            className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:max-w-4xl lg:max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={currentCmImage} alt="Bihar CM" className="w-full object-cover" />
          </div>
        </div>
      )}

      {/* Main Carousel container */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        aria-live="polite"
      >
        {carouselImages.map((src, idx) => (
          <div
            key={idx}
            className="w-full h-full bg-center bg-cover flex-shrink-0"
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={currentIndex !== idx}
          />
        ))}
      </div>

      {/* Overlay for darkening */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-indigo-950 opacity-70 pointer-events-none"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        <h1
          key={currentIndex}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 opacity-0 animate-slideDownFadeIn"
        >
          {t(content[currentIndex].headingKey)}
        </h1>
        <p
          key={`sub-${currentIndex}`}
          className="text-md sm:text-lg md:text-xl max-w-3xl mb-8 opacity-0 animate-slideDownFadeIn delay-200"
        >
          {t(content[currentIndex].subheadingKey)}
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a
            href="/jobs"
            className="inline-flex items-center justify-center px-6 py-2 text-base sm:text-lg font-bold text-blue-900 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50"
          >
            {t('hero_searchJobs')}
          </a>
          <a
            href="/register"
            className="inline-flex items-center justify-center px-6 py-2 text-base sm:text-lg font-bold text-white border-2 border-white rounded-full shadow-lg hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          >
            {t('hero_getStarted')}
          </a>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ease-in-out ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideDownFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDownFadeIn {
          animation: slideDownFadeIn 1s ease forwards;
        }
        .animate-slideDownFadeIn.delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;