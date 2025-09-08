import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { User, ChevronRight, X, Mic, Send, Bot, Loader, Bell, LayoutGrid, Check, DollarSign, Settings, LogOut, FileText, Users, Clock, Key, ShieldCheck, CreditCard, Mail, Phone, Calendar, Moon, Sun, Briefcase, Landmark, Info, Menu, Upload, Plus, Award } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Global Variable Declarations with Fallbacks ---
// These variables are globally injected by the online Canvas environment.
// The following declarations with 'let' and a try-catch block are a workaround
// to prevent 'no-undef' errors when running in a local development environment.
// The linter will now see these variables as defined.
let __app_id = 'default-app-id';
let __firebase_config = '{}';
let __initial_auth_token = null;

try {
  __app_id = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  __firebase_config = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
  __initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
} catch (e) {
  // This catch block is for environments where the globals are not defined at all.
  console.warn("Global Canvas variables not found. Using default fallbacks.");
}

const appId = __app_id;
const firebaseConfig = JSON.parse(__firebase_config);
const initialAuthToken = __initial_auth_token;


// --- UTILITY COMPONENTS AND HOOKS ---

// Theme Context for managing light and dark modes
const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Define color variables for light and dark themes
  const themeVars = theme === 'light' ? {
    '--bg-color': '#f0f4f8',
    '--card-bg': '#ffffff',
    '--text-color': '#1f2937',
    '--primary-color': '#2563eb', // Blue
    '--secondary-color': '#e0f2ff', // Light blue
    '--accent-color': '#10b981', // Green
    '--border-color': '#e5e7eb',
    '--shadow-color': 'rgba(0, 0, 0, 0.05)',
  } : {
    '--bg-color': '#1a202c', // Dark blue-gray
    '--card-bg': '#2d3748', // Darker blue-gray
    '--text-color': '#e2e8f0', // Off-white
    '--primary-color': '#4299e1', // Vibrant blue
    '--secondary-color': '#2b6cb0', // Darker blue
    '--accent-color': '#48bb78', // Vibrant green
    '--border-color': '#4a5568', // Gray
    '--shadow-color': 'rgba(0, 0, 0, 0.5)',
  };

  // Inject CSS variables into the document head
  const styles = `
    :root {
      --bg-color: ${themeVars['--bg-color']};
      --card-bg: ${themeVars['--card-bg']};
      --text-color: ${themeVars['--text-color']};
      --primary-color: ${themeVars['--primary-color']};
      --secondary-color: ${themeVars['--secondary-color']};
      --accent-color: ${themeVars['--accent-color']};
      --border-color: ${themeVars['--border-color']};
      --shadow-color: ${themeVars['--shadow-color']};
      font-family: 'Inter', sans-serif;
    }
    body {
      margin: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color 0.3s, color 0.3s;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: var(--border-color);
      border-radius: 4px;
      border: 2px solid var(--bg-color);
    }
    .md-hidden {
      display: none;
    }
    .md-inline {
      display: none;
    }
    @media (max-width: 768px) {
      .responsive-grid {
        grid-template-columns: 1fr;
      }
      /* This is the hamburger menu button, visible only on small screens */
      .md-hidden {
        display: block;
      }
      .md-inline {
        display: none;
      }
      .sidebar {
        transform: translateX(-100%);
        position: fixed;
        width: 16rem;
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .main-content {
        margin-left: 0 !important;
      }
    }
    @media (min-width: 769px) {
      /* The sidebar is always visible on large screens */
      .sidebar {
        transform: translateX(0) !important;
        position: static;
        width: 16rem;
      }
      .md-inline {
        display: block;
      }
      .main-content {
        margin-left: 16rem !important;
      }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
    }
  `;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeVars }}>
      <style>{styles}</style>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
const useTheme = () => useContext(ThemeContext);

// A simple loading spinner component
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
    <Loader style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-color)' }} size={24} />
  </div>
);

// A reusable modal component
const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
    <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 8px 24px var(--shadow-color)', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', paddingRight: '2rem' }}>{title}</h2>
      <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-color)' }}><X size={24} /></button>
      {children}
    </div>
  </div>
);

// --- AI ASSISTANT COMPONENT WITH VOICE COMMANDS ---
const AIAssistantFloating = ({ db, userId, onToggle, isChatOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const recognitionRef = useRef(null);
  const CHAT_COLLECTION = `artifacts/${appId}/users/${userId}/chat`;

  useEffect(() => {
    if (!db || !userId) {
      console.log("Firestore or userId not available, skipping chat listener setup.");
      return;
    }

    console.log("Setting up Firestore listener for chat...");
    const q = query(collection(db, CHAT_COLLECTION), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => {
      console.log("Unsubscribing from Firestore chat listener.");
      unsubscribe();
    };
  }, [db, userId, CHAT_COLLECTION]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition API is not supported in this browser.');
    }
  }, []);

  const handleVoiceCommand = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!db || !userId) {
        console.error("Firestore not initialized or userId not available. Cannot send message.");
        return;
    }

    try {
      // Add user message to Firestore
      await addDoc(collection(db, CHAT_COLLECTION), {
        text,
        role: 'user',
        timestamp: serverTimestamp(),
      });
      setInput('');
      setIsLoading(true);

      // Prepare chat history for API call
      // Filter out pending messages from the history to avoid duplication.
      let chatHistory = messages.filter(msg => !msg.isPending).map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
      chatHistory.push({ role: 'user', parts: [{ text: text }] });
      console.log("Sending chat history to Gemini API:", chatHistory);

      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      let response;
      let retries = 0;
      const maxRetries = 5;

      while (retries < maxRetries) {
        try {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.status !== 429) {
            break;
          }
          retries++;
          const delay = Math.pow(2, retries) * 1000;
          console.warn(`API call rate-limited. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
          console.error("Fetch error, retrying:", error);
          retries++;
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!response || !response.ok) {
        console.error("API call failed after multiple retries. Response status:", response?.status, response?.statusText);
        throw new Error("Failed to get a response from the AI assistant.");
      }

      const result = await response.json();
      console.log("Received AI response:", result);

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const botResponse = result.candidates[0].content.parts[0].text;
        // Add bot message to Firestore
        await addDoc(collection(db, CHAT_COLLECTION), {
          text: botResponse,
          role: 'model',
          timestamp: serverTimestamp(),
        });
        console.log("Successfully received and saved AI response.");
      } else {
        console.error("Unexpected API response structure:", result);
        // Add error message to Firestore
        await addDoc(collection(db, CHAT_COLLECTION), {
          text: "Sorry, I couldn't get a response. Please try again.",
          role: 'model',
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Add generic error message to Firestore
      await addDoc(collection(db, CHAT_COLLECTION), {
        text: "There was an error processing your request. Please try again.",
        role: 'model',
        timestamp: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 900 }}>
      {!isChatOpen && (
        <button
          onClick={onToggle}
          style={{
            padding: '1rem', borderRadius: '50%',
            backgroundColor: 'var(--primary-color)', color: '#ffffff',
            boxShadow: '0 4px 12px var(--shadow-color)', cursor: 'pointer',
            animation: 'pulse 2s infinite',
            transition: 'transform 0.3s',
            border: 'none',
          }}
          title="Open AI Assistant"
        >
          <Bot size={24} />
        </button>
      )}
      {isChatOpen && (
        <div style={{
          width: 'min(90vw, 400px)', height: 'min(70vh, 500px)',
          display: 'flex', flexDirection: 'column',
          backgroundColor: 'var(--card-bg)', borderRadius: '1rem',
          boxShadow: '0 8px 24px var(--shadow-color)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Bot size={20} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
              <span style={{ fontWeight: '600' }}>AI Assistant</span>
            </div>
            <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }} className="custom-scrollbar">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px var(--shadow-color)', maxWidth: '80%', backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--secondary-color)', color: msg.role === 'user' ? '#ffffff' : 'var(--text-color)' }}>
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px var(--shadow-color)', backgroundColor: 'var(--secondary-color)', color: 'var(--text-color)' }}>
                    <LoadingSpinner />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)' }}>
            <button
              onClick={handleVoiceCommand}
              style={{
                padding: '0.5rem',
                marginRight: '0.5rem',
                borderRadius: '50%',
                backgroundColor: isListening ? '#dc3545' : 'var(--primary-color)',
                color: '#ffffff',
                border: isListening ? '2px solid red' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                animation: isListening ? 'pulse 1.5s infinite' : 'none',
              }}
              disabled={isLoading}
              title="Voice Command"
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isListening ? 'Listening...' : 'Type a message...'}
              style={{
                flexGrow: 1,
                padding: '0.75rem 1rem',
                borderRadius: '1.5rem',
                border: '1px solid var(--border-color)',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: 'var(--secondary-color)',
                color: 'var(--text-color)',
              }}
              disabled={isListening || isLoading}
            />
            <button
              onClick={() => sendMessage()}
              style={{
                padding: '0.5rem',
                marginLeft: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                color: '#ffffff',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                opacity: input.trim() ? 1 : 0.5,
                transition: 'all 0.3s',
              }}
              disabled={isLoading || !input.trim()}
              title="Send Message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MODAL COMPONENTS ---
const ChangePasswordModal = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to change the password.
    // For this example, we'll just show a success message.
    setIsSuccess(true);
    setMessage('Password has been successfully updated!');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="password" placeholder="Current Password" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} required />
        <input type="password" placeholder="New Password" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} required />
        <input type="password" placeholder="Confirm New Password" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} required />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Save Password</button>
      </form>
      {message && <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: isSuccess ? 'var(--accent-color)' : '#dc3545', color: '#ffffff', borderRadius: '0.5rem' }}>{message}</div>}
    </div>
  );
};

const TwoFAModal = ({ onClose }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <p>Two-Factor Authentication adds an extra layer of security to your account.</p>
    <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
      <li style={{ marginBottom: '0.5rem' }}>Download an authenticator app (e.g., Google Authenticator).</li>
      <li style={{ marginBottom: '0.5rem' }}>Scan the QR code or enter the key provided.</li>
      <li style={{ marginBottom: '0.5rem' }}>Enter the 6-digit code from the app to verify.</li>
    </ol>
    <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer', marginTop: '1rem' }}>Close</button>
  </div>
);

const EditProfileModal = ({ onClose, onSave, initialProfile }) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [email, setEmail] = useState(initialProfile.email || '');
  const [phone, setPhone] = useState(initialProfile.phone || '');
  const [pan, setPan] = useState(initialProfile.pan || '');
  const [aadhar, setAadhar] = useState(initialProfile.aadhar || '');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = { name, email, phone, pan, aadhar };
    onSave(updatedProfile, imageFile);
    setIsSuccess(true);
    setMessage('Profile updated successfully!');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: '8rem', width: '8rem', backgroundColor: 'var(--secondary-color)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={64} style={{ color: 'var(--primary-color)' }} />
          )}
        </div>
        <label style={{ cursor: 'pointer', marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--secondary-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}>
          Upload Profile Picture
          <input id="profilePicInput" type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </label>
      </div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
      <input type="text" value={pan} onChange={(e) => setPan(e.target.value)} placeholder="PAN Number" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
      <input type="text" value={aadhar} onChange={(e) => setAadhar(e.target.value)} placeholder="Aadhar Number" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
      <button type="submit" style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Save Changes</button>
      {message && <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: isSuccess ? 'var(--accent-color)' : '#dc3545', color: '#ffffff', borderRadius: '0.5rem' }}>{message}</div>}
    </form>
  );
};

const UploadDocumentModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);
    // Simulate an API call
    setTimeout(() => {
      setUploading(false);
      setMessage(`File "${file.name}" uploaded successfully!`);
      setFile(null);
      setTimeout(() => onClose(), 2000);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'var(--secondary-color)',
        }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        {file ? (
          <p style={{ margin: 0 }}>File selected: {file.name}</p>
        ) : (
          <>
            <Upload size={48} style={{ color: 'var(--primary-color)' }} />
            <p style={{ marginTop: '0.5rem', marginBottom: 0, fontWeight: 'bold' }}>Click or drag a file to upload</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-color)' }}>PDF, JPG, DOCX up to 10MB</p>
          </>
        )}
      </div>
      <button
        onClick={handleUpload}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          backgroundColor: file ? 'var(--accent-color)' : 'var(--border-color)',
          color: '#ffffff',
          border: 'none',
          cursor: file ? 'pointer' : 'not-allowed',
        }}
        disabled={!file || uploading}
      >
        {uploading ? <LoadingSpinner /> : 'Upload'}
      </button>
      {message && <p style={{ textAlign: 'center', color: uploading ? 'var(--text-color)' : 'var(--accent-color)', margin: 0 }}>{message}</p>}
    </div>
  );
};


// --- MAIN PAGE COMPONENTS ---
const DashboardCard = ({ title, value, description, icon }) => (
  <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 12px var(--shadow-color)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'transform 0.3s' }}>
    <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)' }}>{icon}</div>
    <h3 style={{ marginTop: '1rem', fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-color)', margin: '0.5rem 0 0.25rem' }}>{value}</h3>
    <p style={{ fontSize: '1rem', color: 'var(--text-color)', margin: '0' }}>{title}</p>
    <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-color)' }}>{description}</p>
  </div>
);

const SectionContainer = ({ title, children }) => (
  <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 12px var(--shadow-color)', border: '1px solid var(--border-color)' }}>
    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-color)' }}>{title}</h3>
    {children}
  </div>
);

const TaxDashboard = ({ onAction }) => {
  const userActivityData = [
    { name: 'Jan', filings: 1 },
    { name: 'Feb', filings: 2 },
    { name: 'Mar', filings: 2 },
    { name: 'Apr', filings: 3 },
    { name: 'May', filings: 4 },
    { name: 'Jun', filings: 5 },
  ];
  const recentActivity = [
    { type: 'Payment', description: 'Payment of ₹5,000 for GST filing.', date: 'Jun 25' },
    { type: 'Document', description: 'Uploaded PAN Card for verification.', date: 'Jun 22' },
    { type: 'Filing', description: 'ITR-1 for FY 2023-24 submitted.', date: 'Jun 18' },
  ];
  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }} className="responsive-grid">
        <DashboardCard title="My Filing Status" value="In Progress" description="Your ITR-1 is currently being reviewed" icon={<Clock />} />
        <DashboardCard title="Upcoming Deadline" value="July 31, 2024" description="Last date for ITR Filing" icon={<Calendar />} />
        <DashboardCard title="Pending Payments" value="₹5,000" description="Due for GST Filing" icon={<DollarSign />} />
        <DashboardCard title="Documents Submitted" value="12" description="Total documents uploaded" icon={<FileText />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }} className="responsive-grid">
        <SectionContainer title="Monthly Filings">
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer>
              <ReLineChart data={userActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-color)" />
                <YAxis stroke="var(--text-color)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }} labelStyle={{ color: 'var(--text-color)' }} />
                <Line type="monotone" dataKey="filings" stroke="var(--primary-color)" strokeWidth={2} activeDot={{ r: 8 }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </SectionContainer>
        <SectionContainer title="Recent Activity">
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.map((activity, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)' }}>
                  {activity.type === 'Payment' && <CreditCard size={18} />}
                  {activity.type === 'Document' && <FileText size={18} />}
                  {activity.type === 'Filing' && <Check size={18} />}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '500' }}>{activity.description}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-color)' }}>{activity.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionContainer>
      </div>

      <SectionContainer title="Quick Actions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={() => onAction('upload_doc')} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} /> Upload Document
          </button>
          <button onClick={() => onAction('payments')} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} /> Make a Payment
          </button>
          <button onClick={() => onAction('show_notifications')} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} /> View Notifications
          </button>
        </div>
      </SectionContainer>
    </div>
  );
};

const PaymentsPage = ({ onAction }) => (
  <div style={{ padding: '1.5rem' }}>
    <SectionContainer title="Make a Payment (INR)">
      <p style={{ margin: '0 0 1rem 0' }}>Process payments for our services securely using your credit or debit card.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Card Number" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
        <input type="text" placeholder="Card Holder Name" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" placeholder="MM/YY" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
          <input type="text" placeholder="CVV" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
        </div>
        <input type="text" placeholder="Amount in INR (e.g., 5000)" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
        <button onClick={() => onAction('process_payment')} style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Process Payment</button>
      </div>
    </SectionContainer>
  </div>
);

const ProfilePage = ({ onAction, profile, profilePicUrl }) => (
  <div style={{ padding: '1.5rem' }}>
    <SectionContainer title="My Profile">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ height: '8rem', width: '8rem', backgroundColor: 'var(--secondary-color)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
          {profilePicUrl ? (
            <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Briefcase size={64} style={{ color: 'var(--primary-color)' }} />
          )}
          <button
            onClick={() => onAction('edit_profile')}
            style={{
              position: 'absolute', bottom: '0.5rem', right: '0.5rem',
              padding: '0.3rem', borderRadius: '50%', backgroundColor: 'var(--primary-color)',
              color: '#ffffff', border: 'none', cursor: 'pointer',
            }}
            title="Edit Profile"
          >
            <Plus size={16} />
          </button>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', margin: 0 }}>{profile.name}</h2>
        <p style={{ margin: 0, color: 'var(--text-color)' }}>Tax Consultant</p>
      </div>
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Email:</span> {profile.email}</p>
        <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Phone:</span> {profile.phone}</p>
        <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Aadhar Number:</span> {profile.aadhar}</p>
        <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>PAN Number:</span> {profile.pan}</p>
        <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>Registered Address:</span> 123 Tax Lane, New Delhi, India</p>
        <button onClick={() => onAction('edit_profile')} style={{ marginTop: '1rem', padding: '0.3rem 0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Edit Profile</button>
      </div>
    </SectionContainer>
  </div>
);

const SettingsPage = ({ onAction }) => (
  <div style={{ padding: '1.5rem' }}>
    <SectionContainer title="Account Settings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={() => onAction('change_password')} style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--secondary-color)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Key size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
          <span>Change Password</span>
        </button>
        <button onClick={() => onAction('2fa')} style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--secondary-color)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <ShieldCheck size={20} style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }} />
          <span>Two-Factor Authentication</span>
        </button>
      </div>
    </SectionContainer>
  </div>
);

const ITRInfoPage = () => (
  <div style={{ padding: '1.5rem' }}>
    <SectionContainer title="ITR & GST Information">
      <p>Here you will find detailed information and a list of all documents required for Income Tax Return (ITR) and Goods and Services Tax (GST) filing.</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-color)', margin: '0 0 0.5rem 0' }}>ITR Documents</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', margin: 0 }}>
            <li>Form 16/Form 16A</li>
            <li>Bank Statements</li>
            <li>Aadhar Card</li>
            <li>PAN Card</li>
            <li>Details of Investments</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-color)', margin: '0 0 0.5rem 0' }}>GST Documents</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', margin: 0 }}>
            <li>PAN Card of the business/applicant</li>
            <li>Aadhar Card</li>
            <li>Proof of Business Registration</li>
            <li>Bank Account Statement</li>
            <li>Address Proof for the business</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  </div>
);

const DocumentsPage = ({ onAction }) => (
  <div style={{ padding: '1.5rem' }}>
    <SectionContainer title="Client Documents">
      <p>This section is for managing and uploading client-related documents securely.</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <FileText size={20} style={{ marginRight: '0.75rem' }} />
            <span>ITR_2023_Ravi_Kumar.pdf</span>
          </span>
          <button onClick={() => onAction('download_doc')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Download</button>
        </div>
        <div style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <FileText size={20} style={{ marginRight: '0.75rem' }} />
            <span>PAN_Card_Priya_Sharma.jpg</span>
          </span>
          <button onClick={() => onAction('download_doc')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-color)', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Download</button>
        </div>
      </div>
      <button onClick={() => onAction('upload_doc')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--accent-color)', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Upload New Document</button>
    </SectionContainer>
  </div>
);


// --- MAIN APP COMPONENT ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const { theme, toggleTheme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    aadhar: "XXXX XXXX 1234",
    pan: "ABCDE1234F"
  });
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  // Firebase state
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firebase initialization and auth
  useEffect(() => {
    if (Object.keys(firebaseConfig).length === 0) {
      console.warn("Firebase config is not set. Firestore features will not work.");
      setIsAuthReady(true);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const auth = getAuth(app);
      setDb(firestoreDb);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            await signInAnonymously(auth);
          } catch (error) {
            console.error("Anonymous sign-in failed:", error);
          }
        }
        setIsAuthReady(true);
      });

      const signIn = async () => {
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(auth, initialAuthToken);
          } catch (error) {
            console.error("Custom token sign-in failed:", error);
            await signInAnonymously(auth);
          }
        }
      };
      signIn();

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsAuthReady(true);
    }
  }, []);


  const handleAction = (action) => {
    switch (action) {
      case 'show_notifications':
        setModalContent({
          title: 'Notifications',
          body: (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>New tax filing deadline approaching.</li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>Client 'Ravi Kumar' uploaded a document.</li>
              <li style={{ padding: '0.75rem 0' }}>Payment of ₹5000 received.</li>
            </ul>
          )
        });
        break;
      case 'change_password':
        setModalContent({
          title: 'Change Password',
          body: <ChangePasswordModal onClose={() => setShowModal(false)} />
        });
        break;
      case '2fa':
        setModalContent({
          title: 'Two-Factor Authentication',
          body: <TwoFAModal onClose={() => setShowModal(false)} />
        });
        break;
      case 'process_payment':
        setModalContent({
          title: 'Payment Processed',
          body: <p>Your payment request has been submitted. A confirmation will be sent to you shortly. This is a mock interaction.</p>
        });
        break;
      case 'edit_profile':
        setModalContent({
          title: 'Edit Profile',
          body: <EditProfileModal
            onClose={() => setShowModal(false)}
            onSave={(updatedProfile, imageFile) => {
              setProfile(updatedProfile);
              if (imageFile) {
                setProfilePicUrl(URL.createObjectURL(imageFile));
              }
            }}
            initialProfile={profile}
          />
        });
        break;
      case 'upload_doc':
        setModalContent({
          title: 'Upload Document',
          body: <UploadDocumentModal onClose={() => setShowModal(false)} />
        });
        break;
      case 'download_doc':
        setModalContent({
          title: 'Download Document',
          body: <p>The document would be downloaded here. This is a mock action.</p>
        });
        break;
      case 'logout':
        setModalContent({
          title: 'Log Out',
          body: (
            <div>
              <p>Are you sure you want to log out?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--secondary-color)', color: 'var(--text-color)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { console.log('User logged out'); setShowModal(false); }} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: '#dc3545', color: '#ffffff', border: 'none', cursor: 'pointer' }}>Log Out</button>
              </div>
            </div>
          )
        });
        break;
      default:
        setModalContent({
          title: 'Action Performed',
          body: <p>Action: {action} was triggered.</p>
        });
    }
    setShowModal(true);
  };

  const renderPage = () => {
    if (!isAuthReady) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <LoadingSpinner />
          <p style={{ marginLeft: '0.5rem', color: 'var(--text-color)' }}>Initializing...</p>
        </div>
      );
    }
    switch (currentPage) {
      case 'dashboard':
        return <TaxDashboard onAction={handleAction} />;
      case 'payments':
        return <PaymentsPage onAction={handleAction} />;
      case 'profile':
        return <ProfilePage onAction={handleAction} profile={profile} profilePicUrl={profilePicUrl} />;
      case 'documents':
        return <DocumentsPage onAction={handleAction} />;
      case 'ITR & GST Info':
        return <ITRInfoPage />;
      case 'settings':
        return <SettingsPage onAction={handleAction} />;
      default:
        return <TaxDashboard onAction={handleAction} />;
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutGrid />, page: 'dashboard' },
    { name: 'Profile', icon: <User />, page: 'profile' },
    { name: 'ITR & GST Info', icon: <Info />, page: 'ITR & GST Info' },
    { name: 'Documents', icon: <FileText />, page: 'documents' },
    { name: 'Payments', icon: <DollarSign />, page: 'payments' },
    { name: 'Settings', icon: <Settings />, page: 'settings' },
    { name: 'Log Out', icon: <LogOut />, page: 'logout' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', color: 'var(--text-color)', backgroundColor: 'var(--bg-color)' }}>
      {showModal && <Modal title={modalContent.title} onClose={() => setShowModal(false)}>{modalContent.body}</Modal>}
      {/* AI Assistant Floating Chat */}
      <AIAssistantFloating db={db} userId={userId} onToggle={() => setIsChatOpen(!isChatOpen)} isChatOpen={isChatOpen} />

      {/* Sidebar for navigation */}
      <div
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          backgroundColor: 'var(--card-bg)',
          boxShadow: '4px 0 12px var(--shadow-color)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 50,
          position: 'fixed',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark size={24} /> Tax Panel
          </h1>
          {/* This is the hamburger menu button, visible only on small screens */}
          <button onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-color)' }} className="md-hidden">
            <X size={24} />
          </button>
        </div>
        <nav style={{ marginTop: '2rem', padding: '0 1rem' }}>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.name} style={{ margin: '0.5rem 0' }}>
                <button
                  onClick={() => {
                    if (item.page === 'logout') {
                      handleAction('logout');
                    } else {
                      setCurrentPage(item.page);
                    }
                    setSidebarOpen(false); // Close sidebar on item click
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    backgroundColor: currentPage === item.page ? 'var(--secondary-color)' : 'transparent',
                    color: currentPage === item.page ? 'var(--primary-color)' : 'var(--text-color)',
                    fontWeight: currentPage === item.page ? '600' : 'normal',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-color)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentPage === item.page ? 'var(--secondary-color)' : 'transparent'}
                >
                  <div style={{ marginRight: '1rem', color: currentPage === item.page ? 'var(--primary-color)' : 'inherit' }}>{item.icon}</div>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar with user info and theme toggle */}
        <header style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', boxShadow: '0 2px 8px var(--shadow-color)', zIndex: 40 }}>
          {/* This is the hamburger menu button, only visible on small screens */}
          <button onClick={() => setSidebarOpen(true)} style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-color)' }} className="md-hidden">
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => handleAction('show_notifications')}
              style={{ position: 'relative', padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-color)' }}
              title="Notifications"
            >
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, height: '0.5rem', width: '0.5rem', backgroundColor: '#dc3545', borderRadius: '50%', border: '2px solid var(--card-bg)' }}></span>
            </button>
            <button
              onClick={toggleTheme}
              style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => {
                setCurrentPage('profile');
                setSidebarOpen(false);
              }}
            >
              <div style={{ height: '2rem', width: '2rem', backgroundColor: 'var(--secondary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={18} style={{ color: 'var(--primary-color)' }} />
                )}
              </div>
              <span style={{ color: 'var(--text-color)' }} className="md-inline">{profile.name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering based on current page */}
        <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', padding: 0 }} className="custom-scrollbar">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Root component wrapped in the ThemeProvider
export default () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
