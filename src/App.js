import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import JobsSection from './components/JobsSection';
import SkillsSection from './components/SkillsSection';
import AssessmentsSection from './components/AssessmentsSection';
import AboutUs from './components/AboutUs';
import BenefitsPrograms from './components/BenefitsPrograms';
import DataVisualization from './components/DataVisualization';
import ImageCarousel from './components/ImageCarousel';
import HeroSection from './components/HeroSection';
import MediaGallary from './components/MediaGallary';
import SchemeSection from './components/SchemeSection';
import ChatBot from './components/Chatbot';
import ResumeBuilder from './components/ResumeBuilder';
import UserDashboardpage from './components/UserDashboardPage';

import './App.css';


const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="jobs" element={<JobsSection />} />
            <Route path="skills" element={<SkillsSection />} />
            <Route path="assessments" element={<AssessmentsSection />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="Header" element={<Header />} />
            <Route path="HeroSection" element={<HeroSection />} />
            <Route path="datavisualization" element={<DataVisualization />} />
            <Route path="imagecarousel" element={<ImageCarousel />} />
            <Route path="BenefitsPrograms" element={<BenefitsPrograms />} />
            <Route path="MediaGallary" element={<MediaGallary />} />
            <Route path="SchemeSection" element={<SchemeSection />} />
          </Route>

          
          <Route path="/dashboard" element={<UserDashboardpage />} />
           <Route path ="ChatBot"  element={<ChatBot/>}/>
           <Route path ="ResumeBuilder"  element={<ResumeBuilder/>}/>
          {/* 404 Route */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

