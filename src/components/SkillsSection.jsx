import React from 'react';

const skillPrograms = [
  {
    id: 1,
    title: 'Advanced Web Development',
    category: 'IT',
    description: 'Learn modern web technologies including React, Node.js, and MongoDB. Get certified by Bihar Government.',
    certification: 'Bihar Govt. Certified Web Developer',
  },
  {
    id: 2,
    title: 'Digital Marketing Fundamentals',
    category: 'Non-IT',
    description: 'Master SEO, SEM, Social Media Marketing, and Content Marketing. Bihar Government approved certification.',
    certification: 'Bihar Govt. Certified Digital Marketer',
  },
  {
    id: 3,
    title: 'Data Analytics with Python',
    category: 'IT',
    description: 'Explore data analysis using Python, Pandas, and NumPy. Receive a state-recognized certification.',
    certification: 'Bihar Govt. Certified Data Analyst',
  },
  {
    id: 4,
    title: 'Spoken English & Communication',
    category: 'Non-IT',
    description: 'Improve your English fluency and communication skills for professional growth. Government approved course.',
    certification: 'Bihar Govt. Certified Communicator',
  },
  {
    id: 5,
    title: 'Mobile App Development (Android)',
    category: 'IT',
    description: 'Build native Android applications from scratch. Certification recognized across Bihar.',
    certification: 'Bihar Govt. Certified Android Developer',
  },
  {
    id: 6,
    title: 'Basic Accounting & Tally',
    category: 'Non-IT',
    description: 'Learn fundamental accounting principles and Tally ERP software. Certification will boost your career.',
    certification: 'Bihar Govt. Certified Accountant',
  },
  {
    id: 7,
    title: 'Cloud Computing with AWS',
    category: 'IT',
    description: 'Understand cloud services, architecture, and deployment on Amazon Web Services.',
    certification: 'Bihar Govt. Certified Cloud Practitioner',
  },
  {
    id: 8,
    title: 'Graphic Design with Adobe Suite',
    category: 'Non-IT',
    description: 'Learn to create stunning visuals using Photoshop, Illustrator, and InDesign.',
    certification: 'Bihar Govt. Certified Graphic Designer',
  },
  {
    id: 9,
    title: 'Cybersecurity Essentials',
    category: 'IT',
    description: 'Cover foundational concepts of network security, threat detection, and risk management.',
    certification: 'Bihar Govt. Certified Cybersecurity Analyst',
  },
  {
    id: 10,
    title: 'Professional Communication',
    category: 'Non-IT',
    description: 'Develop strong verbal and written communication skills for the corporate world.',
    certification: 'Bihar Govt. Certified Professional Communicator',
  },
  {
    id: 11,
    title: 'Full Stack JavaScript',
    category: 'IT',
    description: 'Become a full-stack developer with comprehensive training in the MERN stack.',
    certification: 'Bihar Govt. Certified Full Stack Developer',
  },
  {
    id: 12,
    title: 'Content Writing & Strategy',
    category: 'Non-IT',
    description: 'Learn to create engaging content for blogs, websites, and social media platforms.',
    certification: 'Bihar Govt. Certified Content Strategist',
  },
  {
    id: 13,
    title: 'UI/UX Design',
    category: 'IT',
    description: 'Master the principles of user interface and user experience design for web and mobile.',
    certification: 'Bihar Govt. Certified UI/UX Designer',
  },
  {
    id: 14,
    title: 'Project Management Professional',
    category: 'Non-IT',
    description: 'Learn to plan, execute, and close projects successfully using proven methodologies.',
    certification: 'Bihar Govt. Certified Project Manager',
  },
  {
    id: 15,
    title: 'Artificial Intelligence & Machine Learning',
    category: 'IT',
    description: 'An introduction to AI, machine learning algorithms, and their applications.',
    certification: 'Bihar Govt. Certified AI/ML Specialist',
  },
  {
    id: 16,
    title: 'Human Resources Management',
    category: 'Non-IT',
    description: 'Gain skills in recruitment, employee relations, and HR policies.',
    certification: 'Bihar Govt. Certified HR Manager',
  },
  {
    id: 17,
    title: 'Data Science with R',
    category: 'IT',
    description: 'Learn data manipulation, visualization, and statistical analysis using the R programming language.',
    certification: 'Bihar Govt. Certified Data Scientist',
  },
  {
    id: 18,
    title: 'Financial Planning',
    category: 'Non-IT',
    description: 'Understand personal and corporate finance, budgeting, and investment principles.',
    certification: 'Bihar Govt. Certified Financial Planner',
  },
  {
    id: 19,
    title: 'SAP Basic Training',
    category: 'IT',
    description: 'An introductory course to SAP ERP software, covering core modules and functionalities.',
    certification: 'Bihar Govt. Certified SAP User',
  },
  {
    id: 20,
    title: 'Supply Chain Management',
    category: 'Non-IT',
    description: 'Learn the fundamentals of logistics, operations, and supply chain optimization.',
    certification: 'Bihar Govt. Certified Supply Chain Manager',
  },
];

const SkillsSection = () => {
  return (
    <section style={{ padding: '3rem 0', backgroundColor: '#eff6ff' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '2.5rem' }}>
          Free Skill Development Programs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {skillPrograms.map((program) => (
            <div
              key={program.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                  {program.title}
                </h3>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{program.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', color: '#ea580c', fontWeight: '600' }}>
                  <svg
                    style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.21a4.807 4.807 0 00-6.46-.732L11 10.27M13.27 13.27l3.96 3.96a4.807 4.807 0 006.46-.732L21 6a4.807 4.807 0 00-6.46-.732zM7.382 17.618a4.807 4.807 0 006.46.732L11 13.73M9 10.27L5.04 6.31a4.807 4.807 0 00-6.46.732L3 18a4.807 4.807 0 006.46.732z"
                    ></path>
                  </svg>
                  {program.certification}
                </div>
              </div>
              <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderTop: '1px solid #e5e7eb', marginTop: 'auto' }}>
                <a
                  href="/register"
                  style={{
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textAlign: 'center',
                    display: 'inline-block',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease-in-out',
                  }}
                >
                  Enroll
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
