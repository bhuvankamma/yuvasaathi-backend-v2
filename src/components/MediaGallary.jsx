import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming this is used elsewhere
import CM from '../assets/CM.jpg';
import vg from '../assets/vg.jpg';
import st from '../assets/st.jpg';
import docs from '../assets/docs.jpg';
import ac from '../assets/ac.png';
import mini from '../assets/mini.webp';



const mediaItems = {
  visuals: [
    { src: CM, alt: 'Bihar CM Nitish Kumar in a cabinet meeting', title: 'Honorable CM Nitish Kumar at a Cabinet Meeting' },
    { src: '', alt: 'Bihar Deputy CM Samrat Chaudhary', title: 'Deputy CM Samrat Chaudhary' },
    { src: '', alt: 'Bihar ministers at the Vidhan Sabha building', title: 'Ministers at the Bihar Vidhan Sabha' },
    { src: mini, alt: 'Exterior of the Bihar Vidhan Sabha building', title: 'Bihar Vidhan Sabha Building' },
    { src: 'https://media.gettyimages.com/id/2217136417/photo/bikramganj-india-prime-minister-narendra-modi-bihar-governor-arif-mohammed-khan-chief.jpg?s=612x612&w=0&k=20&c=jK6_DulljaVGqllM-gtLYpmckvNrH7K4B1vtEtefHLo=', alt: 'Ministers and officials at a public event', title: 'Public Event with Ministers and Officials' },
  ],
  movingImages: [
    {
      src: 'https://youtu.be/WkB-j3F6gfw?si=VTSpV4H5ivhZZ9N9',
      alt: 'Video of a new government scheme launch',
      title: 'Launch of New Government Scheme',
    },
    {
      src: 'https://www.youtube.com/embed/tgbNymZ7vqY',
      alt: "Chief Minister addressing the public",
      title: "CM's Public Address",
    },
    {
      src: 'https://www.youtube.com/embed/g2qJ53r2K7c',
      alt: 'Drone footage of new infrastructure projects',
      title: 'Progress on Infrastructure Projects',
    },
    {
      src: 'https://www.youtube.com/embed/M7lc1UVf-VE',
      alt: 'Inauguration of new bridges',
      title: 'Inauguration of New Bridges',
    },
    {
      src: 'https://www.youtube.com/embed/u1QeKx5u2eE',
      alt: 'Farmers fair in rural Bihar',
      title: 'Farmers Fair in Rural Bihar',
    },
    {
      src: 'https://www.youtube.com/embed/Bw9O1w2M7f8',
      alt: 'Public awareness campaign on health',
      title: 'Public Health Awareness Campaign',
    },
    {
      src: 'https://www.youtube.com/embed/WJ_v6B0p-80',
      alt: 'Education initiatives for students',
      title: 'New Education Initiatives',
    },
    {
      src: 'https://www.youtube.com/embed/oG5s7y-Tj2U',
      alt: 'Tourism promotion in Bihar',
      title: 'Promoting Tourism in Bihar',
    },
  ],
  cmImages: [
    { src: 'https://placehold.co/1200x600/16a34a/ffffff?text=CM+at+a+meeting', alt: 'CM Nitish Kumar in a meeting with officials' },
    { src: 'https://placehold.co/1200x600/d97706/ffffff?text=CM+delivering+a+speech', alt: 'CM delivering a speech at a public event' },
    { src: 'https://placehold.co/1200x600/1e40af/ffffff?text=CM+visiting+a+project', alt: 'CM Nitish Kumar visiting an infrastructure project' },
  ],
};

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
    <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
    <polygon points="12 11 12 13 14 12" />
    <polygon points="23 7 16 12 23 17 23 7" />
  </svg>
);

const PublicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20h-14.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const FeedbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CMActivitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110">
    <circle cx="12" cy="7" r="4" />
    <path d="M12 15a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z" />
  </svg>
);

const cardData = [
  {
    title: 'Visuals',
    icon: <PhotoIcon />,
    view: 'visuals',
    bgImage: mini,
  },
  {
    title: 'Video Gallery',
    icon: <VideoIcon />,
    view: 'movingImages',
    bgImage: vg,
  },
  {
    title: 'Documents & Reports',
    icon: <PublicationsIcon />,
    view: 'documents',
    bgImage: docs,
  },
  {
    title: 'Share Your Thoughts',
    icon: <FeedbackIcon />,
    view: 'feedback',
    bgImage: st,
  },
  {
    title: 'CM Activities',
    icon: <CMActivitiesIcon />,
    view: 'cmActivities',
    bgImage: ac,
  },
];

const SectionCard = ({ title, icon, onClick, bgImage }) => (
  <div
    onClick={onClick}
    className="group relative flex flex-col items-center justify-center p-6 sm:p-8 text-center text-white cursor-pointer rounded-2xl shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl bg-cover bg-center overflow-hidden"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300 rounded-2xl"></div>
    <div className="relative z-10 flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl sm:text-2xl font-bold mb-6 text-shadow-lg">{title}</h3>
      <button
        className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-300 transform hover:scale-105 text-base"
      >
        View More
      </button>
    </div>
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-4 left-4 flex items-center bg-gray-800 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-700 transition-colors duration-300 z-50 text-base"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H14a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
    </svg>
    Back
  </button>
);

const PhotoGallery = ({ onBack }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} p-4 sm:p-8 rounded-b-lg w-full relative bg-gradient-to-br from-purple-100 to-indigo-200`}>
      <BackButton onClick={onBack} />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Visuals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.visuals.map((item, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg animate-fadeIn hover:shadow-xl transition-shadow duration-300 bg-white" style={{ animationDelay: `${index * 50}ms` }}>
            <img src={item.src} alt={item.alt} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VideoGallery = ({ onBack }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} p-4 sm:p-8 rounded-b-lg w-full relative bg-gradient-to-br from-pink-100 to-rose-200`}>
      <BackButton onClick={onBack} />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Video Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {mediaItems.movingImages.map((item, index) => (
          <div key={index} className="flex-none overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={item.src}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-cover rounded-t-lg"
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Publications = ({ onBack }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} p-4 sm:p-8 rounded-b-lg w-full relative bg-gradient-to-br from-blue-100 to-cyan-200`}>
      <BackButton onClick={onBack} />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Documents & Reports</h2>
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Bihar Budget 2024-25</h3>
          <p className="text-gray-600">A detailed report on the state budget, outlining key allocations and fiscal policies for the year.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '50ms' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-1">State of Education Report</h3>
          <p className="text-gray-600">An annual publication on the progress and challenges in the education sector across Bihar.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Agricultural Policy Brief</h3>
          <p className="text-gray-600">A concise document summarizing the government's initiatives to support farmers and boost agricultural productivity.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '150ms' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Economic Survey 2024</h3>
          <p className="text-gray-600">A comprehensive survey of Bihar's economic performance, key sectors, and growth drivers.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Infrastructure Development Plan</h3>
          <p className="text-gray-600">Details on upcoming and ongoing projects for roads, bridges, and other public infrastructure.</p>
        </div>
      </div>
    </div>
  );
};

const Feedback = ({ onBack }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} p-4 sm:p-8 rounded-b-lg w-full relative bg-gradient-to-br from-teal-100 to-green-200`}>
      <BackButton onClick={onBack} />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Share Your Thoughts</h2>
      <p className="text-center text-gray-600 mb-6">Your feedback helps us improve our services. Please fill out the form below.</p>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-600">Name</label>
          <input type="text" id="name" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-800 placeholder-gray-400" placeholder="Your Name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-600">Email</label>
          <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-800 placeholder-gray-400" placeholder="Your Email" />
        </div>
        <div>
          <label htmlFor="feedback" className="block text-gray-600">Your Feedback</label>
          <textarea id="feedback" rows="4" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-800 placeholder-gray-400" placeholder="Share your thoughts..."></textarea>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 shadow-md">
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

const CMActivities = ({ onBack }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const activities = [
    {
      title: "Addressing the State Assembly on Key Legislative Reforms",
      date: "September 2, 2025",
      description: "Honorable Chief Minister presented a series of landmark bills aimed at improving public services and governance. The session highlighted his commitment to transparency and efficiency.",
    },
    {
      title: "Launch of 'Digital Bihar' Initiative",
      date: "August 28, 2025",
      description: "A new scheme was unveiled to bridge the digital divide in rural areas. The initiative includes plans to establish community centers and provide digital literacy training to thousands of citizens.",
    },
    {
      title: "Meeting with a Delegation of International Investors",
      date: "August 20, 2025",
      description: "The Chief Minister hosted a high-level meeting to showcase Bihar's investment potential. Discussions focused on attracting foreign capital to sectors like manufacturing, renewable energy, and technology.",
    },
    {
      title: "Inauguration of the Patna Metro's First Phase",
      date: "August 15, 2025",
      description: "In a major step towards modernizing urban transport, the Chief Minister inaugurated the first operational stretch of the Patna Metro. This project is expected to significantly ease traffic congestion.",
    },
    {
      title: "Review Meeting on Flood Preparedness",
      date: "August 10, 2025",
      description: "With monsoon season approaching, the CM chaired a meeting with district officials to assess preparedness for potential flooding. He emphasized proactive measures and swift response mechanisms.",
    },
  ];

  return (
    <div className={`transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} p-4 sm:p-8 rounded-b-lg w-full relative bg-gradient-to-br from-yellow-100 to-orange-200`}>
      <BackButton onClick={onBack} />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">CM Activities</h2>
      <div
        className="mb-8 relative rounded-lg shadow-lg aspect-w-16 aspect-h-9"
        style={{
          backgroundImage: `url(${mediaItems.cmImages[0].src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
      </div>
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-fadeIn hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 50}ms` }}>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{activity.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{activity.date}</p>
            <p className="text-gray-600">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans p-4 bg-gray-200">
      <div className="w-full max-w-6xl rounded-lg shadow-xl overflow-hidden my-8 mx-auto relative">
        <div className="p-6 md:p-8 text-white text-center rounded-t-lg shadow-lg" style={{ background: 'linear-gradient(90deg, #FF9933, #ffffff, #138808)' }}>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-black">
            Bihar Government Information Hub
          </h1>
        </div>

        <div className="p-4 md:p-8 relative">
          {currentView === 'home' ? (
            <div className="w-full bg-gradient-to-br from-orange-400 via-white to-green-500 rounded-b-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center w-full">
                {cardData.map((card, index) => (
                  <SectionCard
                    key={index}
                    title={card.title}
                    icon={card.icon}
                    bgImage={card.bgImage}
                    onClick={() => setCurrentView(card.view)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {currentView === 'visuals' && <PhotoGallery onBack={() => setCurrentView('home')} />}
              {currentView === 'movingImages' && <VideoGallery onBack={() => setCurrentView('home')} />}
              {currentView === 'documents' && <Publications onBack={() => setCurrentView('home')} />}
              {currentView === 'feedback' && <Feedback onBack={() => setCurrentView('home')} />}
              {currentView === 'cmActivities' && <CMActivities onBack={() => setCurrentView('home')} />}
            </>
          )}
        </div>

        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
            }
            @keyframes scroll-left {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-100%);
              }
            }
            .animate-scroll-left {
              animation: scroll-left 25s linear infinite;
              will-change: transform;
            }
            .aspect-w-16 {
              --tw-aspect-w: 16;
            }
            .aspect-h-9 {
              --tw-aspect-h: 9;
            }
            .aspect-w-16,
            .aspect-h-9 {
              position: relative;
              padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
            }
            .aspect-w-16 > *,
            .aspect-h-9 > * {
              position: absolute;
              height: 100%;
              width: 100%;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default App;