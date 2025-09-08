import React, { useState, useEffect, useRef } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
} from 'chart.js';
import MapComponent from './MapComponent';
import Modal from './Modal';

// Register Chart.js components for use
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle
);

// Translation data for Hindi and English
const translations = {
    en: {
        title: "Bihar's Skill & Opportunity Compass",
        subtitle: "Explore key metrics for skill development across the state of Bihar. Click on a district on the map to see real-time data insights.",
        overview: "Overview",
        highLevelProgress: "High-level Progress",
        mandalWiseBreakdown: "Mandal-wise Breakdown",
        kpis: "Key Performance Indicators",
        detailedStats: "Detailed Statistics",
        totalTrainees: "Total Trainees",
        totalPlacements: "Total Placements",
        avgScore: "Avg. Test Score",
        itJobs: "IT Jobs",
        nonIt: "Non-IT Jobs",
        test: "Test Results",
        skillTraining: "Skill Training",
        jobPlacement: "Job Placement",
        assessments: "Assessments",
        initiativeTitle: "Bihar Government's '7 Nishchay' Program",
        initiativeDesc: "A comprehensive program to transform Bihar's youth into a skilled workforce. This initiative, part of the 'Sushasan' agenda, aims to create a self-reliant and prosperous state.",
        initiativeFact1: "Kushal Yuva Program",
        initiativeFact2: "BSDM & Govt Initiatives",
        initiativeFact3: "Industry Skill Councils",
        initiativeFact4: "Employment Exchange Services",
        slidingCard1Title: "Kushal Yuva Program (KYP)",
        slidingCard1Desc: "A flagship program providing essential IT, soft skills, and communication training to the youth of Bihar.",
        slidingCard2Title: "Bihar Skill Development Mission (BSDM)",
        slidingCard2Desc: "The core government body driving skill development, creating a skilled workforce for a modern Bihar.",
        slidingCard3Title: "Sector Skill Councils (SSCs)",
        slidingCard3Desc: "Partnering with industry to bridge the skill gap and ensure training meets market demands for jobs.",
        slidingCard4Title: "Industrial Training Institutes (ITIs)",
        slidingCard4Desc: "Providing vocational training in technical trades to prepare youth for industry-specific roles.",
        slidingCard5Title: "Yuva Shakti Bihar",
        slidingCard5Desc: "A core part of the '7 Nishchay' initiative focused on empowering youth with skills and opportunities for growth.",
        learnMore: "Learn More",
        close: "Close",
    },
    hi: {
        title: "बिहार का कौशल और अवसर कंपास",
        subtitle: "बिहार राज्य में कौशल विकास के लिए प्रमुख मेट्रिक्स का अन्वेषण करें। वास्तविक समय डेटा अंतर्दृष्टि देखने के लिए मानचित्र पर एक जिले पर क्लिक करें।",
        overview: "अवलोकन",
        highLevelProgress: "उच्च-स्तरीय प्रगति",
        mandalWiseBreakdown: "मंडल-वार विवरण",
        kpis: "मुख्य प्रदर्शन संकेतक",
        detailedStats: "विस्तृत आँकड़े",
        totalTrainees: "कुल प्रशिक्षु",
        totalPlacements: "कुल प्लेसमेंट",
        avgScore: "औसत परीक्षा स्कोर",
        itJobs: "आईटी नौकरियां",
        nonIt: "गैर-आईटी नौकरियां",
        test: "परीक्षा परिणाम",
        skillTraining: "कौशल प्रशिक्षण",
        jobPlacement: "नौकरी प्लेसमेंट",
        assessments: "मूल्यांकन",
        initiativeTitle: "बिहार सरकार की '7 निश्चय' योजना",
        initiativeDesc: "बिहार के युवाओं को कुशल कार्यबल में बदलने के लिए एक व्यापक कार्यक्रम। 'सुशासन' एजेंडा का हिस्सा, इस पहल का उद्देश्य एक आत्मनिर्भर और समृद्ध राज्य का निर्माण करना है।",
        initiativeFact1: "कुशल युवा कार्यक्रम",
        initiativeFact2: "बीएसडीएम और सरकारी पहल",
        initiativeFact3: "उद्योग कौशल परिषद",
        initiativeFact4: "रोजगार विनिमय सेवाएँ",
        slidingCard1Title: "कुशल युवा कार्यक्रम (KYP)",
        slidingCard1Desc: "बिहार के युवाओं को आवश्यक आईटी, सॉफ्ट स्किल्स और संचार प्रशिक्षण प्रदान करने वाला एक प्रमुख कार्यक्रम।",
        slidingCard2Title: "बिहार कौशल विकास मिशन (BSDM)",
        slidingCard2Desc: "कौशल विकास को बढ़ावा देने वाला एक प्रमुख सरकारी निकाय, जो आधुनिक बिहार के लिए कुशल कार्यबल का निर्माण कर रहा है।",
        slidingCard3Title: "सेक्टर स्किल काउंसिल (SSC)",
        slidingCard3Desc: "कौशल अंतर को पाटने के लिए उद्योग के साथ साझेदारी करना और यह सुनिश्चित करना कि प्रशिक्षण बाजार की मांगों को पूरा करे।",
        slidingCard4Title: "औद्योगिक प्रशिक्षण संस्थान (ITI)",
        slidingCard4Desc: "युवाओं को उद्योग-विशिष्ट भूमिकाओं के लिए तैयार करने के लिए तकनीकी व्यवसायों में व्यावसायिक प्रशिक्षण प्रदान करना।",
        slidingCard5Title: "युवा शक्ति बिहार",
        slidingCard5Desc: "यह '7 निश्चय' पहल का एक प्रमुख हिस्सा है जो युवाओं को विकास के लिए कौशल और अवसर प्रदान करने पर केंद्रित है।",
        learnMore: "और जानें",
        close: "बंद करें",
    },
};

// New Sliding Cards Component with continuous scrolling
// animation
const SlidingCards = ({ content, language, onCardClick }) => {
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let animationFrameId;

        const scroll = () => {
            const scrollSpeed = 0.5;
            slider.scrollLeft += scrollSpeed;
            if (slider.scrollLeft >= slider.scrollWidth / 2) {
                slider.scrollLeft = 0;
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        slider.addEventListener('mouseenter', () => cancelAnimationFrame(animationFrameId));
        slider.addEventListener('mouseleave', () => requestAnimationFrame(scroll));

        requestAnimationFrame(scroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const t = translations[language];

    return (
        <div
            ref={sliderRef}
            className="md:hidden flex overflow-x-scroll no-scrollbar p-4 mt-8 snap-x"
        >
            <div className="flex-none flex items-stretch gap-6">
                {content.concat(content).map((card, i) => ( // Duplicate cards for seamless loop
                    <div
                        key={i}
                        className="flex-none w-64 snap-center shrink-0"
                    >
                        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.03] flex flex-col h-full justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-1">{t[card.titleKey]}</h4>
                                <p className="text-xs text-gray-600">{t[card.descKey]}</p>
                            </div>
                            <button
                                onClick={() => onCardClick(t[card.titleKey], t[card.descKey])}
                                className="self-end px-4 py-1 mt-3 text-xs font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                            >
                                {t.learnMore} →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component for the Detailed Data Section
const DetailedDataSection = ({ data, t, sectionRef, handleClose }) => {
    if (!data) return null;

    // Helper function to render different chart types
    const renderChart = (chartType, chartData, title) => {
        const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
        return (
            <div className="p-4 bg-gray-50/80 rounded-lg shadow-inner flex flex-col items-center">
                <h4 className="text-base font-semibold text-gray-700 mb-2">{title}</h4>
                <div className="h-40 w-40 flex justify-center items-center">
                    {chartType === 'pie' ? (
                        <Pie data={chartData} options={options} />
                    ) : (
                        <Bar data={chartData} options={options} />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            ref={sectionRef}
            className="w-full max-w-6xl mt-8 p-4 md:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 relative transition-all duration-1000"
        >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center mb-6">
                {data.name} {t.overview}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* KPIs */}
                <div className="p-4 bg-gray-50/80 rounded-lg shadow-inner flex flex-col items-center justify-center">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">{t.totalTrainees}</h4>
                    <span className="text-3xl font-bold text-indigo-600">{data.totalTrainees}</span>
                </div>
                <div className="p-4 bg-gray-50/80 rounded-lg shadow-inner flex flex-col items-center justify-center">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">{t.totalPlacements}</h4>
                    <span className="text-3xl font-bold text-green-600">{data.totalPlacements}</span>
                </div>
                <div className="p-4 bg-gray-50/80 rounded-lg shadow-inner flex flex-col items-center justify-center">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">{t.avgScore}</h4>
                    <span className="text-3xl font-bold text-rose-600">{data.avgScore}</span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderChart('pie', data.pieChart, t.skillTraining)}
                {renderChart('bar', data.barChart, t.jobPlacement)}
            </div>
        </div>
    );
};

// Main component for the interactive data map
const App = () => {
    const [language, setLanguage] = useState('en');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [detailedData, setDetailedData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        description: ''
    });
    const [hoverData, setHoverData] = useState(null);

    const detailedDataRef = useRef(null);

    const t = translations[language];

    // Dummy data for district hover charts. This
    // should be replaced with real API calls.
    const getDummyDistrictData = (name) => {
        // Add a check here to ensure 'name' is a string
        const safeName = name || ''; 

        const skills = [t.itJobs, t.nonIt, t.test];
        const values = [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 800), Math.floor(Math.random() * 500)];
        const colors = ['#3B82F6', '#EF4444', '#10B981'];

        // Pie chart data
        const pieChart = {
            labels: skills,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2,
            }]
        };

        // Bar chart data
        const barChart = {
            labels: skills,
            datasets: [{
                label: safeName,
                data: values,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2,
            }]
        };

        return {
            name: safeName,
            totalTrainees: Math.floor(Math.random() * 100000),
            totalPlacements: Math.floor(Math.random() * 50000),
            avgScore: (Math.random() * 100).toFixed(2),
            pieChart,
            barChart,
            // A simple way to alternate between chart types on hover
            // We use the first letter of the city name to decide.
            // In a real-world app, you might use a more robust
            // method like a hash or a specific API property.
            chartType: (safeName.charCodeAt(0) % 2 === 0) ? 'pie' : 'bar'
        };
    };

    // Function to handle map feature clicks and
    // scrolling
    const handleFeatureClick = (name, level) => {
        const data = getDummyDistrictData(name);
        setSelectedFeature({
            name,
            level
        });
        setDetailedData(data);

        // Scroll to the detailed data
        // section
        setTimeout(() => {
            if (detailedDataRef.current) {
                detailedDataRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    // Function to handle district hover
    const handleFeatureHover = (name, level) => {
        if (level === 'districts') {
            const chartData = getDummyDistrictData(name);
            setHoverData(chartData);
        }
    };

    // Function to handle hover end
    const handleFeatureHoverEnd = () => {
        setHoverData(null);
    };

    // Function to handle "Learn More"
    // button clicks on cards
    const handleCardClick = (title, description) => {
        setModalContent({
            title,
            description
        });
        setIsModalOpen(true);
    };

    const closeLearnMoreModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseDataSection = () => {
        setSelectedFeature(null);
        setDetailedData(null);
    };

    const slidingCardData = [{
        titleKey: "slidingCard1Title",
        descKey: "slidingCard1Desc"
    }, {
        titleKey: "slidingCard2Title",
        descKey: "slidingCard2Desc"
    }, {
        titleKey: "slidingCard3Title",
        descKey: "slidingCard3Desc"
    }, {
        titleKey: "slidingCard4Title",
        descKey: "slidingCard4Desc"
    }, {
        titleKey: "slidingCard5Title",
        descKey: "slidingCard5Desc"
    }, ];

    return (
        <div className="relative min-h-screen p-4 sm:p-8 font-sans text-gray-800 bg-gradient-to-br from-violet-100 to-pink-100 overflow-hidden flex flex-col items-center justify-start">
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          }
          .animate-pulse-slow { animation: pulse-slow 3s infinite; }
          @keyframes floating-text {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-floating { animation: floating-text 3s ease-in-out infinite; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          /* Custom styles for map hover effect */
          .MapComponent path:hover {
            fill: #60a5fa !important; /* A light blue shade that won't obscure text */
            stroke: #2563eb !important;
            stroke-width: 1.5px;
            cursor: pointer;
          }
          .MapComponent text {
            pointer-events: none; /* Prevents text from blocking hover events */
            user-select: none; /* Prevents text from being selected */
          }

          /* Increase map height for better visibility */
          .MapComponent svg {
            height: auto !important; /* Allow height to be determined by aspect ratio */
            max-height: 80vh; /* Set a maximum height for larger screens */
            width: 100%;
          }
        `}
            </style>

            {/* Language Selector */}
            <div className="language-selector absolute top-4 right-4 flex gap-2 z-30">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    English
                </button>
                <button
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${language === 'hi' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    हिंदी
                </button>
            </div>

            <div className="text-center transition-all duration-1000 mt-12 mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-2 drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-500 animate-floating">
                    {t.title}
                </h1>
                <p className="text-base sm:text-lg text-center text-gray-600 max-w-2xl transition-all duration-1000 delay-200">
                    {t.subtitle}
                </p>
            </div>

            {/* Map and Hover Chart Section */}
            <div className="w-full max-w-4xl lg:max-w-5xl p-2 md:p-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 relative transition-all duration-1000 mb-8">
                <MapComponent
                    onFeatureClick={handleFeatureClick}
                    onFeatureHover={handleFeatureHover}
                    onFeatureHoverEnd={handleFeatureHoverEnd}
                />

                {/* Responsive Hover Chart */}
                {hoverData && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 p-4 bg-white/90 rounded-xl shadow-lg border border-gray-200 pointer-events-none z-50 transition-opacity duration-300">
                        <h4 className="text-xs md:text-sm font-bold text-gray-900 text-center mb-1">{hoverData.name}</h4>
                        {/* Alternate between a pie chart and a bar chart */}
                        {hoverData.chartType === 'pie' ? (
                            <Pie data={hoverData.pieChart} options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }} />
                        ) : (
                            <Bar data={hoverData.barChart} options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }} />
                        )}
                    </div>
                )}
            </div>

            {/* Sliding Cards Section (for mobile) */}
            <SlidingCards content={slidingCardData} language={language} onCardClick={handleCardClick} />

            {/* Interactive Data Panels Section */}
            <DetailedDataSection
                data={detailedData}
                t={t}
                sectionRef={detailedDataRef}
                handleClose={handleCloseDataSection}
            />

            {/* Modal for "Learn More" */}
            <Modal
                title={modalContent.title}
                description={modalContent.description}
                isOpen={isModalOpen}
                onClose={closeLearnMoreModal}
                language={language}
            />
        </div>
    );
};

export default App;