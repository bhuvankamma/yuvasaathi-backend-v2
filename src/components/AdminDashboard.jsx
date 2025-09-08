import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Home, Settings, LogOut, Users, Briefcase, GraduationCap, BarChart2, FileText, Bell,
  Menu, X, Sun, Moon, PlusCircle, Edit, Trash2, CheckCircle, XCircle, ChevronRight, MessageSquare, List,
  Lock, UserCheck, Mail, Image as ImageIcon
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

// Ensure __app_id and __firebase_config are defined in the environment
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'standalone-admin-dashboard';
const firebaseConfig = typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : {
  // Minimal placeholder Firebase config for standalone testing
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.Iinitial_auth_token : null;

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

// Define color palettes
const LIGHT_COLOR_PALETTE = {
  primary: '#1A5276',   // Dark blue-grey
  primaryGradient: 'linear-gradient(to bottom right, #1A5276, #2874A6)', // Gradient for primary
  accent: '#2874A6',    // Medium blue
  lightGray: '#F8F9F9', // Very light grey
  mediumLightGray: '#E9F0F3', // Slightly darker light gray
  borderGray: '#D5DBDB', // Gray for borders
  placeholderGray: '#95A5A6', // Gray for placeholders/icons
  textGray: '#5D6D7E',   // General gray text
  darkTextGray: '#34495E', // Darker gray text
  blackText: '#2C3E50',  // Very dark text, almost black

  successBg: '#D4EFDF',  // Light green
  successText: '#28B463', // Dark green
  successBorder: '#82E0AA', // Medium green
  successButton: '#2ECC71', // Green
  successButtonHover: '#28B463', // Darker green

  errorBg: '#FADBD8',    // Light red
  errorText: '#CB4335',   // Dark red
  errorBorder: '#F1948A', // Medium red
  errorButton: '#E74C3C', // Red
  errorButtonHover: '#CB4335', // Darker red

  white: '#ffffff',
  pureWhite: '#FFFFFF',
  blackOverlay: 'rgba(0, 0, 0, 0.7)',
  bodyBg: 'linear-gradient(to bottom right, #EBEDEF, #D5DBDB)', // Light gradient background
  cardBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  inputBorder: '#D5DBDB',
  shadowColor: 'rgba(0, 0, 0, 0.15)', // Slightly stronger shadow
};

const DARK_COLOR_PALETTE = {
  primary: '#2C3E50',   // Dark blue-grey for primary
  primaryGradient: 'linear-gradient(to bottom right, #2C3E50, #34495E)', // Gradient for primary
  accent: '#34495E',    // Darker blue for accent
  lightGray: '#4A6572', // Darker gray
  mediumLightGray: '#5D7C8C', // Even darker for contrast
  borderGray: '#708D9C', // Lighter gray for borders
  placeholderGray: '#BDC3C7', // Lighter gray for placeholders
  textGray: '#BDC3C7',   // Light text
  darkTextGray: '#ECF0F1', // White text
  blackText: '#ECF0F1',  // White text

  successBg: '#1F6A44',  // Darker green
  successText: '#D4EFDF', // Light green
  successBorder: '#39A36E', // Green
  successButton: '#2ECC71', // Green
  successButtonHover: '#28B463', // Darker green

  errorBg: '#943126',    // Darker red
  errorText: '#FADBD8',   // Light red
  errorBorder: '#C0392B', // Red
  errorButton: '#E74C3C', // Red
  errorButtonHover: '#CB4335', // Darker red

  white: '#212121', // Dark background for things that were white
  pureWhite: '#FFFFFF',
  blackOverlay: 'rgba(0, 0, 0, 0.85)',
  bodyBg: 'linear-gradient(to bottom right, #1A212E, #2E4053)', // Very dark gradient background
  cardBg: '#2E4053', // Dark card background
  inputBg: '#394B5C', // Dark input background
  inputBorder: '#4A6572',
  shadowColor: 'rgba(0, 0, 0, 0.4)', // Stronger shadow for dark mode
};


// --- Custom Modal Components ---
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  };

  const contentStyles = {
    position: 'relative',
    backgroundColor: bgColor,
    borderRadius: '0.75rem',
    boxShadow: `0 10px 20px ${colorPalette.shadowColor}`,
    padding: '1.5rem',
    textAlign: 'center',
    maxWidth: '20rem',
    width: '100%',
    transition: 'all 0.3s ease-out',
    animation: 'fade-in-up 0.5s ease-out',
    border: `1px solid ${borderColor}`,
  };

  const buttonStyles = {
    width: '100%',
    backgroundColor: buttonBg,
    color: colorPalette.pureWhite,
    padding: '0.5rem 0',
    borderRadius: '0.25rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
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
    padding: window.innerWidth <= 768 ? '0.5rem' : '1rem', // Smaller padding on mobile
    overflowY: 'auto',
  };

  const contentStyles = {
    position: 'relative',
    backgroundColor: colorPalette.cardBg,
    borderRadius: '0.75rem',
    boxShadow: `0 15px 30px ${colorPalette.shadowColor}`,
    padding: window.innerWidth <= 768 ? '1rem' : '1.5rem', // Smaller padding on mobile
    width: '100%',
    maxWidth: window.innerWidth <= 768 ? '95vw' : '50rem', // Max width for mobile
    height: 'auto',
    minHeight: window.innerWidth <= 768 ? '80vh' : '70vh', // Min height for mobile
    maxHeight: '95vh', // Max height for all screens
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
    marginBottom: '1rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    paddingBottom: '0.75rem',
  };

  const titleStyles = {
    fontSize: window.innerWidth <= 768 ? '1.4rem' : '1.8rem', // Smaller title on mobile
    fontWeight: 'bold',
    color: colorPalette.blackText,
  };

  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colorPalette.textGray,
    transition: 'color 0.2s',
    padding: '0.4rem',
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
            <X size={24} />
          </button>
        </div>
        <div style={{ flexGrow: 1, padding: '0.75rem 0' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// New Confirmation Modal
const ConfirmationModal = ({ message, onConfirm, onCancel, colorPalette }) => {
  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001, // Higher than custom message modal
    padding: '1rem',
  };

  const contentStyles = {
    backgroundColor: colorPalette.cardBg,
    borderRadius: '0.75rem',
    boxShadow: `0 10px 20px ${colorPalette.shadowColor}`,
    padding: '1.5rem',
    textAlign: 'center',
    maxWidth: '22rem', // Slightly larger for text
    width: '100%',
    border: `1px solid ${colorPalette.borderGray}`,
    animation: 'fade-in-up 0.5s ease-out',
  };

  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  };

  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
  };

  const confirmButtonStyle = {
    backgroundColor: colorPalette.errorButton,
    color: colorPalette.pureWhite,
  };

  const cancelButtonStyles = {
    backgroundColor: colorPalette.lightGray,
    color: colorPalette.blackText,
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <p style={{ fontSize: '1rem', color: colorPalette.darkTextGray, marginBottom: '1.5rem' }}>{message}</p>
        <div style={buttonContainerStyles}>
          <button
            onClick={onConfirm}
            style={{ ...buttonStyle, ...confirmButtonStyle }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colorPalette.errorButtonHover; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colorPalette.errorButton; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            style={{ ...buttonStyle, ...cancelButtonStyles }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colorPalette.lightGray; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Admin Dashboard Sections ---

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

// Admin Dashboard Overview
const AdminDashboardOverview = ({ colorPalette, showMessage }) => {
  const stats = [
    { label: "Total Users", value: "50,000+", icon: Users, color: colorPalette.primary },
    { label: "Active Jobs", value: "2,500+", icon: Briefcase, color: colorPalette.accent },
    { label: "Applications Received", value: "15,000+", icon: CheckCircle, color: colorPalette.successButton },
    { label: "Skill Programs", value: "150+", icon: GraduationCap, color: colorPalette.errorButton },
  ];

  const cardStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginBottom: '1.5rem',
    border: `1px solid ${colorPalette.borderGray}`,
    textAlign: 'center',
    transition: 'all 0.3s ease',
  };

  const cardHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`,
    transform: 'translateY(-3px)',
    borderColor: colorPalette.primary,
  };

  const statValueStyle = {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginTop: '0.8rem',
    marginBottom: '0.4rem',
  };

  const statLabelStyle = {
    fontSize: '1rem',
    color: colorPalette.textGray,
  };

  return (
    <div>
      <DashboardSectionHeader title="Dashboard Overview" icon={Home} colorPalette={colorPalette} />
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <stat.icon size={40} style={{ color: stat.color }} />
            <p style={statValueStyle}>{stat.value}</p>
            <p style={statLabelStyle}>{stat.label}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '2.5rem', marginBottom: '1.5rem' }}>
        Recent Activity
      </h3>
      <div style={{ ...cardStyle, textAlign: 'left', padding: '1.2rem', marginBottom: '0' }}>
        <p style={{ color: colorPalette.darkTextGray, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          **July 24, 2024:** 15 new users registered, 5 job postings approved.
        </p>
        <p style={{ color: colorPalette.darkTextGray, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          **July 23, 2024:** "Digital Literacy Program" updated, 2 job applications marked as shortlisted.
        </p>
        <p style={{ color: colorPalette.darkTextGray, fontSize: '0.95rem' }}>
          **July 22, 2024:** System maintenance completed.
        </p>
      </div>
    </div>
  );
};


// reusable form field for modals
const ModalFormField = ({ label, name, type = "text", as = "input", options, errors, touched, colorPalette, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor={name} style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: colorPalette.blackText }}>{label}</label>
    {as === "select" ? (
      <Field as="select" id={name} name={name} style={{
        width: '100%',
        padding: '0.6rem 0.8rem',
        border: `1px solid ${errors[name] && touched[name] ? colorPalette.errorButton : colorPalette.inputBorder}`,
        borderRadius: '0.4rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
        backgroundColor: colorPalette.inputBg,
        color: colorPalette.darkTextGray,
      }} {...props}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Field>
    ) : (
      <Field type={type} id={name} name={name} as={as} style={{
        width: '100%',
        padding: '0.6rem 0.8rem',
        border: `1px solid ${errors[name] && touched[name] ? colorPalette.errorButton : colorPalette.inputBorder}`,
        borderRadius: '0.4rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box', // Fixed typo here from 'border-sizing'
        backgroundColor: colorPalette.inputBg,
        color: colorPalette.darkTextGray,
      }} {...props} />
    )}
    <ErrorMessage name={name} component="div" style={{ color: colorPalette.errorText, fontSize: '0.8rem', marginTop: '0.2rem' }} />
  </div>
);

// Reusable modal action buttons
const ModalActionButtons = ({ onClose, isSubmitting, colorPalette }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
    <button
      type="button"
      onClick={onClose}
      style={{
        backgroundColor: colorPalette.borderGray,
        color: colorPalette.blackText,
        padding: '0.7rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontWeight: '600',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.borderGray}
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      style={{
        backgroundColor: colorPalette.successButton,
        color: colorPalette.pureWhite,
        padding: '0.7rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontWeight: '600',
        fontSize: '1rem',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
        opacity: isSubmitting ? 0.7 : 1,
        transition: 'background-color 0.3s',
      }}
      onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = colorPalette.successButtonHover; }}
      onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = colorPalette.successButton; }}
    >
      {isSubmitting ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
);

// Change Password Modal (Admin)
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
    setTimeout(() => {
      showMessage("Admin password changed successfully!", "success");
      resetForm();
      onClose();
      setSubmitting(false);
    }, 1500);
  };

  return (
    <FullPageModal title="Change Admin Password" onClose={onClose} colorPalette={colorPalette}>
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
            <ModalFormField label="Current Password" name="currentPassword" type="password" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField label="New Password" name="newPassword" type="password" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField label="Confirm New Password" name="confirmNewPassword" type="password" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

// Admin Profile Details Section
const AdminProfileDetails = ({ colorPalette, showMessage, profileData, setProfileData }) => { // Added profileData, setProfileData
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      setProfileData(prev => ({ ...prev, ...values }));
      setIsEditing(false);
      setSubmitting(false);
      showMessage('Admin profile updated successfully!', 'success');
    }, 1000);
  };

  const sectionStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginBottom: '1.5rem',
  };

  const detailRowStyle = {
    display: 'flex',
    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
    alignItems: window.innerWidth < 768 ? 'flex-start' : 'flex-start',
    marginBottom: '0.8rem',
    fontSize: '0.9rem',
    color: colorPalette.darkTextGray,
  };

  const detailLabelStyle = {
    fontWeight: 'bold',
    marginRight: '0.5rem',
    color: colorPalette.blackText,
    minWidth: window.innerWidth < 768 ? 'auto' : '10rem',
    marginBottom: window.innerWidth < 768 ? '0.2rem' : '0',
    flexShrink: 0,
  };

  const editButtonStyle = {
    backgroundColor: colorPalette.accent,
    color: colorPalette.pureWhite,
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

  const formActionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  };

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

  return (
    <div>
      <DashboardSectionHeader title="Admin Profile" icon={Users} colorPalette={colorPalette} />
      <div style={sectionStyle}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1.5rem' }}>Profile Information</h3>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <img src={profileData.profilePicture} alt="Admin Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${colorPalette.primary}`, marginBottom: '1rem' }} />
          <input
            type="file"
            id="adminProfilePicUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfilePicChange}
          />
          <label htmlFor="adminProfilePicUpload" style={{ ...editButtonStyle, marginTop: '0', backgroundColor: colorPalette.accent }}>
            <ImageIcon size={16} /> Change Profile Picture
          </label>
        </div>

        {!isEditing ? (
          <>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Name:</span> <span>{profileData.name}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Email:</span> <span>{profileData.email}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Role:</span> <span>{profileData.role}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Last Login:</span> <span>{profileData.lastLogin}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button
                style={editButtonStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} /> Edit Profile
              </button>
              <button
                style={{...editButtonStyle, backgroundColor: colorPalette.errorButton}}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.errorButtonHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.errorButton}
                onClick={() => setShowChangePasswordModal(true)}
              >
                <Lock size={16} /> Change Password
              </button>
            </div>
          </>
        ) : (
          <Formik
            initialValues={{ name: profileData.name, email: profileData.email, role: profileData.role }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              email: Yup.string().email('Invalid email address').required('Email is required'),
              role: Yup.string().required('Role is required'),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <ModalFormField label="Name" name="name" errors={errors} touched={touched} colorPalette={colorPalette} />
                <ModalFormField label="Email" name="email" type="email" errors={errors} touched={touched} colorPalette={colorPalette} />
                <ModalFormField label="Role" name="role" errors={errors} touched={touched} colorPalette={colorPalette} />
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
      {showChangePasswordModal && (
        <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} showMessage={showMessage} colorPalette={colorPalette} />
      )}
    </div>
  );
};


// Add/Edit User Modals
const AddUserModal = ({ onClose, showMessage, colorPalette, onAddUser }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      onAddUser({ id: `u${Date.now()}`, ...values, status: 'Active' });
      showMessage('User added successfully!', 'success');
      resetForm();
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title="Add New User" onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ name: '', email: '', role: 'User' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
          role: Yup.string().required('Role is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Full Name" name="name" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField label="Email" name="email" type="email" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField
              label="Role"
              name="role"
              as="select"
              options={[{ value: 'User', label: 'User' }, { value: 'Admin', label: 'Admin' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

const EditUserModal = ({ onClose, showMessage, colorPalette, onEditUser, user }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      onEditUser({ ...user, ...values });
      showMessage('User updated successfully!', 'success');
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title={`Edit User: ${user.name}`} onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ name: user.name, email: user.email, role: user.role, status: user.status }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
          role: Yup.string().required('Role is required'),
          status: Yup.string().required('Status is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Full Name" name="name" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField label="Email" name="email" type="email" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField
              label="Role"
              name="role"
              as="select"
              options={[{ value: 'User', label: 'User' }, { value: 'Admin', label: 'Admin' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalFormField
              label="Status"
              name="status"
              as="select"
              options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

// User Management Section
const UserManagement = ({ colorPalette, showMessage }) => {
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Ravi Kumar', email: 'ravi.k@example.com', role: 'User', status: 'Active' },
    { id: 'u2', name: 'Suman Devi', email: 'suman.d@example.com', role: 'User', status: 'Active' },
    { id: 'u3', name: 'Amit Singh', email: 'amit.s@example.com', role: 'User', status: 'Inactive' },
    { id: 'u4', name: 'Priya Sharma', email: 'priya.s@example.com', role: 'User', status: 'Active' },
    { id: 'u5', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
  ]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDeleteUserModal, setShowConfirmDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleAddUser = (newUser) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const requestDeleteUser = (user) => { // New function to trigger confirmation
    setUserToDelete(user);
    setShowConfirmDeleteUserModal(true);
  };

  const confirmDeleteUser = () => { // New function to handle actual deletion
    setUsers(users.filter(user => user.id !== userToDelete.id));
    showMessage(`User "${userToDelete.name}" deleted successfully!`, "success");
    setShowConfirmDeleteUserModal(false);
    setUserToDelete(null);
  };

  const tableHeaderStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
  };

  const tableRowStyle = {
    backgroundColor: colorPalette.cardBg,
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    transition: 'background-color 0.2s',
  };

  const tableRowHoverStyle = {
    backgroundColor: colorPalette.mediumLightGray,
  };

  const tableCellStyle = {
    padding: '0.8rem 1rem',
    color: colorPalette.darkTextGray,
    fontSize: '0.9rem',
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    margin: '0 0.3rem',
    transition: 'color 0.2s',
  };

  const editButtonStyle = { ...actionButtonStyle, color: colorPalette.accent };
  const deleteButtonStyle = { ...actionButtonStyle, color: colorPalette.errorButton };

  return (
    <div>
      <DashboardSectionHeader title="User Management" icon={Users} colorPalette={colorPalette} />
      <div style={{
        backgroundColor: colorPalette.cardBg,
        borderRadius: '0.75rem',
        boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
        overflowX: 'auto', // Make table horizontally scrollable on small screens
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                style={tableRowStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, tableRowStyle)}
              >
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{user.role}</td>
                <td style={tableCellStyle}>{user.status}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => { setSelectedUser(user); setShowEditUserModal(true); }}
                    style={editButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.primary}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.accent}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => requestDeleteUser(user)} // Use requestDeleteUser
                    style={deleteButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.errorButtonHover}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.errorButton}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowAddUserModal(true)}
        style={{
          backgroundColor: colorPalette.successButton,
          color: colorPalette.pureWhite,
          padding: '0.8rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
      >
        <PlusCircle size={20} /> Add New User
      </button>

      {showAddUserModal && (
        <AddUserModal onClose={() => setShowAddUserModal(false)} showMessage={showMessage} colorPalette={colorPalette} onAddUser={handleAddUser} />
      )}
      {showEditUserModal && selectedUser && (
        <EditUserModal onClose={() => setShowEditUserModal(false)} showMessage={showMessage} colorPalette={colorPalette} onEditUser={handleEditUser} user={selectedUser} />
      )}
      {showConfirmDeleteUserModal && userToDelete && ( // Render confirmation modal
        <ConfirmationModal
          message={`Are you sure you want to delete user "${userToDelete.name}"? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setShowConfirmDeleteUserModal(false)}
          colorPalette={colorPalette}
        />
      )}
    </div>
  );
};

// Add/Edit Job Modals
const AddJobModal = ({ onClose, showMessage, colorPalette, onAddJob }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      onAddJob({ id: `j${Date.now()}`, ...values, date: new Date().toISOString().split('T')[0] });
      showMessage('Job added successfully!', 'success');
      resetForm();
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title="Add New Job" onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ title: '', company: '', status: 'Pending' }}
        validationSchema={Yup.object({
          title: Yup.string().required('Job Title is required'),
          company: Yup.string().required('Company is required'),
          status: Yup.string().required('Status is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Job Title" name="title" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField label="Company" name="company" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField
              label="Status"
              name="status"
              as="select"
              options={[{ value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

const EditJobModal = ({ onClose, showMessage, colorPalette, onEditJob, job }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      onEditJob({ ...job, ...values });
      showMessage('Job updated successfully!', 'success');
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title={`Edit Job: ${job.title}`} onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ title: job.title, company: job.company, status: job.status }}
        validationSchema={Yup.object({
          title: Yup.string().required('Job Title is required'),
          company: Yup.string().required('Company is required'),
          status: Yup.string().required('Status is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Job Title" name="title" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField label="Company" name="company" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField
              label="Status"
              name="status"
              as="select"
              options={[{ value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

// Job Posting Management Section
const JobManagement = ({ colorPalette, showMessage }) => {
  const [jobs, setJobs] = useState([
    { id: 'j1', title: 'Software Engineer', company: 'Tech Solutions', status: 'Approved', date: '2024-07-20' },
    { id: 'j2', title: 'Marketing Manager', company: 'Global Brands', status: 'Pending', date: '2024-07-18' },
    { id: 'j3', title: 'Data Analyst', company: 'Analytics Co.', status: 'Approved', date: '2024-07-15' },
    { id: 'j4', title: 'HR Executive', company: 'People First', status: 'Rejected', date: '2024-07-10' },
  ]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showConfirmDeleteJobModal, setShowConfirmDeleteJobModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleAddJob = (newJob) => {
    setJobs(prevJobs => [...prevJobs, newJob]);
  };

  const handleEditJob = (updatedJob) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
  };

  const requestDeleteJob = (job) => { // New function to trigger confirmation
    setJobToDelete(job);
    setShowConfirmDeleteJobModal(true);
  };

  const confirmDeleteJob = () => { // New function to handle actual deletion
    setJobs(jobs.filter(job => job.id !== jobToDelete.id));
    showMessage(`Job "${jobToDelete.title}" deleted successfully!`, "success");
    setShowConfirmDeleteJobModal(false);
    setJobToDelete(null);
  };

  const handleApproveReject = (jobId, status) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: status } : job));
    showMessage(`Job ${jobId} status updated to ${status}!`, "success");
  };

  const tableHeaderStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
  };

  const tableRowStyle = {
    backgroundColor: colorPalette.cardBg,
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    transition: 'background-color 0.2s',
  };

  const tableRowHoverStyle = {
    backgroundColor: colorPalette.mediumLightGray,
  };

  const tableCellStyle = {
    padding: '0.8rem 1rem',
    color: colorPalette.darkTextGray,
    fontSize: '0.9rem',
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    margin: '0 0.3rem',
    transition: 'color 0.2s',
  };

  const approveButtonStyle = { ...actionButtonStyle, color: colorPalette.successButton };
  const rejectButtonStyle = { ...actionButtonStyle, color: colorPalette.errorButton };
  const editButtonStyle = { ...actionButtonStyle, color: colorPalette.accent };
  const deleteButtonStyle = { ...actionButtonStyle, color: colorPalette.errorButton };


  return (
    <div>
      <DashboardSectionHeader title="Job Posting Management" icon={Briefcase} colorPalette={colorPalette} />
      <div style={{
        backgroundColor: colorPalette.cardBg,
        borderRadius: '0.75rem',
        boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Job Title</th>
              <th style={tableHeaderStyle}>Company</th>
              <th style={tableHeaderStyle}>Date Posted</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr
                key={job.id}
                style={tableRowStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, tableRowStyle)}
              >
                <td style={tableCellStyle}>{job.title}</td>
                <td style={tableCellStyle}>{job.company}</td>
                <td style={tableCellStyle}>{job.date}</td>
                <td style={tableCellStyle}>{job.status}</td>
                <td style={tableCellStyle}>
                  {job.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApproveReject(job.id, 'Approved')}
                        style={approveButtonStyle}
                        onMouseEnter={e => e.currentTarget.style.color = colorPalette.successButtonHover}
                        onMouseLeave={e => e.currentTarget.style.color = colorPalette.successButton}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleApproveReject(job.id, 'Rejected')}
                        style={rejectButtonStyle}
                        onMouseEnter={e => e.currentTarget.style.color = colorPalette.errorButtonHover}
                        onMouseLeave={e => e.currentTarget.style.color = colorPalette.errorButton}
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { setSelectedJob(job); setShowEditJobModal(true); }}
                    style={editButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.primary}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.accent}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => requestDeleteJob(job)} // Use requestDeleteJob
                    style={deleteButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.errorButtonHover}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.errorButton}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowAddJobModal(true)}
        style={{
          backgroundColor: colorPalette.successButton,
          color: colorPalette.pureWhite,
          padding: '0.8rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
      >
        <PlusCircle size={20} /> Add New Job
      </button>

      {showAddJobModal && (
        <AddJobModal onClose={() => setShowAddJobModal(false)} showMessage={showMessage} colorPalette={colorPalette} onAddJob={handleAddJob} />
      )}
      {showEditJobModal && selectedJob && (
        <EditJobModal onClose={() => setShowEditJobModal(false)} showMessage={showMessage} colorPalette={colorPalette} onEditJob={handleEditJob} job={selectedJob} />
      )}
      {showConfirmDeleteJobModal && jobToDelete && ( // Render confirmation modal
        <ConfirmationModal
          message={`Are you sure you want to delete job posting "${jobToDelete.title}"? This action cannot be undone.`}
          onConfirm={confirmDeleteJob}
          onCancel={() => setShowConfirmDeleteJobModal(false)}
          colorPalette={colorPalette}
        />
      )}
    </div>
  );
};

// Add/Edit Skill Program Modals
const AddProgramModal = ({ onClose, showMessage, colorPalette, onAddProgram }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      onAddProgram({ id: `p${Date.now()}`, ...values });
      showMessage('Program added successfully!', 'success');
      resetForm();
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title="Add New Skill Program" onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ name: '', category: '', status: 'Active' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Program Name is required'),
          category: Yup.string().required('Category is required'),
          status: Yup.string().required('Status is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Program Name" name="name" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField
              label="Category"
              name="category"
              as="select"
              options={[{ value: 'IT', label: 'IT' }, { value: 'Vocational', label: 'Vocational' }, { value: 'Soft Skills', label: 'Soft Skills' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalFormField
              label="Status"
              name="status"
              as="select"
              options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

const EditProgramModal = ({ onClose, showMessage, colorPalette, onEditProgram, program }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      onEditProgram({ ...program, ...values });
      showMessage('Program updated successfully!', 'success');
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title={`Edit Program: ${program.name}`} onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ name: program.name, category: program.category, status: program.status }}
        validationSchema={Yup.object({
          name: Yup.string().required('Program Name is required'),
          category: Yup.string().required('Category is required'),
          status: Yup.string().required('Status is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Program Name" name="name" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalFormField
              label="Category"
              name="category"
              as="select"
              options={[{ value: 'IT', label: 'IT' }, { value: 'Vocational', label: 'Vocational' }, { value: 'Soft Skills', label: 'Soft Skills' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalFormField
              label="Status"
              name="status"
              as="select"
              options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
              errors={errors}
              touched={touched}
              colorPalette={colorPalette}
            />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};


// Skill Program Management Section
const SkillProgramManagement = ({ colorPalette, showMessage }) => {
  const [programs, setPrograms] = useState([
    { id: 'p1', name: 'Digital Literacy Program', status: 'Active', category: 'IT' },
    { id: 'p2', name: 'Vocational Training in Handicrafts', status: 'Active', category: 'Vocational' },
    { id: 'p3', name: 'Advanced Excel for Data Analysis', status: 'Inactive', category: 'IT' },
  ]);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [showEditProgramModal, setShowEditProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showConfirmDeleteProgramModal, setShowConfirmDeleteProgramModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);


  const handleAddProgram = (newProgram) => {
    setPrograms(prevPrograms => [...prevPrograms, newProgram]);
  };

  const handleEditProgram = (updatedProgram) => {
    setPrograms(prevPrograms => prevPrograms.map(program => program.id === updatedProgram.id ? updatedProgram : program));
  };

  const requestDeleteProgram = (program) => { // New function to trigger confirmation
    setProgramToDelete(program);
    setShowConfirmDeleteProgramModal(true);
  };

  const confirmDeleteProgram = () => { // New function to handle actual deletion
    setPrograms(programs.filter(program => program.id !== programToDelete.id));
    showMessage(`Program "${programToDelete.name}" deleted successfully!`, "success");
    setShowConfirmDeleteProgramModal(false);
    setProgramToDelete(null);
  };

  const tableHeaderStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
  };

  const tableRowStyle = {
    backgroundColor: colorPalette.cardBg,
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    transition: 'background-color 0.2s',
  };

  const tableRowHoverStyle = {
    backgroundColor: colorPalette.mediumLightGray,
  };

  const tableCellStyle = {
    padding: '0.8rem 1rem',
    color: colorPalette.darkTextGray,
    fontSize: '0.9rem',
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    margin: '0 0.3rem',
    transition: 'color 0.2s',
  };

  const editButtonStyle = { ...actionButtonStyle, color: colorPalette.accent };
  const deleteButtonStyle = { ...actionButtonStyle, color: colorPalette.errorButton };

  return (
    <div>
      <DashboardSectionHeader title="Skill Program Management" icon={GraduationCap} colorPalette={colorPalette} />
      <div style={{
        backgroundColor: colorPalette.cardBg,
        borderRadius: '0.75rem',
        boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Program Name</th>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(program => (
              <tr
                key={program.id}
                style={tableRowStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, tableRowStyle)}
              >
                <td style={tableCellStyle}>{program.name}</td>
                <td style={tableCellStyle}>{program.category}</td>
                <td style={tableCellStyle}>{program.status}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => { setSelectedProgram(program); setShowEditProgramModal(true); }}
                    style={editButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.primary}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.accent}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => requestDeleteProgram(program)} // Use requestDeleteProgram
                    style={deleteButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.errorButtonHover}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.errorButton}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowAddProgramModal(true)}
        style={{
          backgroundColor: colorPalette.successButton,
          color: colorPalette.pureWhite,
          padding: '0.8rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
      >
        <PlusCircle size={20} /> Add New Program
      </button>

      {showAddProgramModal && (
        <AddProgramModal onClose={() => setShowAddProgramModal(false)} showMessage={showMessage} colorPalette={colorPalette} onAddProgram={handleAddProgram} />
      )}
      {showEditProgramModal && selectedProgram && (
        <EditProgramModal onClose={() => setShowEditProgramModal(false)} showMessage={showMessage} colorPalette={colorPalette} onEditProgram={handleEditProgram} program={selectedProgram} />
      )}
      {showConfirmDeleteProgramModal && programToDelete && ( // Render confirmation modal
        <ConfirmationModal
          message={`Are you sure you want to delete program "${programToDelete.name}"? This action cannot be undone.`}
          onConfirm={confirmDeleteProgram}
          onCancel={() => setShowConfirmDeleteProgramModal(false)}
          colorPalette={colorPalette}
        />
      )}
    </div>
  );
};

// Analytics & Reports Section
const AnalyticsReports = ({ colorPalette }) => {
  const chartContainerStyle = {
    width: '100%',
    height: '300px',
    backgroundColor: colorPalette.cardBg,
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorPalette.textGray,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    overflowX: 'auto',
    flexDirection: 'column',
  };

  const insightCardStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1.2rem',
    borderRadius: '0.75rem',
    boxShadow: `0 2px 8px ${colorPalette.shadowColor}`,
    border: `1px solid ${colorPalette.borderGray}`,
    textAlign: 'center',
    fontSize: '0.9rem',
    color: colorPalette.darkTextGray,
    marginBottom: '1rem', // Spacing between insights
  };

  return (
    <div>
      <DashboardSectionHeader title="Analytics & Reports" icon={BarChart2} colorPalette={colorPalette} />
      <p style={{ color: colorPalette.darkTextGray, marginBottom: '1.5rem' }}>
        Gain insights into platform performance, user engagement, and job market trends.
      </p>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1rem' }}>
        Key Performance Indicators
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={insightCardStyle}>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.accent }}>92%</span>
          <p>Avg. Profile Completion</p>
        </div>
        <div style={insightCardStyle}>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.primary }}>12%</span>
          <p>Job Application Conversion</p>
        </div>
        <div style={insightCardStyle}>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.successButton }}>7.5K</span>
          <p>Monthly Active Users</p>
        </div>
        <div style={insightCardStyle}>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colorPalette.errorButton }}>48%</span>
          <p>Skill Gap Identified</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginTop: '2.5rem', marginBottom: '1rem' }}>
        Trends & Visualizations
      </h3>
      <div style={chartContainerStyle}>
        <p>[Graph Placeholder: User Registrations Over Time]</p>
      </div>
      <div style={chartContainerStyle}>
        <p>[Graph Placeholder: Jobs Posted vs. Applications]</p>
      </div>
      <div style={chartContainerStyle}>
        <p>[Graph Placeholder: Top Demanded Skills]</p>
      </div>
    </div>
  );
};

// Add/Edit Content Modals
const EditContentModal = ({ onClose, showMessage, colorPalette, onEditContent, contentItem }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      onEditContent({ ...contentItem, content: values.content });
      showMessage(`Content "${contentItem.title}" updated successfully!`, "success");
      onClose();
      setSubmitting(false);
    }, 1000);
  };
  return (
    <FullPageModal title={`Edit: ${contentItem.title}`} onClose={onClose} colorPalette={colorPalette}>
      <Formik
        initialValues={{ content: contentItem.content || '' }}
        validationSchema={Yup.object({
          content: Yup.string().required('Content cannot be empty'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form style={{ padding: '1rem' }}>
            <ModalFormField label="Content" name="content" as="textarea" rows="10" errors={errors} touched={touched} colorPalette={colorPalette} />
            <ModalActionButtons onClose={onClose} isSubmitting={isSubmitting} colorPalette={colorPalette} />
          </Form>
        )}
      </Formik>
    </FullPageModal>
  );
};

// Content Management Section
const ContentManagement = ({ colorPalette, showMessage }) => {
  const [contentItems, setContentItems] = useState([
    { id: 'c1', title: 'About Us Page Content', type: 'Static Page', content: 'This is the mock content for the About Us page. It explains our mission, vision, and objectives. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 'c2', title: 'Privacy Policy Document', type: 'Legal', content: 'This is the mock content for the Privacy Policy. It details how user data is collected, used, and protected. We are committed to safeguarding your privacy.' },
    { id: 'c3', title: 'FAQs Section', type: 'Help', content: 'This section contains Frequently Asked Questions. Find answers to common queries regarding job applications, profile management, and skill development programs.' },
    { id: 'c4', title: 'Welcome Message', type: 'System', content: 'Welcome to the Bihar KIOSK platform! We are dedicated to empowering citizens with employment opportunities and skill development resources.' },
  ]);
  const [showEditContentModal, setShowEditContentModal] = useState(false);
  const [selectedContentItem, setSelectedContentItem] = useState(null);

  const handleEditContent = (updatedContent) => {
    setContentItems(prevItems => prevItems.map(item => item.id === updatedContent.id ? updatedContent : item));
  };

  const tableHeaderStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
  };

  const tableRowStyle = {
    backgroundColor: colorPalette.cardBg,
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    transition: 'background-color 0.2s',
  };

  const tableRowHoverStyle = {
    backgroundColor: colorPalette.mediumLightGray,
  };

  const tableCellStyle = {
    padding: '0.8rem 1rem',
    color: colorPalette.darkTextGray,
    fontSize: '0.9rem',
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    margin: '0 0.3rem',
    transition: 'color 0.2s',
  };

  const editButtonStyle = { ...actionButtonStyle, color: colorPalette.accent };

  return (
    <div>
      <DashboardSectionHeader title="Content Management" icon={FileText} colorPalette={colorPalette} />
      <div style={{
        backgroundColor: colorPalette.cardBg,
        borderRadius: '0.75rem',
        boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Content Title</th>
              <th style={tableHeaderStyle}>Type</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentItems.map(item => (
              <tr
                key={item.id}
                style={tableRowStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, tableRowStyle)}
              >
                <td style={tableCellStyle}>{item.title}</td>
                <td style={tableCellStyle}>{item.type}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => { setSelectedContentItem(item); setShowEditContentModal(true); }}
                    style={editButtonStyle}
                    onMouseEnter={e => e.currentTarget.style.color = colorPalette.primary}
                    onMouseLeave={e => e.currentTarget.style.color = colorPalette.accent}
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditContentModal && selectedContentItem && (
        <EditContentModal onClose={() => setShowEditContentModal(false)} showMessage={showMessage} colorPalette={colorPalette} onEditContent={handleEditContent} contentItem={selectedContentItem} />
      )}
    </div>
  );
};

// System Settings Modals
const ManageUserRolesModal = ({ onClose, showMessage, colorPalette }) => {
  const [usersToManage, setUsersToManage] = useState([
    { id: 'u1', name: 'Ravi Kumar', role: 'User' },
    { id: 'u2', name: 'Suman Devi', role: 'User' },
    { id: 'u5', name: 'Admin User', role: 'Admin' },
  ]); // Simplified list for role management

  const handleRoleChange = (userId, newRole) => {
    setUsersToManage(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    showMessage(`Role for user ${userId} updated to ${newRole}! (mock)`, "success");
  };

  const tableHeaderStyle = {
    backgroundColor: colorPalette.lightGray,
    padding: '0.8rem 1rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    textAlign: 'left',
    fontSize: '0.9rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
  };

  const tableRowStyle = {
    backgroundColor: colorPalette.cardBg,
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    transition: 'background-color 0.2s',
  };

  const tableCellStyle = {
    padding: '0.8rem 1rem',
    color: colorPalette.darkTextGray,
    fontSize: '0.9rem',
  };

  const selectStyle = {
    padding: '0.4rem 0.6rem',
    borderRadius: '0.3rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
    outline: 'none',
  };

  return (
    <FullPageModal title="Manage User Roles" onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>User Name</th>
              <th style={tableHeaderStyle}>Current Role</th>
              <th style={tableHeaderStyle}>Change Role To</th>
            </tr>
          </thead>
          <tbody>
            {usersToManage.map(user => (
              <tr key={user.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user.role}</td>
                <td style={tableCellStyle}>
                  <select
                    style={selectStyle}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ color: colorPalette.textGray, fontSize: '0.8rem', marginTop: '1.5rem', textAlign: 'center' }}>
          (Roles updated instantly for demonstration. In a real system, a "Save" button would apply changes.)
        </p>
      </div>
    </FullPageModal>
  );
};

const SystemConfigurationModal = ({ onClose, showMessage, colorPalette }) => {
  const [config, setConfig] = useState({
    maxJobPostingsPerDay: 100,
    enableUserRegistration: true,
    requireAdminApprovalForJobs: true,
    emailNotificationsEnabled: true,
  });

  const handleConfigChange = (e) => {
    const { name, type, checked, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveConfig = () => {
    showMessage('System configuration updated! (mock)', 'success');
    onClose();
  };

  const formFieldStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    padding: '0.8rem',
    backgroundColor: colorPalette.lightGray,
    borderRadius: '0.5rem',
  };

  const labelStyle = {
    fontSize: '0.95rem',
    color: colorPalette.blackText,
    fontWeight: '500',
  };

  const inputStyle = {
    padding: '0.4rem 0.6rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    borderRadius: '0.3rem',
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
    outline: 'none',
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: colorPalette.primary, // Highlight color for checkbox
  };


  return (
    <FullPageModal title="System Configuration" onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '1.5rem' }}>General Settings</h3>
        
        <div style={formFieldStyle}>
          <label style={labelStyle}>Max Job Postings per Day:</label>
          <input
            type="number"
            name="maxJobPostingsPerDay"
            value={config.maxJobPostingsPerDay}
            onChange={handleConfigChange}
            style={inputStyle}
          />
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Enable User Registration:</label>
          <input
            type="checkbox"
            name="enableUserRegistration"
            checked={config.enableUserRegistration}
            onChange={handleConfigChange}
            style={checkboxStyle}
          />
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Require Admin Approval for Jobs:</label>
          <input
            type="checkbox"
            name="requireAdminApprovalForJobs"
            checked={config.requireAdminApprovalForJobs}
            onChange={handleConfigChange}
            style={checkboxStyle}
          />
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>Email Notifications Enabled:</label>
          <input
            type="checkbox"
            name="emailNotificationsEnabled"
            checked={config.emailNotificationsEnabled}
            onChange={handleConfigChange}
            style={checkboxStyle}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            onClick={handleSaveConfig}
            style={{
              backgroundColor: colorPalette.successButton,
              color: colorPalette.pureWhite,
              padding: '0.8rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </FullPageModal>
  );
};

const SendAnnouncementModal = ({ onClose, showMessage, colorPalette }) => {
  const [announcementText, setAnnouncementText] = useState('');

  const handleSendAnnouncement = () => {
    if (!announcementText.trim()) {
      showMessage("Announcement message cannot be empty.", "error");
      return;
    }
    showMessage(`Announcement sent: "${announcementText.substring(0, 50)}..." (mock)`, "success");
    setAnnouncementText('');
    onClose();
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '0.5rem',
    border: `1px solid ${colorPalette.inputBorder}`,
    backgroundColor: colorPalette.inputBg,
    color: colorPalette.darkTextGray,
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  };

  const buttonStyle = {
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite,
    padding: '0.8rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <FullPageModal title="Send Announcement" onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem' }}>
        <p style={{ fontSize: '0.95rem', color: colorPalette.darkTextGray, marginBottom: '1rem' }}>
          Compose and send a system-wide announcement to all active users.
        </p>
        <textarea
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          placeholder="Type your announcement here..."
          rows="6"
          style={textareaStyle}
        ></textarea>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{...buttonStyle, backgroundColor: colorPalette.borderGray, color: colorPalette.blackText}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.mediumLightGray}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.borderGray}
          >
            Cancel
          </button>
          <button
            onClick={handleSendAnnouncement}
            style={{...buttonStyle, backgroundColor: colorPalette.successButton}}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.successButtonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.successButton}
          >
            Send Announcement
          </button>
        </div>
      </div>
    </FullPageModal>
  );
};


// System Settings Section
const AdminSettings = ({ colorPalette, showMessage }) => {
  const [showManageUserRolesModal, setShowManageUserRolesModal] = useState(false);
  const [showSystemConfigurationModal, setShowSystemConfigurationModal] = useState(false);
  const [showSendAnnouncementModal, setShowSendAnnouncementModal] = useState(false);

  const settingOptionStyle = {
    backgroundColor: colorPalette.cardBg,
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const settingOptionHoverStyle = {
    boxShadow: `0 8px 20px ${colorPalette.shadowColor}`,
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

  return (
    <div>
      <DashboardSectionHeader title="System Settings" icon={Settings} colorPalette={colorPalette} />
      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setShowManageUserRolesModal(true)}
      >
        <h3 style={titleStyle}>Manage User Roles</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>
      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setShowSystemConfigurationModal(true)}
      >
        <h3 style={titleStyle}>System Configuration</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>
      <div
        style={settingOptionStyle}
        onMouseEnter={e => Object.assign(e.currentTarget.style, settingOptionHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, settingOptionStyle)}
        onClick={() => setShowSendAnnouncementModal(true)}
      >
        <h3 style={titleStyle}>Send Announcements</h3>
        <ChevronRight size={20} style={iconStyle} />
      </div>

      {showManageUserRolesModal && (
        <ManageUserRolesModal onClose={() => setShowManageUserRolesModal(false)} showMessage={showMessage} colorPalette={colorPalette} />
      )}
      {showSystemConfigurationModal && (
        <SystemConfigurationModal onClose={() => setShowSystemConfigurationModal(false)} showMessage={showMessage} colorPalette={colorPalette} />
      )}
      {showSendAnnouncementModal && (
        <SendAnnouncementModal onClose={() => setShowSendAnnouncementModal(false)} showMessage={showMessage} colorPalette={colorPalette} />
      )}
    </div>
  );
};


// Notifications Modal for Admin
const AdminNotificationsModal = ({ onClose, colorPalette }) => {
    const [notifications, setNotifications] = useState([ // Made notifications stateful
      { id: 'anotif1', message: 'New user registered: John Doe', time: '5 mins ago', type: 'info' },
      { id: 'anotif2', message: 'Job posting "Senior Developer" submitted for approval by ABC Corp.', time: '1 hour ago', type: 'warning' },
      { id: 'anotif3', message: 'Error in daily data sync process. Review logs.', time: 'Yesterday', type: 'error' },
      { id: 'anotif4', message: 'New skill program "AI Fundamentals" added by NSDC.', time: '2 days ago', type: 'info' },
    ]);
  
    const notificationItemStyle = (type) => {
      let borderColor = colorPalette.borderGray;
      let bgColor = colorPalette.cardBg;
      let iconColor = colorPalette.textGray;
  
      switch(type) {
        case 'info':
          borderColor = colorPalette.primary;
          iconColor = colorPalette.primary;
          break;
        case 'warning':
          borderColor = '#F59E0B'; // Amber
          iconColor = '#F59E0B';
          break;
        case 'error':
          borderColor = colorPalette.errorButton;
          iconColor = colorPalette.errorButton;
          break;
        default:
          break;
      }
  
      return {
        backgroundColor: bgColor,
        padding: '0.8rem 1.2rem',
        borderRadius: '0.5rem',
        marginBottom: '0.6rem',
        boxShadow: `0 1px 4px ${colorPalette.shadowColor}`,
        border: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.8rem',
      };
    };
  
    const notificationTextStyle = {
      fontSize: '0.9rem',
      color: colorPalette.darkTextGray,
      fontWeight: 'normal',
      marginBottom: '0.2rem',
    };
  
    const notificationTimeStyle = {
      fontSize: '0.75rem',
      color: colorPalette.textGray,
    };

    const handleMarkAllAsRead = () => {
      setNotifications([]); // Clear all notifications
      // In a real app, this would update a backend database
    };
  
    return (
      <FullPageModal title="Admin Notifications" onClose={onClose} colorPalette={colorPalette}>
        <div style={{ padding: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            <>
              {notifications.map(notif => (
                <div key={notif.id} style={notificationItemStyle(notif.type)}>
                  <MessageSquare size={20} style={{ color: notificationItemStyle(notif.type).iconColor, flexShrink: 0 }} />
                  <div>
                    <p style={notificationTextStyle}>{notif.message}</p>
                    <p style={notificationTimeStyle}>{notif.time}</p>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    backgroundColor: colorPalette.primary,
                    color: colorPalette.pureWhite,
                    padding: '0.6rem 1.2rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.accent}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.primary}
                >
                  Mark All As Read
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: colorPalette.textGray, textAlign: 'center', padding: '1rem' }}>No new notifications.</p>
          )}
        </div>
      </FullPageModal>
    );
  };
  
// AdDetailsModal Component
const AdDetailsModal = ({ ad, onClose, colorPalette }) => {
  return (
    <FullPageModal title={ad.title} onClose={onClose} colorPalette={colorPalette}>
      <div style={{ padding: '1rem', color: colorPalette.darkTextGray }}>
        <img src={ad.imageUrl} alt={ad.title} style={{ maxWidth: '100%', borderRadius: '0.75rem', marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colorPalette.blackText, marginBottom: '0.8rem' }}>{ad.tagline}</h3>
        <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          {ad.fullDescription || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
        </p>
        <p style={{ fontSize: '0.9rem', color: colorPalette.textGray }}>
          **Validity:** {ad.validity || "Until further notice"}
        </p>
        <p style={{ fontSize: '0.9rem', color: colorPalette.textGray }}>
          **Contact:** {ad.contactInfo || "info@biharkiosk.gov.in"}
        </p>
      </div>
    </FullPageModal>
  );
};

// RightPanel Component
const RightPanel = ({ colorPalette, showPanel, onClose, onShowAdDetails }) => {
  const announcements = [
    { id: 1, title: "New Job Fair in Patna", date: "Aug 10, 2024", content: "Join us for a mega job fair at Gandhi Maidan. Over 100 companies participating!" },
    { id: 2, title: "Skill Development Workshop", date: "Aug 15, 2024", content: "Free workshop on Digital Marketing for youth. Register now!" },
    { id: 3, title: "Government Scheme Updates", date: "July 28, 2024", content: "Latest updates on employment generation schemes. Check the 'Schemes' section." },
  ];

  const advertisement = {
    title: "Empower Your Future!",
    tagline: "Bihar KIOSK: Your Gateway to Opportunities",
    imageUrl: "https://placehold.co/250x70/2874A6/ffffff?text=ADVERTISEMENT", // Further reduced image height
    link: "#", // This is now handled by onShowAdDetails
    fullDescription: "This advertisement promotes the Bihar KIOSK platform as a comprehensive solution for job seekers and skill development. It highlights various government initiatives and private sector partnerships aimed at boosting employment in Bihar. The platform offers personalized job recommendations, free skill training programs, and direct application tracking. Join thousands of successful candidates who found their career path through Bihar KIOSK. Explore opportunities in IT, manufacturing, services, and more.",
    validity: "December 31, 2024",
    contactInfo: "For more details, visit our nearest KIOSK center or call our helpline: 1800-123-4567."
  };

  const panelStyle = {
    width: '20rem', // Fixed width for the right panel
    flexShrink: 0, // Prevent it from shrinking
    background: colorPalette.bodyBg, // Match main content background
    padding: '2rem 1rem',
    boxShadow: `-2px 0 8px ${colorPalette.shadowColor}`, // Shadow on the left
    display: (window.innerWidth < 1024 || !showPanel) ? 'none' : 'block', // Hide on smaller screens or if closed
    overflowY: 'auto',
    borderLeft: `1px solid ${colorPalette.borderGray}`,
    position: 'relative', // Needed for absolute positioning of close button
  };

  const sectionTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: colorPalette.blackText,
    marginBottom: '1rem',
    borderBottom: `1px solid ${colorPalette.borderGray}`,
    paddingBottom: '0.5rem',
  };

  const adCardStyle = {
    backgroundColor: colorPalette.cardBg,
    borderRadius: '0.75rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    padding: '0.5rem', // Further reduced padding
    marginBottom: '1.5rem',
    textAlign: 'center',
    border: `1px solid ${colorPalette.accent}`,
  };

  const announcementCardStyle = {
    backgroundColor: colorPalette.cardBg,
    borderRadius: '0.75rem',
    boxShadow: `0 2px 8px ${colorPalette.shadowColor}`,
    padding: '0.8rem',
    marginBottom: '1rem',
    border: `1px solid ${colorPalette.borderGray}`,
  };

  const closeButtonStyle = { // Corrected variable name from plural to singular
    position: 'absolute',
    top: '1rem',
    right: '1rem', // Adjusted for more space
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
    zIndex: 10, // Ensure it's above other content
  };

  const closeButtonHoverStyle = {
    backgroundColor: 'rgba(0,0,0,0.05)',
    color: colorPalette.blackText,
  };

  return (
    <div style={panelStyle}>
      <button
        onClick={onClose}
        style={closeButtonStyle} // Used singular variable here
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, closeButtonHoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, closeButtonStyle)} // Used singular variable here
        aria-label="Close Advertisement Panel"
      >
        <X size={20} />
      </button>

      <h3 style={sectionTitleStyle}>Advertisements</h3>
      <div style={adCardStyle}>
        <img src={advertisement.imageUrl} alt={advertisement.title} style={{ maxWidth: '100%', borderRadius: '0.5rem', marginBottom: '0.4rem' }} /> {/* Further reduced margin-bottom */}
        <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: colorPalette.primary, marginBottom: '0.1rem' }}>{advertisement.title}</h4> {/* Further reduced font size and margin */}
        <p style={{ fontSize: '0.75rem', color: colorPalette.textGray, marginBottom: '0.4rem' }}>{advertisement.tagline}</p> {/* Further reduced font size and margin */}
        <button
          onClick={() => onShowAdDetails(advertisement)}
          style={{
            display: 'inline-block',
            backgroundColor: colorPalette.accent,
            color: colorPalette.pureWhite,
            padding: '0.2rem 0.5rem', // Further reduced padding
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.7rem', // Further reduced font size
            fontWeight: '600',
            transition: 'background-color 0.2s',
            border: 'none', // Ensure button styling
            cursor: 'pointer',
          }} onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.primary} onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.accent}>
          Learn More
        </button>
      </div>

      <h3 style={sectionTitleStyle}>Recent Announcements</h3>
      {announcements.map(announcement => (
        <div key={announcement.id} style={announcementCardStyle}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: colorPalette.blackText, marginBottom: '0.3rem' }}>{announcement.title}</h4>
          <p style={{ fontSize: '0.85rem', color: colorPalette.darkTextGray, marginBottom: '0.3rem' }}>{announcement.content}</p>
          <p style={{ fontSize: '0.75rem', color: colorPalette.textGray, textAlign: 'right' }}>{announcement.date}</p>
        </div>
      ))}
    </div>
  );
};

// Admin Dashboard Main Component
export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboardOverview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [userId, setUserId] = useState(null); // Will ideally be an Admin user ID
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customModalMessage, setCustomModalMessage] = useState('');
  const [customModalType, setCustomModalType] = useState('info');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorPalette = isDarkMode ? DARK_COLOR_PALETTE : LIGHT_COLOR_PALETTE;
  const [showAdminNotificationsModal, setShowAdminNotificationsModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true); // State to control RightPanel visibility
  const [showAdDetailsModal, setShowAdDetailsModal] = useState(false); // State for ad details modal
  const [selectedAd, setSelectedAd] = useState(null); // State to hold selected ad data

  const [adminProfileData, setAdminProfileData] = useState({ // Lifted admin profile state
    name: 'Admin User',
    email: 'admin@biharkiosk.gov.in',
    role: 'Super Admin',
    lastLogin: '2024-07-25 10:30 AM',
    profilePicture: 'https://placehold.co/80x80/2874A6/ffffff?text=ADMIN'
  });


  const handleShowMessage = (message, type) => {
    setCustomModalMessage(message);
    setCustomModalType(type);
    setShowCustomModal(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleNavLinkClick = (section) => {
    setActiveSection(section);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleShowAdDetails = (ad) => {
    setSelectedAd(ad);
    setShowAdDetailsModal(true);
  };

  // Firebase Auth for Admin (conceptual - would typically involve admin-specific auth)
  useEffect(() => {
    if (!auth || !db) {
      console.error("Firebase is not initialized. Cannot proceed with authentication.");
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // In a real app, you'd check if this user has admin role
        setUserId(user.uid);
      } else {
        try {
          // For standalone demo, sign in anonymously or use a mock admin ID
          await signInAnonymously(auth);
          setUserId(auth.currentUser.uid); // Mock as admin for demo
        } catch (error) {
          console.error("Firebase anonymous sign-in error in standalone admin dashboard:", error);
          setUserId('mock-admin-id'); // Fallback to mock ID
          handleShowMessage("Could not sign in anonymously. Using a demo admin ID.", "error");
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setUserId(null);
      handleShowMessage("Admin logged out.", "success");
      console.log("Admin logged out (standalone demo)");
    } catch (error) {
      console.error("Error logging out:", error);
      handleShowMessage(`Error logging out: ${error.message}`, "error");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // If resizing to desktop, ensure sidebar is open
      if (window.innerWidth > 768 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const sidebarWidth = '18rem';
  const rightPanelWidth = '20rem'; // Define right panel width for grid

  const mainContainerStyles = {
    display: window.innerWidth <= 768 ? 'block' : 'grid', // Use block on mobile for simpler flow
    gridTemplateColumns: window.innerWidth <= 768 ? 'none' : (showRightPanel ? `${sidebarWidth} 1fr ${rightPanelWidth}` : `${sidebarWidth} 1fr`),
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden',
  };

  const sidebarStyles = {
    background: colorPalette.primaryGradient, // Apply gradient here
    color: colorPalette.white,
    padding: '1.5rem 0.5rem', // Reduced overall horizontal padding for sidebar
    boxShadow: `2px 0 8px ${colorPalette.shadowColor}`,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gridColumn: '1 / 2', // Always in the first column on desktop
    position: window.innerWidth <= 768 ? 'fixed' : 'relative',
    height: '100vh',
    overflowY: 'auto',
    zIndex: 40,
    width: sidebarWidth, // Explicitly set width for fixed sidebar
    transform: (window.innerWidth <= 768 && !isSidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
  };

  const sidebarOverlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 39,
    display: (window.innerWidth <= 768 && isSidebarOpen) ? 'block' : 'none', // Directly control display
    opacity: (window.innerWidth <= 768 && isSidebarOpen) ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    pointerEvents: (window.innerWidth <= 768 && isSidebarOpen) ? 'auto' : 'none', // Ensure clicks are blocked only when visible
  };


  const mainContentAreaStyles = {
    flexGrow: 1,
    padding: window.innerWidth <= 768 ? '1rem' : '2rem', // Adjusted padding for mobile
    background: colorPalette.bodyBg, // Apply gradient here
    minHeight: '100vh',
    gridColumn: window.innerWidth <= 768 ? 'auto' : '2 / 3', // Auto on mobile, second column on desktop
    marginLeft: (window.innerWidth <= 768 && isSidebarOpen) ? sidebarWidth : '0', // Dynamic margin for mobile
    transition: 'margin-left 0.3s ease-in-out', // Smooth transition for margin
    overflowY: 'auto',
    paddingTop: window.innerWidth <= 768 ? '1rem' : '2rem', // Reduced paddingTop for mobile
  };

  const navLinkContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    flexGrow: 1,
  };

  const navLinkStyles = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '0.2rem', // Adjusted to be very close to the left edge
    paddingRight: '1rem', // Keep some padding on the right for text
    paddingTop: '0.8rem',
    paddingBottom: '0.8rem',
    borderRadius: '0.5rem',
    backgroundColor: isActive ? colorPalette.accent : 'transparent',
    color: colorPalette.pureWhite,
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: isActive ? '700' : '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    boxShadow: isActive ? `inset 0 1px 3px ${colorPalette.shadowColor}` : 'none',
  });

  const navLinkHoverStyles = {
    backgroundColor: colorPalette.accent,
    transform: 'translateX(5px)',
  };

  const logoutButtonStyles = {
    backgroundColor: colorPalette.errorButton,
    color: colorPalette.pureWhite,
    padding: '0.8rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    transition: 'background-color 0.3s',
  };

  const mobileMenuButtonStyles = {
    position: 'fixed',
    top: '0.8rem', // Adjusted top
    left: '0.8rem', // Adjusted left
    backgroundColor: colorPalette.primary,
    color: colorPalette.pureWhite,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
    border: 'none',
    cursor: 'pointer',
    zIndex: 50,
    display: window.innerWidth <= 768 ? 'block' : 'none',
    transition: 'transform 0.3s ease-in-out, background-color 0.3s',
  };

  if (!isAuthReady) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: colorPalette.primaryGradient, // Use gradient here
        color: colorPalette.pureWhite, fontSize: '1.5rem', fontWeight: 'bold'
      }}>
        Loading Admin Dashboard...
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: colorPalette.errorBg, color: colorPalette.errorText, fontSize: '1.2rem',
        fontWeight: 'bold', padding: '2rem', textAlign: 'center'
      }}>
        <XCircle size={48} style={{ marginBottom: '1rem' }} />
        <p>Authentication failed or admin user ID not found.</p>
        <p>Please ensure Firebase is correctly configured and authenticated with admin privileges.</p>
        <button
          onClick={() => { window.location.reload(); }}
          style={{
            marginTop: '1.5rem', padding: '0.8rem 1.5rem', backgroundColor: colorPalette.errorButton,
            color: colorPalette.pureWhite, borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
            fontSize: '1rem', fontWeight: '600', transition: 'background-color 0.3s',
          }}
        >
          Retry / Reload
        </button>
      </div>
    );
  }

  return (
    <div style={mainContainerStyles}>
      <button style={mobileMenuButtonStyles} onClick={toggleSidebar} onMouseEnter={e => { e.currentTarget.style.backgroundColor = colorPalette.accent; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = colorPalette.primary; }}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay - Now with opacity transition and conditional display */}
      {(window.innerWidth <= 768 && isSidebarOpen) && (
        <div style={sidebarOverlayStyles} onClick={toggleSidebar}></div>
      )}

      <div style={sidebarStyles}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0', borderBottom: `1px solid ${colorPalette.accent}`, marginBottom: '1.5rem' }}>
          <img
            src={adminProfileData.profilePicture} // Use dynamic profile picture
            alt="Admin Profile"
            style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${colorPalette.pureWhite}`, objectFit: 'cover', marginBottom: '0.8rem' }}
          />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colorPalette.pureWhite, marginBottom: '0.2rem' }}>
            {adminProfileData.name} {/* Use dynamic name */}
          </h3>
          <p style={{ fontSize: '0.8rem', color: colorPalette.lightGray }}>
            Logged in as: {userId}
          </p>
        </div>

        <div style={navLinkContainerStyles}>
          <a onClick={() => { handleNavLinkClick('dashboardOverview'); }} style={navLinkStyles(activeSection === 'dashboardOverview')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'dashboardOverview'))}>
            <Home size={20} style={{ marginRight: '0.6rem' }} /> Dashboard
          </a>
          <a onClick={() => { handleNavLinkClick('adminProfile'); }} style={navLinkStyles(activeSection === 'adminProfile')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'adminProfile'))}>
            <Users size={20} style={{ marginRight: '0.6rem' }} /> Admin Profile
          </a> {/* New Admin Profile link */}
          <a onClick={() => { handleNavLinkClick('userManagement'); }} style={navLinkStyles(activeSection === 'userManagement')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'userManagement'))}>
            <Users size={20} style={{ marginRight: '0.6rem' }} /> User Management
          </a>
          <a onClick={() => { handleNavLinkClick('jobManagement'); }} style={navLinkStyles(activeSection === 'jobManagement')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'jobManagement'))}>
            <Briefcase size={20} style={{ marginRight: '0.6rem' }} /> Job Posting Management
          </a>
          <a onClick={() => { handleNavLinkClick('skillProgramManagement'); }} style={navLinkStyles(activeSection === 'skillProgramManagement')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'skillProgramManagement'))}>
            <GraduationCap size={20} style={{ marginRight: '0.6rem' }} /> Skill Program Management
          </a>
          <a onClick={() => { handleNavLinkClick('analyticsReports'); }} style={navLinkStyles(activeSection === 'analyticsReports')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'analyticsReports'))}>
            <BarChart2 size={20} style={{ marginRight: '0.6rem' }} /> Analytics & Reports
          </a>
          <a onClick={() => { handleNavLinkClick('contentManagement'); }} style={navLinkStyles(activeSection === 'contentManagement')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'contentManagement'))}>
            <List size={20} style={{ marginRight: '0.6rem' }} /> Content Management
          </a>
          <a onClick={() => { handleNavLinkClick('adminSettings'); }} style={navLinkStyles(activeSection === 'adminSettings')} onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkHoverStyles)} onMouseLeave={e => Object.assign(e.currentTarget.style, navLinkStyles(activeSection === 'adminSettings'))}>
            <Settings size={20} style={{ marginRight: '0.6rem' }} /> System Settings
          </a>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyles} onMouseEnter={e => e.currentTarget.style.backgroundColor = colorPalette.errorButtonHover} onMouseLeave={e => e.currentTarget.style.backgroundColor = colorPalette.errorButton}>
          <LogOut size={20} /> Logout
        </button>
        {userId && <p style={{ fontSize: '0.7rem', color: colorPalette.textGray, marginTop: '0.5rem', textAlign: 'center' }}>Admin ID: {userId}</p>}
      </div>

      <div className="main-content-area" style={mainContentAreaStyles}>
        {/* Light/Dark Mode Toggle and Notifications Bell */}
        <div style={{
          position: 'absolute',
          top: '0.8rem', // Adjusted top
          right: '2.5rem', // Moved slightly left
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem', // Reduced gap
          backgroundColor: colorPalette.cardBg,
          padding: '0.5rem 0.8rem',
          borderRadius: '0.75rem',
          boxShadow: `0 4px 12px ${colorPalette.shadowColor}`,
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}>
          <div
            onClick={toggleDarkMode}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              color: colorPalette.primary, // Icon color
            }}
            onMouseEnter={e => e.currentTarget.style.color = colorPalette.accent}
            onMouseLeave={e => e.currentTarget.style.color = colorPalette.primary}
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </div>

          <div
            onClick={() => setShowAdminNotificationsModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              color: colorPalette.primary, // Icon color
            }}
            onMouseEnter={e => e.currentTarget.style.color = colorPalette.accent}
            onMouseLeave={e => e.currentTarget.style.color = colorPalette.primary}
          >
            <Bell size={20} />
          </div>
        </div>

        {activeSection === 'dashboardOverview' && <AdminDashboardOverview colorPalette={colorPalette} showMessage={handleShowMessage} />}
        {activeSection === 'adminProfile' && <AdminProfileDetails colorPalette={colorPalette} showMessage={handleShowMessage} profileData={adminProfileData} setProfileData={setAdminProfileData} />} {/* Pass profileData and setter */}
        {activeSection === 'userManagement' && <UserManagement colorPalette={colorPalette} showMessage={handleShowMessage} />}
        {activeSection === 'jobManagement' && <JobManagement colorPalette={colorPalette} showMessage={handleShowMessage} />}
        {activeSection === 'skillProgramManagement' && <SkillProgramManagement colorPalette={colorPalette} showMessage={handleShowMessage} />}
        {activeSection === 'analyticsReports' && <AnalyticsReports colorPalette={colorPalette} />}
        {activeSection === 'contentManagement' && <ContentManagement colorPalette={colorPalette} showMessage={handleShowMessage} />}
        {activeSection === 'adminSettings' && <AdminSettings colorPalette={colorPalette} showMessage={handleShowMessage} />}
      </div>

      {/* New Right Panel - conditionally rendered */}
      <RightPanel
        colorPalette={colorPalette}
        showPanel={showRightPanel}
        onClose={() => setShowRightPanel(false)}
        onShowAdDetails={handleShowAdDetails}
      />

      {showCustomModal && (
        <CustomMessageModal
          message={customModalMessage}
          type={customModalType}
          onClose={() => setShowCustomModal(false)}
          colorPalette={colorPalette}
        />
      )}
      {showAdminNotificationsModal && (
        <AdminNotificationsModal onClose={() => setShowAdminNotificationsModal(false)} colorPalette={colorPalette} />
      )}
      {showAdDetailsModal && selectedAd && (
        <AdDetailsModal
          ad={selectedAd}
          onClose={() => setShowAdDetailsModal(false)}
          colorPalette={colorPalette}
        />
      )}
    </div>
  );
}
