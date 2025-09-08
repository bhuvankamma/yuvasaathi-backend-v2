import React, { useState, useMemo } from 'react';
import image1 from '../assets/image-1.png';
import image2 from '../assets/pmky.jpg';
import image3 from '../assets/kisan.jpg';
import image4 from '../assets/intern.png';
import image5 from '../assets/image-5.jpg';
import image6 from '../assets/image-6.jpg';
import image7 from '../assets/card.webp';
import image8 from '../assets/image-8.jpg';
import image9 from '../assets/yojana.webp';
import image10 from '../assets/water.jpg';
import image11 from '../assets/NSAP.jpg';
import image12 from '../assets/image-12.jpg';


// Real Bihar Govt links for programs
const govtLinks = {
  'Bihar Rojgar Mela (Job Fair)': 'https://ncs.gov.in/',
  'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)': 'https://www.india.gov.in/pradhan-mantri-kaushal-vikas-yojana-pmkvy',
  'Bihar Krishi Anudan Yojana': 'https://dbtagriculture.bihar.gov.in/',
  'Student Internship Program': 'https://cag.gov.in/ag/bihar/hi/page-ag-bihar-student-internship-program',
  'Startup Bihar Policy': 'https://startup.bihar.gov.in/startup-recognition',
  'Jal Jeevan Hariyali Abhiyan': 'https://jaljeevanmission.gov.in/about_jjm',
  'Bihar Student Credit Card Scheme': 'https://www.myscheme.gov.in/schemes/bsccs',
  'Mukhya Mantri Kanya Utthan Yojana': 'https://ekalyan.bih.nic.in/kanyautthan.aspx',
  'Mukhyamantri Gram Parivahan Yojana': 'https://transport.bih.nic.in/RoadSafety/MGPY.html',
  'Har Ghar Nal Ka Jal': 'https://bvm.bihar.gov.in/submission/nc/nishchay-1-har-ghar-nal-ka-jal/',
  'National Social Assistance Programme': 'https://www.sspmis.bihar.gov.in/',
  'Bihar Rajya Fasal Sahayata Yojana': 'https://dbtagriculture.bihar.gov.in/PMFBY.aspx',
};

// Hindi translations for all text and program info
const translations = {
  hi: {
    sectionTitle: 'बिहार सरकार के लाभ और कार्यक्रम',
    sectionDescription:
      'कौशल विकास, रोजगार, और सामाजिक कल्याण के लिए बिहार सरकार की विभिन्न पहलों और योजनाओं का अन्वेषण करें।',
    searchPlaceholder: 'कार्यक्रम खोजें...',
    filterAll: 'सभी',
    filterActive: 'सक्रिय',
    filterUpcoming: 'आगामी',
    filterLive: 'लाइव',
    participants: 'प्रतिभागी',
    statusLabels: {
      Active: 'सक्रिय',
      Upcoming: 'आगामी',
      Live: 'लाइव',
      Default: 'स्थिति',
    },
    languageLabel: 'भाषा',
    viewDetails: 'विवरण देखें',
    noProgramsFound: 'कोई कार्यक्रम नहीं मिला।',
    viewMore: 'और देखें',
    viewLess: 'कम देखें',
    programs: {
      'Bihar Rojgar Mela (Job Fair)': {
        title: 'बिहार रोजगार मेला (नौकरी मेला)',
        description:
          'नौकरी चाहने वालों को विभिन्न उद्योगों से जोड़ना। नियमित नौकरी मेले जिलों में आयोजित किए जाते हैं।',
      },
      'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)': {
        title: 'प्रधानमंत्री कौशल विकास योजना (पीएमकेवीवाई)',
        description:
          'युवाओं को उद्योग-संबंधित कौशल प्रशिक्षण लेने में सक्षम बनाने के लिए कौशल प्रमाणीकरण योजना।',
      },
      'Bihar Krishi Anudan Yojana': {
        title: 'बिहार कृषि अनुदान योजना',
        description:
          'आधुनिक कृषि पद्धतियों के लिए किसानों को सब्सिडी और सहायता प्रदान करना।',
      },
      'Student Internship Program': {
        title: 'छात्र इंटर्नशिप कार्यक्रम',
        description:
          'छात्रों को सरकारी विभागों और सार्वजनिक क्षेत्र के उपक्रमों में व्यावहारिक अनुभव प्राप्त करने के अवसर।',
      },
      'Startup Bihar Policy': {
        title: 'स्टार्टअप बिहार नीति',
        description:
          'उभरते उद्यमियों को धन और परामर्श के साथ प्रोत्साहित और समर्थन करना।',
      },
      'Jal Jeevan Hariyali Abhiyan': {
        title: 'जल जीवन हरियाली अभियान',
        description:
          'जल संरक्षण और हरियाली को बढ़ावा देने के लिए एक बड़ा अभियान।',
      },
      'Bihar Student Credit Card Scheme': {
        title: 'बिहार स्टूडेंट क्रेडिट कार्ड योजना',
        description:
          'छात्रों को उच्च शिक्षा के लिए वित्तीय सहायता, ताकि वे अपने सपनों को पूरा कर सकें।',
      },
      'Mukhya Mantri Kanya Utthan Yojana': {
        title: 'मुख्यमंत्री कन्या उत्थान योजना',
        description:
          'जन्म से स्नातक तक महिला शिक्षा और सामाजिक कल्याण को बढ़ावा देने वाली एक योजना।',
      },
      'Mukhyaministri Gram Parivahan Yojana': {
        title: 'मुख्यमंत्री ग्राम परिवहन योजना',
        description:
          'ग्रामीण कनेक्टिविटी में सुधार के लिए बेरोजगार युवाओं को वाहन खरीदने के लिए रियायती ऋण प्रदान करना।',
      },
      'Har Ghar Nal Ka Jal': {
        title: 'हर घर नल का जल',
        description:
          'बिहार के हर घर में पाइप से पीने का पानी उपलब्ध कराने का एक प्रमुख कार्यक्रम।',
      },
      'National Social Assistance Programme': {
        title: 'राष्ट्रीय सामाजिक सहायता कार्यक्रम',
        description:
          'वृद्धावस्था पेंशन, विधवा पेंशन और विकलांगता लाभ सहित विभिन्न सामाजिक पेंशन प्रदान करना।',
      },
      'Bihar Rajya Fasal Sahayata Yojana': {
        title: 'बिहार राज्य फसल सहायता योजना',
        description:
          'प्राकृतिक आपदाओं के कारण फसल क्षति से पीड़ित किसानों को वित्तीय सहायता प्रदान करना।',
      },
    },
  },
  en: {
    sectionTitle: 'Current Benefits & Programs',
    sectionDescription:
      'Explore the various government initiatives and schemes designed to empower citizens with skill development, employment, and social welfare support.',
    searchPlaceholder: 'Search programs...',
    filterAll: 'All',
    filterActive: 'Active',
    filterUpcoming: 'Upcoming',
    filterLive: 'Live',
    participants: 'Participants',
    statusLabels: {
      Active: 'Active',
      Upcoming: 'Upcoming',
      Live: 'Live',
      Default: 'Status',
    },
    languageLabel: 'Language',
    viewDetails: 'View Details',
    noProgramsFound: 'No programs found.',
    viewMore: 'View More',
    viewLess: 'View Less',
    programs: {}, // English already exists in the initial data
  },
};

const initialPrograms = [
  {
    id: 1,
    title: 'Bihar Rojgar Mela (Job Fair)',
    description:
      'Connecting job seekers with various industries. Regular job fairs held across districts.',
    detailsLink: '#',
    status: 'Active',
    icon: '💼',
    image: image1,
    participants: 12000,
    progress: 75,
  },
  {
    id: 2,
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
    description:
      'Skill certification scheme to enable youth to take up industry-relevant skill training.',
    detailsLink: '#',
    status: 'Active',
    icon: '🎓',
    image: image2,
    participants: 9500,
    progress: 60,
  },
  {
    id: 3,
    title: 'Bihar Krishi Anudan Yojana',
    description:
      'Providing subsidies and support to farmers for modern agricultural practices.',
    detailsLink: '#',
    status: 'Upcoming',
    icon: '🚜',
    image: image3,
    participants: 0,
    progress: 0,
  },
  {
    id: 4,
    title: 'Student Internship Program',
    description:
      'Opportunities for students to gain practical experience in government departments and PSUs.',
    detailsLink: '#',
    status: 'Active',
    icon: '📚',
    image: image4,
    participants: 3500,
    progress: 50,
  },
  {
    id: 5,
    title: 'Startup Bihar Policy',
    description:
      'Incentivizing and supporting budding entrepreneurs with funding and mentorship.',
    detailsLink: '#',
    status: 'Active',
    icon: '🚀',
    image: image5,
    participants: 1800,
    progress: 40,
  },
  {
    id: 6,
    title: 'Jal Jeevan Hariyali Abhiyan',
    description:
      'A massive campaign for water conservation and greenery promotion.',
    detailsLink: '#',
    status: 'Active',
    icon: '💧',
    image: image6,
    participants: 25000,
    progress: 85,
  },
  {
    id: 7,
    title: 'Bihar Student Credit Card Scheme',
    description:
      'Financial assistance to students for higher education, enabling them to pursue their dreams.',
    detailsLink: '#',
    status: 'Active',
    icon: '💳',
    image: image7,
    participants: 45000,
    progress: 90,
  },
  {
    id: 8,
    title: 'Mukhya Mantri Kanya Utthan Yojana',
    description:
      'A scheme to promote female education and social welfare from birth to graduation.',
    detailsLink: '#',
    status: 'Active',
    icon: '👧',
    image: image8,
    participants: 60000,
    progress: 80,
  },
  {
    id: 9,
    title: 'Mukhyamantri Gram Parivahan Yojana',
    description:
      'Providing subsidized loans to unemployed youth for purchasing vehicles to improve rural connectivity.',
    detailsLink: '#',
    status: 'Upcoming',
    icon: '🚐',
    image: image9,
    participants: 0,
    progress: 0,
  },
  {
    id: 10,
    title: 'Har Ghar Nal Ka Jal',
    description:
      'A flagship program to provide piped drinking water to every household in Bihar.',
    detailsLink: '#',
    status: 'Live',
    icon: '🚰',
    image: image10,
    participants: 15000,
    progress: 10,
  },
  {
    id: 11,
    title: 'National Social Assistance Programme',
    description: 'Providing various social pensions, including old age pension, widow pension, and disability benefits.',
    detailsLink: '#',
    status: 'Active',
    icon: '👵',
    image: image11,
    participants: 150000,
    progress: 95,
  },
  {
    id: 12,
    title: 'Bihar Rajya Fasal Sahayata Yojana',
    description: 'Providing financial assistance to farmers who suffer crop losses due to natural calamities.',
    detailsLink: '#',
    status: 'Active',
    icon: '🌾',
    image: image12,
    participants: 40000,
    progress: 70,
  },
];

const statusColors = {
  Active: 'bg-green-500',
  Upcoming: 'bg-blue-500',
  Live: 'bg-red-500',
  Default: 'bg-gray-400',
};

// Number of programs to show initially
const PROGRAMS_TO_SHOW = 6;

// This component now receives props for language management
const BenefitsPrograms = ({ language, setLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [visibleProgramsCount, setVisibleProgramsCount] = useState(PROGRAMS_TO_SHOW);

  // Filter and search programs dynamically
  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((p) => {
      // Check both English and Hindi versions for search
      const title = translations[language].programs[p.title]?.title || p.title;
      const description = translations[language].programs[p.title]?.description || p.description;

      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, language]);

  const displayedPrograms = filteredPrograms.slice(0, visibleProgramsCount);
  const showViewMore = filteredPrograms.length > visibleProgramsCount && visibleProgramsCount === PROGRAMS_TO_SHOW;
  const showViewLess = visibleProgramsCount > PROGRAMS_TO_SHOW && filteredPrograms.length > PROGRAMS_TO_SHOW;

  // Translate text helper
  const t = (key) => {
    return translations[language][key] || key;
  };

  const getTranslatedProgram = (program) => {
    return translations[language].programs[program.title] || {
      title: program.title,
      description: program.description
    };
  };

  // Get real govt link if available, else fallback
  const getProgramLink = (title, fallback) => {
    return govtLinks[title] || fallback || '#';
  };

  const handleViewMore = () => {
    setVisibleProgramsCount(initialPrograms.length);
  };

  const handleViewLess = () => {
    setVisibleProgramsCount(PROGRAMS_TO_SHOW);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        {/* Language toggle buttons - now using the setLanguage prop */}
        <div className="flex justify-end mb-8 gap-2 items-center">
          <button
            onClick={() => setLanguage('hi')}
            className={`font-semibold px-4 py-1 rounded-full border-2 border-white transition-all transform hover:scale-105 shadow-md ${
              language === 'hi'
                ? 'bg-white text-blue-800'
                : 'bg-transparent text-white'
            }`}
          >
            HI
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`font-semibold px-4 py-1 rounded-full border-2 border-white transition-all transform hover:scale-105 shadow-md ${
              language === 'en'
                ? 'bg-white text-blue-800'
                : 'bg-transparent text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Title and description */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white leading-tight tracking-tight">
            {t('sectionTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto leading-relaxed opacity-90">
            {t('sectionDescription')}
          </p>
        </header>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <input
            type="search"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 text-lg rounded-full border-2 border-white w-full max-w-xs transition-shadow focus:outline-none focus:ring-4 focus:ring-white shadow-lg bg-gray-50 text-gray-800"
            aria-label={t('searchPlaceholder')}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 text-lg rounded-full border-2 border-white w-full max-w-[150px] cursor-pointer transition-shadow focus:outline-none focus:ring-4 focus:ring-white shadow-lg bg-gray-50 text-gray-800"
            aria-label="Filter by status"
          >
            <option value="All">{t('filterAll')}</option>
            <option value="Active">{t('filterActive')}</option>
            <option value="Upcoming">{t('filterUpcoming')}</option>
            <option value="Live">{t('filterLive')}</option>
          </select>
        </div>

        {/* Programs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPrograms.length === 0 ? (
            <p className="col-span-full text-center text-xl text-white opacity-80">
              {t('noProgramsFound')}
            </p>
          ) : (
            displayedPrograms.map((program) => {
              const statusColorClass = statusColors[program.status] || statusColors.Default;
              const link = getProgramLink(program.title, program.detailsLink);
              const translated = getTranslatedProgram(program);

              return (
                <article
                  key={program.id}
                  tabIndex={0}
                  className="rounded-3xl shadow-xl p-6 flex flex-col transition-all transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer ring-4 ring-transparent hover:ring-fuchsia-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-500 relative overflow-hidden text-white min-h-[350px] bg-transparent"
                  aria-label={`${translated.title} - ${t('statusLabels')[program.status]}`}
                  onClick={() => window.open(link, '_blank', 'noopener')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      window.open(link, '_blank', 'noopener');
                    }
                  }}
                >
                  {/* Background image and overlay container */}
                  <div 
                      className="absolute inset-0 z-0 rounded-3xl"
                      style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${program.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                      }}
                  ></div>

                  {/* Content container with higher z-index */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start mb-5">
                      <span className="text-4xl mr-4 flex-shrink-0 animate-bounce-once">
                        {program.icon}
                      </span>
                      <div className="flex-grow">
                        <h2 className="text-2xl font-bold mb-1 leading-tight">
                          {translated.title}
                        </h2>
                        <span className={`px-4 py-1.5 rounded-full font-bold text-sm text-white ${statusColorClass} shadow-md`}>
                          {t('statusLabels')[program.status] || t('statusLabels').Default}
                        </span>
                      </div>
                    </div>
                    <p className="text-base flex-grow mb-4 min-h-[60px]">
                      {translated.description}
                    </p>
                    <div className="mb-4">
                      <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                      <small className="font-bold text-indigo-200 text-xs mt-1 block">
                        {t('participants')}: {program.participants.toLocaleString()}
                      </small>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener"
                      className="mt-auto inline-block text-center bg-teal-600 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 hover:bg-teal-700 shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-300 text-base"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('viewDetails')}
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
        {(showViewMore || showViewLess) && (
          <div className="flex justify-center mt-12">
            {showViewMore && (
              <button
                onClick={handleViewMore}
                className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full text-base shadow-xl transition-all transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                {t('viewMore')}
              </button>
            )}
            {showViewLess && (
              <button
                onClick={handleViewLess}
                className="bg-gray-700 text-white font-bold py-2 px-6 rounded-full text-base shadow-xl transition-all transform hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500 ml-4"
              >
                {t('viewLess')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App component that handles the global language state
const App = () => {
  const [language, setLanguage] = useState('hi');

  return <BenefitsPrograms language={language} setLanguage={setLanguage} />;
};

export default App;