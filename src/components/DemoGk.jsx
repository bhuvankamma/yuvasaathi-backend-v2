import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Mail, Phone, MapPin, User, Briefcase, ChevronRight, X, MessageSquare, Mic, Send, Bot, Loader, DollarSign, Users, Award, TrendingUp, Facebook, Twitter, Linkedin, Instagram, Landmark, FileText, CheckCircle, Lightbulb, Lock, Activity, Moon, Sun, Bell, LayoutGrid, Check, CreditCard, ClipboardCheck, BriefcaseBusiness, Globe, Handshake, ShieldCheck, PieChart, LineChart, Handshake as AboutIcon, Newspaper, Home } from 'lucide-react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

// --- CSS KEYFRAMES FOR ANIMATIONS ---
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes scrollText {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

// --- AUTH CONTEXT FOR MOCK AUTHENTICATION ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name: string, role: 'user' | 'admin' }

  // Mock login function
  const login = (userData) => {
    // In a real app, this would involve API calls for OTP and user validation
    console.log('Mock login successful for: ' + userData.email + ' with role: ' + userData.role);
    setUser({ name: userData.email.split('@')[0], role: userData.role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const onNavigate = (page) => {
    setCurrentPage(page);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
  };

  // Main container style to provide a base background and font
  const containerStyle = {
    fontFamily: 'sans-serif',
    backgroundColor: '#1a1a2e',
    color: '#e4e4e4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <AuthProvider>
      <style>{styles}</style>
      <div style={containerStyle}>
        <Header onNavigate={onNavigate} onOpenLogin={() => setIsLoginModalOpen(true)} />
        <AnnouncementBar />
        <main style={{ flex: '1 0 auto', padding: '1rem' }}>
          {currentPage === 'home' && <HomePage onNavigate={onNavigate} />}
          {currentPage === 'services' && <ServicesPage />}
          {currentPage === 'contact' && <ContactPage showSuccessMessage={showSuccessMessage} />}
          {currentPage === 'gst' && <GstPage onNavigate={onNavigate} />}
          {currentPage === 'about' && <AboutPage />}
          {successMessage && <MessageBox message={successMessage} />}
        </main>
        <Footer onOpenChatbot={() => setIsChatbotOpen(true)} />
        {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onOpenRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} />}
        {isRegisterModalOpen && <RegisterModal onClose={() => setIsRegisterModalOpen(false)} onOpenLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} showSuccessMessage={showSuccessMessage} />}
      </div>
    </AuthProvider>
  );
}

// --- MESSAGE BOX COMPONENT to replace alert() ---
const MessageBox = ({ message }) => {
  const messageBoxStyle = {
    position: 'fixed',
    bottom: '5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
    zIndex: 100,
    animation: 'popIn 0.3s ease-out forwards',
  };
  return <div style={messageBoxStyle}>{message}</div>;
};

// --- HEADER COMPONENT ---
const Header = ({ onNavigate, onOpenLogin }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#0f3460',
    color: '#facc15',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const navItemStyle = {
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const iconStyle = {
    color: '#facc15',
    marginRight: '0.5rem',
  };
  
  const navItemsContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  };
  
  const mobileMenuButtonStyle = {
    cursor: 'pointer',
    display: isMobile ? 'block' : 'none',
  };
  
  return (
    <header style={headerStyle}>
      <div style={logoStyle} onClick={() => onNavigate('home')}>
        <Briefcase style={iconStyle} /> GK Tax Consultancy
      </div>
      <div style={mobileMenuButtonStyle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <LayoutGrid />
      </div>
      
      {!isMobile && (
        <nav style={navItemsContainerStyle}>
          <div style={navItemStyle} onClick={() => onNavigate('home')}><Home /> Home</div>
          <div style={navItemStyle} onClick={() => onNavigate('services')}><ShieldCheck /> Services</div>
          <div style={navItemStyle} onClick={() => onNavigate('gst')}><Landmark /> GST Info</div>
          <div style={navItemStyle} onClick={() => onNavigate('about')}><AboutIcon /> About Us</div>
          <div style={navItemStyle} onClick={() => onNavigate('contact')}><Phone /> Contact</div>
          {user ? (
            <div style={navItemStyle} onClick={logout}>
              <User />
            </div>
          ) : (
            <div style={navItemStyle} onClick={onOpenLogin}>
              <User />
            </div>
          )}
        </nav>
      )}

      {isMobileMenuOpen && isMobile && (
        <div style={{
          position: 'absolute',
          top: '4rem',
          right: '1rem',
          backgroundColor: '#0f3460',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}>
          <div style={navItemStyle} onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}><Home /> Home</div>
          <div style={navItemStyle} onClick={() => { onNavigate('services'); setIsMobileMenuOpen(false); }}><ShieldCheck /> Services</div>
          <div style={navItemStyle} onClick={() => { onNavigate('gst'); setIsMobileMenuOpen(false); }}><Landmark /> GST Info</div>
          <div style={navItemStyle} onClick={() => { onNavigate('about'); setIsMobileMenuOpen(false); }}><AboutIcon /> About Us</div>
          <div style={navItemStyle} onClick={() => { onNavigate('contact'); setIsMobileMenuOpen(false); }}><Phone /> Contact</div>
          {user ? (
            <div style={navItemStyle} onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout</div>
          ) : (
            <div style={navItemStyle} onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }}>Login</div>
          )}
        </div>
      )}
    </header>
  );
};

// --- ANNOUNCEMENT BAR COMPONENT ---
const AnnouncementBar = () => {
  const barStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.5rem 0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const textStyle = {
    animation: 'scrollText 20s linear infinite',
    display: 'inline-block',
  };

  return (
    <div style={barStyle}>
      <Newspaper size={20} style={{ marginLeft: '1rem', minWidth: '20px' }} />
      <span style={textStyle}>
        Latest Update: Our new GST consultation service is now available! Get personalized advice and seamless filing support.
      </span>
    </div>
  );
};

// --- FOOTER COMPONENT (Advanced Responsive Design) ---
const Footer = ({ onOpenChatbot }) => {
  const footerStyle = {
    backgroundColor: '#0f3460',
    color: '#e4e4e4',
    padding: '2rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '2rem',
  };

  const sectionStyle = {
    flex: '1 1 200px',
  };

  const headingStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#facc15',
  };

  const linkStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#e4e4e4',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem',
  };

  const socialIconStyle = {
    color: '#e4e4e4',
    transition: 'color 0.3s ease',
  };
  
  const mapContainerStyle = {
    flex: '1 1 300px',
    height: '200px',
    borderRadius: '0.75rem',
    overflow: 'hidden',
  };
  
  const copyrightStyle = {
    width: '100%',
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.75rem',
    color: '#a0aec0',
  };

  return (
    <footer style={footerStyle}>
      <div style={sectionStyle}>
        <h4 style={headingStyle}>GK Tax Consultancy</h4>
        <p style={{ fontSize: '0.875rem' }}>Your trusted partner for all tax and business solutions. We help you grow with confidence and clarity.</p>
        <div style={socialLinksStyle}>
          <a href="#" style={socialIconStyle}><Facebook size={20} /></a>
          <a href="#" style={socialIconStyle}><Twitter size={20} /></a>
          <a href="#" style={socialIconStyle}><Linkedin size={20} /></a>
          <a href="#" style={socialIconStyle}><Instagram size={20} /></a>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={headingStyle}>Quick Links</h4>
        <a href="#" style={linkStyle}>Home</a>
        <a href="#" style={linkStyle}>Services</a>
        <a href="#" style={linkStyle}>About Us</a>
        <a href="#" style={linkStyle}>Contact</a>
      </div>

      <div style={sectionStyle}>
        <h4 style={headingStyle}>Contact Info</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Mail size={16} />
          <span>info@gktaxconsultancy.com</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Phone size={16} />
          <span>+91 7815942730</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
          <MapPin size={16} />
          {/* Updated address based on the screenshot */}
          <span>3rd Floor, 7-1-304/7/22, Oaks men's saloon, Udaynagar Colony, Tulasi Nagar, Sanath Nagar, Hyderabad</span>
        </div>
      </div>
      
      <div style={mapContainerStyle}>
        <h4 style={{ ...headingStyle, marginBottom: '0.5rem' }}>Our Location</h4>
        <iframe
          // Updated Google Maps embed URL for the new location
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.402361665403!2d78.43572877561848!3d17.44358688344605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9046645391d1%3A0xf6731d7f1d43a6d7!2sSanath%20Nagar%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1716301323385!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location Map"
        ></iframe>
      </div>
      
      <div style={copyrightStyle}>
        &copy; 2024 GK Tax Consultancy. All rights reserved.
      </div>
      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 30 }}>
        <button onClick={onOpenChatbot} style={{ backgroundColor: '#facc15', color: '#1a1a2e', width: '3rem', height: '3rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: 'none', cursor: 'pointer', animation: 'popIn 0.3s ease-out forwards' }}>
          <MessageSquare size={20} />
        </button>
      </div>
    </footer>
  );
};

// --- HOME PAGE COMPONENT (Minimized with animation) ---
const HomePage = ({ onNavigate }) => {
  const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '40vh',
    padding: '1rem',
    animation: 'fadeIn 1s ease-out forwards',
  };
  
  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#facc15',
  };
  
  const subHeadingStyle = {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#e4e4e4',
  };
  
  const buttonStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.5rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    border: 'none',
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={headingStyle}>Your Trusted Partner in Business Solutions</h1>
      <p style={subHeadingStyle}>We provide expert consulting and financial services to help your business thrive.</p>
      <button style={buttonStyle} onClick={() => onNavigate('contact')}>Get Started</button>
    </div>
  );
};

// --- ABOUT PAGE COMPONENT (IMPROVED) ---
const AboutPage = () => {
  const pageContainerStyle = {
    padding: '1.5rem',
    backgroundColor: 'rgba(25, 25, 40, 0.7)',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: '1rem',
  };

  const subHeadingStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#e4e4e4',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
  };
  
  const paragraphStyle = {
    marginBottom: '1rem',
    lineHeight: '1.6',
    fontSize: '0.9rem',
  };
  
  const listStyle = {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
  };

  const listItemStyle = {
    marginBottom: '0.25rem',
  };
  
  const sectionDividerStyle = {
    height: '1px',
    backgroundColor: 'rgba(240, 240, 240, 0.2)',
    margin: '1.5rem 0',
  };

  return (
    <div style={pageContainerStyle}>
      <h2 style={headingStyle}>About GK Tax Consultancy</h2>
      <p style={paragraphStyle}>
        At GK Tax Consultancy, our mission is to empower businesses with the knowledge and tools they need to navigate the complexities of tax and finance. We believe that with the right guidance, every business can achieve its full potential and contribute to a thriving economy.
      </p>

      <div style={sectionDividerStyle}></div>

      <h3 style={subHeadingStyle}>Our Expertise</h3>
      <p style={paragraphStyle}>
        Our team is comprised of highly experienced and certified professionals who are passionate about delivering excellence. We stay ahead of regulatory changes and market trends to provide proactive, tailored solutions. From complex GST filings to strategic business planning, our expertise ensures you are always compliant and on a path to success.
      </p>

      <div style={sectionDividerStyle}></div>

      <h3 style={subHeadingStyle}>Our Core Values</h3>
      <ul style={listStyle}>
        <li style={listItemStyle}><strong>Integrity:</strong> We operate with the highest level of honesty and ethical standards.</li>
        <li style={listItemStyle}><strong>Client-Centric:</strong> Your business goals are our priority. We are dedicated to building long-term, trusting relationships.</li>
        <li style={listItemStyle}><strong>Innovation:</strong> We leverage technology and modern practices to provide efficient and transparent services.</li>
        <li style={listItemStyle}><strong>Clarity:</strong> We simplify complex financial concepts, so you can make informed decisions with confidence.</li>
      </ul>
      
      <div style={sectionDividerStyle}></div>
      
      <p style={paragraphStyle}>
        Partner with GK Tax Consultancy today and discover how our dedicated support can make a tangible difference in your business's financial health and growth.
      </p>
    </div>
  );
};

// --- SERVICES PAGE COMPONENT ---
const ServicesPage = () => {
  const services = [
    { icon: <BriefcaseBusiness />, title: 'Business Consulting', description: 'Expert advice to optimize your business strategy and operations.' },
    { icon: <DollarSign />, title: 'Financial Planning', description: 'Comprehensive financial strategies for sustainable growth and stability.' },
    { icon: <ClipboardCheck />, title: 'Tax & Compliance', description: 'Ensuring your business stays compliant with all regulatory requirements.' },
    { icon: <TrendingUp />, title: 'Growth Strategies', description: 'Customized plans to help you expand your market reach and revenue.' },
    { icon: <FileText />, title: 'GST Filing & Returns', description: 'Hassle-free management of your GST filings and documentation.' },
    { icon: <Award />, title: 'Auditing & Assurance', description: 'Reliable and independent audit services to ensure financial accuracy.' },
    { icon: <Handshake />, title: 'Payroll Management', description: 'Efficient and accurate payroll processing for your employees.' },
    { icon: <CreditCard />, title: 'Loan & Funding Assistance', description: 'Guidance and support in securing business loans and funding.' },
  ];
  
  const pageContainerStyle = {
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  };
  
  const cardStyle = {
    backgroundColor: 'rgba(25, 25, 40, 0.7)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'fadeInUp 0.5s ease-out forwards',
  };

  const iconContainerStyle = {
    color: '#facc15',
    marginBottom: '0.75rem',
  };

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
  };

  const descriptionStyle = {
    fontSize: '0.875rem',
    color: '#a0aec0',
  };

  return (
    <div style={pageContainerStyle}>
      {services.map((service, index) => (
        <div key={index} style={{ ...cardStyle, animationDelay: `${index * 0.1}s` }}>
          <div style={iconContainerStyle}>{service.icon}</div>
          <h3 style={titleStyle}>{service.title}</h3>
          <p style={descriptionStyle}>{service.description}</p>
        </div>
      ))}
    </div>
  );
};

// --- CONTACT PAGE COMPONENT (Minimized form with validation) ---
const ContactPage = ({ showSuccessMessage }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.message) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Logic to submit the form data
      console.log('Form submitted:', formData);
      showSuccessMessage('Thank you for your message! We will get back to you shortly.');
      // Clear the form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      console.log('Validation failed:', errors);
    }
  };
  
  const formContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
  };
  
  const formCardStyle = {
    backgroundColor: 'rgba(25, 25, 40, 0.7)',
    padding: '1rem', // Reduced padding
    borderRadius: '0.75rem',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Reduced gap
  };

  const inputStyle = {
    width: '100%',
    padding: '0.4rem 0.6rem', // Smaller padding
    borderRadius: '0.5rem',
    border: '1px solid #4a5568',
    backgroundColor: '#2d3748',
    color: '#e4e4e4',
    boxSizing: 'border-box', // Added box-sizing to fix overflow
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px',
  };

  const submitButtonStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.6rem', // Reduced padding
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    marginTop: '0.5rem',
  };

  const errorTextStyle = {
    color: '#ff6b6b',
    fontSize: '0.75rem',
    marginTop: '-0.25rem',
    marginBottom: '0.25rem',
  };

  return (
    <div style={formContainerStyle}>
      <div style={formCardStyle}>
        <h2 style={headingStyle}>Get in Touch</h2>
        <form style={formStyle} onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} style={inputStyle} />
          {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} style={inputStyle} />
          {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={inputStyle} />
          <textarea name="message" placeholder="Your Message" rows="3" value={formData.message} onChange={handleChange} style={textareaStyle}></textarea>
          {errors.message && <p style={errorTextStyle}>{errors.message}</p>}
          <button type="submit" style={submitButtonStyle}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

// --- GST INFO PAGE COMPONENT ---
const GstPage = ({ onNavigate }) => {
  const pageContainerStyle = {
    padding: '1.5rem',
    backgroundColor: 'rgba(25, 25, 40, 0.7)',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: '1rem',
  };

  const subHeadingStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#e4e4e4',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
  };

  const paragraphStyle = {
    marginTop: '1rem',
    lineHeight: '1.6',
    fontSize: '0.9rem',
  };

  const listStyle = {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
  };

  const listItemStyle = {
    marginBottom: '0.25rem',
  };

  const buttonContainerStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
  };

  const buttonStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.6rem 1.8rem',
    borderRadius: '9999px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  };

  return (
    <div style={pageContainerStyle}>
      <h2 style={headingStyle}>What is GST?</h2>
      <p style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
        The Goods and Services Tax (GST) is an indirect tax used in India on the supply of goods and services. It is a comprehensive, multi-stage, destination-based tax that has replaced many indirect taxes.
      </p>
      <p style={{ lineHeight: '1.6', marginTop: '0.75rem', fontSize: '0.9rem' }}>
        It was implemented to consolidate all central and state taxes into a single tax. This has streamlined the tax structure and made the process more transparent for businesses.
      </p>

      <h3 style={subHeadingStyle}>Key Benefits for Small Businesses</h3>
      <ul style={listStyle}>
        <li style={listItemStyle}>Simplified compliance with a single tax structure.</li>
        <li style={listItemStyle}>Reduced cascading effect of taxes.</li>
        <li style={listItemStyle}>Uniform tax rates across the country.</li>
        <li style={listItemStyle}>Easier to do business with online registration and return filing.</li>
      </ul>

      <p style={paragraphStyle}>For more detailed information or personalized advice, feel free to contact our team of experts.</p>
      
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={() => onNavigate('contact')}>Contact Us Today</button>
      </div>
    </div>
  );
};

// --- CHATBOT COMPONENT (Minimized and responsive) ---
const Chatbot = ({ onClose }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [chatHistory, isLoading]);
  
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    const userMessage = { role: 'user', text: currentMessage };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setCurrentMessage('');
    setIsLoading(true);
    
    // Mock API call to demonstrate functionality
    setTimeout(() => {
        const botResponseText = 'This is a mock response to your query: "' + currentMessage + '". For detailed tax advice, please contact a consultant.';
        setChatHistory(prev => [...prev, { role: 'bot', text: botResponseText }]);
        setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSendMessage(); };

  const chatbotContainerStyle = {
    position: 'fixed',
    bottom: '4rem',
    right: '1rem',
    width: '90%',
    maxWidth: '20rem',
    height: '25rem',
    borderRadius: '0.75rem',
    backgroundColor: '#2d3748',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
    zIndex: 40,
    animation: 'popIn 0.3s ease-out forwards',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: '#0f3460',
    color: '#facc15',
    borderTopLeftRadius: '0.75rem',
    borderTopRightRadius: '0.75rem',
  };

  const chatMessagesStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#3b4352',
  };

  const messageBoxStyle = (role) => ({
    backgroundColor: role === 'user' ? '#facc15' : '#4a5568',
    color: role === 'user' ? '#1a1a2e' : '#e4e4e4',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    maxWidth: '80%',
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
  });
  
  const inputContainerStyle = {
    display: 'flex',
    padding: '0.75rem',
    borderTop: '1px solid #4a5568',
    backgroundColor: '#2d3748',
  };

  const inputStyle = {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '9999px',
    border: '1px solid #4a5568',
    backgroundColor: '#3b4352',
    color: '#e4e4e4',
    marginRight: '0.5rem',
  };

  const sendButtonStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={chatbotContainerStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>AI Assistant</h3>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#e4e4e4', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      <div style={chatMessagesStyle}>
        <div style={{ ...messageBoxStyle('bot'), alignSelf: 'flex-start' }}>
          Hello! How can I help you today?
        </div>
        {chatHistory.map((msg, index) => (
          <div key={index} style={messageBoxStyle(msg.role)}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ ...messageBoxStyle('bot'), alignSelf: 'flex-start' }}>
            <Loader size={16} className="animate-spin" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} style={sendButtonStyle}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

// --- LOGIN MODAL (Role-based and Responsive with minimal styling) ---
const LoginModal = ({ onClose, onOpenRegister }) => {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (role === 'user' && (!email || !/\S+@\S+\.\S+/.test(email))) {
      newErrors.email = 'Valid email is required.';
    }
    if (role === 'admin' && !adminId) {
      newErrors.adminId = 'Admin ID is required.';
    }
    if (role === 'admin' && !password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Sending OTP to ' + (role === 'user' ? email : adminId));
      setShowOtpField(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (otp) {
      if (role === 'user') {
        login({ email, role });
      } else {
        login({ email: adminId, role });
      }
      onClose();
    }
  };

  const modalContainerStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease-out forwards',
  };

  const formCardStyle = {
    position: 'relative',
    width: '90%',
    maxWidth: '300px', // Smaller width
    borderRadius: '0.75rem',
    backgroundColor: '#1a1a2e',
    padding: '1rem', // Reduced padding
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
  };

  const roleToggleStyle = {
    display: 'flex',
    marginBottom: '0.75rem',
    backgroundColor: '#2d3748',
    borderRadius: '0.5rem',
  };

  const toggleButtonStyle = (active) => ({
    flex: 1,
    padding: '0.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    backgroundColor: active ? '#facc15' : 'transparent',
    color: active ? '#1a1a2e' : '#e4e4e4',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
  });

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Reduced gap
  };

  const inputStyle = {
    width: '100%',
    padding: '0.4rem 0.6rem', // Smaller padding
    borderRadius: '0.5rem',
    border: '1px solid #4a5568',
    backgroundColor: '#2d3748',
    color: '#e4e4e4',
    boxSizing: 'border-box', // Added box-sizing to fix overflow
  };

  const buttonStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.6rem', // Reduced padding
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    marginTop: '0.5rem',
  };

  const errorTextStyle = {
    color: '#ff6b6b',
    fontSize: '0.75rem',
    marginTop: '-0.25rem',
    marginBottom: '0.25rem',
  };

  return (
    <div style={modalContainerStyle}>
      <div style={formCardStyle}>
        <button onClick={onClose} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', color: '#e4e4e4', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem' }}>Login</h2>

        <div style={roleToggleStyle}>
          <div onClick={() => { setRole('user'); setErrors({}); }} style={toggleButtonStyle(role === 'user')}>User</div>
          <div onClick={() => { setRole('admin'); setErrors({}); }} style={toggleButtonStyle(role === 'admin')}>Admin</div>
        </div>

        <form style={formStyle} onSubmit={showOtpField ? handleLogin : handleSendOtp}>
          {role === 'user' ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
              {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                style={inputStyle}
                required
              />
              {errors.adminId && <p style={errorTextStyle}>{errors.adminId}</p>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
              {errors.password && <p style={errorTextStyle}>{errors.password}</p>}
            </>
          )}

          {showOtpField && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
              required
            />
          )}

          <button type="submit" style={buttonStyle}>
            {showOtpField ? 'Login' : 'Send OTP'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          Don't have an account? <span onClick={onOpenRegister} style={{ color: '#facc15', cursor: 'pointer' }}>Register here.</span>
        </p>
      </div>
    </div>
  );
};

// --- REGISTER MODAL (Role-based and Responsive with validation and minimal styling) ---
const RegisterModal = ({ onClose, onOpenLogin, showSuccessMessage }) => {
  const [role, setRole] = useState('user');
  // Updated formData state to include confirmPassword and remove dob
  const [formData, setFormData] = useState({ fullName: '', surname: '', email: '', password: '', confirmPassword: '', aadhaar: '', pan: '' });
  const [adminFormData, setAdminFormData] = useState({ adminId: '', password: '', department: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (role === 'user') {
      if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
      if (!formData.surname) newErrors.surname = 'Surname is required.';
      if (!formData.email) {
        newErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email address is invalid.';
      }
      if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
      // Validation for confirmPassword
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
      if (!formData.aadhaar || formData.aadhaar.length !== 12) newErrors.aadhaar = 'Aadhaar must be 12 digits.';
      if (!formData.pan || formData.pan.length !== 10) newErrors.pan = 'PAN must be 10 characters.';
    } else {
      if (!adminFormData.adminId) newErrors.adminId = 'Admin ID is required.';
      if (!adminFormData.password) newErrors.password = 'Password is required.';
      if (!adminFormData.department) newErrors.department = 'Department is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (role === 'user') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setAdminFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Registering as ' + (role === 'user' ? formData.email : adminFormData.adminId));
      showSuccessMessage('Registration successful!');
      onClose();
    } else {
      console.log('Validation failed:', errors);
    }
  };

  const modalContainerStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.3s ease-out forwards',
  };

  const formCardStyle = {
    position: 'relative',
    width: '90%',
    maxWidth: '300px', // Smaller width
    borderRadius: '0.75rem',
    backgroundColor: '#1a1a2e',
    padding: '1rem', // Reduced padding
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
  };

  const roleToggleStyle = {
    display: 'flex',
    marginBottom: '0.75rem',
    backgroundColor: '#2d3748',
    borderRadius: '0.5rem',
  };

  const toggleButtonStyle = (active) => ({
    flex: 1,
    padding: '0.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    backgroundColor: active ? '#facc15' : 'transparent',
    color: active ? '#1a1a2e' : '#e4e4e4',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
  });

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Reduced gap
  };

  const inputStyle = {
    width: '100%',
    padding: '0.4rem 0.6rem', // Smaller padding
    borderRadius: '0.5rem',
    border: '1px solid #4a5568',
    backgroundColor: '#2d3748',
    color: '#e4e4e4',
    boxSizing: 'border-box', // Added box-sizing to fix overflow
  };

  const buttonStyle = {
    backgroundColor: '#facc15',
    color: '#1a1a2e',
    padding: '0.6rem', // Reduced padding
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    marginTop: '0.5rem',
  };
  
  const errorTextStyle = {
    color: '#ff6b6b',
    fontSize: '0.75rem',
    marginTop: '-0.25rem',
    marginBottom: '0.25rem',
  };

  return (
    <div style={modalContainerStyle}>
      <div style={formCardStyle}>
        <button onClick={onClose} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', color: '#e4e4e4', cursor: 'pointer' }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem' }}>Register</h2>

        <div style={roleToggleStyle}>
          <div onClick={() => { setRole('user'); setErrors({}); }} style={toggleButtonStyle(role === 'user')}>User</div>
          <div onClick={() => { setRole('admin'); setErrors({}); }} style={toggleButtonStyle(role === 'admin')}>Admin</div>
        </div>

        <form style={formStyle} onSubmit={handleRegister}>
          {role === 'user' ? (
            <>
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} style={inputStyle} required />
              {errors.fullName && <p style={errorTextStyle}>{errors.fullName}</p>}
              <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} style={inputStyle} required />
              {errors.surname && <p style={errorTextStyle}>{errors.surname}</p>}
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} required />
              {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={inputStyle} required />
              {errors.password && <p style={errorTextStyle}>{errors.password}</p>}
              {/* Added a Confirm Password field as requested. */}
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} required />
              {errors.confirmPassword && <p style={errorTextStyle}>{errors.confirmPassword}</p>}
              {/* Removed the Date of Birth field */}
              <input type="text" name="aadhaar" placeholder="Aadhaar Number (12 digits)" value={formData.aadhaar} onChange={handleChange} style={inputStyle} required />
              {errors.aadhaar && <p style={errorTextStyle}>{errors.aadhaar}</p>}
              <input type="text" name="pan" placeholder="PAN Number (10 characters)" value={formData.pan} onChange={handleChange} style={inputStyle} required />
              {errors.pan && <p style={errorTextStyle}>{errors.pan}</p>}
            </>
          ) : (
            <>
              <input type="text" name="adminId" placeholder="Admin ID" value={adminFormData.adminId} onChange={handleChange} style={inputStyle} required />
              {errors.adminId && <p style={errorTextStyle}>{errors.adminId}</p>}
              <input type="password" name="password" placeholder="Password" value={adminFormData.password} onChange={handleChange} style={inputStyle} required />
              {errors.password && <p style={errorTextStyle}>{errors.password}</p>}
              <input type="text" name="department" placeholder="Department" value={adminFormData.department} onChange={handleChange} style={inputStyle} required />
              {errors.department && <p style={errorTextStyle}>{errors.department}</p>}
            </>
          )}

          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          Already have an account? <span onClick={onOpenLogin} style={{ color: '#facc15', cursor: 'pointer' }}>Login here.</span>
        </p>
      </div>
    </div>
  );
};
