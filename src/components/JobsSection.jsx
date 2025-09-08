import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, ChevronDown, Laptop, UserRoundPlus, LogIn, ExternalLink, X, Search, Banknote, Mic } from 'lucide-react';

// --- TRANSLATION DATA ---
const translations = {
  en: {
    title: 'Explore Your Next Opportunity',
    subtitle: 'Find the perfect job for you among a diverse range of sectors, from IT to government and beyond.',
    allCategories: 'All Categories',
    selectState: 'Select State',
    selectCity: 'Select City',
    searchPlaceholder: 'Search for jobs, companies...',
    readButton: 'Read',
    applyNowButton: 'Apply Now',
    noJobsFound: 'No jobs found for the selected criteria.',
    viewMoreButton: 'View More Jobs',
    jobDescriptionModalTitle: 'Job Description',
    howToApply: 'How would you like to apply?',
    applyWithYuvaSaathi: 'Apply with YuvaSaathi',
    applyWithOtherPortals: 'Apply with Other Portals',
    usefulJobPortals: 'Useful Job Portals',
    closeButton: 'Close',
    all: 'All',
  },
  hi: {
    title: 'अपना अगला अवसर खोजें',
    subtitle: 'आईटी से लेकर सरकारी और अन्य क्षेत्रों तक, अपने लिए सही नौकरी खोजें।',
    allCategories: 'सभी श्रेणियां',
    selectState: 'राज्य चुनें',
    selectCity: 'शहर चुनें',
    searchPlaceholder: 'नौकरियों, कंपनियों की खोज करें...',
    readButton: 'पढ़ें',
    applyNowButton: 'अभी आवेदन करें',
    noJobsFound: 'चयनित मानदंडों के लिए कोई नौकरी नहीं मिली।',
    viewMoreButton: 'और नौकरियां देखें',
    jobDescriptionModalTitle: 'नौकरी का विवरण',
    howToApply: 'आप कैसे आवेदन करना चाहेंगे?',
    applyWithYuvaSaathi: 'युवासाथी के साथ आवेदन करें',
    applyWithOtherPortals: 'अन्य पोर्टलों के साथ आवेदन करें',
    usefulJobPortals: 'उपयोगी जॉब पोर्टल',
    closeButton: 'बंद करें',
    all: 'सभी',
  }
};

const allJobs_en = [
  { id: 1, title: 'Senior Web Developer', company: 'Tech Solutions Inc.', category: 'IT', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "We are seeking a highly skilled Senior Web Developer with expertise in React and Node.js to lead our next-gen web projects.", readMore: 'This is a detailed description of the Senior Web Developer role. Responsibilities include full-stack development, mentorship of junior developers, and collaboration with cross-functional teams. Required skills: 5+ years experience, React.js, Node.js, SQL/NoSQL databases, and cloud services (AWS/Azure).', link: 'https://www.yuvsathi.com/jobs/webdev' },
  { id: 2, title: 'Data Analyst', company: 'Innovate Data', category: 'IT', location: 'Gaya', state: 'Bihar', type: 'Full-time', description: "Join our team to analyze large datasets, interpret trends, and provide actionable insights to drive business strategy.", readMore: 'This is a detailed description of the Data Analyst role. You will collect, clean, and analyze complex data sets to solve business problems. Skills required: Proficiency in Python, SQL, and data visualization tools like Tableau or Power BI. Knowledge of statistical models is a plus.', link: 'https://www.yuvsathi.com/jobs/dataanalyst' },
  { id: 3, title: 'Operations Manager', company: 'Logistics Hub', category: 'Non-IT', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Oversee daily operations and improve operational efficiency. Strong leadership and problem-solving skills are a must for this role.", readMore: 'This is a detailed description of the Operations Manager role. Key responsibilities include managing a team, optimizing workflows, and ensuring all operational processes run smoothly and efficiently. Candidates should have 3+ years of experience in a similar role.', link: 'https://www.yuvsathi.com/jobs/opsmanager' },
  { id: 4, title: 'Digital Marketing Specialist', company: 'Brand Builders', category: 'IT', location: 'Patna', state: 'Bihar', type: 'Part-time', description: "Develop and implement digital marketing campaigns. Ideal for creative individuals with experience in SEO, SEM, and social media marketing.", readMore: 'This is a detailed description of the Digital Marketing Specialist role. You will be responsible for managing all digital marketing channels, including social media, email campaigns, and website content. A portfolio of past work is highly recommended.', link: 'https://www.yuvsathi.com/jobs/digitalmarketing' },
  { id: 5, title: 'Civil Engineer', company: 'InfraWorks Ltd.', category: 'Non-IT', location: 'Gaya', state: 'Bihar', type: 'Full-time', description: "We are looking for a qualified Civil Engineer to design and oversee construction projects. Must have a Bachelor’s degree in Civil Engineering and relevant certifications.", readMore: 'This is a detailed description of the Civil Engineer role. You will work on various infrastructure projects, from concept to completion. Experience with AutoCAD and project management software is a must.', link: 'https://www.yuvsathi.com/jobs/civilengineer' },
  { id: 6, title: 'Accountant', company: 'Financial Corp.', category: 'Non-IT', location: 'Patna', state: 'Bihar', type: 'Contract', description: "Manage financial records and ensure compliance with regulations. Candidates should have a background in accounting and experience with financial software.", readMore: 'This is a detailed description of the Accountant role. You will handle accounts payable and receivable, prepare financial reports, and assist with audits. A degree in Accounting or Finance is required.', link: 'https://www.yuvsathi.com/jobs/accountant' },
  { id: 7, title: 'UX/UI Designer', company: 'DesignWorks Co.', category: 'IT', location: 'Bengaluru', state: 'Karnataka', type: 'Full-time', description: "Create engaging and user-friendly interfaces for our mobile and web applications. A strong portfolio is essential.", readMore: 'This is a detailed description of the UX/UI Designer role. You will be responsible for the full design lifecycle, from user research and wireframing to prototyping and high-fidelity mockups. Proficiency with Figma, Sketch, or Adobe XD is required.', link: 'https://www.yuvsathi.com/jobs/uxui' },
  { id: 8, title: 'Marketing Executive', company: 'Growth Innovators', category: 'Non-IT', location: 'Mumbai', state: 'Maharashtra', type: 'Full-time', description: "Develop and execute marketing strategies to increase brand awareness and drive customer acquisition.", readMore: 'This is a detailed description of the Marketing Executive role. Key responsibilities include market research, campaign planning, and performance analysis. Experience in a fast-paced environment and excellent communication skills are a plus.', link: 'https://www.yuvsathi.com/jobs/marketingexec' },
  { id: 9, title: 'Software Engineer', company: 'CodeFlow Solutions', category: 'IT', location: 'Mumbai', state: 'Maharashtra', type: 'Full-time', description: "Join our development team to build scalable and high-performance software applications using modern technologies.", readMore: 'This is a detailed description of the Software Engineer role. You will contribute to the design, development, and maintenance of our core software products. Required skills: Strong command of at least one programming language (Java, C++, Python), and experience with cloud platforms.', link: 'https://www.yuvsathi.com/jobs/software' },
  { id: 10, title: 'HR Recruiter', company: 'PeopleLink Services', category: 'Non-IT', location: 'New Delhi', state: 'Delhi', type: 'Full-time', description: "Source, interview, and onboard top talent. This role requires excellent interpersonal skills and a deep understanding of the recruitment process.", readMore: 'This is a detailed description of the HR Recruiter role. You will manage the end-to-end recruitment cycle, from creating job descriptions to extending offers. Experience with applicant tracking systems (ATS) is a plus.', link: 'https://www.yuvsathi.com/jobs/hr' },
  { id: 11, title: 'School Teacher', company: 'City Public School', category: 'Education', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Teach primary school students. We are looking for passionate educators with a B.Ed. degree and excellent communication skills.", readMore: "This is a detailed description of the School Teacher role. You will be responsible for creating and implementing engaging lesson plans, managing classroom activities, and assessing student progress. Experience teaching a specific grade level is a plus.", link: 'https://www.yuvsathi.com/jobs/teacher' },
  { id: 12, title: 'Police Officer', company: 'Bihar Police Department', category: 'Government', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Serve the community and maintain law and order. Candidates must meet physical fitness standards and pass a written exam.", readMore: "This is a detailed description of the Police Officer role. You will patrol assigned areas, respond to emergencies, and investigate crimes. This is a crucial role for public safety and requires a strong sense of duty and integrity.", link: 'https://www.yuvsathi.com/jobs/police' },
  { id: 13, title: 'Registered Nurse', company: 'Patna General Hospital', category: 'Healthcare', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Provide patient care, administer medication, and assist doctors. Must be a licensed and registered nurse in the state.", readMore: "This is a detailed description of the Registered Nurse role. You will work directly with patients, monitoring their health and providing emotional support. You will also collaborate with a medical team to develop and implement patient care plans.", link: 'https://www.yuvsathi.com/jobs/nurse' },
  { id: 14, title: 'Chef', company: 'The Royal Kitchen', category: 'Hospitality', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Lead our kitchen team and create innovative dishes. We need a creative and experienced chef.", readMore: "This is a detailed description of the Chef role. You will be responsible for menu planning, food preparation, and kitchen management. Culinary training and experience in a high-volume kitchen are required.", link: 'https://www.yuvsathi.com/jobs/chef' },
  { id: 15, title: 'Bank Clerk', company: 'State Bank of India', category: 'Government', location: 'Gaya', state: 'Bihar', type: 'Full-time', description: "Assist customers with their banking needs and handle financial transactions. A degree in commerce is preferred.", readMore: "This is a detailed description of the Bank Clerk role. You will be the first point of contact for customers, assisting with account inquiries, deposits, and withdrawals. Strong customer service skills and attention to detail are a must.", link: 'https://www.yuvsathi.com/jobs/bankclerk' },
  { id: 16, title: 'Journalist', company: 'Bihar News Daily', category: 'Media', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Cover local news and write compelling stories. We are looking for a skilled writer with a knack for investigative journalism.", readMore: "This is a detailed description of the Journalist role. You will be responsible for researching, reporting, and writing news articles for print and digital platforms. A degree in journalism or mass communication is highly desirable.", link: 'https://www.yuvsathi.com/jobs/journalist' },
  { id: 17, title: 'Electrician', company: 'Patna Power Works', category: 'Technical', location: 'Patna', state: 'Bihar', type: 'Full-time', description: "Install, maintain, and repair electrical systems. A certified electrician with a strong safety record is required.", readMore: "This is a detailed description of the Electrician role. You will work on residential and commercial projects, ensuring all electrical systems are up to code. This role requires technical expertise and a commitment to safety.", link: 'https://www.yuvsathi.com/jobs/electrician' },
  { id: 18, title: 'Financial Analyst', company: 'Apex Finance Group', category: 'Finance', location: 'Mumbai', state: 'Maharashtra', type: 'Full-time', description: "Conduct financial analysis and provide investment recommendations. Candidates should have experience in financial modeling and strong analytical skills.", readMore: "This is a detailed description of the Financial Analyst role. You will analyze market trends, evaluate investment opportunities, and prepare financial reports to support business decisions. A bachelor's degree in finance or a related field is required.", link: 'https://www.yuvsathi.com/jobs/financialanalyst' },
  { id: 19, title: 'Content Writer', company: 'WordCraft Solutions', category: 'IT', location: 'New Delhi', state: 'Delhi', type: 'Remote', description: "Create engaging and SEO-friendly content for websites, blogs, and social media. Excellent writing skills are a must.", readMore: "This is a detailed description of the Content Writer role. You will be responsible for producing high-quality written content that aligns with our brand's voice and marketing strategy. Experience with content management systems (CMS) is a plus.", link: 'https://www.yuvsathi.com/jobs/contentwriter' },
  { id: 20, title: 'Product Manager', company: 'InnoTech Solutions', category: 'IT', location: 'Bengaluru', state: 'Karnataka', type: 'Full-time', description: "Lead the development of new products from conception to launch. This role requires strong leadership and strategic thinking.", readMore: "This is a detailed description of the Product Manager role. You will define the product roadmap, prioritize features, and collaborate with engineering, design, and marketing teams to ensure product success. Experience in an agile development environment is required.", link: 'https://www.yuvsathi.com/jobs/productmanager' },
];

const allJobs_hi = [
  { id: 1, title: 'सीनियर वेब डेवलपर', company: 'टेक सॉल्यूशंस इंक.', category: 'आईटी', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "हम रिएक्ट और नोड.जेएस में विशेषज्ञता वाले एक उच्च कुशल सीनियर वेब डेवलपर की तलाश कर रहे हैं जो हमारी अगली पीढ़ी के वेब प्रोजेक्ट्स का नेतृत्व कर सकें।", readMore: 'यह सीनियर वेब डेवलपर की भूमिका का विस्तृत विवरण है। जिम्मेदारियों में पूर्ण-स्टैक विकास, जूनियर डेवलपर्स का मार्गदर्शन, और क्रॉस-फंक्शनल टीमों के साथ सहयोग शामिल है। आवश्यक कौशल: 5+ साल का अनुभव, रिएक्ट.जेएस, नोड.जेएस, एसक्यूएल/नोएसक्यूएल डेटाबेस, और क्लाउड सेवाएं (एडब्ल्यूएस/अजुर)।', link: 'https://www.yuvsathi.com/jobs/webdev' },
  { id: 2, title: 'डेटा एनालिस्ट', company: 'इनोवेट डेटा', category: 'आईटी', location: 'गया', state: 'बिहार', type: 'पूर्णकालिक', description: "व्यापार रणनीति को आगे बढ़ाने के लिए बड़े डेटासेट का विश्लेषण करने, रुझानों की व्याख्या करने और कार्रवाई योग्य अंतर्दृष्टि प्रदान करने के लिए हमारी टीम में शामिल हों। पायथन और एसक्यूएल में दक्षता आवश्यक है।", readMore: 'यह डेटा एनालिस्ट की भूमिका का विस्तृत विवरण है। आप व्यावसायिक समस्याओं को हल करने के लिए जटिल डेटा सेट को इकट्ठा, साफ और विश्लेषण करेंगे। आवश्यक कौशल: पायथन, एसक्यूएल, और टैब्लू या पावर बीआई जैसे डेटा विज़ुअलाइज़ेशन टूल में दक्षता। सांख्यिकीय मॉडल का ज्ञान एक अतिरिक्त लाभ है।', link: 'https://www.yuvsathi.com/jobs/dataanalyst' },
  { id: 3, title: 'ऑपरेशंस मैनेजर', company: 'लॉजिस्टिक्स हब', category: 'गैर-आईटी', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "दैनिक संचालन की देखरेख करें और परिचालन दक्षता में सुधार करें। इस भूमिका के लिए मजबूत नेतृत्व और समस्या-समाधान कौशल आवश्यक हैं।", readMore: 'यह ऑपरेशंस मैनेजर की भूमिका का विस्तृत विवरण है। प्रमुख जिम्मेदारियों में एक टीम का प्रबंधन, वर्कफ़्लो को अनुकूलित करना, और यह सुनिश्चित करना शामिल है कि सभी परिचालन प्रक्रियाएं सुचारू और कुशलता से चलें। उम्मीदवारों के पास इसी तरह की भूमिका में 3+ साल का अनुभव होना चाहिए।', link: 'https://www.yuvsathi.com/jobs/opsmanager' },
  { id: 4, title: 'डिजिटल मार्केटिंग स्पेशलिस्ट', company: 'ब्रांड बिल्डर्स', category: 'आईटी', location: 'पटना', state: 'बिहार', type: 'अंशकालिक', description: "डिजिटल मार्केटिंग अभियानों का विकास और कार्यान्वयन करें। एसईओ, एसईएम, और सोशल मीडिया मार्केटिंग में अनुभव वाले रचनात्मक व्यक्तियों के लिए आदर्श।", readMore: 'यह डिजिटल मार्केटिंग स्पेशलिस्ट की भूमिका का विस्तृत विवरण है। आप सोशल मीडिया, ईमेल अभियानों, और वेबसाइट सामग्री सहित सभी डिजिटल मार्केटिंग चैनलों के प्रबंधन के लिए जिम्मेदार होंगे। पिछले काम का एक पोर्टफोलियो अत्यधिक अनुशंसित है।', link: 'https://www.yuvsathi.com/jobs/digitalmarketing' },
  { id: 5, title: 'सिविल इंजीनियर', company: 'इन्फ्रावर्क्स लिमिटेड', category: 'गैर-आईटी', location: 'गया', state: 'बिहार', type: 'पूर्णकालिक', description: "हम निर्माण परियोजनाओं को डिजाइन और देखरेख करने के लिए एक योग्य सिविल इंजीनियर की तलाश कर रहे हैं। सिविल इंजीनियरिंग में स्नातक की डिग्री और प्रासंगिक प्रमाणपत्र होने चाहिए।", readMore: 'यह सिविल इंजीनियर की भूमिका का विस्तृत विवरण है। आप अवधारणा से लेकर पूर्णता तक विभिन्न बुनियादी ढांचा परियोजनाओं पर काम करेंगे। ऑटोकैड और परियोजना प्रबंधन सॉफ्टवेयर के साथ अनुभव एक जरूरी है।', link: 'https://www.yuvsathi.com/jobs/civilengineer' },
  { id: 6, title: 'अकाउंटेंट', company: 'फाइनेंशियल कॉर्प.', category: 'गैर-आईटी', location: 'पटना', state: 'बिहार', type: 'अनुबंध', description: "वित्तीय रिकॉर्ड का प्रबंधन करें और नियमों का पालन सुनिश्चित करें। उम्मीदवारों के पास लेखांकन में पृष्ठभूमि और वित्तीय सॉफ्टवेयर के साथ अनुभव होना चाहिए।", readMore: 'यह अकाउंटेंट की भूमिका का विस्तृत विवरण है। आप देय और प्राप्य खातों को संभालेंगे, वित्तीय रिपोर्ट तैयार करेंगे, और ऑडिट में सहायता करेंगे। लेखांकन या वित्त में एक डिग्री आवश्यक है।', link: 'https://www.yuvsathi.com/jobs/accountant' },
  { id: 7, title: 'यूएक्स/यूआई डिजाइनर', company: 'डिजाइनवर्क्स को.', category: 'आईटी', location: 'बेंगलुरु', state: 'कर्नाटक', type: 'पूर्णकालिक', description: "हमारे मोबाइल और वेब अनुप्रयोगों के लिए आकर्षक और उपयोगकर्ता के अनुकूल इंटरफ़ेस बनाएं। एक मजबूत पोर्टफोलियो आवश्यक है।", readMore: 'यह यूएक्स/यूआई डिजाइनर की भूमिका का विस्तृत विवरण है। आप उपयोगकर्ता अनुसंधान और वायरफ्रेमिंग से लेकर प्रोटोटाइपिंग और उच्च-निष्ठा मॉकअप तक, पूर्ण डिजाइन जीवनचक्र के लिए जिम्मेदार होंगे। फिग्मा, स्केच, या एडोब एक्सडी में दक्षता आवश्यक है।', link: 'https://www.yuvsathi.com/jobs/uxui' },
  { id: 8, title: 'मार्केटिंग एग्जीक्यूटिव', company: 'ग्रोथ इनोवेटर्स', category: 'गैर-आईटी', location: 'मुंबई', state: 'महाराष्ट्र', type: 'पूर्णकालिक', description: "ब्रांड जागरूकता बढ़ाने और ग्राहक अधिग्रहण को चलाने के लिए मार्केटिंग रणनीतियों का विकास और निष्पादन करें।", readMore: 'यह मार्केटिंग एग्जीक्यूटिव की भूमिका का विस्तृत विवरण है। प्रमुख जिम्मेदारियों में बाजार अनुसंधान, अभियान योजना, और प्रदर्शन विश्लेषण शामिल हैं। एक तेज-तर्रार वातावरण में अनुभव और उत्कृष्ट संचार कौशल एक अतिरिक्त लाभ है।', link: 'https://www.yuvsathi.com/jobs/marketingexec' },
  { id: 9, title: 'सॉफ्टवेयर इंजीनियर', company: 'कोडफ्लो सॉल्यूशंस', category: 'आईटी', location: 'मुंबई', state: 'महाराष्ट्र', type: 'पूर्णकालिक', description: "आधुनिक तकनीकों का उपयोग करके स्केलेबल और उच्च-प्रदर्शन वाले सॉफ्टवेयर अनुप्रयोगों का निर्माण करने के लिए हमारी विकास टीम में शामिल हों।", readMore: 'यह सॉफ्टवेयर इंजीनियर की भूमिका का विस्तृत विवरण है। आप हमारे मुख्य सॉफ्टवेयर उत्पादों के डिजाइन, विकास और रखरखाव में योगदान देंगे। आवश्यक कौशल: कम से कम एक प्रोग्रामिंग भाषा (जावा, सी++, पायथन) पर मजबूत पकड़, और क्लाउड प्लेटफार्मों के साथ अनुभव।', link: 'https://www.yuvsathi.com/jobs/software' },
  { id: 10, title: 'एचआर रिक्रूटर', company: 'पीपललिंक सर्विसेज', category: 'गैर-आईटी', location: 'नई दिल्ली', state: 'दिल्ली', type: 'पूर्णकालिक', description: "शीर्ष प्रतिभा को स्रोत, साक्षात्कार और ऑनबोर्ड करें। इस भूमिका के लिए उत्कृष्ट पारस्परिक कौशल और भर्ती प्रक्रिया की गहरी समझ की आवश्यकता है।", readMore: 'यह एचआर रिक्रूटर की भूमिका का विस्तृत विवरण है। आप जॉब विवरण बनाने से लेकर प्रस्ताव देने तक, एंड-टू-एंड भर्ती चक्र का प्रबंधन करेंगे। आवेदक ट्रैकिंग सिस्टम (एटीएस) के साथ अनुभव एक अतिरिक्त लाभ है।', link: 'https://www.yuvsathi.com/jobs/hr' },
  { id: 11, title: 'स्कूल टीचर', company: 'सिटी पब्लिक स्कूल', category: 'शिक्षा', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "प्राथमिक विद्यालय के छात्रों को पढ़ाएं। हम एक बी.एड. डिग्री और उत्कृष्ट संचार कौशल वाले भावुक शिक्षकों की तलाश कर रहे हैं।", readMore: 'यह स्कूल टीचर की भूमिका का विस्तृत विवरण है। आप आकर्षक पाठ योजनाओं को बनाने और लागू करने, कक्षा की गतिविधियों का प्रबंधन करने, और छात्र की प्रगति का आकलन करने के लिए जिम्मेदार होंगे। किसी विशिष्ट ग्रेड स्तर को पढ़ाने का अनुभव एक अतिरिक्त लाभ है।', link: 'https://www.yuvsathi.com/jobs/teacher' },
  { id: 12, title: 'पुलिस अधिकारी', company: 'बिहार पुलिस विभाग', category: 'सरकारी', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "समुदाय की सेवा करें और कानून और व्यवस्था बनाए रखें। उम्मीदवारों को शारीरिक फिटनेस मानकों को पूरा करना होगा और एक लिखित परीक्षा पास करनी होगी।", readMore: 'यह पुलिस अधिकारी की भूमिका का विस्तृत विवरण है। आप निर्दिष्ट क्षेत्रों में गश्त करेंगे, आपात स्थितियों पर प्रतिक्रिया देंगे, और अपराधों की जांच करेंगे। यह सार्वजनिक सुरक्षा के लिए एक महत्वपूर्ण भूमिका है और इसमें कर्तव्य और ईमानदारी की एक मजबूत भावना की आवश्यकता होती है।', link: 'https://www.yuvsathi.com/jobs/police' },
  { id: 13, title: 'रजिस्टर्ड नर्स', company: 'पटना जनरल अस्पताल', category: 'स्वास्थ्य सेवा', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "रोगी देखभाल प्रदान करें, दवाएं दें, और डॉक्टरों की सहायता करें। राज्य में एक लाइसेंस प्राप्त और पंजीकृत नर्स होनी चाहिए।", readMore: 'यह रजिस्टर्ड नर्स की भूमिका का विस्तृत विवरण है। आप सीधे रोगियों के साथ काम करेंगे, उनके स्वास्थ्य की निगरानी करेंगे और भावनात्मक सहायता प्रदान करेंगे। आप रोगी देखभाल योजनाओं को विकसित और लागू करने के लिए एक मेडिकल टीम के साथ भी सहयोग करेंगे।', link: 'https://www.yuvsathi.com/jobs/nurse' },
  { id: 14, title: 'शेफ', company: 'द रॉयल किचन', category: 'आतिथ्य', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "हमारी रसोई टीम का नेतृत्व करें और अभिनव व्यंजन बनाएं। हमें एक रचनात्मक और अनुभवी शेफ की आवश्यकता है।", readMore: 'यह शेफ की भूमिका का विस्तृत विवरण है। आप मेनू योजना, भोजन तैयार करने, और रसोई प्रबंधन के लिए जिम्मेदार होंगे। पाक प्रशिक्षण और एक उच्च-मात्रा वाली रसोई में अनुभव आवश्यक है।', link: 'https://www.yuvsathi.com/jobs/chef' },
  { id: 15, title: 'बैंक क्लर्क', company: 'भारतीय स्टेट बैंक', category: 'सरकारी', location: 'गया', state: 'बिहार', type: 'पूर्णकालिक', description: "ग्राहकों को उनकी बैंकिंग जरूरतों में सहायता करें और वित्तीय लेनदेन संभालें। वाणिज्य में एक डिग्री पसंद की जाती है।", readMore: 'यह बैंक क्लर्क की भूमिका का विस्तृत विवरण है। आप ग्राहकों के लिए पहला संपर्क बिंदु होंगे, खाता पूछताछ, जमा और निकासी में सहायता करेंगे। मजबूत ग्राहक सेवा कौशल और विस्तार पर ध्यान देना एक जरूरी है।', link: 'https://www.yuvsathi.com/jobs/bankclerk' },
  { id: 16, title: 'पत्रकार', company: 'बिहार न्यूज डेली', category: 'मीडिया', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "स्थानीय समाचारों को कवर करें और सम्मोहक कहानियां लिखें। हम खोजी पत्रकारिता के लिए एक कुशल लेखक की तलाश कर रहे हैं।", readMore: 'यह पत्रकार की भूमिका का विस्तृत विवरण है। आप प्रिंट और डिजिटल प्लेटफार्मों के लिए समाचार लेखों का शोध, रिपोर्टिंग और लेखन करने के लिए जिम्मेदार होंगे। पत्रकारिता या जनसंचार में एक डिग्री अत्यधिक वांछनीय है।', link: 'https://www.yuvsathi.com/jobs/journalist' },
  { id: 17, title: 'इलेक्ट्रीशियन', company: 'पटना पावर वर्क्स', category: 'तकनीकी', location: 'पटना', state: 'बिहार', type: 'पूर्णकालिक', description: "विद्युत प्रणालियों को स्थापित, बनाए रखें, और मरम्मत करें। एक मजबूत सुरक्षा रिकॉर्ड के साथ एक प्रमाणित इलेक्ट्रीशियन की आवश्यकता है।", readMore: 'यह इलेक्ट्रीशियन की भूमिका का विस्तृत विवरण है। आप आवासीय और वाणिज्यिक परियोजनाओं पर काम करेंगे, यह सुनिश्चित करते हुए कि सभी विद्युत प्रणालियां कोड के अनुसार हैं। इस भूमिका में तकनीकी विशेषज्ञता और सुरक्षा के प्रति प्रतिबद्धता की आवश्यकता है।', link: 'https://www.yuvsathi.com/jobs/electrician' },
  { id: 18, title: 'वित्तीय विश्लेषक', company: 'एपेक्स फाइनेंस ग्रुप', category: 'वित्त', location: 'मुंबई', state: 'महाराष्ट्र', type: 'पूर्णकालिक', description: "वित्तीय विश्लेषण करें और निवेश सिफारिशें प्रदान करें। उम्मीदवारों के पास वित्तीय मॉडलिंग में अनुभव और मजबूत विश्लेषणात्मक कौशल होना चाहिए।", readMore: 'यह वित्तीय विश्लेषक की भूमिका का विस्तृत विवरण है। आप बाजार के रुझानों का विश्लेषण करेंगे, निवेश के अवसरों का मूल्यांकन करेंगे, और व्यावसायिक निर्णयों का समर्थन करने के लिए वित्तीय रिपोर्ट तैयार करेंगे। वित्त या संबंधित क्षेत्र में स्नातक की डिग्री आवश्यक है।', link: 'https://www.yuvsathi.com/jobs/financialanalyst' },
  { id: 19, title: 'कंटेंट राइटर', company: 'वर्डक्राफ्ट सॉल्यूशंस', category: 'आईटी', location: 'नई दिल्ली', state: 'दिल्ली', type: 'रिमोट', description: "वेबसाइटों, ब्लॉगों और सोशल मीडिया के लिए आकर्षक और एसईओ-अनुकूल सामग्री बनाएं। उत्कृष्ट लेखन कौशल एक जरूरी है।", readMore: 'यह कंटेंट राइटर की भूमिका का विस्तृत विवरण है। आप उच्च-गुणवत्ता वाली लिखित सामग्री का उत्पादन करने के लिए जिम्मेदार होंगे जो हमारे ब्रांड की आवाज और मार्केटिंग रणनीति के साथ संरेखित होती है। सामग्री प्रबंधन प्रणालियों (सीएमएस) के साथ अनुभव एक अतिरिक्त लाभ है।', link: 'https://www.yuvsathi.com/jobs/contentwriter' },
  { id: 20, title: 'प्रोडक्ट मैनेजर', company: 'इन्नोटेक सॉल्यूशंस', category: 'आईटी', location: 'बेंगलुरु', state: 'कर्नाटक', type: 'पूर्णकालिक', description: "अवधारणा से लेकर लॉन्च तक नए उत्पादों के विकास का नेतृत्व करें। इस भूमिका के लिए मजबूत नेतृत्व और रणनीतिक सोच की आवश्यकता है।", readMore: 'यह प्रोडक्ट मैनेजर की भूमिका का विस्तृत विवरण है। आप उत्पाद रोडमैप को परिभाषित करेंगे, सुविधाओं को प्राथमिकता देंगे, और उत्पाद की सफलता सुनिश्चित करने के लिए इंजीनियरिंग, डिजाइन और मार्केटिंग टीमों के साथ सहयोग करेंगे। एक चुस्त विकास वातावरण में अनुभव आवश्यक है।', link: 'https://www.yuvsathi.com/jobs/productmanager' },
];

const allJobs = {
  en: allJobs_en,
  hi: allJobs_hi
};

const categories = ['IT', 'Non-IT', 'Government', 'Healthcare', 'Education', 'Finance', 'Media', 'Hospitality', 'Technical'];
const states = [
  { name: 'Bihar', cities: ['All', 'Patna', 'Gaya', 'Muzaffarpur'] },
  { name: 'Delhi', cities: ['All', 'New Delhi'] },
  { name: 'Karnataka', cities: ['All', 'Bengaluru'] },
  { name: 'Maharashtra', cities: ['All', 'Mumbai'] },
];

const JobsSection = () => {
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [jobsToShow, setJobsToShow] = useState(6); // Initially show 6 jobs
  const [currentLang, setCurrentLang] = useState('en');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showOtherPortalsModal, setShowOtherPortalsModal] = useState(false);

  // Translation function
  const t = (key) => translations[currentLang][key] || key;

  // Handles language switch
  const handleLanguageSwitch = (lang) => {
    setCurrentLang(lang);
  };

  useEffect(() => {
    let filteredJobs = allJobs[currentLang];

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerCaseQuery) ||
          job.company.toLowerCase().includes(lowerCaseQuery) ||
          job.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Filter by category
    if (category !== 'All') {
      filteredJobs = filteredJobs.filter((job) => job.category === category);
    }

    // Filter by state and city
    if (state) {
      filteredJobs = filteredJobs.filter((job) => job.state === state);
    }
    if (city && city !== 'All') {
      filteredJobs = filteredJobs.filter((job) => job.location === city);
    }

    setJobs(filteredJobs);
    setVisibleJobs(filteredJobs.slice(0, jobsToShow));
  }, [category, state, city, searchQuery, jobsToShow, currentLang]);

  const handleReadMore = (job) => {
    setSelectedJob(job);
    setShowDescriptionModal(true);
  };

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleViewMore = () => {
    setJobsToShow(jobs.length);
  };

  const cities = state ? states.find((s) => s.name === state)?.cities : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <section className="py-16 bg-gray-50 dark:bg-gray-900 rounded-xl m-4 md:m-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${currentLang === 'en' ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageSwitch('hi')}
                className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${currentLang === 'hi' ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                हिंदी
              </button>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-slate-900 dark:text-white mb-6 drop-shadow-md">
            {t('title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          
          {/* Search Bar & Filters */}
          <div className="flex flex-col items-center space-y-4 mb-12">
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={20} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
              {/* Category Filter */}
              <div className="relative w-full md:w-auto">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none w-full md:w-60 p-4 pl-4 pr-10 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 cursor-pointer"
                >
                  <option value="All">{t('allCategories')}</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* State Filter */}
              <div className="relative w-full md:w-auto">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="appearance-none w-full md:w-60 p-4 pl-4 pr-10 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 cursor-pointer"
                >
                  <option value="">{t('selectState')}</option>
                  {states.map((s, index) => (
                    <option key={index} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* City Filter */}
              <div className="relative w-full md:w-auto">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!state}
                  className="appearance-none w-full md:w-60 p-4 pl-4 pr-10 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t('selectCity')}</option>
                  {cities.map((c, index) => (
                    <option key={index} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Jobs list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleJobs.length > 0 ? (
              visibleJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {job.category === 'IT' ? (
                      <Laptop size={32} className="text-cyan-500" />
                    ) : job.category === 'Government' ? (
                      <Banknote size={32} className="text-lime-500" />
                    ) : job.category === 'Healthcare' ? (
                      <Briefcase size={32} className="text-pink-500" />
                    ) : (
                      <Building size={32} className="text-purple-500" />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{job.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{job.company}</p>
                    </div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    <p className="flex items-center space-x-2 mb-2">
                      <Briefcase size={18} className="text-gray-400" />
                      <span>{job.type}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <MapPin size={18} className="text-gray-400" />
                      <span>{job.location}, {job.state}</span>
                    </p>
                    <p className="mt-4">{job.description}</p>
                  </div>
                  <div className="flex space-x-3 mt-6 justify-end">
                    <button
                      onClick={() => handleReadMore(job)}
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                    >
                      {t('readButton')}
                    </button>
                    <button
                      onClick={() => handleApplyNow(job)}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                    >
                      {t('applyNowButton')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500 dark:text-gray-400 text-xl font-semibold p-8">
                {t('noJobsFound')}
              </div>
            )}
          </div>

          {jobsToShow < jobs.length && (
            <div className="text-center mt-12">
              <button
                onClick={handleViewMore}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:from-violet-600 hover:to-purple-700"
              >
                {t('viewMoreButton')}
              </button>
            </div>
          )}

        </div>

        {/* Job Description Modal */}
        {showDescriptionModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-xl w-full relative">
              <button onClick={() => setShowDescriptionModal(false)} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('jobDescriptionModalTitle')}</h3>
              <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{selectedJob.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{selectedJob.company}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedJob.location}, {selectedJob.state}</p>
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedJob.readMore}</p>
            </div>
          </div>
        )}

        {/* Apply Now Modal */}
        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-sm w-full relative text-center">
              <button onClick={() => setShowApplyModal(false)} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('howToApply')}</h3>
              <div className="flex flex-col space-y-4">
                <a 
                  href="/register" 
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <UserRoundPlus size={20} />
                  <span>{t('applyWithYuvaSaathi')}</span>
                </a>
                <button 
                  onClick={() => {
                    setShowApplyModal(false);
                    setShowOtherPortalsModal(true);
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <ExternalLink size={20} />
                  <span>{t('applyWithOtherPortals')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Portals Modal */}
        {showOtherPortalsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-sm w-full relative text-center">
              <button onClick={() => setShowOtherPortalsModal(false)} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('usefulJobPortals')}</h3>
              <div className="flex flex-col space-y-4">
                <a href="https://www.naukri.com/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <ExternalLink size={20} />
                  <span>Naukri</span>
                </a>
                <a href="https://www.linkedin.com/jobs/" target="_blank" rel="noopener noreferrer" className="bg-cyan-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <ExternalLink size={20} />
                  <span>LinkedIn Jobs</span>
                </a>
                <a href="https://www.indeed.com/" target="_blank" rel="noopener noreferrer" className="bg-green-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <ExternalLink size={20} />
                  <span>Indeed</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobsSection;
