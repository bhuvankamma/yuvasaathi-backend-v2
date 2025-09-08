import React from 'react';
import { Link } from 'react-router-dom';

import Announcements from './Announcements';
import HeroSection from './HeroSection';
import ImageCarousel from './ImageCarousel';
import DataVisualization from './DataVisualization';
import BenefitsPrograms from './BenefitsPrograms';
import MediaGallary from './MediaGallary';
import SchemeSection from './SchemeSection';
import ChatBot from './Chatbot';
import ResumeBuilder from './ResumeBuilder';

const LandingPage = () => {
  return (
    <div>
      
      <Announcements />
       <HeroSection/>
      <ImageCarousel />
      <DataVisualization/>
      <BenefitsPrograms/>
      <MediaGallary/>
      <SchemeSection/>
      <ChatBot/>
      <ResumeBuilder/>
      
      
      
     

      </div>
      
      
  );
};

export default LandingPage;