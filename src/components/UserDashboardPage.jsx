import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  LogIn, Key, Phone, UserCheck, XCircle, CheckCircle,
  UserPlus, Home, Info, Mail, PhoneCall, Facebook, Twitter, Linkedin, Instagram,
  MapPin, Clock, Bell, TrendingUp, Briefcase, GraduationCap, ClipboardCheck,
  ArrowLeft, X, Monitor, Cpu, Building, BarChart2, Users, Award, Shield, Map, User, Lock, Eye, EyeOff, FileText,
  Search, Bookmark, UploadCloud, FilePlus, Send, History, Settings, LogOut, MessageSquare, Compass,
  Star, ChevronRight, BarChart, FileMinus, HardDrive, Edit, Cloud, Clipboard, FileSearch,
  User as UserIcon, Calendar, TrendingUp as TrendingUpIcon, Target, CheckSquare, List, Image as ImageIcon, Sun, Moon, DownloadCloud, Menu,
  MessageCircle, Volume2, BookOpen, Lightbulb, UserCog, Code, Database, Factory, HeartPulse, HardHat, Handshake, Brain, Book, Award as AwardIcon
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

// Import translation files directly from the src directory
// import translationEN from './en.json';
// import translationHI from './hi.json';
// import i18n from './i18n'; // Assuming you have a separate i18n config file

// Ensure __app_id and __firebase_config are defined in the environment
// For standalone testing, you might need to mock these or provide default values
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'standalone-user-dashboard';
const firebaseConfig = typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : {
  // A minimal, placeholder Firebase config for standalone testing.
  // Replace with your actual project's config if you want real Firebase integration
  // when running this file separately.
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API Key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Replace with your Firebase Auth Domain
  projectId: "YOUR_PROJECT_ID", // Replace with your Firebase Project ID
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // Replace with your Firebase Storage Bucket
  messagingSenderId: "YOUR_SENDER_ID", // Replace with your Firebase Messaging Sender ID
  appId: "YOUR_APP_ID"
};
const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

// Initialize Firebase (only once)
let app;
let db;
let auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  console.warn("Using default Firebase config. Please replace with your actual project config for full functionality.");
}

// Define a consistent, professional color palette for the government theme
const LIGHT_COLOR_PALETTE = {
  primary: '#0A4D68',   // Dark teal/blue
  accent: '#088F8F',    // Teal
  lightGray: '#F3F4F6', // Very light gray
  mediumLightGray: '#E5E7EB', // Slightly darker light gray
  borderGray: '#D1D5DB', // Gray for borders
  placeholderGray: '#9CA3AF', // Gray for placeholders/icons
  textGray: '#6B7280',   // General gray text
  darkTextGray: '#4B5563', // Darker gray text
  darkerTextGray: '#374151', // Even darker text, almost black
  blackText: '#111827',  // Very dark text, almost black
  successBg: '#D1FAE5',   // Light green for success background
  successText: '#065F46', // Dark green for success text
  successBorder: '#6EE7B7', // Medium green for success border
  successButton: '#10B981', // Green for success button
  successButtonHover: '#059669', // Darker green for success button hover
  errorBg: '#FEE2E2',    // Light red for error background
  errorText: '#991B1B',   // Dark red for error text
  errorBorder: '#FCA5A5', // Medium red for error border
  errorButton: '#EF4444', // Red for error button
  errorButtonHover: '#DC2626', // Darker red for error button hover
  white: '#ffffff',
  pureWhite: '#FFFFFF', // Explicit pure white
  blackOverlay: 'rgba(0, 0, 0, 0.7)', // Dark black background for hero card
  bodyBg: '#F0F2F5', // Light background for the overall page
  cardBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  shadowColor: 'rgba(0, 0, 0, 0.08)',
};

const DARK_COLOR_PALETTE = {
  primary: '#1A5A7A',   // Slightly lighter primary for dark mode
  accent: '#0CA4A4',    // Slightly brighter accent for dark mode
  lightGray: '#2C3E50', // Dark grayish blue
  mediumLightGray: '#34495E', // Even darker for contrast
  borderGray: '#4A6572', // Darker gray for borders
  placeholderGray: '#7F8C8D', // Lighter gray for placeholders
  textGray: '#BDC3C7',   // Light gray text
  darkTextGray: '#ECF0F1', // White text
  darkerTextGray: '#F5F7F8', // Brighter white text
  blackText: '#ECF0F1',  // White text
  successBg: '#1E8449',   // Darker green
  successText: '#D1FAE5', // Light green
  successBorder: '#28B463', // Green
  successButton: '#27AE60', // Green
  successButtonHover: '#229954', // Darker green
  errorBg: '#C0392B',    // Darker red
  errorText: '#FEE2E2',   // Light red
  errorBorder: '#E74C3C', // Red
  errorButton: '#E74C3C', // Red
  errorButtonHover: '#C0392B', // Darker red
  white: '#212121', // Dark background for things that were white
  pureWhite: '#FFFFFF', // Explicit pure white
  blackOverlay: 'rgba(0, 0, 0, 0.85)',
  bodyBg: '#1A212E', // Very dark background for the overall page
  cardBg: '#2C3E50', // Dark card background
  inputBg: '#34495E', // Dark input background
  inputBorder: '#4A6572',
  shadowColor: 'rgba(0, 0, 0, 0.4)',
};

// --- Custom Modal Components ---

// Custom Message Modal Component for success/error messages
const CustomMessageModal = ({ message, type, onClose, colorPalette }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? colorPalette.successBg : colorPalette.errorBg;
  const textColor = isSuccess ? colorPalette.successText : colorPalette.errorText;
  const borderColor = isSuccess ? colorPalette.successBorder : colorPalette.errorBorder;
  const buttonBg = isSuccess ? colorPalette.successButton : colorPalette.errorButton;
  const buttonHoverBg = isSuccess ? colorPalette.successButtonHover : colorPalette.errorButtonHover;
  const iconColor = isSuccess ? colorPalette.successButton : colorPalette.errorButton;

  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly lighter overlay
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  };

  const contentStyles = {
    position: 'relative',
    backgroundColor: bgColor,
    borderRadius: '0.75rem', // Smaller border-radius for more professional look
    boxShadow: `0 10px 20px ${colorPalette.shadowColor}`, // Refined shadow
    padding: '1.5rem',
    textAlign: 'center',
    maxWidth: '20rem', // Reduced max-width
    width: '100%',
    transition: 'all 0.3s ease-out',
    animation: 'fade-in-up 0.5s ease-out',
    border: `1px solid ${borderColor}`, // Thinner border
  };

  const buttonStyles = {
    width: '100%',
    backgroundColor: buttonBg,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 0', // Smaller padding
    borderRadius: '0.25rem', // Smaller border-radius
    fontWeight: '600',
    transition: 'background-color 0.2s',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem', // Smaller font size
  };

  const closeIconButtonStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.textGray,
    padding: '0.3rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, color 0.2s',
  };

  const closeIconHoverStyle = {
    backgroundColor: 'rgba(0,0,0,0.05)',
    color: colorPalette.blackText,
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <button
          onClick={onClose}
          style={closeIconButtonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, closeIconHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, closeIconButtonStyle)}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {isSuccess ? <CheckCircle style={{ width: '1.8rem', height: '1.8rem', color: iconColor }} /> : <XCircle style={{ width: '1.8rem', height: '1.8rem', color: iconColor }} />}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: textColor }}>
          {isSuccess ? 'Success!' : 'Error!'}
        </h3>
        <p style={{ fontSize: '0.8rem', color: textColor, marginBottom: '1rem' }}>{message}</p>
        <button
          onClick={onClose}
          style={buttonStyles}
          onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverBg}
          onMouseLeave={(e) => e.target.style.backgroundColor = buttonBg}
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Generic Full-Page Modal for content display (renamed from InfoModal for clarity)
const FullPageModal = ({ title, onClose, children, colorPalette }) => {
  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colorPalette.blackOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '1rem',
    overflowY: 'auto',
  };

  const contentStyles = {
    position: 'relative',
    backgroundColor: colorPalette.cardBg,
    borderRadius: '0.75rem',
    boxShadow: `0 15px 30px ${colorPalette.shadowColor}`,
    padding: '1.5rem',
    width: '100%',
    maxWidth: '50rem', // Adjusted max-width
    height: 'auto',
    minHeight: '70vh', // Slightly reduced min-height
    maxHeight: '90vh', // Slightly reduced max-height
    overflowY: 'auto',
    animation: 'fade-in-up 0.5s ease-out',
    border: `1px solid ${colorPalette.primary}`,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem', // Reduced margin
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    paddingBottom: '0.75rem', // Reduced padding
  };

  const titleStyles = {
    fontSize: '1.8rem', // Reduced font size
    fontWeight: 'bold',
    color: colorPalette.blackText,
  };

  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.textGray,
    transition: 'color 0.2s',
    padding: '0.4rem', // Reduced padding
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const closeButtonHoverStyles = {
    color: colorPalette.primary,
    backgroundColor: colorPalette.lightGray,
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>{title}</h2>
          <button
            onClick={onClose}
            style={closeButtonStyles}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, closeButtonHoverStyles)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, closeButtonStyles)}
            aria-label="Close"
          >
            <X size={24} /> {/* Smaller icon */}
          </button>
        </div>
        <div style={{ flexGrow: 1, padding: '0.75rem 0' }}> {/* Reduced padding */}
          {children}
        </div>
      </div>
    </div>
  );
};

// --- User Dashboard Sections ---

const DashboardSectionHeader = ({ title, icon: IconComponent, colorPalette }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
  }}>
    {IconComponent && <IconComponent size={28} style={{ color: colorPalette.primary, marginRight: '0.8rem' }} />}
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.blackText, margin: 0 }}>
      {title}
    </h2>
  </div>
);

// New Component: Interview Guidance Modal
const InterviewGuidanceModal = ({ jobTitle, company, role, onClose, showMessage, colorPalette }) => {
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidance = async () => {
      setLoading(true);
      setGuidance(''); // Clear previous guidance
      let retries = 0;
      const maxRetries = 5;
      const baseDelay = 1000; // 1 second

      while (retries < maxRetries) {
        try {
          const prompt = `Generate interview preparation guidance for a ${role} position at ${company}. Include common interview questions, tips for answering them, and a few FAQs specific to this type of role. Make it concise and actionable.`;

          let chatHistory = [];
          chatHistory.push({ role: "user", parts: [{ text: prompt }] });
          const payload = { contents: chatHistory };
          const apiKey = "";
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            // If response is not OK, it might be a rate limit or other API error
            const errorData = await response.json();
            console.error("API Error Response:", errorData); // Log full error data
            if (response.status === 429) { // Too Many Requests
              const delay = Math.pow(2, retries) * baseDelay + Math.random() * baseDelay;
              console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              retries++;
              continue; // Try the request again
            } else {
              throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
          }

          const result = await response.json();
          console.log("API Success Result:", result); // Log successful result

          if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            setGuidance(text);
          } else {
            setGuidance("Failed to generate guidance: Unexpected API response format. Please try again.");
            showMessage("Failed to generate guidance: Unexpected API response format.", "error");
          }
          break; // Exit loop on success
        } catch (error) {
          console.error("Error generating interview guidance:", error);
          setGuidance("Failed to generate guidance due to a network or unexpected error.");
          showMessage(`Failed to generate guidance: ${error.message}`, "error");
          break; // Exit loop on unexpected error
        } finally {
          setLoading(false);
        }
      }

      if (retries === maxRetries) {
        setLoading(false);
        setGuidance("Failed to generate guidance after multiple retries. Please try again later.");
        showMessage("Failed to generate interview guidance after multiple attempts.", "error");
      }
    };

    fetchGuidance();
  }, [jobTitle, company, role, showMessage]);

  const contentStyle = {
    padding: '1rem',
    maxHeight: '60vh',
    overflowY: 'auto',
    color: colorPalette.darkTextGray,
    lineHeight: '1.6',
    fontSize: '0.95rem',
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: colorPalette.textGray,
  };

  return (
    <FullPageModal title={`Interview Prep: ${jobTitle}`} onClose={onClose} colorPalette={colorPalette}>
      {loading ? (
        <div style={loadingStyle}>Generating guidance... Please wait.</div>
      ) : (
        <div style={contentStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.primary, marginBottom: '0.8rem' }}>
            Guidance for your {role} interview at {company}:
          </h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{guidance}</p> {/* pre-wrap to preserve newlines */}
        </div>
      )}
    </FullPageModal>
  );
};

// Job Details Modal
const JobDetailsModal = ({ job, onClose, onSaveJob, showMessage, colorPalette }) => {
  const [showInterviewGuidance, setShowInterviewGuidance] = useState(false);

  const modalContentStyle = {
    padding: '1rem',
    color: colorPalette.darkTextGray,
    lineHeight: '1.6',
  };

  const sectionHeadingStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginTop: '1.5rem',
    marginBottom: '0.8rem',
    borderBottom: `1px dashed ${colorPalette.borderGray}`,
    paddingBottom: '0.5rem',
  };

  const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const actionButton = {
    padding: '0.8rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    justifyContent: 'center',
  };

  const handleApplyNow = () => {
    showMessage("Application for " + job.title + " submitted successfully!", "success");
    // Delay showing interview guidance slightly so the apply success message can be seen first
    setTimeout(() => {
      setShowInterviewGuidance(true);
    }, 500); // 500ms delay
  };

  return (
    <>
      <FullPageModal title={job.title} onClose={onClose} colorPalette={colorPalette}>
        <div style={modalContentStyle}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: colorPalette.primary, marginBottom: '0.5rem' }}>{job.company}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', marginBottom: '1.5rem' }}>
            <span style={infoRowStyle}><MapPin size={16} style={{ marginRight: '0.5rem', color: colorPalette.placeholderGray }} /> {job.location}</span>
            <span style={infoRowStyle}><Briefcase size={16} style={{ marginRight: '0.5rem', color: colorPalette.placeholderGray }} /> {job.experience}</span>
            <span style={infoRowStyle}><Clock size={16} style={{ marginRight: '0.5rem', color: colorPalette.placeholderGray }} /> Posted {job.posted}</span>
            <span style={infoRowStyle}><Star size={16} style={{ marginRight: '0.5rem', color: '#FFD700' }} /> {job.rating}</span>
          </div>
          <p>{job.description}</p>
          <p style={{ marginTop: '1rem' }}>
            This is a detailed description of the {job.title} position at {job.company}. We are looking for highly motivated individuals to join our team and contribute to exciting projects.
            Responsibilities include: developing scalable solutions, collaborating with cross-functional teams, ensuring code quality, and participating in design discussions.
          </p>

          <h4 style={sectionHeadingStyle}>Key Responsibilities</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            <li>Design, develop, and maintain robust and scalable applications.</li>
            <li>Write clean, well-documented, and efficient code.</li>
            <li>Participate in code reviews and provide constructive feedback.</li>
            <li>Collaborate with product, design, and QA teams.</li>
            <li>Troubleshoot and debug issues in production environments.</li>
          </ul>

          <h4 style={sectionHeadingStyle}>Qualifications</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            <li>Bachelor's degree in Computer Science or a related field.</li>
            <li>{job.experience} of relevant industry experience.</li>
            <li>Proficiency in {job.title.includes('Engineer') ? 'Node.js, Python, or Java' : 'relevant tools and technologies'}.</li>
            <li>Strong problem-solving and analytical skills.</li>
            <li>Excellent communication and teamwork abilities.</li>
          </ul>

          <div style={buttonGroupStyle}>
            <button
              style={{ ...actionButton, backgroundColor: colorPalette.successButton }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
              onClick={handleApplyNow}
            >
              Apply Now <Send size={16} />
            </button>
            <button
              style={{ ...actionButton, backgroundColor: colorPalette.accent }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
              onClick={() => onSaveJob(job)}
            >
              Save Job <Bookmark size={16} />
            </button>
          </div>
        </div>
      </FullPageModal>

      {showInterviewGuidance && (
        <InterviewGuidanceModal
          jobTitle={job.title}
          company={job.company}
          role={job.title.includes('Engineer') ? 'Software Engineer' : (job.title.includes('Analyst') ? 'Analyst' : job.title)} // Pass a more general role
          onClose={() => setShowInterviewGuidance(false)}
          showMessage={showMessage}
          colorPalette={colorPalette}
        />
      )}
    </>
  );
};

// Job Search Section - Enhanced with more details and filters
const JobSearchSection = ({ onSaveJob, showMessage, colorPalette }) => {
  const [jobListings, setJobListings] = useState([
    { id: 'job1', title: "SDE 1 - Backend Engineer", company: "Livspace", location: "Bengaluru", experience: "Associate level", rating: 3.5, posted: "7d ago", description: "Develop robust backend services for scalable applications. Node.js, Python, or Go experience required." },
    { id: 'job2', title: "Software Developer", company: "S&P Global Market Intelligence", location: "Hyderabad, Ahmedabad", experience: "1-2 Yrs", rating: 4.0, posted: "6d ago", description: "Contribute to the development of financial intelligence platforms. Java/Spring Boot knowledge a plus." },
    { id: 'job3', title: "AML And KYC Analyst", company: "Sutherland", location: "Hyderabad (Manikonda)", experience: "1-3 Yrs", rating: 3.5, posted: "3d ago", description: "Perform Anti-Money Laundering and Know Your Customer checks. Regulatory compliance background preferred." },
    { id: 'job4', title: "Service Desk Analyst - L1", company: "Wipro", location: "Pune", experience: "0-1 Yrs", rating: 3.8, posted: "2d ago", description: "Provide first-level IT support to end-users. Excellent communication skills needed." },
    { id: 'job5', title: "Digital Marketing Specialist", company: "Aditya Birla Group", location: "Mumbai", experience: "2-4 Yrs", rating: 4.2, posted: "5d ago", description: "Plan and execute digital marketing campaigns across various channels. SEO/SEM experience." },
    { id: 'job6', title: "Civil Site Engineer", company: "L&T Construction", location: "Chennai", experience: "4-6 Yrs", rating: 4.5, posted: "10d ago", description: "Oversee construction site operations, ensure project deadlines and quality standards." },
    { id: 'job7', title: "HR Recruiter", company: "Accenture", location: "Gurugram", experience: "1-2 Yrs", rating: 4.1, posted: "1d ago", description: "Manage end-to-end recruitment process. Strong interviewing skills required." },
    { id: 'job8', title: "Product Manager", company: "Flipkart", location: "Bengaluru", experience: "5-8 Yrs", rating: 4.7, posted: "8d ago", description: "Define product roadmap, drive product development from conception to launch." },
    { id: 'job9', title: "Frontend Developer", company: "Zomato", location: "Delhi", experience: "2-3 Yrs", rating: 4.0, posted: "1d ago", description: "Build interactive and responsive user interfaces using React.js." },
    { id: 'job10', title: "Business Analyst", company: "Deloitte", location: "Mumbai", experience: "3-5 Yrs", rating: 4.3, posted: "4d ago", description: "Analyze business requirements and translate them into technical specifications. TRAINING" },
    { id: 'job11', title: "UX Designer", company: "Swiggy", location: "Bengaluru", experience: "1-3 Yrs", rating: 3.9, posted: "6d ago", description: "Design user-centered experiences and prototypes." },
    { id: 'job12', title: "Cloud Engineer", company: "Infosys", location: "Pune", experience: "4-7 Yrs", rating: 4.1, posted: "9d ago", description: "Manage and deploy cloud infrastructure on AWS/Azure." },
  ]);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    experience: '',
    industry: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredJobs = jobListings.filter(job => {
    const lowerKeyword = filters.keyword.toLowerCase();
    const lowerLocation = filters.location.toLowerCase();
    const lowerExperience = filters.experience.toLowerCase();
    const lowerIndustry = filters.industry.toLowerCase();

    const matchesKeyword = (job.title.toLowerCase().includes(lowerKeyword) ||
                           job.company.toLowerCase().includes(lowerKeyword) ||
                           job.description.toLowerCase().includes(lowerKeyword));
    const matchesLocation = filters.location === '' || job.location.toLowerCase().includes(lowerLocation);
    const matchesExperience = filters.experience === '' || job.experience.toLowerCase().includes(lowerExperience);
    const matchesIndustry = filters.industry === '' || (
      (lowerIndustry === 'it' && (job.title.toLowerCase().includes('software') || job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('analyst') || job.title.toLowerCase().includes('engineer') || job.title.toLowerCase().includes('designer'))) ||
      (lowerIndustry === 'finance' && job.title.toLowerCase().includes('analyst')) ||
      (lowerIndustry === 'construction' && job.title.toLowerCase().includes('civil engineer')) ||
      (lowerIndustry === 'marketing' && job.title.toLowerCase().includes('marketing'))
    );

    return matchesKeyword && matchesLocation && matchesExperience && matchesIndustry;
  });

  const jobCardStyles = {
    backgroundColor: colorPalette.cardBg,
    padding: '1rem 1.2rem', // Adjusted padding for more intensive look
    borderRadius: '0.75rem',
    boxShadow: `0 4px 15px ${colorPalette.shadowColor}`, // Stronger shadow
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative', // For the eye icon
    overflow: 'hidden', // To contain the overlay on hover
  };

  const jobCardHoverStyles = {
    boxShadow: `0 8px 25px ${colorPalette.shadowColor}`, // Even stronger shadow
    transform: 'translateY(-5px)',
    borderColor: colorPalette.primary,
  };

  const jobTitleStyles = {
    fontSize: '1.1rem', // Slightly smaller for more compact card
    fontWeight: '700',
    color: colorPalette.primary,
    marginBottom: '0.2rem',
  };

  const jobCompanyStyles = {
    fontSize: '0.85rem',
    color: colorPalette.darkTextGray,
    marginBottom: '0.3rem',
  };

  const jobMetaStyles = {
    fontSize: '0.75rem', // Smallest for meta info
    color: colorPalette.textGray,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.1rem',
  };

  const jobDescriptionStyles = {
    fontSize: '0.8rem',
    color: colorPalette.darkerTextGray,
    marginTop: '0.8rem',
    marginBottom: '1rem',
    lineHeight: '1.4',
    flexGrow: 1, // Allows description to take available space
  };

  const viewDetailsButtonStyles = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem', // Smaller button
    borderRadius: '0.3rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    width: '100%', // Full width in card
    marginTop: '0.5rem', // Spacing
  };

  const ratingStarStyles = {
    color: '#FFD700', // Gold color for stars
    width: '14px',
    height: '14px',
    marginLeft: '0.3rem',
    marginRight: '0.1rem',
  };

  const bookmarkIconStyle = {
    position: 'absolute',
    top: '0.8rem',
    right: '0.8rem',
    color: colorPalette.placeholderGray,
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  const bookmarkIconHoverStyle = {
    color: colorPalette.primary,
  };

  const filterInputStyle = {
    padding: '0.6rem 1rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    flex: '1',
    minWidth: '8rem',
    boxSizing: 'border-box',
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
  };

  const filterSelectStyle = {
    padding: '0.6rem 1rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    flex: '1',
    minWidth: '8rem',
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
    boxSizing: 'border-box',
  };

  const filterWrapperStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: colorPalette.cardBg, // Changed to cardBg
    borderRadius: '0.75rem',
    boxShadow: `0 2px 8px ${colorPalette.shadowColor}`, // Updated shadow
  };

  return (
    <div>
      <DashboardSectionHeader title="Search Jobs" icon={Search} colorPalette={colorPalette} />
      <div style={filterWrapperStyles}>
        <input
          type="text"
          name="keyword"
          placeholder="Keyword (e.g., Engineer, Analyst)"
          value={filters.keyword}
          onChange={handleFilterChange}
          style={{ ...filterInputStyle, flexBasis: window.innerWidth < 768 ? '100%' : 'calc(50% - 0.5rem)' }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g., Patna, Hyderabad)"
          value={filters.location}
          onChange={handleFilterChange}
          style={{ ...filterInputStyle, flexBasis: window.innerWidth < 768 ? '100%' : 'calc(50% - 0.5rem)' }}
        />
        <select
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
          style={{ ...filterSelectStyle, flexBasis: window.innerWidth < 768 ? '100%' : 'calc(50% - 0.5rem)' }}
        >
          <option value="">Experience</option>
          <option value="0-1 Yrs">0-1 Yrs</option>
          <option value="1-2 Yrs">1-2 Yrs</option>
          <option value="1-3 Yrs">1-3 Yrs</option>
          <option value="Associate level">Associate level</option>
          <option value="2-4 Yrs">2-4 Yrs</option>
          <option value="4-6 Yrs">4-6 Yrs</option>
          <option value="5-8 Yrs">5-8 Yrs</option>
        </select>
        <select
          name="industry"
          value={filters.industry}
          onChange={handleFilterChange}
          style={{ ...filterSelectStyle, flexBasis: window.innerWidth < 768 ? '100%' : 'calc(50% - 0.5rem)' }}
        >
          <option value="">Industry</option>
          <option value="it">IT/Software</option>
          <option value="finance">Finance</option>
          <option value="construction">Construction</option>
          <option value="retail">Retail</option>
          <option value="healthcare">Healthcare</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div
              key={job.id}
              style={jobCardStyles}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, jobCardHoverStyles)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, jobCardStyles)}
            >
              <Bookmark
                size={18}
                style={bookmarkIconStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, bookmarkIconHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, bookmarkIconStyle)}
                onClick={(e) => { e.stopPropagation(); onSaveJob(job); }} // Stop propagation to prevent opening details
              />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <img
                  src={`https://placehold.co/40x40/ccc/fff/png?text=${job.company.split(' ').map(n => n[0]).join('').substring(0,2)}`}
                  alt={`${job.company} logo`}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', marginRight: '0.8rem', flexShrink: 0 }}
                />
                <div>
                  <h3 style={jobTitleStyles}>{job.title}</h3>
                  <p style={jobCompanyStyles}>{job.company}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '0.8rem' }}>
                <span style={jobMetaStyles}>
                  <MapPin size={14} style={{ marginRight: '0.3rem', color: colorPalette.placeholderGray }} /> {job.location}
                </span>
                <span style={jobMetaStyles}>
                  <Briefcase size={14} style={{ marginRight: '0.3rem', color: colorPalette.placeholderGray }} /> {job.experience}
                </span>
                <span style={jobMetaStyles}>
                  <Star size={14} style={ratingStarStyles} /> {job.rating} {/* Star color for light/dark */}
                </span>
                <span style={jobMetaStyles}>
                  <Clock size={14} style={{ marginRight: '0.3rem', color: colorPalette.placeholderGray }} /> Posted {job.posted}
                </span>
              </div>

              <p style={jobDescriptionStyles}>{job.description.substring(0, 100)}...</p> {/* Truncated description */}
              <button
                style={viewDetailsButtonStyles}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onClick={() => setSelectedJob(job)}
              >
                View Details <ChevronRight size={16} />
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: colorPalette.textGray, fontSize: '1rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            No jobs found matching your criteria. Try adjusting your filters.
          </p>
        )}
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onSaveJob={onSaveJob} showMessage={showMessage} colorPalette={colorPalette} />
      )}
    </div>
  );
};

// Resume Preview Modal (New Component)
const ResumePreviewModal = ({ resumeData, onClose, colorPalette }) => {
  const previewSectionStyle = {
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px dashed ${colorPalette.borderGray}`,
  };

  const previewTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginBottom: '0.5rem',
  };

  const textContentStyle = {
    whiteSpace: 'pre-wrap', // Preserve newlines and spaces
    fontSize: '0.9rem',
    color: colorPalette.darkTextGray,
    marginBottom: '0.8rem',
  };

  return (
    <FullPageModal title="Resume Preview" onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem' }}>
        <div style={previewSectionStyle}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: colorPalette.primary, marginBottom: '0.5rem' }}>{resumeData.name}</h3>
          <p style={{fontSize: '0.9rem', color: colorPalette.darkTextGray, marginBottom: '0.2rem'}}>Email: {resumeData.email}</p>
          <p style={{fontSize: '0.9rem', color: colorPalette.darkTextGray}}>Phone: {resumeData.phone}</p>
        </div>

        {resumeData.objective && (
          <div style={previewSectionStyle}>
            <h4 style={previewTitleStyle}>Objective</h4>
            <p style={textContentStyle}>{resumeData.objective}</p>
          </div>
        )}

        <div style={previewSectionStyle}>
          <h4 style={previewTitleStyle}>Experience</h4>
          <p style={textContentStyle}>{resumeData.experience}</p>
        </div>

        <div style={previewSectionStyle}>
          <h4 style={previewTitleStyle}>Education</h4>
          <p style={textContentStyle}>{resumeData.education}</p>
        </div>

        <div>
          <h4 style={previewTitleStyle}>Skills</h4>
          <p style={textContentStyle}>{resumeData.skills}</p>
        </div>
      </div>
    </FullPageModal>
  );
};

// Resume Management Section - Enhanced with more options
const ResumeManagementSection = ({ userId, db, showMessage, colorPalette }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedResumeName, setUploadedResumeName] = useState('');
  const [isBuildingResume, setIsBuildingResume] = useState(false); // State for resume builder
  const [selectedTemplate, setSelectedTemplate] = useState(''); // State for selected template
  const [showResumePreview, setShowResumePreview] = useState(false); // State to show preview modal
  const [previewResumeData, setPreviewResumeData] = useState(null); // Data for preview modal

  // Mock resume data for display
  const [mockResumes, setMockResumes] = useState([
    { id: 'res1', name: 'my_software_resume.pdf', date: '2024-07-20', type: 'PDF' },
    { id: 'res2', name: 'data_entry_cv.docx', date: '2024-07-15', type: 'DOCX' },
  ]);

  const resumeTemplates = {
    'standard': {
      name: 'Standard Professional Template',
      initialValues: {
        name: '', // Will be filled by user
        email: '',
        phone: '',
        experience: `[Job Title], [Company Name], [Start Date] - [End Date]
- Achieved [quantifiable result] by [action taken].
- Led/Contributed to [project/initiative], resulting in [impact].
[Job Title], [Company Name], [Start Date] - [End Date]
- Managed [responsibility].
- Developed [solution/feature].`,
        education: `[Degree Name], [Major] | [University Name], [Graduation Year]
[High School Name] | [Graduation Year]`,
        skills: 'Teamwork, Problem Solving, Communication, [Technical Skill 1], [Technical Skill 2]',
        objective: 'Seeking a challenging role in a dynamic organization where I can apply my skills and contribute to company growth.',
      },
      fields: ['name', 'email', 'phone', 'objective', 'experience', 'education', 'skills'],
    },
    // Add more templates here with different initialValues and structures
  };

  useEffect(() => {
    const fetchResume = async () => {
      if (userId && db) {
        try {
          const docRef = doc(db, `artifacts/${appId}/users/${userId}/resumes`, 'current_resume');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUploadedResumeName(docSnap.data().fileName);
          }
        } catch (error) {
          console.error("Error fetching resume:", error);
        }
      }
    };
    fetchResume();
  }, [userId, db]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage("File size exceeds 5MB limit.", "error");
        setResumeFile(null);
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showMessage("Only PDF, DOC, DOCX, JPG, PNG files are allowed.", "error");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
    }
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      showMessage("Please select a file to upload.", "error");
      return;
    }
    if (!userId || !db) {
      showMessage("Authentication error. Please log in again.", "error");
      return;
    }

    try {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/resumes`, resumeFile.name); // Using file name as doc ID
      await setDoc(docRef, {
        fileName: resumeFile.name,
        fileType: resumeFile.type,
        fileSize: resumeFile.size,
        uploadDate: new Date().toISOString(),
        // In a real app, you'd upload the file to Firebase Storage and save its URL here
      });
      setUploadedResumeName(resumeFile.name);
      showMessage(`Resume "${resumeFile.name}" uploaded successfully!`, "success");
      setResumeFile(null); // Clear selected file
      // Add the new resume to mockResumes
      setMockResumes(prev => [...prev, { id: `res${Date.now()}`, name: resumeFile.name, date: new Date().toISOString().split('T')[0], type: resumeFile.name.split('.').pop().toUpperCase() }]);
    } catch (error) {
      console.error("Error uploading resume:", error);
      showMessage(`Failed to upload resume: ${error.message}`, "error");
    }
  };

  const handleDeleteResume = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setMockResumes(prev => prev.filter(resume => resume.id !== id));
      showMessage(`Resume "${name}" deleted successfully!`, "success");
      // In a real app, you would delete from Firestore here:
      // deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/resumes`, id));
    }
  };

  const fileInputStyle = {
    display: 'none',
  };

  const actionButtonStyles = {
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.7rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  };

  const fileInfoStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    borderRadius: '0.5rem',
    border: `1px dashed ${colorPalette.borderGray}`,
    color: colorPalette.darkTextGray,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem',
  };

  const resumeCardStyles = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: `0 2px 8px ${colorPalette.shadowColor}`, // Shadow
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.8rem',
    flexWrap: 'wrap', // Allow wrapping on small screens
    gap: '0.5rem', // Spacing between elements when wrapped
  };

  const resumeCardInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    flexBasis: '70%', // Take more space on desktop
    minWidth: '150px', // Ensure text doesn't get too small
    // Adjust flex basis for mobile
    ['@media (max-width: 768px)']: { // Apply media query directly
      flexBasis: '100%',
    },
  };

  const resumeCardActionsStyles = {
    display: 'flex',
    gap: '0.5rem',
    flexBasis: 'calc(30% - 0.5rem)', // Take remaining space on desktop
    justifyContent: 'flex-end', // Align actions to the right
    // Adjust flex basis for mobile, take full width if wrapped
    ['@media (max-width: 768px)']: { // Apply media query directly
      flexBasis: '100%',
      justifyContent: 'flex-start', // Align actions to the left on mobile
      marginTop: '0.5rem',
    },
  };

  const resumeCardActionButton = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.placeholderGray,
    transition: 'color 0.2s',
    padding: '0.3rem', // Add padding for easier tapping on mobile
    borderRadius: '0.25rem', // Slight round for buttons
  };

  const resumeCardActionButtonHover = {
    color: colorPalette.primary,
    backgroundColor: colorPalette.mediumLightGray,
  };

  const resumeBuilderFormStyles = {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: colorPalette.lightGray,
    borderRadius: '0.75rem',
    boxShadow: `inset 0 1px 3px ${colorPalette.shadowColor}`, // Shadow
  };

  const resumeBuilderFieldStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: `1px solid ${colorPalette.inputBorder}`, // Input border
    borderRadius: '0.4rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    marginBottom: '0.8rem',
    backgroundColor: colorPalette.inputBg, // Input background
    color: colorPalette.darkTextGray, // Input text color
  };

  return (
    <div>
      <DashboardSectionHeader title="Resume & Document Management" icon={FileText} colorPalette={colorPalette} />
      <div style={{
        backgroundColor: colorPalette.cardBg, // Card background
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1rem' }}>Your Resumes</h3>
        {mockResumes.length === 0 && !uploadedResumeName ? (
          <p style={{ color: colorPalette.textGray, textAlign: 'center', padding: '1rem' }}>No resumes uploaded yet.</p>
        ) : (
          <div>
            {mockResumes.map(resume => (
              <div key={resume.id} style={resumeCardStyles}>
                <div style={resumeCardInfoStyles}>
                  <FileText size={24} style={{ color: colorPalette.primary }} />
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: colorPalette.darkTextGray }}>{resume.name}</p>
                    <p style={{ fontSize: '0.75rem', color: colorPalette.textGray }}>Uploaded: {resume.date} ({resume.type})</p>
                  </div>
                </div>
                <div style={resumeCardActionsStyles}>
                  <button
                    style={resumeCardActionButton}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, resumeCardActionButtonHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, resumeCardActionButton)}
                  >
                    <FileSearch size={18} />
                  </button>
                  <button
                    style={resumeCardActionButton}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, resumeCardActionButtonHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, resumeCardActionButton)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    style={{...resumeCardActionButton, color: colorPalette.errorButton}}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, {...resumeCardActionButtonHover, color: colorPalette.errorButtonHover})}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, {...resumeCardActionButton, color: colorPalette.errorButton})}
                    onClick={() => handleDeleteResume(resume.id, resume.name)}
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
            {uploadedResumeName && !mockResumes.find(r => r.name === uploadedResumeName) && (
               <div style={resumeCardStyles}>
                <div style={resumeCardInfoStyles}>
                  <FileText size={24} style={{ color: colorPalette.primary }} />
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: '600', color: colorPalette.darkTextGray }}>{uploadedResumeName}</p>
                    <p style={{ fontSize: '0.75rem', color: colorPalette.textGray }}>Uploaded: Recent</p>
                  </div>
                </div>
                <div style={resumeCardActionsStyles}>
                  <button
                    style={resumeCardActionButton}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, resumeCardActionButtonHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, resumeCardActionButton)}
                  >
                    <FileSearch size={18} />
                  </button>
                  <button
                    style={resumeCardActionButton}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, resumeCardActionButtonHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, resumeCardActionButton)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    style={{...resumeCardActionButton, color: colorPalette.errorButton}}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, {...resumeCardActionButtonHover, color: colorPalette.errorButtonHover})}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, {...resumeCardActionButton, color: colorPalette.errorButton})}
                    onClick={() => handleDeleteResume('uploaded-temp', uploadedResumeName)} // Use a unique ID for temp uploads
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '2rem', marginBottom: '1rem' }}>
          Update Resume (Upload New)
        </h3>
        <input
          type="file"
          id="resumeUploadInput"
          onChange={handleFileChange}
          style={fileInputStyle}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
        <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '1rem' }}>
          <label htmlFor="resumeUploadInput" style={{ ...actionButtonStyles, backgroundColor: colorPalette.primary, cursor: 'pointer' }}>
            <UploadCloud size={20} /> Select File
          </label>
          <button
            onClick={handleUpload}
            style={{ ...actionButtonStyles, backgroundColor: colorPalette.successButton, }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
            disabled={!resumeFile}
          >
            <Send size={20} /> Upload to Profile
          </button>
        </div>
        {resumeFile && (
          <div style={fileInfoStyle}>
            <span>Selected for upload: {resumeFile.name} ({Math.round(resumeFile.size / 1024)} KB)</span>
            <X size={18} style={{ cursor: 'pointer', color: colorPalette.errorButton }} onClick={() => setResumeFile(null)} />
          </div>
        )}

        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '2rem', marginBottom: '1rem' }}>
          Create Resume
        </h3>
        <button
          onClick={() => setIsBuildingResume(!isBuildingResume)}
          style={{ ...actionButtonStyles, backgroundColor: colorPalette.accent, width: '100%' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
        >
          <FilePlus size={20} /> {isBuildingResume ? 'Close Resume Builder' : 'Open Resume Builder'}
        </button>

        {isBuildingResume && (
          <Formik
            initialValues={selectedTemplate ? resumeTemplates[selectedTemplate].initialValues : {
              name: '', email: '', phone: '', experience: '', education: '', skills: '', objective: ''
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email').required('Required'),
              phone: Yup.string().matches(/^[0-9]+$/, 'Invalid phone').required('Required'),
              experience: Yup.string().required('Required'),
              education: Yup.string().required('Required'),
              skills: Yup.string().required('Required'),
              objective: Yup.string(),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setTimeout(() => {
                const newResume = {
                  id: `res${Date.now()}`,
                  name: `Resume by ${values.name}.pdf`, // Mock file name
                  date: new Date().toISOString().split('T')[0],
                  type: 'PDF',
                  content: values, // Store form data as content
                };
                setMockResumes(prev => [...prev, newResume]);
                showMessage('Resume created successfully!', 'success');
                setPreviewResumeData(values); // Set data for preview
                setShowResumePreview(true); // Show preview modal
                resetForm();
                setSubmitting(false);
                setIsBuildingResume(false); // Close builder after submission
                setSelectedTemplate(''); // Clear selected template
              }, 1000);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form style={resumeBuilderFormStyles}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1rem' }}>Choose a Template</h4>
                <select
                  style={{...resumeBuilderFieldStyle, marginBottom: '1.5rem'}}
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Select Template</option>
                  {Object.keys(resumeTemplates).map(key => (
                    <option key={key} value={key}>{resumeTemplates[key].name}</option>
                  ))}
                </select>
                {selectedTemplate && (
                  <>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1rem' }}>Basic Info</h4>
                    <Field type="text" name="name" placeholder="Full Name" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="name" component="div" style={colorPalette.errorText} />

                    <Field type="email" name="email" placeholder="Email Address" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="email" component="div" style={colorPalette.errorText} />

                    <Field type="text" name="phone" placeholder="Phone Number" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="phone" component="div" style={colorPalette.errorText} />

                    <label htmlFor="objective" style={{ fontSize: '0.9rem', color: colorPalette.textGray, marginBottom: '0.2rem', display: 'block' }}>Objective (Optional)</label>
                    <Field as="textarea" name="objective" placeholder="Your career objective" rows="3" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="objective" component="div" style={colorPalette.errorText} />

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '1.5rem', marginBottom: '1rem' }}>Experience</h4>
                    <Field as="textarea" name="experience" placeholder="Work Experience (e.g., Company, Role, Duration, Responsibilities)" rows="8" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="experience" component="div" style={colorPalette.errorText} />

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '1.5rem', marginBottom: '1rem' }}>Education</h4>
                    <Field as="textarea" name="education" placeholder="Educational Qualifications (e.g., Degree, University, Year)" rows="5" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="education" component="div" style={colorPalette.errorText} />

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '1.5rem', marginBottom: '1rem' }}>Skills</h4>
                    <Field as="textarea" name="skills" placeholder="Skills (comma-separated, e.g., React, Node.js, Data Analysis)" rows="3" style={resumeBuilderFieldStyle} />
                    <ErrorMessage name="skills" component="div" style={colorPalette.errorText} />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        ...actionButtonStyles,
                        backgroundColor: isSubmitting ? colorPalette.placeholderGray : colorPalette.successButton,
                        width: '100%',
                        marginTop: '1.5rem',
                      }}
                      onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = colorPalette.successButtonHover; }}
                      onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = colorPalette.successButton; }}
                    >
                      {isSubmitting ? 'Saving Resume...' : 'Save Resume'}
                    </button>
                  </>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>

      {showResumePreview && (
        <ResumePreviewModal
          resumeData={previewResumeData}
          onClose={() => setShowResumePreview(false)}
          colorPalette={colorPalette}
        />
      )}
    </div>
  );
};

// Applied Jobs Section - Enhanced
const AppliedJobsSection = ({ userId, db, colorPalette }) => {
  const [appliedJobs, setAppliedJobs] = useState([
    { id: 'app1', jobId: 'job1', jobTitle: "SDE 1 - Backend Engineer", company: "Livspace", status: "Under Review", applyDate: "2024-07-20", updateDate: "2024-07-22" },
    { id: 'app2', jobId: 'job2', jobTitle: "Software Developer", company: "S&P Global Market Intelligence", status: "Shortlisted", applyDate: "2024-07-15", updateDate: "2024-07-21" },
    { id: 'app3', jobId: 'job3', jobTitle: "AML And KYC Analyst", company: "Sutherland", status: "Rejected", applyDate: "2024-07-10", updateDate: "2024-07-18" },
    { id: 'app4', jobId: 'job4', jobTitle: "Service Desk Analyst - L1", company: "Wipro", status: "Interview Scheduled", applyDate: "2024-07-05", updateDate: "2024-07-12" },
    { id: 'app5', jobId: 'job5', jobTitle: "Digital Marketing Specialist", company: "Aditya Birla Group", status: "Submitted", applyDate: "2024-07-01", updateDate: "2024-07-01" },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return '#6B7280'; // Gray
      case 'Under Review': return '#60A5FA'; // Blue
      case 'Shortlisted': return colorPalette.successButton; // Green
      case 'Interview Scheduled': return '#F59E0B'; // Amber
      case 'Rejected': return colorPalette.errorButton; // Red
      default: return colorPalette.textGray;
    }
  };

  const jobApplicationCardStyles = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
    alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
    justifyContent: 'space-between',
    gap: '0.8rem',
    transition: 'all 0.3s ease',
  };

  const jobApplicationCardHoverStyles = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`, // Hover shadow
    transform: 'translateY(-3px)',
    borderColor: colorPalette.accent,
  };

  const titleCompanyStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colorPalette.primary,
  };

  const metaInfoStyle = {
    fontSize: '0.85rem',
    color: colorPalette.darkTextGray,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  };

  const statusBadgeStyle = (status) => ({
    backgroundColor: getStatusColor(status),
    color: colorPalette.pureWhite, // Text on badge should be pure white
    padding: '0.3rem 0.8rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    minWidth: '6rem', // Ensure consistent badge width
    textAlign: 'center',
  });

  const viewDetailsButtonStyles = {
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem',
    borderRadius: '0.3rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: window.innerWidth < 768 ? '0.5rem' : '0', // Adjust margin for mobile
  };

  return (
    <div>
      <DashboardSectionHeader title="My Applications" icon={History} colorPalette={colorPalette} />
      {appliedJobs.length > 0 ? (
        appliedJobs.map(app => (
          <div
            key={app.id}
            style={jobApplicationCardStyles}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, jobApplicationCardHoverStyles)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, jobApplicationCardStyles)}
          >
            <div style={{ flexGrow: 1 }}>
              <h3 style={titleCompanyStyle}>{app.jobTitle} at {app.company}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginTop: '0.3rem' }}>
                <p style={metaInfoStyle}><Calendar size={14} style={{ color: colorPalette.placeholderGray }} /> Applied: {app.applyDate}</p>
                <p style={metaInfoStyle}><Clock size={14} style={{ color: colorPalette.placeholderGray }} /> Last Update: {app.updateDate}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', alignItems: 'center', gap: '0.8rem' }}>
              <span style={statusBadgeStyle(app.status)}>{app.status}</span>
              <button
                style={viewDetailsButtonStyles}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
              >
                View Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: colorPalette.textGray, fontSize: '1rem', textAlign: 'center' }}>
          You haven't applied for any jobs yet. Start exploring opportunities!
        </p>
      )}
    </div>
  );
};

// New Component: Saved Jobs Section
const SavedJobsSection = ({ userId, db, colorPalette }) => {
  const [savedJobs, setSavedJobs] = useState([]); // State to store saved jobs

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!userId || !db) return;
      try {
        const q = query(collection(db, `artifacts/${appId}/users/${userId}/savedJobs`));
        const querySnapshot = await getDocs(q);
        const fetchedJobs = [];
        querySnapshot.forEach((doc) => {
          fetchedJobs.push({ id: doc.id, ...doc.data() });
        });
        setSavedJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };
    fetchSavedJobs();
  }, [userId, db]);

  const jobCardStyles = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1rem 1.2rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 15px ${colorPalette.shadowColor}`, // Stronger shadow
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
  };

  const jobCardHoverStyles = {
    boxShadow: `0 8px 25px ${colorPalette.shadowColor}`, // Even stronger shadow
    transform: 'translateY(-5px)',
    borderColor: colorPalette.primary,
  };

  const jobTitleStyles = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: colorPalette.primary,
    marginBottom: '0.2rem',
  };

  const jobCompanyStyles = {
    fontSize: '0.85rem',
    color: colorPalette.darkTextGray,
    marginBottom: '0.3rem',
  };

  const jobMetaStyles = {
    fontSize: '0.75rem',
    color: colorPalette.textGray,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.1rem',
  };

  const viewDetailsButtonStyles = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem',
    borderRadius: '0.3rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    width: '100%',
    marginTop: '0.5rem',
  };

  const removeButtonStyles = {
    backgroundColor: colorPalette.errorButton,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem',
    borderRadius: '0.3rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    width: '100%',
    marginTop: '0.5rem',
  };

  const handleRemoveJob = async (jobId) => {
    if (!userId || !db) return;
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/savedJobs`, jobId));
      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      // showMessage(`Job removed from saved list!`, "success"); // Optionally show message
    } catch (error) {
      console.error("Error removing saved job:", error);
      // showMessage(`Failed to remove job: ${error.message}`, "error"); // Optionally show message
    }
  };

  return (
    <div>
      <DashboardSectionHeader title="Saved Jobs" icon={Bookmark} colorPalette={colorPalette} />
      {savedJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {savedJobs.map(job => (
            <div
              key={job.id}
              style={jobCardStyles}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, jobCardHoverStyles)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, jobCardStyles)}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <img
                  src={`https://placehold.co/40x40/ccc/fff/png?text=${job.company.split(' ').map(n => n[0]).join('').substring(0,2)}`}
                  alt={`${job.company} logo`}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', marginRight: '0.8rem', flexShrink: 0 }}
                />
                <div>
                  <h3 style={jobTitleStyles}>{job.title}</h3>
                  <p style={jobCompanyStyles}>{job.company}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '0.8rem' }}>
                <span style={jobMetaStyles}>
                  <MapPin size={14} style={{ marginRight: '0.3rem', color: colorPalette.placeholderGray }} /> {job.location}
                </span>
                <span style={jobMetaStyles}>
                  <Briefcase size={14} style={{ marginRight: '0.3rem', color: colorPalette.placeholderGray }} /> {job.experience}
                </span>
                <span style={jobMetaStyles}>
                  <Clock size={14} style={{ marginRight: '0.3rem', color: colorPalette.placeholderGray }} /> Posted {job.posted}
                </span>
              </div>
              <div style={{display: 'flex', gap: '0.8rem', marginTop: '0.5rem', flexWrap: 'wrap'}}>
                <button
                    style={{...viewDetailsButtonStyles, flex: '1 1 calc(50% - 0.4rem)'}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                >
                    View Details
                </button>
                <button
                    style={{...removeButtonStyles, flex: '1 1 calc(50% - 0.4rem)'}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.errorButtonHover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.errorButton}
                    onClick={() => handleRemoveJob(job.id)}
                >
                    Remove <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: colorPalette.textGray, fontSize: '1rem', textAlign: 'center', gridColumn: '1 / -1' }}>
          You haven't saved any jobs yet.
        </p>
      )}
    </div>
  );
};

// Profile Overview Section (New: similar to Naukri's profile summary)
const ProfileOverviewSection = ({ userId, setActiveSection, colorPalette, profileCompletion }) => { // Added profileCompletion prop
  // Mock data for profile overview
  const [profileData] = useState({ // Changed to const as it's static mock data
    name: "Priya Sharma", // Changed to dummy name
    title: "IT Analyst Team Lead", // Mocked title
    // profileCompletion: 92, // Now passed as prop
    pendingActions: 1,
    lastUpdated: "today",
    activelySearching: true,
  });

  const profilePicStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: `3px solid ${colorPalette.primary}`,
    objectFit: 'cover',
    marginBottom: '1rem',
  };

  const completionCircleStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(${colorPalette.successButton} ${profileCompletion}%, ${colorPalette.lightGray} ${profileCompletion}%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
  };

  const cardStyle = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    marginBottom: '1.5rem',
    border: `1px solid ${colorPalette.borderGray}`,
  };

  const statusBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    gap: '0.8rem',
  };

  const actionButtonSmall = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  };

  return (
    <div>
      <DashboardSectionHeader title="Dashboard Overview" icon={Home} colorPalette={colorPalette} />
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveSection('profileDetails')}> {/* Made clickable */}
          <div style={{ position: 'relative', width: '90px', height: '90px', marginRight: '1rem' }}>
            <img
              src="https://placehold.co/80x80/088F8F/ffffff?text=Profile" // Placeholder for user profile pic
              alt="User Profile"
              style={profilePicStyle}
            />
            <div style={completionCircleStyle}>
              {profileCompletion}%
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '0.2rem' }}>
              Hi, {profileData.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: colorPalette.darkTextGray }}>
              {profileData.title}
            </p>
            <p style={{ fontSize: '0.8rem', color: colorPalette.textGray, marginTop: '0.5rem' }}>
              Updated {profileData.lastUpdated}
            </p>
          </div>
        </div>

        <div style={statusBoxStyle}>
          <Bell size={20} style={{ color: colorPalette.primary }} />
          <p style={{ fontSize: '0.9rem', color: colorPalette.darkTextGray, flexGrow: 1 }}>
            You have {profileData.pendingActions} pending action{profileData.pendingActions !== 1 ? 's' : ''}.
          </p>
          <button
            style={{ ...actionButtonSmall, backgroundColor: colorPalette.primary }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
            onClick={() => setActiveSection('profileDetails')} // Link to profile for pending actions
          >
            View Actions
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 48%', minWidth: '150px', ...cardStyle, marginBottom: 0, padding: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '0.5rem' }}>Jobs Applied</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.accent }}>77</p>
            <p style={{ fontSize: '0.8rem', color: colorPalette.textGray }}>Total applications</p>
          </div>
          <div style={{ flex: '1 1 48%', minWidth: '150px', ...cardStyle, marginBottom: 0, padding: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '0.5rem' }}>Recommended Jobs</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.primary }}>72</p>
            <p style={{ fontSize: '0.8rem', color: colorPalette.textGray }}>Matching your profile</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            style={{ ...actionButtonSmall, backgroundColor: colorPalette.successButton, width: 'fit-content' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
            onClick={() => setActiveSection('resumeManagement')} /* Link to resume management */
          >
            Add Job Profile <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// New Component: Profile Details Section
const ProfileDetailsSection = ({ userId, db, showMessage, colorPalette, setProfileCompletion }) => {
  // Mock profile data (can be fetched from Firestore in a real app)
  const [profileData, setProfileData] = useState({
    profilePicture: 'https://placehold.co/100x100/088F8F/ffffff?text=Profile', // Default placeholder
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    mobile: "9876543210",
    address: "123, Gandhi Maidan Rd, Patna, Bihar - 800001",
    skills: "React.js, Node.js, JavaScript, Database Management, Project Coordination",
    aadhaar: "XXXX XXXX XXXX",
    pan: "ABCDE1234F",
    previousCTC: "", // Empty for tracking
    expectedCTC: "", // Empty for tracking
    noticePeriod: "", // Empty for tracking
    fieldOfWork: "", // Empty for tracking
    detailedExperience: "", // Empty for tracking
    educationalBackground: "" // Empty for tracking
  });

  // Define mandatory fields for profile completion (using profileData keys)
  const mandatoryFields = [
    'fullName', 'email', 'mobile', 'address', 'previousCTC', 'expectedCTC',
    'noticePeriod', 'fieldOfWork', 'detailedExperience', 'educationalBackground', 'skills'
  ];

  // Calculate profile completion on data change
  useEffect(() => {
    const calculateCompletion = () => {
      let filledFields = 0;
      mandatoryFields.forEach(field => {
        // Check if the field exists and is not empty/whitespace
        if (profileData[field] && String(profileData[field]).trim() !== '') {
          filledFields++;
        }
      });
      const completion = Math.round((filledFields / mandatoryFields.length) * 100);
      setProfileCompletion(completion); // Update the state in parent component
    };
    calculateCompletion();
  }, [profileData, setProfileCompletion, mandatoryFields]); // Add mandatoryFields to dependency array

  const [isEditing, setIsEditing] = useState(false);

  // Initial values for the Formik form, based on current profileData
  const initialFormValues = {
    fullName: profileData.fullName,
    email: profileData.email,
    mobile: profileData.mobile,
    address: profileData.address,
    skills: profileData.skills,
    previousCTC: profileData.previousCTC,
    expectedCTC: profileData.expectedCTC,
    noticePeriod: profileData.noticePeriod,
    fieldOfWork: profileData.fieldOfWork,
    detailedExperience: profileData.detailedExperience,
    educationalBackground: profileData.educationalBackground,
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string().matches(/^[0-9]{10}$/, 'Invalid mobile number').required('Mobile is required'),
    address: Yup.string().required('Address is required'),
    skills: Yup.string().required('Skills are required'),
    previousCTC: Yup.string().required('Previous CTC is required'),
    expectedCTC: Yup.string().required('Expected CTC is required'),
    noticePeriod: Yup.string().required('Notice Period is required'),
    fieldOfWork: Yup.string().required('Field of Work is required'),
    detailedExperience: Yup.string().min(100, 'Detailed experience must be at least 100 characters').max(2000, 'Detailed experience cannot exceed 2000 characters').required('Detailed experience is required'),
    educationalBackground: Yup.string().required('Educational background is required'),
  });

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
        showMessage("Profile picture updated!", "success");
      };
      reader.readAsDataURL(file);
    } else {
      showMessage("Please select a valid image file.", "error");
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        ...values,
        // Keep Aadhaar and PAN as they are mock and not editable via this form
      })); // Update local state with new data
      setIsEditing(false); // Exit edit mode
      setSubmitting(false);
      showMessage('Profile updated successfully!', 'success');
      // In a real app, you would save this data to Firestore here:
      // const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'details');
      // setDoc(userDocRef, values, { merge: true });
    }, 1000);
  };

  const sectionStyle = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    marginBottom: '1.5rem',
  };

  const detailRowStyle = {
    display: 'flex',
    flexDirection: window.innerWidth < 768 ? 'column' : 'row', // Stack on small screens
    alignItems: window.innerWidth < 768 ? 'flex-start' : 'flex-start', // Align text top for multiline
    marginBottom: '0.8rem',
    fontSize: '0.9rem',
    color: colorPalette.darkerTextGray,
  };

  const detailLabelStyle = {
    fontWeight: 'bold',
    marginRight: '0.5rem',
    color: colorPalette.blackText,
    minWidth: window.innerWidth < 768 ? 'auto' : '10rem', // No min-width on small screens
    marginBottom: window.innerWidth < 768 ? '0.2rem' : '0', // Spacing for stacked labels
    flexShrink: 0, // Prevent shrinking
  };

  const editButtonStyle = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '1rem',
  };

  const formFieldStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: `1px solid ${colorPalette.inputBorder}`, // Input border
    borderRadius: '0.4rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    marginBottom: '0.8rem',
    backgroundColor: colorPalette.inputBg, // Input background
    color: colorPalette.darkTextGray, // Input text color
  };

  const formActionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  };

  return (
    <div>
      <DashboardSectionHeader title="My Profile" icon={UserIcon} colorPalette={colorPalette} />
      <div style={sectionStyle}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1.5rem' }}>Personal Details</h3>

        {/* Profile Picture Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <img src={profileData.profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${colorPalette.primary}`, marginBottom: '1rem' }} />
          <input
            type="file"
            id="profilePicUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
          <label htmlFor="profilePicUpload" style={{ ...editButtonStyle, marginTop: '0', backgroundColor: colorPalette.accent }}>
            <ImageIcon size={16} /> Change Profile Picture
          </label>
        </div>

        {!isEditing ? (
          <>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Full Name:</span> <span>{profileData.fullName}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Email:</span> <span>{profileData.email}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Mobile:</span> <span>{profileData.mobile}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Aadhaar No:</span> <span>{profileData.aadhaar} (Mock)</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>PAN No:</span> <span>{profileData.pan} (Mock)</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Address:</span> <span style={{flexGrow:1}}>{profileData.address}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Previous CTC:</span> <span>{profileData.previousCTC || 'N/A'}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Expected CTC:</span> <span>{profileData.expectedCTC || 'N/A'}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Notice Period:</span> <span>{profileData.noticePeriod || 'N/A'}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Field of Work:</span> <span>{profileData.fieldOfWork || 'N/A'}</span>
            </div>
            <button
              style={editButtonStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} /> Edit Profile
            </button>
          </>
        ) : (
          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <label htmlFor="fullName" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Full Name</label>
                <Field type="text" id="fullName" name="fullName" style={formFieldStyle} />
                <ErrorMessage name="fullName" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="email" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Email</label>
                <Field type="email" id="email" name="email" style={formFieldStyle} />
                <ErrorMessage name="email" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="mobile" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Mobile</label>
                <Field type="text" id="mobile" name="mobile" style={formFieldStyle} />
                <ErrorMessage name="mobile" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="address" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Address</label>
                <Field as="textarea" id="address" name="address" rows="3" style={formFieldStyle} />
                <ErrorMessage name="address" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="previousCTC" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Previous CTC</label>
                <Field type="text" id="previousCTC" name="previousCTC" placeholder="e.g., 5 LPA" style={formFieldStyle} />
                <ErrorMessage name="previousCTC" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="expectedCTC" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Expected CTC</label>
                <Field type="text" id="expectedCTC" name="expectedCTC" placeholder="e.g., 8 LPA" style={formFieldStyle} />
                <ErrorMessage name="expectedCTC" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="noticePeriod" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Notice Period</label>
                <Field type="text" id="noticePeriod" name="noticePeriod" placeholder="e.g., 30 days" style={formFieldStyle} />
                <ErrorMessage name="noticePeriod" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="fieldOfWork" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Field of Work</label>
                <Field type="text" id="fieldOfWork" name="fieldOfWork" placeholder="e.g., Information Technology, Healthcare" style={formFieldStyle} />
                <ErrorMessage name="fieldOfWork" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <div style={formActionButtonsStyle}>
                  <button
                    type="button"
                    style={{...editButtonStyle, backgroundColor: colorPalette.borderGray, color: colorPalette.blackText, marginTop:0}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.borderGray}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{...editButtonStyle, backgroundColor: colorPalette.successButton, marginTop:0}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>

      <div style={sectionStyle}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1.5rem' }}>Professional & Educational Details</h3>
        {!isEditing ? (
          <>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Educational Background:</span> <span style={{flexGrow:1, whiteSpace: 'pre-wrap'}}>{profileData.educationalBackground || 'N/A'}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Detailed Experience:</span> <span style={{flexGrow:1, whiteSpace: 'pre-wrap'}}>{profileData.detailedExperience || 'N/A'}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Skills:</span> <span style={{flexGrow:1}}>{profileData.skills || 'N/A'}</span>
            </div>
            <button
              style={editButtonStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
              onClick={() => setIsEditing(true)} // Enable editing for these fields too
            >
              <Edit size={16} /> Update Details
            </button>
          </>
        ) : (
            <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true} // Reinitialize form when profileData changes
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <label htmlFor="educationalBackground" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Educational Background</label>
                <Field as="textarea" id="educationalBackground" name="educationalBackground" rows="5" style={formFieldStyle} />
                <ErrorMessage name="educationalBackground" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="detailedExperience" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Detailed Experience</label>
                <Field as="textarea" id="detailedExperience" name="detailedExperience" rows="8" style={formFieldStyle} />
                <ErrorMessage name="detailedExperience" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <label htmlFor="skills" style={{...detailLabelStyle, display:'block', minWidth: 'unset'}}>Skills</label>
                <Field as="textarea" id="skills" name="skills" placeholder="Comma-separated skills (e.g., React, Node.js, Data Analysis)" rows="3" style={formFieldStyle} />
                <ErrorMessage name="skills" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

                <div style={formActionButtonsStyle}>
                  <button
                    type="button"
                    style={{...editButtonStyle, backgroundColor: colorPalette.borderGray, color: colorPalette.blackText, marginTop:0}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.borderGray}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{...editButtonStyle, backgroundColor: colorPalette.successButton, marginTop:0}}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

// New Component: Recommendations Section
const RecommendationsSection = ({ showMessage, colorPalette }) => {
  // Mock recommendations (can be jobs or skill programs) - Expanded
  const [recommendations, setRecommendations] = useState([
    { id: 'rec1', type: 'job', title: 'Senior Data Scientist', company: 'Persistent Systems', description: 'Analyze complex datasets and build predictive models.', category: 'IT/Tech', relevance: 'High', location: "Bengaluru", experience: "5-8 Yrs", rating: 4.5, posted: "2d ago" },
    { id: 'rec2', type: 'skill', title: 'Advanced Cloud Computing Course', provider: 'NPTEL', description: 'Learn about AWS and Azure services for scalable applications.', category: 'Technical Skills', relevance: 'High', duration: "6 weeks", level: "Intermediate" },
    { id: 'rec3', type: 'job', title: 'Quality Assurance Engineer', company: 'Capgemini', description: 'Ensure software quality through testing and defect tracking.', category: 'IT/Tech', relevance: 'Medium', location: "Pune", experience: "2-4 Yrs", rating: 4.0, posted: "5d ago" },
    { id: 'rec4', type: 'skill', title: 'Effective Communication Workshop', provider: 'Bihar Skill Dev. Mission', description: 'Improve your verbal and written communication for interviews.', category: 'Soft Skills', relevance: 'Medium', duration: "2 days", level: "Beginner" },
    { id: 'rec5', type: 'job', title: 'Full Stack Developer', company: 'TCS', description: 'Develop both frontend and backend components of web applications.', category: 'IT/Tech', relevance: 'High', location: "Hyderabad", experience: "3-6 Yrs", rating: 4.2, posted: "1d ago" },
    { id: 'rec6', type: 'skill', title: 'Project Management Professional (PMP)', provider: 'PMI', description: 'Certification for project managers.', category: 'Management', relevance: 'High', duration: "Flexible", level: "Advanced" },
  ]);

  const [selectedItem, setSelectedItem] = useState(null); // For view job/course details

  const cardStyle = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1.2rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  };

  const cardHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`, // Hover shadow
    transform: 'translateY(-3px)',
    borderColor: colorPalette.primary,
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colorPalette.primary,
    marginBottom: '0.2rem',
  };

  const metaStyle = {
    fontSize: '0.85rem',
    color: colorPalette.darkTextGray,
    marginBottom: '0.5rem',
  };

  const descriptionStyle = {
    fontSize: '0.8rem',
    color: colorPalette.textGray,
    lineHeight: '1.4',
    marginBottom: '1rem',
  };

  const viewButton = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite, // Use pureWhite
    padding: '0.5rem 1rem',
    borderRadius: '0.3rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    width: '100%',
  };

  return (
    <div>
      <DashboardSectionHeader title="Personalized Recommendations" icon={Compass} colorPalette={colorPalette} />
      {recommendations.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {recommendations.map(rec => (
            <div
              key={rec.id}
              style={cardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            >
              <h3 style={titleStyle}>{rec.title}</h3>
              <p style={metaStyle}>
                {rec.type === 'job' ? `at ${rec.company} (${rec.category})` : `by ${rec.provider} (${rec.category})`}
              </p>
              <p style={descriptionStyle}>{rec.description}</p>
              <button
                style={viewButton}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onClick={() => setSelectedItem(rec)}
              >
                {rec.type === 'job' ? 'View Job' : 'View Course'} <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: colorPalette.darkTextGray }}>
          No recommendations available at the moment. Update your profile to get personalized suggestions!
        </p>
      )}

      {selectedItem && selectedItem.type === 'job' && (
        <JobDetailsModal job={selectedItem} onClose={() => setSelectedItem(null)} onSaveJob={() => showMessage("Job saved from recommendations!", "success")} showMessage={showMessage} colorPalette={colorPalette} />
      )}

      {selectedItem && selectedItem.type === 'skill' && (
        <FullPageModal title={selectedItem.title} onClose={() => setSelectedItem(null)} colorPalette={colorPalette}>
          <div style={{ padding: '1rem', color: colorPalette.darkTextGray }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: colorPalette.primary, marginBottom: '0.5rem' }}>{selectedItem.provider}</h3>
            <p style={{marginBottom: '1rem'}}>{selectedItem.description}</p>
            <p style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>
              **Category:** {selectedItem.category}
            </p>
            <p style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>
              **Relevance:** {selectedItem.relevance}
            </p>
            {selectedItem.duration && <p style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>**Duration:** {selectedItem.duration}</p>}
            {selectedItem.level && <p style={{fontSize: '0.9rem'}}>**Level:** {selectedItem.level}</p>}
            <button
              style={{
                ...viewButton,
                marginTop: '1.5rem',
                backgroundColor: colorPalette.successButton,
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
              onClick={() => showMessage("Enrolled in " + selectedItem.title + " (Mock Action)!", "success")}
            >
              Enroll Now <ChevronRight size={16} />
            </button>
          </div>
        </FullPageModal>
      )}
    </div>
  );
};

// New Component: Profile Performance Section
const ProfilePerformanceSection = ({ showMessage, colorPalette }) => {
  const performanceMetrics = [
    { label: "Profile Views", value: "125", icon: <Eye size={24} style={{ color: colorPalette.primary }} /> },
    { label: "Recruiter Actions", value: "15", icon: <UserCheck size={24} style={{ color: colorPalette.successButton }} /> },
    { label: "Application Success Rate", value: "45%", icon: <CheckSquare size={24} style={{ color: colorPalette.accent }} /> },
    { label: "Skills Matched", value: "8/10", icon: <ClipboardCheck size={24} style={{ color: colorPalette.errorButton }} /> },
  ];

  const chartData = [
    { name: 'Jan', applications: 30, interviews: 5, offers: 1 },
    { name: 'Feb', applications: 35, interviews: 7, offers: 2 },
    { name: 'Mar', applications: 40, interviews: 8, offers: 2 },
    { name: 'Apr', applications: 45, interviews: 10, offers: 3 },
    { name: 'May', applications: 38, interviews: 6, offers: 1 },
    { name: 'Jun', applications: 50, interviews: 12, offers: 4 },
  ];

  const metricCardStyle = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  };

  const metricCardHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`, // Hover shadow
    transform: 'translateY(-3px)',
    borderColor: colorPalette.primary,
  };

  const valueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginTop: '0.8rem',
    marginBottom: '0.4rem',
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: colorPalette.darkTextGray,
  };

  const chartContainerStyle = {
    width: '100%',
    height: '250px',
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorPalette.textGray,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    overflowX: 'auto', // For horizontal scrolling on small screens
  };

  return (
    <div>
      <DashboardSectionHeader title="Profile Performance" icon={BarChart} colorPalette={colorPalette} />
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            style={metricCardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, metricCardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, metricCardStyle)}
          >
            {metric.icon}
            <div style={valueStyle}>{metric.value}</div>
            <div style={labelStyle}>{metric.label}</div>
          </div>
        ))}
      </div>
      <p style={{ color: colorPalette.textGray, fontSize: '0.9rem', marginTop: '2rem', textAlign: 'center' }}>
        These metrics provide insights into your profile's visibility and engagement.
      </p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Application & Interview Trends
      </h3>
      <div style={chartContainerStyle}>
        {/* Placeholder for a chart. Actual chart library integration (like Recharts or D3) would go here. */}
        <p>
          [Chart Placeholder: A graph showing applications, interviews, and offers over time would be displayed here.]
          <br/><br/>
          (e.g., using Recharts LineChart with data for applications, interviews, offers)
        </p>
      </div>
      <p style={{ color: colorPalette.textGray, fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}>
        Track your progress and identify trends in your job search activity.
      </p>
    </div>
  );
};

// Mock Test Interface Modal (New Component)
const MockTestInterfaceModal = ({ test, onClose, showMessage, colorPalette, returnToDashboard }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const mockQuestions = {
    'test1': [ // Aptitude Test
      { id: 'q1', question: 'What is 15% of 200?', options: ['15', '20', '30', '40'], correct: '30' },
      { id: 'q2', question: 'If 5 men can build a wall in 10 days, how many days will 10 men take to build the same wall?', options: ['5', '8', '10', '20'], correct: '5' },
      { id: 'q3', question: 'Which number completes the series: 2, 4, 8, 16, ___?', options: ['20', '24', '32', '64'], correct: '32' },
      { id: 'q4', question: 'Find the odd one out: Apple, Orange, Potato, Banana', options: ['Apple', 'Orange', 'Potato', 'Banana'], correct: 'Potato' },
      { id: 'q5', question: 'If A=1, B=2, then C=?', options: ['3', '4', '5', '6'], correct: '3' },
    ],
    'test2': [ // Technical Skills Assessment (IT)
      { id: 'q1', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'], correct: 'Hyper Text Markup Language' },
      { id: 'q2', question: 'Which programming language is known for its use in AI and machine learning?', options: ['Java', 'Python', 'C++', 'JavaScript'], correct: 'Python' },
      { id: 'q3', question: 'What is a primary key in a database?', options: ['A key that uniquely identifies each record in a table', 'A key used for encryption', 'A key that links to another table', 'A key that can be null'], correct: 'A key that uniquely identifies each record in a table' },
      { id: 'q4', question: 'Which of the following is a version control system?', options: ['Jira', 'Slack', 'Git', 'Trello'], correct: 'Git' },
      { id: 'q5', question: 'What is the purpose of CSS?', options: ['To define database schemas', 'To add interactivity to web pages', 'To style web pages', 'To manage server-side logic'], correct: 'To style web pages' },
    ],
    'test3': [ // Government Exam Prep (Bihar PSC)
      { id: 'q1', question: 'Who was the first Chief Minister of Bihar?', options: ['Krishna Sinha', 'Anugrah Narayan Sinha', 'Jagannath Mishra', 'Lalu Prasad Yadav'], correct: 'Krishna Sinha' },
      { id: 'q2', question: 'Which river is known as the "Sorrow of Bihar"?', options: ['Ganga', 'Kosi', 'Gandak', 'Son'], correct: 'Kosi' },
      { id: 'q3', question: 'What is the capital of Bihar?', options: ['Ranchi', 'Lucknow', 'Patna', 'Bhubaneswar'], correct: 'Patna' },
      { id: 'q4', question: 'When was Bihar separated from Bengal Presidency?', options: ['1905', '1912', '1936', '1947'], correct: '1912' },
      { id: 'q5', question: 'Which ancient university was located in Bihar?', options: ['Taxila', 'Nalanda', 'Vikramshila', 'Both B and C'], correct: 'Both B and C' },
    ],
    'test4': [ // Soft Skills Evaluation
      { id: 'q1', question: 'How do you handle constructive criticism?', options: ['Get defensive', 'Ignore it', 'Listen, understand, and apply relevant feedback', 'Criticize back'], correct: 'Listen, understand, and apply relevant feedback' },
      { id: 'q2', question: 'Describe a situation where you worked effectively in a team.', options: ['I always work alone', 'I prefer to lead', 'I contributed to a project where everyone had clear roles and we supported each other', 'I delegated all tasks'], correct: 'I contributed to a project where everyone had clear roles and we supported each other' },
      { id: 'q3', question: 'How do you prioritize tasks when you have multiple deadlines?', options: ['Do the easiest ones first', 'Panic', 'Assess urgency and importance, then plan accordingly', 'Ask someone else to do it'], correct: 'Assess urgency and and importance, then plan accordingly' },
    ],
    'test5': [ // English Language Proficiency
      { id: 'q1', question: 'Choose the correct sentence:', options: ['She go to the store.', 'She goes to the store.', 'She going to the store.', 'She gone to the store.'], correct: 'She goes to the store.' },
      { id: 'q2', question: 'Synonym of "Ubiquitous":', options: ['Rare', 'Common', 'Unique', 'Scarce'], correct: 'Common' },
      { id: 'q3', question: 'Antonym of "Benevolent":', options: ['Kind', 'Generous', 'Malevolent', 'Friendly'], correct: 'Malevolent' },
    ],
  };

  const currentQuestions = mockQuestions[test.id] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleOptionChange = (e) => {
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let newScore = 0;
    currentQuestions.forEach(q => {
      if (answers[q.id] === q.correct) {
        newScore++;
      }
    });
    return newScore;
  };

  const handleEndTest = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const endTestAndReturn = () => {
    setShowResults(false);
    onClose(); // Close the test modal
    returnToDashboard(); // Return to dashboard overview
    showMessage(`Test "${test.title}" completed! You scored ${score} out of ${currentQuestions.length}.`, "success");
  };

  if (showResults) {
    return (
      <FullPageModal title="Test Results" onClose={endTestAndReturn} colorPalette={colorPalette}>
        <div style={{ textAlign: 'center', padding: '2rem', color: colorPalette.blackText }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{test.title} Completed!</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.primary }}>
            Your Score: {score} / {currentQuestions.length}
          </p>
          <p style={{ fontSize: '1rem', color: colorPalette.textGray, marginTop: '0.5rem' }}>
            Review your performance and explore recommendations.
          </p>
          <button
            onClick={endTestAndReturn}
            style={{
              backgroundColor: colorPalette.successButton,
              color: colorPalette.pureWhite,
              padding: '0.8rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              marginTop: '2rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
          >
            Return to Dashboard
          </button>
        </div>
      </FullPageModal>
    );
  }

  return (
    <FullPageModal title={test.title} onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem' }}>
        {currentQuestion ? (
          <>
            <div style={{
              backgroundColor: colorPalette.lightGray,
              padding: '1.2rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              border: `1px solid ${colorPalette.borderGray}`,
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1rem' }}>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}:
              </p>
              <p style={{ fontSize: '1rem', color: colorPalette.darkTextGray, lineHeight: '1.6' }}>
                {currentQuestion.question}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} style={{ marginBottom: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.95rem', color: colorPalette.darkTextGray }}>
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={handleOptionChange}
                      style={{ marginRight: '0.8rem', accentColor: colorPalette.primary }}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                style={{
                  backgroundColor: colorPalette.borderGray,
                  color: colorPalette.blackText,
                  padding: '0.7rem 1.2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (currentQuestionIndex !== 0) e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray; }}
                onMouseLeave={e => { if (currentQuestionIndex !== 0) e.currentTarget.style.backgroundColor = colorPalette.borderGray; }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              {currentQuestionIndex === currentQuestions.length - 1 ? (
                <button
                  onClick={handleEndTest}
                  style={{
                    backgroundColor: colorPalette.errorButton, // Red for end test
                    color: colorPalette.pureWhite,
                    padding: '0.7rem 1.2rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.errorButtonHover}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.errorButton}
                >
                  End Test <CheckCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  style={{
                    backgroundColor: colorPalette.primary,
                    color: colorPalette.pureWhite,
                    padding: '0.7rem 1.2rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                >
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: colorPalette.errorText }}>No questions available for this test.</p>
        )}
      </div>
    </FullPageModal>
  );
};

// New Component: Mock Tests Section
const MockTestsSection = ({ showMessage, colorPalette, setActiveSection }) => {
  const mockTests = [
    { id: 'test1', title: 'Aptitude Test', description: 'Assess your quantitative and logical reasoning skills.', duration: '60 min', questions: '50' },
    { id: 'test2', title: 'Technical Skills Assessment (IT)', description: 'Evaluate your proficiency in core IT concepts and programming.', duration: '90 min', questions: '40' },
    { id: 'test3', title: 'Government Exam Prep (Bihar PSC)', description: 'Practice for upcoming Bihar Public Service Commission exams.', duration: '120 min', questions: '100' },
    { id: 'test4', title: 'Soft Skills Evaluation', description: 'Measure your communication, teamwork, and problem-solving abilities.', duration: '30 min', questions: '25' },
    { id: 'test5', title: 'English Language Proficiency', description: 'Test your grammar, vocabulary, and comprehension.', duration: '45 min', questions: '50' },
    { id: 'test6', title: 'General Knowledge (India)', description: 'Test your knowledge about Indian history, geography, and current affairs.', duration: '30 min', questions: '30' },
    { id: 'test7', title: 'Logical Reasoning', description: 'Sharpen your analytical and logical thinking abilities.', duration: '40 min', questions: '35' },
    { id: 'test8', title: 'Data Interpretation', description: 'Analyze and interpret data presented in various formats.', duration: '50 min', questions: '25' },
  ];

  const [selectedTest, setSelectedTest] = useState(null);

  const cardStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginBottom: '1.5rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  };

  const cardHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`,
    transform: 'translateY(-3px)',
    borderColor: colorPalette.primary,
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginBottom: '0.5rem',
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    color: colorPalette.darkTextGray,
    lineHeight: '1.5',
    marginBottom: '1rem',
    flexGrow: 1,
  };

  const metaStyle = {
    fontSize: '0.8rem',
    color: colorPalette.textGray,
    marginBottom: '0.5rem',
  };

  const startTestButton = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite,
    padding: '0.7rem 1.2rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
  };

  const handleStartTest = (test) => {
    setSelectedTest(test);
  };

  return (
    <div>
      <DashboardSectionHeader title="Mock Tests" icon={Target} colorPalette={colorPalette} />
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {mockTests.map(test => (
          <div
            key={test.id}
            style={cardStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <h3 style={titleStyle}>{test.title}</h3>
            <p style={descriptionStyle}>{test.description}</p>
            <p style={metaStyle}>Duration: {test.duration}</p>
            <p style={metaStyle}>Questions: {test.questions}</p>
            <button
              style={startTestButton}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
              onClick={() => handleStartTest(test)}
            >
              Start Test <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
      <p style={{ color: colorPalette.textGray, fontSize: '0.9rem', marginTop: '2rem', textAlign: 'center' }}>
        Take mock tests to assess your skills and prepare for interviews and exams.
      </p>

      {selectedTest && (
        <MockTestInterfaceModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          showMessage={showMessage}
          colorPalette={colorPalette}
          returnToDashboard={() => setActiveSection('dashboardOverview')} // Pass function to return to dashboard
        />
      )}
    </div>
  );
};

// New Component: Change Password Modal
const ChangePasswordModal = ({ onClose, showMessage, colorPalette }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (values.newPassword !== values.confirmNewPassword) {
      showMessage("New password and confirm password do not match.", "error");
      setSubmitting(false);
      return;
    }
    if (values.currentPassword === values.newPassword) {
      showMessage("New password cannot be the same as the current password.", "error");
      setSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      showMessage("Password changed successfully!", "success");
      resetForm();
      onClose();
      setSubmitting(false);
    }, 1500);
  };

  const formFieldStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    borderRadius: '0.4rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    marginBottom: '0.8rem',
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
  };

  const actionButton = {
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite,
    padding: '0.7rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  };

  return (
    <FullPageModal title="Change Password" onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
        validationSchema={Yup.object({
          currentPassword: Yup.string().required('Current password is required'),
          newPassword: Yup.string().min(6, 'New password must be at least 6 characters').required('New password is required'),
          confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirm new password is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <label htmlFor="currentPassword" style={{display:'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: colorPalette.blackText}}>Current Password</label>
            <Field type="password" name="currentPassword" style={formFieldStyle} />
            <ErrorMessage name="currentPassword" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

            <label htmlFor="newPassword" style={{display:'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: colorPalette.blackText}}>New Password</label>
            <Field type="password" name="newPassword" style={formFieldStyle} />
            <ErrorMessage name="newPassword" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

            <label htmlFor="confirmNewPassword" style={{display:'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: colorPalette.blackText}}>Confirm New Password</label>
            <Field type="password" name="confirmNewPassword" style={formFieldStyle} />
            <ErrorMessage name="confirmNewPassword" component="div" style={{color: colorPalette.errorText, fontSize: '0.8rem', marginBottom: '0.5rem'}} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{...actionButton, backgroundColor: colorPalette.borderGray, color: colorPalette.blackText}}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.borderGray}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{...actionButton, backgroundColor: colorPalette.successButton}}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

// New Component: Privacy Settings Modal
const PrivacySettingsModal = ({ onClose, colorPalette }) => {
  const contentStyle = {
    padding: '1rem',
    color: colorPalette.darkTextGray,
    lineHeight: '1.6',
    fontSize: '0.95rem',
  };

  const sectionHeadingStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginTop: '1.5rem',
    marginBottom: '0.8rem',
    borderBottom: `1px dashed ${colorPalette.borderGray}`,
    paddingBottom: '0.5rem',
  };

  return (
    <FullPageModal title="Privacy Settings" onClose={onClose} colorPalette={colorPalette}>
      <div style={contentStyle}>
        <p>Your privacy is important to us. This section allows you to manage how your data is used and shared within the Bihar KIOSK platform.</p>

        <h3 style={sectionHeadingStyle}>Data Usage</h3>
        <p>We use your profile and activity data to provide personalized job recommendations, skill development suggestions, and track your application progress. Your data is anonymized and aggregated for analytical insights that help improve government employment initiatives.</p>
        <ul>
          <li><strong>Personalized Recommendations:</strong> Enabled by default to offer tailored job and skill suggestions.</li>
          <li><strong>Anonymized Analytics:</strong> Your data contributes to employment trend reports, always anonymized.</li>
        </ul>

        <h3 style={sectionHeadingStyle}>Data Sharing</h3>
        <p>We share necessary information with employers only when you explicitly apply for a job. Your data is never sold to third parties.</p>
        <ul>
          <li><strong>Employer Applications:</strong> Only shared upon your direct application to a job.</li>
          <li><strong>Government Services Integration:</strong> Data shared only with relevant government departments for schemes you apply to.</li>
        </ul>

        <h3 style={sectionHeadingStyle}>Your Controls</h3>
        <p>You have control over your data. You can update your profile, manage your resumes, and delete your account at any time from the 'Settings' section.</p>
        <ul>
          <li><strong>Profile Updates:</strong> You can edit personal and professional details in 'My Profile'.</li>
          <li><strong>Resume Management:</strong> Upload, create, and delete resumes in 'Resume & Document Management'.</li>
          <li><strong>Account Deletion:</strong> Permanently delete your account from 'Settings'.</li> {/* Corrected closing tag here */}
        </ul>
        <p style={{marginTop: '1.5rem', fontStyle: 'italic', color: colorPalette.textGray}}>
          For more details, please refer to our full Privacy Policy.
        </p>
      </div>
    </FullPageModal>
  );
};

// New Component: Delete Account Confirmation Modal
const DeleteAccountConfirmationModal = ({ onClose, showMessage, colorPalette }) => {
  const handleConfirmDelete = () => {
    // Simulate account deletion
    showMessage("Your account has been successfully deleted.", "success");
    onClose();
    // In a real app, you would log out the user and redirect to the main page
    // auth.signOut();
    // window.location.href = '/';
  };

  const buttonStyle = {
    padding: '0.8rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <FullPageModal title="Delete Account" onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem', textAlign: 'center', color: colorPalette.blackText }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.errorButton, marginBottom: '1rem' }}>
          Are you sure you want to delete your account?
        </h3>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          This action is permanent and cannot be undone. All your profile data, saved jobs, and application history will be removed.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onClose}
            style={{...buttonStyle, backgroundColor: colorPalette.borderGray, color: colorPalette.blackText}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.borderGray}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            style={{...buttonStyle, backgroundColor: colorPalette.errorButton, color: colorPalette.pureWhite}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.errorButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.errorButton}
          >
            Confirm Deletion
          </button>
        </div>
      </div>
    </FullPageModal>
  );
};

// New Component: Notifications Modal
const NotificationsModal = ({ onClose, colorPalette }) => {
  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 'notif1', type: 'recruiterAction', message: 'A recruiter viewed your profile for "Software Engineer" role.', time: '2 mins ago', read: false },
    { id: 'notif2', type: 'applicationUpdate', message: 'Your application for "Digital Marketing Specialist" has been shortlisted!', time: '1 hour ago', read: false },
    { id: 'notif3', type: 'interview', message: 'Interview scheduled for "UX Designer" at Swiggy. Check your email for details.', time: 'Yesterday', read: true },
    { id: 'notif4', type: 'applicationUpdate', message: 'Your application for "Business Analyst" at Deloitte was rejected.', time: '2 days ago', read: true },
    { id: 'notif5', type: 'recruiterAction', message: 'A new job matching your skills has been posted.', time: '3 days ago', read: true },
  ]);

  const notificationItemStyle = (read) => ({
    backgroundColor: read ? colorPalette.cardBg : colorPalette.lightGray, // Lighter background for unread
    padding: '0.8rem 1.2rem',
    borderRadius: '0.5rem',
    marginBottom: '0.6rem',
    boxShadow: `0 1px 4px ${colorPalette.shadowColor}`,
    border: `1px solid ${read ? colorPalette.borderGray : colorPalette.accent}`,
    transition: 'background-color 0.2s',
  });

  const notificationTextStyle = (read) => ({
    fontSize: '0.9rem',
    color: read ? colorPalette.darkTextGray : colorPalette.blackText,
    fontWeight: read ? 'normal' : 'bold',
    marginBottom: '0.2rem',
  });

  const notificationTimeStyle = {
    fontSize: '0.75rem',
    color: colorPalette.textGray,
  };

  const markAllReadButtonStyle = {
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite,
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginTop: '1.5rem',
    width: 'fit-content', // Reduced width
    marginLeft: 'auto', // Center the button
    marginRight: 'auto', // Center the button
    display: 'block', // Ensure it takes full width of content for centering
    transition: 'background-color 0.3s',
  };

  const handleMarkAllRead = () => {
    setNotifications([]); // Clear all notifications
    // In a real app, you'd update a backend status for notifications
  };

  return (
    <FullPageModal title="Notifications" onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          <>
            {notifications.map(notif => (
              <div key={notif.id} style={notificationItemStyle(notif.read)}>
                <p style={notificationTextStyle(notif.read)}>
                  {notif.message}
                </p>
                <p style={notificationTimeStyle}>{notif.time}</p>
              </div>
            ))}
            <button
              style={markAllReadButtonStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
              onClick={handleMarkAllRead}
            >
              Mark All As Read
            </button>
          </>
        ) : (
          <p style={{ color: colorPalette.textGray, textAlign: 'center', padding: '1rem' }}>No new notifications.</p>
        )}
      </div>
    </FullPageModal>
  );
};

// New Component: Settings Section
const SettingsSection = ({ showMessage, setActiveSection, toggleDarkMode, isDarkMode, colorPalette }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPrivacySettingsModal, setShowPrivacySettingsModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const settingOptionStyle = {
    backgroundColor: colorPalette.cardBg, // Card background
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`, // Shadow
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const settingOptionHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`, // Hover shadow
    transform: 'translateY(-3px)',
    borderColor: colorPalette.accent,
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: colorPalette.blackText,
  };

  const iconStyle = {
    color: colorPalette.placeholderGray,
  };

  const notificationToggleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  };

  const toggleSwitchStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '24px',
    backgroundColor: isDarkMode ? colorPalette.mediumLightGray : colorPalette.borderGray, // Adjusted for dark mode
    borderRadius: '12px',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  };

  const toggleSliderStyle = (isOn) => ({
    position: 'absolute',
    content: '""',
    height: '20px',
    width: '20px',
    left: isOn ? '18px' : '2px',
    bottom: '2px',
    backgroundColor: isOn ? colorPalette.successButton : colorPalette.pureWhite, // Use pureWhite
    borderRadius: '50%',
    transition: '0.2s',
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <div>
      <DashboardSectionHeader title="Settings" icon={Settings} colorPalette={colorPalette} />

      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setActiveSection('profileDetails')} // Link to profile details
      >
        <h3 style={titleStyle}>Update Profile Information</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>

      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setShowChangePasswordModal(true)}
      >
        <h3 style={titleStyle}>Change Password</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>

      <div style={{ ...settingOptionStyle, flexDirection: 'column', alignItems: 'flex-start' }} onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}>
        <h3 style={titleStyle}>Notification Preferences</h3>
        <div style={{ width: '100%', marginTop: '1rem' }}>
          <div style={notificationToggleStyle}>
            <span style={{ color: colorPalette.textGray }}>Email Notifications</span>
            <div style={toggleSwitchStyle} onClick={() => setEmailNotifications(!emailNotifications)}>
              <span style={toggleSliderStyle(emailNotifications)}></span>
            </div>
          </div>
          <div style={{ ...notificationToggleStyle, marginTop: '0.8rem' }}>
            <span style={{ color: colorPalette.textGray }}>SMS Notifications</span>
            <div style={toggleSwitchStyle} onClick={() => setSmsNotifications(!smsNotifications)}>
              <span style={toggleSliderStyle(smsNotifications)}></span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setShowPrivacySettingsModal(true)}
      >
        <h3 style={titleStyle}>Privacy Settings</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>

      {/* Light/Dark Mode Toggle is now on main screen, removed from settings */}

      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setShowDeleteAccountModal(true)}
      >
        <h3 style={titleStyle}>Delete Account</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>

      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} showMessage={showMessage} colorPalette={colorPalette} />
      )}
      {showPrivacySettingsModal && (
        <PrivacySettingsModal onClose={() => setShowPrivacySettingsModal(false)} colorPalette={colorPalette} />
      )}
      {showDeleteAccountModal && (
        <DeleteAccountConfirmationModal onClose={() => setShowDeleteAccountModal(false)} showMessage={showMessage} colorPalette={colorPalette} />
      )}
    </div>
  );
};

// New Component: Resume Templates Section
const ResumeTemplatesSection = ({ showMessage, colorPalette }) => {
  const templates = [
    { id: 't1', name: 'Standard Professional', description: 'Clean and classic design, suitable for most industries.', image: 'https://placehold.co/150x200/0A4D68/ffffff?text=Standard+Pro', downloadUrl: 'mock_standard_template.pdf' },
    { id: 't2', name: 'Modern & Creative', description: 'Highlights your creativity with a modern layout and subtle graphics.', image: 'https://placehold.co/150x200/088F8F/ffffff?text=Modern+Creative', downloadUrl: 'mock_creative_template.pdf' },
    { id: 't3', name: 'Minimalist Design', description: 'Focuses on content clarity with a simple, elegant structure.', image: 'https://placehold.co/150x200/4B5563/ffffff?text=Minimalist', downloadUrl: 'mock_minimalist_template.pdf' },
    { id: 't4', name: 'Academic & Research', description: 'Designed for academic professionals, emphasizes publications and research.', image: 'https://placehold.co/150x200/1A5A7A/ffffff?text=Academic+Research', downloadUrl: 'mock_academic_template.pdf' },
  ];

  const cardStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1.2rem', // Reduced padding
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginBottom: '1.5rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  };

  const cardHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`,
    transform: 'translateY(-3px)',
    borderColor: colorPalette.primary,
  };

  const imageStyle = {
    width: '100%',
    maxWidth: '150px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
  };

  const titleStyle = {
    fontSize: '1rem', // Slightly reduced font size
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginBottom: '0.4rem', // Reduced margin
  };

  const descriptionStyle = {
    fontSize: '0.8rem', // Slightly reduced font size
    color: colorPalette.darkTextGray,
    lineHeight: '1.4',
    marginBottom: '1rem', // Reduced margin
    flexGrow: 1,
  };

  const buttonStyle = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite,
    padding: '0.5rem 1rem', // Reduced padding
    borderRadius: '0.4rem', // Slightly less rounded
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem', // Reduced font size
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem', // Reduced gap
    width: '100%',
  };

  const handleDownload = (templateName) => {
    showMessage(`Downloading "${templateName}" template (mock download).`, "success");
    // In a real app, you'd trigger a file download here.
  };

  return (
    <div>
      <DashboardSectionHeader title="Resume Templates" icon={FileText} colorPalette={colorPalette} />
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}> {/* Adjusted minmax and gap */}
        {templates.map(template => (
          <div
            key={template.id}
            style={cardStyle}
            onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <img src={template.image} alt={template.name} style={imageStyle} />
            <h3 style={titleStyle}>{template.name}</h3>
            <p style={descriptionStyle}>{template.description}</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%'}}> {/* Column layout for buttons on small cards */}
              <button
                style={{...buttonStyle, backgroundColor: colorPalette.primary}}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                onClick={() => showMessage(`Viewing preview for "${template.name}" (mock).`, "info")}
              >
                View Template
              </button>
              <button
                style={buttonStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onClick={() => handleDownload(template.name)}
              >
                <DownloadCloud size={14} /> Download {/* Smaller icon */}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: colorPalette.textGray, fontSize: '0.9rem', marginTop: '2rem', textAlign: 'center' }}>
        Choose a template that best suits your professional needs and customize it.
      </p>
    </div>
  );
};

// New Component: Skill Development and Training Programs Section
const SkillDevelopmentSection = ({ showMessage, colorPalette }) => {
  const categories = [
    {
      name: "Technical Skills",
      icon: Code,
      programs: [
        { id: 'ts1', title: 'Programming & Software Dev', description: 'Master various programming languages and software development methodologies.', topics: ['Python', 'Java', 'JavaScript', 'C++', 'Data Structures', 'Algorithms', 'Web Development', 'Mobile App Dev'], type: 'online' },
        { id: 'ts2', title: 'Data Analysis & Visualization', description: 'Learn to analyze complex datasets and create insightful visualizations.', topics: ['SQL', 'Excel', 'Tableau', 'Power BI', 'R', 'Python for Data Analysis'], type: 'online' },
        { id: 'ts3', title: 'Digital Tool Proficiency', description: 'Become proficient in essential digital tools for productivity and design.', topics: ['Microsoft Office Suite', 'Google Workspace', 'Adobe Creative Suite', 'Project Management Tools'], type: 'online' },
        { id: 'ts4', title: 'IT Infrastructure Management', description: 'Gain expertise in managing IT infrastructure, networks, and cloud services.', topics: ['Networking Basics', 'Cloud Computing (AWS/Azure/GCP)', 'Cybersecurity Fundamentals', 'System Administration'], type: 'hybrid' },
      ]
    },
    {
      name: "Vocational Skills",
      icon: Factory,
      programs: [
        { id: 'vs1', title: 'Electrical & Mechanical Trades', description: 'Hands-on training in electrical wiring, machinery maintenance, and more.', topics: ['Basic Electricity', 'Circuit Design', 'Machine Operation', 'Welding', 'Plumbing'], type: 'offline' },
        { id: 'vs2', title: 'Culinary Arts & Hospitality', description: 'Develop skills in cooking, food preparation, and hospitality management.', topics: ['Food Safety', 'Cuisine Techniques', 'Restaurant Management', 'Customer Service'], type: 'offline' },
        { id: 'vs3', title: 'Healthcare Support Services', description: 'Train for roles supporting healthcare professionals in various settings.', topics: ['First Aid', 'Patient Care', 'Medical Terminology', 'Hospital Administration'], type: 'hybrid' },
        { id: 'vs4', title: 'Construction & Manufacturing', description: 'Acquire practical skills for construction sites and manufacturing processes.', topics: ['Blueprint Reading', 'Construction Safety', 'Material Handling', 'Quality Control'], type: 'offline' },
      ]
    },
    {
      name: "Soft Skills",
      icon: Handshake,
      programs: [
        { id: 'ss1', title: 'Communication & Presentation', description: 'Enhance your verbal, non-verbal, and written communication skills.', topics: ['Public Speaking', 'Business Writing', 'Active Listening', 'Negotiation'], type: 'online' },
        { id: 'ss2', title: 'Leadership & Team Management', description: 'Develop leadership qualities and learn to effectively manage teams.', topics: ['Delegation', 'Conflict Resolution', 'Motivation', 'Team Building'], type: 'online' },
        { id: 'ss3', title: 'Critical Thinking & Problem Solving', description: 'Improve your ability to analyze situations and devise effective solutions.', topics: ['Analytical Reasoning', 'Decision Making', 'Creative Problem Solving'], type: 'online' },
        { id: 'ss4', title: 'Time Management & Organization', description: 'Learn strategies to manage time efficiently and organize tasks effectively.', topics: ['Prioritization', 'Goal Setting', 'Productivity Hacks', 'Stress Management'], type: 'online' },
      ]
    },
    {
      name: "Learning Development",
      icon: BookOpen,
      programs: [
        { id: 'ld1', title: 'Study Techniques & Strategies', description: 'Optimize your learning process with proven study methods.', topics: ['Active Recall', 'Spaced Repetition', 'Note-taking', 'Exam Preparation'], type: 'online' },
        { id: 'ld2', title: 'Self-Motivation & Goal Setting', description: 'Build self-discipline and set achievable goals for personal and professional growth.', topics: ['SMART Goals', 'Habit Formation', 'Mindset Coaching'], type: 'online' },
        { id: 'ld3', title: 'Metacognitive Skills Development', description: 'Improve your awareness and control over your own thinking processes.', topics: ['Self-reflection', 'Learning to Learn', 'Cognitive Biases'], type: 'online' },
        { id: 'ld4', title: 'Educational Planning & Advancement', description: 'Strategize your educational path for career advancement and lifelong learning.', topics: ['Career Mapping', 'Higher Education Options', 'Certification Planning'], type: 'hybrid' },
      ]
    },
  ];

  const categoryCardStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginBottom: '2rem',
    border: `1px solid ${colorPalette.borderGray}`,
  };

  const programCardStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.8rem',
    border: `1px solid ${colorPalette.borderGray}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  const programCardHoverStyle = {
    backgroundColor: colorPalette.mediumLightGray,
    transform: 'translateX(5px)',
  };

  const programTitleStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginBottom: '0.3rem',
  };

  const programDescriptionStyle = {
    fontSize: '0.85rem',
    color: colorPalette.darkTextGray,
    marginBottom: '0.5rem',
  };

  const programTopicsStyle = {
    fontSize: '0.75rem',
    color: colorPalette.textGray,
    fontStyle: 'italic',
  };

  const enrollButton = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite,
    padding: '0.6rem 1rem',
    borderRadius: '0.4rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '0.8rem',
  };

  const handleEnroll = (programTitle) => {
    showMessage(`Enrolled in "${programTitle}" (mock action)!`, "success");
  };

  return (
    <div>
      <DashboardSectionHeader title="Skill Development & Training" icon={AwardIcon} colorPalette={colorPalette} />
      {categories.map(category => (
        <div key={category.name} style={categoryCardStyle}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colorPalette.primary, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <category.icon size={24} /> {category.name}
          </h3>
          {category.programs.map(program => (
            <div
              key={program.id}
              style={programCardStyle}
              onMouseEnter={e => Object.assign(e.currentTarget.style, programCardHoverStyle)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, programCardStyle)}
            >
              <h4 style={programTitleStyle}>{program.title}</h4>
              <p style={programDescriptionStyle}>{program.description}</p>
              <p style={programTopicsStyle}>Key Topics: {program.topics.join(', ')}</p>
              <button
                style={enrollButton}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onClick={() => handleEnroll(program.title)}
              >
                Learn More <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// New Component: AI Chatbot and Voice Assistance Section
const AIChatbotSection = ({ colorPalette }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  // audioSource is not needed as it's only used internally by playAudio for a brief moment.

  useEffect(() => {
    // Initialize AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      setAudioContext(new AudioContext());
    } else {
      console.error("Web Audio API is not supported in this browser.");
    }
  }, []);

  const chatContainerStyle = {
    backgroundColor: colorPalette.cardBg,
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    height: '70vh', // Fixed height for chat window
    maxHeight: '70vh',
  };

  const messagesContainerStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    marginBottom: '1rem',
    paddingRight: '0.5rem', // For scrollbar
  };

  const messageStyle = (isUser) => ({
    backgroundColor: isUser ? colorPalette.primary : colorPalette.lightGray,
    color: isUser ? colorPalette.pureWhite : colorPalette.darkTextGray,
    padding: '0.8rem 1rem',
    borderRadius: '0.75rem',
    marginBottom: '0.7rem',
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    marginLeft: isUser ? 'auto' : '0',
    marginRight: isUser ? '0' : 'auto',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  });

  const inputAreaStyle = {
    display: 'flex',
    gap: '0.8rem',
    marginTop: 'auto', // Pushes input to bottom
  };

  const textInputStyle = {
    flexGrow: 1,
    padding: '0.8rem 1rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    borderRadius: '0.5rem',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
  };

  const sendButtonStyle = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite,
    padding: '0.8rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  };

  const voiceButtonStyle = {
    backgroundColor: isVoiceRecording ? colorPalette.errorButton : colorPalette.primary,
    color: colorPalette.pureWhite,
    padding: '0.8rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  };

  const loadingIndicatorStyle = {
    alignSelf: 'flex-start',
    backgroundColor: colorPalette.lightGray,
    color: colorPalette.darkTextGray,
    padding: '0.8rem 1rem',
    borderRadius: '0.75rem',
    marginBottom: '0.7rem',
    fontStyle: 'italic',
  };

  const playAudio = async (base64AudioData, mimeType) => {
    if (!audioContext) {
      console.error("AudioContext not initialized. Cannot play audio.");
      return; // Crucial check to prevent "null is not iterable"
    }

    try {
      // Decode base64 to ArrayBuffer
      const binaryString = window.atob(base64AudioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;

      // Determine sample rate from mimeType (e.g., audio/L16;rate=16000)
      const sampleRateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000; // Default to 16kHz if not found

      // Create AudioBuffer from PCM data
      const buffer = audioContext.createBuffer(1, arrayBuffer.byteLength / 2, sampleRate); // PCM16 is 2 bytes per sample
      const nowBuffering = buffer.getChannelData(0);
      const pcm16 = new Int16Array(arrayBuffer);

      for (let i = 0; i < pcm16.length; i++) {
        nowBuffering[i] = pcm16[i] / 32768.0; // Convert 16-bit PCM to float32
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      // setAudioSource(source); // Store source to stop if needed

      source.onended = () => {
        // setAudioSource(null);
      };

    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = { id: Date.now(), text: inputText, isUser: true };
    setChatHistory(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      let currentChatHistory = [...chatHistory, userMessage]; // Include new user message
      const payload = { contents: currentChatHistory.map(msg => ({ role: msg.isUser ? "user" : "model", parts: [{ text: msg.text }] })) };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const botResponseText = result.candidates[0].content.parts[0].text;
        setChatHistory(prev => [...prev, { id: Date.now() + 1, text: botResponseText, isUser: false }]);
      } else {
        setChatHistory(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I couldn't get a response. Please try again.", isUser: false }]);
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setChatHistory(prev => [...prev, { id: Date.now() + 1, text: "Error: Could not connect to the chatbot. Please try again later.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isVoiceRecording) {
      // Stop recording
      mediaRecorder.stop();
      setIsVoiceRecording(false);
      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data]);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1]; // Get base64 data
          // Send base64Audio to a Speech-to-Text API (mocked here)
          const transcribedText = "This is a mock transcription of your voice input."; // Replace with actual API call
          setInputText(transcribedText);
          handleSendMessage(); // Send transcribed text as a message
        };
      };

      recorder.start();
      setIsVoiceRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // showMessage("Could not access microphone. Please ensure permissions are granted.", "error");
    }
  };

  const handleTextToSpeech = async (text) => {
    setIsLoading(true);
    try {
      const payload = {
        contents: [{
          parts: [{ text: text }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" } // Using a predefined voice
            }
          }
        },
        model: "gemini-2.5-flash-preview-tts"
      };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        await playAudio(audioData, mimeType);
      } else {
        console.error("No audio data received or unexpected mime type.");
      }
    } catch (error) {
      console.error("Error during text-to-speech:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DashboardSectionHeader title="AI Chatbot & Voice Assistant" icon={MessageCircle} colorPalette={colorPalette} />
      <div style={chatContainerStyle}>
        <div style={messagesContainerStyle}>
          {chatHistory.map((msg) => (
            <div key={msg.id} style={messageStyle(msg.isUser)}>
              {msg.text}
              {!msg.isUser && ( // Only show TTS button for bot messages
                <button
                  onClick={() => handleTextToSpeech(msg.text)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colorPalette.textGray,
                    cursor: 'pointer',
                    marginLeft: '0.5rem',
                    verticalAlign: 'middle',
                  }}
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>
          ))}
          {isLoading && (
            <div style={loadingIndicatorStyle}>Typing...</div>
          )}
        </div>
        <div style={inputAreaStyle}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            style={textInputStyle}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            style={{...sendButtonStyle, backgroundColor: isLoading ? colorPalette.placeholderGray : colorPalette.accent}}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = colorPalette.primary; }}
            onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = colorPalette.accent; }}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
          <button
            onClick={handleVoiceInput}
            style={{...voiceButtonStyle, backgroundColor: isVoiceRecording ? colorPalette.errorButton : colorPalette.primary}}
            onMouseEnter={e => { if (!isVoiceRecording) e.currentTarget.style.backgroundColor = colorPalette.accent; }}
            onMouseLeave={e => { if (!isVoiceRecording) e.currentTarget.style.backgroundColor = colorPalette.primary; }}
            disabled={isLoading}
          >
            {isVoiceRecording ? <XCircle size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main User Dashboard Page Component
const UserDashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboardOverview');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customModalMessage, setCustomModalMessage] = useState('');
  const [customModalType, setCustomModalType] = useState('success'); // 'success' or 'error'
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0); // New state for profile completion
  const [showMoreMenu, setShowMoreMenu] = useState(false); // State for "More" dropdown

  const colorPalette = isDarkMode ? DARK_COLOR_PALETTE : LIGHT_COLOR_PALETTE;

  // Firebase Authentication and Firestore Setup
  useEffect(() => {
    const initializeFirebaseAndAuth = async () => {
      if (!app || !auth || !db) {
        console.error("Firebase app, auth, or db not initialized.");
        return;
      }

      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        console.log("Firebase authentication successful.");
      } catch (error) {
        console.error("Firebase authentication failed:", error);
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
          console.log("User ID:", user.uid);
        } else {
          setUserId(null);
          console.log("No user signed in.");
        }
        setIsAuthReady(true); // Auth state is ready
      });

      return () => unsubscribe();
    };

    initializeFirebaseAndAuth();
  }, []); // Run only once on component mount

  // Function to show custom message modal
  const handleShowMessage = (message, type) => {
    setCustomModalMessage(message);
    setCustomModalType(type);
    setShowCustomModal(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Function to save a job to Firestore
  const handleSaveJob = async (job) => {
    if (!userId || !db) {
      handleShowMessage("Please log in to save jobs.", "error");
      return;
    }
    try {
      // Check if job already exists to prevent duplicates
      const savedJobsRef = collection(db, `artifacts/${appId}/users/${userId}/savedJobs`);
      const q = query(savedJobsRef, where("id", "==", job.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await setDoc(doc(savedJobsRef, job.id), job); // Use job.id as document ID
        handleShowMessage(`Job "${job.title}" saved successfully!`, "success");
      } else {
        handleShowMessage(`Job "${job.title}" is already saved.`, "info");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      handleShowMessage(`Failed to save job: ${error.message}`, "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleShowMessage("Logged out successfully!", "success");
      // Optionally redirect to login page or clear state
      setActiveSection('dashboardOverview'); // Reset view
      setUserId(null); // Clear userId
      setIsAuthReady(false); // Reset auth state
    } catch (error) {
      console.error("Error logging out:", error);
      handleShowMessage(`Logout failed: ${error.message}`, "error");
    }
  };

  const sidebarStyle = {
    width: '250px',
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite,
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    boxShadow: `5px 0 15px ${colorPalette.shadowColor}`,
    zIndex: 50,
    transition: 'transform 0.3s ease-in-out',
    transform: window.innerWidth < 768 && activeSection !== 'menu' ? 'translateX(-100%)' : 'translateX(0)', // Hide sidebar on small screens unless menu is active
  };

  const mainContentStyle = {
    marginLeft: window.innerWidth < 768 ? '0' : '265px', // Increased margin for gap
    padding: '1.5rem',
    backgroundColor: colorPalette.bodyBg,
    minHeight: '100vh',
    flexGrow: 1,
    transition: 'margin-left 0.3s ease-in-out',
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '0.6rem',
    cursor: 'pointer',
    backgroundColor: isActive ? colorPalette.accent : 'transparent',
    color: isActive ? colorPalette.pureWhite : colorPalette.pureWhite,
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'background-color 0.2s, color 0.2s',
  });

  const navItemHoverStyle = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite,
  };

  const headerStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: `0 2px 8px ${colorPalette.shadowColor}`,
  };

  const headerTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
  };

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.textGray,
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, color 0.2s',
  };

  const iconButtonHoverStyle = {
    backgroundColor: colorPalette.lightGray,
    color: colorPalette.primary,
  };

  const mobileMenuButtonStyle = {
    display: window.innerWidth < 768 ? 'block' : 'none', // Only show on small screens
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.blackText,
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  };

  const mobileMenuCloseButtonStyle = {
    display: window.innerWidth < 768 ? 'block' : 'none', // Only show on small screens
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.pureWhite,
    padding: '0.5rem',
    borderRadius: '50%',
    alignSelf: 'flex-end',
    marginBottom: '1rem',
  };

  const sidebarHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: `1px solid rgba(255,255,255,0.2)`,
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: colorPalette.pureWhite,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const userIdDisplayStyle = {
    fontSize: '0.75rem',
    color: colorPalette.mediumLightGray,
    padding: '0.5rem 0.8rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '0.5rem',
    wordBreak: 'break-all',
    marginTop: '1.5rem',
    textAlign: 'center',
  };

  const moreDropdownStyle = {
    position: 'absolute',
    backgroundColor: colorPalette.primary,
    borderRadius: '0.5rem',
    boxShadow: `0 4px 15px ${colorPalette.shadowColor}`,
    zIndex: 60,
    minWidth: '200px',
    top: '100%', // Position below the "More" button
    left: '0',
    marginTop: '0.5rem',
    padding: '0.5rem 0',
  };

  const moreDropdownItemStyle = {
    padding: '0.8rem 1rem',
    display: 'flex',
    alignItems: 'center',
    color: colorPalette.pureWhite,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const moreDropdownItemHoverStyle = {
    backgroundColor: colorPalette.accent,
  };

  // Conditional rendering for mobile sidebar
  const isMobileMenuOpen = window.innerWidth < 768 && activeSection === 'menu';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: window.innerWidth < 768 ? 'column' : 'row', fontFamily: '"Inter", sans-serif' }}>
      {/* Mobile Header for Dashboard Title and Menu Button */}
      {window.innerWidth < 768 && (
        <div style={headerStyle}>
          <button
            style={mobileMenuButtonStyle}
            onClick={() => setActiveSection('menu')}
          >
            <Menu size={24} />
          </button>
          <h1 style={headerTitleStyle}>User Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              style={iconButtonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconButtonStyle)}
              onClick={() => setShowNotificationsModal(true)}
            >
              <Bell size={20} />
            </button>
            <button
              style={iconButtonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconButtonStyle)}
              onClick={() => setActiveSection('profileDetails')}
            >
              <User size={20} />
            </button>
            <button
              style={iconButtonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconButtonStyle)}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ ...sidebarStyle, transform: isMobileMenuOpen ? 'translateX(0)' : (window.innerWidth < 768 ? 'translateX(-100%)' : 'translateX(0)') }}>
        <div style={sidebarHeaderStyle}>
          <div style={logoStyle}>
            <Monitor size={32} /> Bihar Rojgar {/* Renamed from Bihar KIOSK */}
          </div>
          {window.innerWidth < 768 && (
            <button
              style={mobileMenuCloseButtonStyle}
              onClick={() => setActiveSection('dashboardOverview')} // Close menu and go to dashboard
            >
              <X size={24} />
            </button>
          )}
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li
              style={navItemStyle(activeSection === 'dashboardOverview')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'dashboardOverview'))}
              onClick={() => { setActiveSection('dashboardOverview'); setShowMoreMenu(false); }}
            >
              <Home size={20} style={{ marginRight: '0.8rem' }} /> Dashboard
            </li>
            <li
              style={navItemStyle(activeSection === 'jobSearch')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'jobSearch'))}
              onClick={() => { setActiveSection('jobSearch'); setShowMoreMenu(false); }}
            >
              <Search size={20} style={{ marginRight: '0.8rem' }} /> Job Search
            </li>
            <li
              style={navItemStyle(activeSection === 'appliedJobs')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'appliedJobs'))}
              onClick={() => { setActiveSection('appliedJobs'); setShowMoreMenu(false); }}
            >
              <ClipboardCheck size={20} style={{ marginRight: '0.8rem' }} /> My Applications
            </li>
            <li
              style={navItemStyle(activeSection === 'savedJobs')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'savedJobs'))}
              onClick={() => { setActiveSection('savedJobs'); setShowMoreMenu(false); }}
            >
              <Bookmark size={20} style={{ marginRight: '0.8rem' }} /> Saved Jobs
            </li>
            <li
              style={navItemStyle(activeSection === 'resumeManagement')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'resumeManagement'))}
              onClick={() => { setActiveSection('resumeManagement'); setShowMoreMenu(false); }}
            >
              <FileText size={20} style={{ marginRight: '0.8rem' }} /> Resume & Docs
            </li>
            <li
              style={navItemStyle(activeSection === 'aiChatbot')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'aiChatbot'))}
              onClick={() => { setActiveSection('aiChatbot'); setShowMoreMenu(false); }}
            >
              <MessageCircle size={20} style={{ marginRight: '0.8rem' }} /> AI Chatbot
            </li>
            {/* "More" option for less frequently accessed items */}
            <li
              style={{ ...navItemStyle(showMoreMenu || ['resumeTemplates', 'recommendations', 'profilePerformance', 'mockTests', 'skillDevelopment'].includes(activeSection)), position: 'relative' }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(showMoreMenu || ['resumeTemplates', 'recommendations', 'profilePerformance', 'mockTests', 'skillDevelopment'].includes(activeSection)))}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <List size={20} style={{ marginRight: '0.8rem' }} /> More
              <ChevronRight size={16} style={{ marginLeft: 'auto', transform: showMoreMenu ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              {showMoreMenu && (
                <ul style={moreDropdownStyle}>
                  <li
                    style={moreDropdownItemStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, moreDropdownItemHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, moreDropdownItemStyle)}
                    onClick={() => { setActiveSection('resumeTemplates'); setShowMoreMenu(false); }}
                  >
                    <FilePlus size={20} style={{ marginRight: '0.8rem' }} /> Resume Templates
                  </li>
                  <li
                    style={moreDropdownItemStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, moreDropdownItemHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, moreDropdownItemStyle)}
                    onClick={() => { setActiveSection('recommendations'); setShowMoreMenu(false); }}
                  >
                    <Compass size={20} style={{ marginRight: '0.8rem' }} /> Recommendations
                  </li>
                  <li
                    style={moreDropdownItemStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, moreDropdownItemHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, moreDropdownItemStyle)}
                    onClick={() => { setActiveSection('profilePerformance'); setShowMoreMenu(false); }}
                  >
                    <BarChart2 size={20} style={{ marginRight: '0.8rem' }} /> Profile Performance
                  </li>
                  <li
                    style={moreDropdownItemStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, moreDropdownItemHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, moreDropdownItemStyle)}
                    onClick={() => { setActiveSection('mockTests'); setShowMoreMenu(false); }}
                  >
                    <Target size={20} style={{ marginRight: '0.8rem' }} /> Mock Tests
                  </li>
                  <li
                    style={moreDropdownItemStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, moreDropdownItemHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, moreDropdownItemStyle)}
                    onClick={() => { setActiveSection('skillDevelopment'); setShowMoreMenu(false); }}
                  >
                    <GraduationCap size={20} style={{ marginRight: '0.8rem' }} /> Skill Development
                  </li>
                </ul>
              )}
            </li>
            <li
              style={navItemStyle(activeSection === 'settings')}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(activeSection === 'settings'))}
              onClick={() => { setActiveSection('settings'); setShowMoreMenu(false); }}
            >
              <Settings size={20} style={{ marginRight: '0.8rem' }} /> Settings
            </li>
            <li
              style={{ ...navItemStyle(false), marginTop: 'auto' }} // Push to bottom
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, navItemHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, navItemStyle(false))}
              onClick={handleLogout}
            >
              <LogOut size={20} style={{ marginRight: '0.8rem' }} /> Logout
            </li>
          </ul>
        </nav>
        {userId && (
          <div style={userIdDisplayStyle}>
            User ID: {userId}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={mainContentStyle}>
        {/* Desktop Header (hidden on mobile as mobile header takes over) */}
        {window.innerWidth >= 768 && (
          <div style={{ ...headerStyle, marginBottom: '1.5rem' }}>
            <h1 style={headerTitleStyle}>User Dashboard</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <button
                style={iconButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconButtonStyle)}
                onClick={() => setShowNotificationsModal(true)}
              >
                <Bell size={20} />
              </button>
              <button
                style={iconButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconButtonStyle)}
                onClick={() => setActiveSection('profileDetails')}
              >
                <User size={20} />
              </button>
              <button
                style={iconButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, iconButtonStyle)}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* Small Advertisement/Announcement */}
        <div style={{
          backgroundColor: colorPalette.accent,
          color: colorPalette.pureWhite,
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
          flexWrap: 'wrap', // Allow wrapping on small screens
        }}>
          <Lightbulb size={24} style={{ flexShrink: 0 }} />
          <p style={{ flexGrow: 1, fontSize: '0.95rem', margin: 0 }}>
            <span style={{ fontWeight: 'bold' }}>Announcement:</span> New government job openings for various departments in Bihar are now live! Check the 'Job Search' section for details.
          </p>
          <button
            onClick={() => setActiveSection('jobSearch')}
            style={{
              backgroundColor: colorPalette.primary,
              color: colorPalette.pureWhite,
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'background-color 0.3s',
              flexShrink: 0, // Prevent shrinking on wrap
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
          >
            View Jobs <ChevronRight size={14} />
          </button>
        </div>

        {/* Render Sections based on activeSection state */}
        {isAuthReady ? (
          <>
            {activeSection === 'dashboardOverview' && <ProfileOverviewSection userId={userId} setActiveSection={setActiveSection} colorPalette={colorPalette} profileCompletion={profileCompletion} />}
            {activeSection === 'jobSearch' && <JobSearchSection onSaveJob={handleSaveJob} showMessage={handleShowMessage} colorPalette={colorPalette} />}
            {activeSection === 'appliedJobs' && <AppliedJobsSection userId={userId} db={db} colorPalette={colorPalette} />}
            {activeSection === 'savedJobs' && <SavedJobsSection userId={userId} db={db} colorPalette={colorPalette} />}
            {activeSection === 'resumeManagement' && <ResumeManagementSection userId={userId} db={db} showMessage={handleShowMessage} colorPalette={colorPalette} />}
            {activeSection === 'resumeTemplates' && <ResumeTemplatesSection showMessage={handleShowMessage} colorPalette={colorPalette} />}
            {activeSection === 'recommendations' && <RecommendationsSection showMessage={handleShowMessage} colorPalette={colorPalette} />}
            {activeSection === 'profilePerformance' && <ProfilePerformanceSection showMessage={handleShowMessage} colorPalette={colorPalette} />}
            {activeSection === 'mockTests' && <MockTestsSection showMessage={handleShowMessage} colorPalette={colorPalette} setActiveSection={setActiveSection} />}
            {activeSection === 'skillDevelopment' && <SkillDevelopmentSection showMessage={handleShowMessage} colorPalette={colorPalette} />}
            {activeSection === 'aiChatbot' && <AIChatbotSection colorPalette={colorPalette} />}
            {activeSection === 'settings' && <SettingsSection showMessage={handleShowMessage} setActiveSection={setActiveSection} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} colorPalette={colorPalette} />}
            {activeSection === 'profileDetails' && <ProfileDetailsSection userId={userId} db={db} showMessage={handleShowMessage} colorPalette={colorPalette} setProfileCompletion={setProfileCompletion} />}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', color: colorPalette.textGray }}>
            Loading dashboard... Please wait.
          </div>
        )}
      </div>

      {showCustomModal && (
        <CustomMessageModal
          message={customModalMessage}
          type={customModalType}
          onClose={() => setShowCustomModal(false)}
          colorPalette={colorPalette}
        />
      )}
      {showNotificationsModal && (
        <NotificationsModal onClose={() => setShowNotificationsModal(false)} colorPalette={colorPalette} />
      )}
    </div>
  );
}

// Export the main App component
export default function App() {
  return <UserDashboardPage />;
}
