import React, { useState, useEffect } from 'react';
const imageURLs = [
  "https://cdn.pixabay.com/photo/2022/09/29/07/01/brain-7486705_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/07/18/16/07/training-396524_1280.jpg",
  "https://cdn.pixabay.com/photo/2022/09/29/07/00/brain-7486704_1280.jpg",
  "https://cdn.pixabay.com/photo/2021/10/06/05/15/training-6684420_1280.jpg",
  "https://cdn.pixabay.com/photo/2022/09/29/07/01/brain-7486705_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/07/18/16/07/training-396524_1280.jpg",
];

const allSchemes = [
  {
    title: 'Mukhyamantri Mahila Rojgar Yojana',
    shortTitle: 'Mahila Rojgar Yojana',
    description: 'Provides financial support for women’s self-employment, a key initiative from 2025.',
    details: 'The Mukhyamantri Mahila Rojgar Yojana is a landmark scheme designed to empower women across Bihar by fostering a spirit of entrepreneurship. It offers substantial financial assistance, providing grants and low-interest loans ranging from ₹10,000 to ₹2 lakh. This capital is intended to help women from rural and urban areas establish small businesses and micro-enterprises. The government provides extensive support, including business planning assistance and training programs, focusing on sectors like food processing, handicrafts, and small-scale manufacturing. The scheme is a cornerstone of the state’s strategy to improve the female labor force participation rate and create a more inclusive economy.',
    category: '2025',
    color: '#81b29a'
  },
  {
    title: 'Bihar Industrial Investment Promotion Package (BIPPP-2025)',
    shortTitle: 'Industrial Promotion Package',
    description: 'A new package to promote industrial investment in Bihar, announced in 2025.',
    details: 'The Bihar Industrial Investment Promotion Package, or BIPPP-2025, is a comprehensive set of incentives aimed at attracting both domestic and foreign investment. The package offers attractive subsidies on capital, interest subvention, and significant tax exemptions for a specified period. These measures are designed to reduce the initial financial burden on investors and create a highly favorable business climate. The government has prioritized sectors like food processing, textiles, IT, and renewable energy, providing tailored support to accelerate growth in these areas. This initiative is expected to generate thousands of new jobs and establish Bihar as a competitive industrial hub in the region.',
    category: '2025',
    color: '#3d405b'
  },
  {
    title: 'New Medical Colleges & Hospitals',
    shortTitle: 'Medical Colleges',
    description: 'Establishes new medical colleges and hospitals in 7 districts.',
    details: 'This ambitious initiative is a major step toward enhancing Bihar’s healthcare and medical education infrastructure. The plan includes establishing seven new medical colleges and hospitals in different districts to address the shortage of medical professionals and provide advanced healthcare services to a broader population. The new institutions will significantly increase the number of medical seats for students, providing more opportunities for aspiring doctors. By decentralizing medical facilities, the government aims to improve health outcomes and ensure that quality healthcare is accessible to citizens in even the most remote areas.',
    category: '2025',
    color: '#f2cc8f'
  },
  {
    title: 'Farm Machinery Banks Expansion',
    shortTitle: 'Farm Machinery Banks',
    description: 'Expansion of Farm Machinery Banks with 38 new FMBs.',
    details: 'To boost agricultural productivity and empower small-scale farmers, the Bihar government is expanding its network of Farm Machinery Banks (FMBs). The initiative involves the establishment of 38 new FMBs, providing farmers with easy access to expensive, modern farm machinery on a rental basis. This allows farmers who cannot afford to purchase equipment like tractors, harvesters, and cultivators to benefit from mechanization. The scheme is crucial for improving efficiency, reducing labor costs, and increasing crop yields, thereby contributing to the overall growth of the agricultural sector.',
    category: '2025',
    color: '#f4f1de'
  },
  {
    title: 'Jeevika SHG Enhancements & Jeevika Nidhi support',
    shortTitle: 'Jeevika Enhancements',
    description: 'Enhancements and support for Jeevika Self-Help Groups.',
    details: 'The Jeevika project has been a monumental success in poverty alleviation and women’s empowerment. The latest enhancements and Jeevika Nidhi support aim to further strengthen the foundation of the Self-Help Groups (SHGs). This includes an increase in financial resources, advanced skill-building workshops, and stronger market linkages. The additional support will enable SHGs to expand their businesses, explore new market opportunities, and achieve greater financial independence. This initiative underscores the government’s commitment to sustainable rural development and social upliftment.',
    category: '2025',
    color: '#e07a5f'
  },
  {
    title: 'Risk Allowance for Anti-Terrorism Police',
    shortTitle: 'Risk Allowance for Police',
    description: 'Provides a special risk allowance for anti-terrorism police.',
    details: 'In recognition of the courageous and high-risk duties performed by its police force, the Bihar government has introduced a special risk allowance for personnel in the anti-terrorism squad. This allowance is a testament to the government\'s commitment to the welfare of its police officers and aims to boost morale and acknowledge the inherent dangers of their work. The financial incentive is provided in addition to their regular salary and serves as a vital component of the state’s strategy to maintain law and order and enhance national security.',
    category: '2025',
    color: '#e63946'
  },
  {
    title: 'Prohibition & Narcotics Bureau posts creation',
    shortTitle: 'Prohibition Bureau Posts',
    description: 'Creation of new posts for the Prohibition & Narcotics Bureau.',
    details: 'To strengthen the enforcement of prohibition laws and effectively combat drug trafficking, the Bihar government has approved the creation of new posts within the Prohibition & Narcotics Bureau. This expansion will significantly boost the bureau\'s capacity, allowing for more robust surveillance, targeted raids, and thorough investigations. By increasing manpower and resources, the government aims to ensure stricter compliance with the liquor ban and curtail the illegal narcotics trade, thereby improving public health and safety across the state.',
    category: '2025',
    color: '#457b9d'
  },
  {
    title: 'Reduced fees for birth/death certificates',
    shortTitle: 'Reduced Certificate Fees',
    description: 'Reduces fees for obtaining birth and death certificates.',
    details: 'In an effort to make essential government services more accessible to all citizens, the Bihar government has reduced the fees for obtaining birth and death certificates. This move is particularly beneficial for the rural population and low-income families, removing a significant financial barrier to legal documentation. The initiative is part of a broader administrative reform agenda to streamline public services and encourage timely registration of vital events, ensuring that citizens have the necessary documents for various government schemes and benefits.',
    category: '2025',
    color: '#a8dadc'
  },
  {
    title: 'Jeevika (Bihar Rural Livelihoods Project)',
    shortTitle: 'Jeevika Livelihoods Project',
    description: 'An ongoing flagship program for rural livelihoods and Self-Help Groups.',
    details: 'Jeevika is a World Bank-supported project that has revolutionized rural development in Bihar. It works by mobilizing rural women into Self-Help Groups (SHGs) and providing them with training, financial literacy, and access to credit. The program enables members to take up various income-generating activities, ranging from livestock farming to handicrafts. Jeevika has empowered millions of women, allowing them to build savings, access bank loans, and become financially independent, thereby creating a ripple effect of positive social change in their communities.',
    category: 'Ongoing',
    color: '#2a9d8f'
  },
  {
    title: 'Mukhyamantri Cycle Yojana',
    shortTitle: 'Cycle Yojana',
    description: 'Provides free bicycles to students to encourage school attendance.',
    details: 'This highly successful scheme was launched to address the issue of high school dropout rates, especially among girls from economically disadvantaged backgrounds. By providing a one-time grant to students for the purchase of a bicycle, the government has made it easier for them to travel to and from school. The scheme has led to a significant increase in school enrollment and attendance, particularly in rural areas, and has become a symbol of educational empowerment in the state.',
    category: 'Ongoing',
    color: '#e9c46a'
  },
  {
    title: 'Mukhyamantri Poshak Yojana',
    shortTitle: 'Poshak Yojana',
    description: 'Offers financial support for school uniforms to students.',
    details: 'The Mukhyatri Poshak Yojana is a crucial scheme that provides financial assistance to students for purchasing school uniforms. By ensuring that all children, regardless of their family’s economic status, have access to proper school attire, the scheme promotes an inclusive and equitable learning environment. It helps reduce the financial burden on parents and fosters a sense of equality among students, contributing to a more positive and focused educational atmosphere.',
    category: 'Ongoing',
    color: '#f4a261'
  },
  {
    title: 'Scholarship & Kanya Utthan Yojana',
    shortTitle: 'Kanya Utthan Yojana',
    description: 'Comprehensive education support and empowerment for girls.',
    details: 'The Scholarship and Kanya Utthan Yojana is a multi-faceted scheme designed to promote the welfare of girls and women from birth to graduation. It provides financial assistance at various stages of a girl\'s life, including grants for schooling, uniforms, and scholarships for higher education. The scheme is a powerful tool for promoting female education, discouraging child marriage, and ensuring that women have the resources to become self-reliant and contributing members of society.',
    category: 'Ongoing',
    color: '#e76f51'
  },
  {
    title: 'Krishi Input Subsidy Schemes',
    shortTitle: 'Krishi Subsidy Schemes',
    description: 'Offers various subsidies and support to farmers for agricultural inputs.',
    details: 'The Krishi Input Subsidy Schemes are designed to support the agricultural community in Bihar by reducing the cost of cultivation. The government provides subsidies on essential agricultural inputs such as certified seeds, fertilizers, and modern farm equipment. This financial support encourages farmers to adopt advanced farming practices, which in turn leads to increased productivity and profitability. The scheme plays a vital role in ensuring food security and sustaining the livelihoods of millions of farmers in the state.',
    category: 'Ongoing',
    color: '#264653'
  },
  {
    title: 'Pension Yojanas',
    shortTitle: 'Pension Schemes',
    description: 'A range of pension schemes for old age, widow, and disability pensions.',
    details: 'The government of Bihar provides a range of pension schemes to create a strong social safety net for its vulnerable citizens. These schemes, including the Old Age Pension, Widow Pension, and Disability Pension, provide a regular monthly income to beneficiaries, ensuring their financial security and dignity. The pensions help these individuals meet their basic needs and live a life with greater peace of mind, demonstrating the government’s commitment to social welfare and support for those in need.',
    category: 'Ongoing',
    color: '#2a9d8f'
  },
  {
    title: 'Student Credit Card Yojana',
    shortTitle: 'Credit Card Yojana',
    description: 'An education loan scheme to help students pursue higher education.',
    details: 'The Student Credit Card Yojana is an innovative scheme that provides an education loan of up to ₹4 lakh to students who wish to pursue higher education but are constrained by financial limitations. The loan is offered without any collateral or guarantee, making it accessible to students from all economic backgrounds. The repayment process begins only after the student completes their education and secures a job, which significantly reduces the financial pressure on students and their families.',
    category: 'Ongoing',
    color: '#3d405b'
  },
  {
    title: 'Kushal Yuva Program',
    shortTitle: 'Kushal Yuva Program',
    description: 'Skill training program for the youth of Bihar.',
    details: 'The Kushal Yuva Program (KYP) is a crucial skill-building initiative that aims to enhance the employability of the youth in Bihar. The program provides comprehensive training in three key areas: soft skills, language proficiency (both Hindi and English), and computer literacy. By equipping young people with these essential skills, the government is preparing them for the demands of the modern job market, increasing their chances of securing meaningful employment and contributing to the state\'s economic growth.',
    category: 'Ongoing',
    color: '#f2cc8f'
  },
  {
    title: 'Har Ghar Nal Ka Jal',
    shortTitle: 'Nal Ka Jal Scheme',
    description: 'A flagship scheme to provide tap water connection to every household.',
    details: 'The Har Ghar Nal Ka Jal scheme is a monumental effort to ensure that every household in Bihar has access to safe and clean drinking water through a piped supply. The government has undertaken extensive infrastructure projects, including laying pipelines and constructing water treatment plants, to achieve this goal. The scheme has not only significantly improved public health and sanitation but has also reduced the daily burden on women and girls who previously had to travel long distances to fetch water.',
    category: 'Ongoing',
    color: '#e07a5f'
  },
  {
    title: '7 Nischay Yojana',
    shortTitle: '7 Nischay Yojana',
    description: 'A comprehensive plan with 7 resolves for youth, women, and infrastructure.',
    details: 'The "7 Nischay" or "Seven Resolves" form the core of the Bihar government\'s development agenda. This visionary plan outlines seven key governance commitments, including initiatives for universal electricity, piped water to every home, improved road connectivity, construction of toilets, skill development for youth, economic empowerment of women, and access to higher education. These resolves serve as a blueprint for the state\'s inclusive and sustainable growth, addressing critical areas of development and social welfare.',
    category: 'Ongoing',
    color: '#a8dadc'
  },
];

const SchemesPerPage = 6;

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  const totalPages = Math.ceil(allSchemes.length / SchemesPerPage);
  const startIndex = (currentPage - 1) * SchemesPerPage;
  const endIndex = startIndex + SchemesPerPage;
  const currentSchemes = allSchemes.slice(startIndex, endIndex);

  const checkScrollTop = () => {
    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (selectedScheme) {
      window.addEventListener('scroll', checkScrollTop);
    }
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [selectedScheme, showScroll]);

  const renderSchemeCard = (scheme) => (
    <div
      key={scheme.title}
      onClick={() => setSelectedScheme(scheme)}
      className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer
                 w-full max-w-sm p-6 bg-white rounded-xl shadow-lg flex flex-col justify-between"
      style={{ border: `1px solid ${scheme.color}` }}
    >
      <div className="mb-4">
        <span
          className="inline-block p-2 rounded-full text-white"
          style={{ backgroundColor: scheme.color }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-file-text"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </span>
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          {scheme.shortTitle}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {scheme.description}
        </p>
      </div>
    </div>
  );

  const renderPaginationButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            setCurrentPage(i);
            setSelectedScheme(null);
          }}
          className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300
                      ${i === currentPage ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const renderMainView = () => (
    <div className="font-sans min-h-screen relative overflow-hidden">
      {/* Background with carousel animation */}
      <style>
        {`
          @keyframes slide {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-carousel {
            animation: slide 30s linear infinite;
          }
        `}
      </style>
      <div className="absolute inset-0 z-0 bg-gray-900 bg-opacity-70">
        <div className="flex w-full animate-carousel" style={{ minWidth: '200%' }}>
          {[...imageURLs, ...imageURLs].map((url, index) => (
            <img
              key={index}
              src={url}
              alt="Bihar landscape and culture"
              className="w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0 object-cover"
              style={{ height: '100vh', width: '20%' }}
            />
          ))}
        </div>
      </div>

      {/* Main content with z-index to stay on top */}
      <div className="relative z-10 p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSchemes.map(renderSchemeCard)}
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );

  const renderDetailedView = () => {
    const backBtnColor = selectedScheme.color || '#3d405b';
    return (
      <div className="font-sans min-h-screen p-6 bg-gray-100 flex flex-col items-center">
        <div className="relative w-full max-w-6xl transition-all duration-500 mb-8">
          <button
            onClick={() => setSelectedScheme(null)}
            className="px-4 py-2 flex items-center space-x-2 bg-white text-gray-800 rounded-lg font-semibold shadow-md hover:shadow-lg transform transition-transform duration-200 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Back to Schemes</span>
          </button>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto p-8 md:p-12 bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12">
          <div className="md:w-1/2">
            <span
              className="inline-block p-4 rounded-full mb-4"
              style={{ backgroundColor: backBtnColor }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-file-text"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
            <h1 className="text-4xl font-extrabold mb-4" style={{ color: backBtnColor }}>
              {selectedScheme.title}
            </h1>
            <p className="text-xl font-medium text-gray-600">
              {selectedScheme.description}
            </p>
          </div>

          <div className="md:w-1/2 flex items-center justify-center">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Scheme Details</h2>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedScheme.details}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {renderPaginationButtons()}
        </div>

        <div
          className={`fixed bottom-6 right-6 p-3 bg-gray-800 text-white rounded-full shadow-lg cursor-pointer transition-opacity duration-300
                      ${showScroll ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={scrollToTop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedScheme ? renderDetailedView() : renderMainView()}
    </div>
  );
};

export default App;
