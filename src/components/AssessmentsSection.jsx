import React, { useState, useEffect } from 'react';
import { Award, Repeat, UserRoundPlus, Timer, ChevronsRight, X, ChevronDown, BookOpen, Laptop, Briefcase, BarChart2 } from 'lucide-react';

const allAssessments = {
  aptitude: [
    { id: 1, text: 'If a car travels at a speed of 60 km/h, how long will it take to cover 180 km?', options: ['2 hours', '3 hours', '4 hours'], correct: '3 hours' },
    { id: 2, text: 'What is 15% of 200?', options: ['15', '30', '45'], correct: '30' },
    { id: 3, text: 'If $a = 5$ and $b = 3$, what is $a² - b²$?', options: ['16', '12', '8'], correct: '16' },
    { id: 4, text: 'The average of 3, 5, and 7 is:', options: ['4', '5', '6'], correct: '5' },
    { id: 5, text: 'A train 100 meters long crosses a pole in 5 seconds. What is its speed?', options: ['20 m/s', '50 m/s', '10 m/s'], correct: '20 m/s' },
    { id: 6, text: 'A sum of money doubles itself in 5 years at simple interest. What is the rate of interest?', options: ['10%', '15%', '20%'], correct: '20%' },
    { id: 7, text: 'What is the next number in the series: 1, 4, 9, 16, 25, ...?', options: ['30', '36', '49'], correct: '36' },
    { id: 8, text: 'If 6 men can do a piece of work in 10 days, how many men would be required to do the same work in 5 days?', options: ['10', '12', '15'], correct: '12' },
    { id: 9, text: 'A box contains 5 red balls and 3 green balls. If one ball is drawn at random, what is the probability that it is red?', options: ['3/8', '5/8', '1/2'], correct: '5/8' },
    { id: 10, text: 'What is the value of 5! (5 factorial)?', options: ['25', '120', '100'], correct: '120' },
  ],
  english: [
    { id: 11, text: 'Choose the correct synonym for "diligent".', options: ['Lazy', 'Hard-working', 'Careless'], correct: 'Hard-working' },
    { id: 12, text: 'Which word is an antonym for "brave"?', options: ['Courageous', 'Fearful', 'Strong'], correct: 'Fearful' },
    { id: 13, text: 'Identify the grammatically correct sentence.', options: ['He go to the park.', 'He goes to the park.', 'He going to the park.'], correct: 'He goes to the park.' },
    { id: 14, text: 'Complete the sentence: "I have been waiting for you ___ a long time."', options: ['since', 'for', 'from'], correct: 'for' },
    { id: 15, text: 'Choose the correct spelling.', options: ['Accommodate', 'Acommodate', 'Acomodate'], correct: 'Accommodate' },
    { id: 16, text: 'Choose the correct preposition: "The book is ___ the table."', options: ['on', 'in', 'at'], correct: 'on' },
    { id: 17, text: 'Which of the following is a verb?', options: ['Happy', 'Jump', 'Quickly'], correct: 'Jump' },
    { id: 18, text: 'The passive voice of "He wrote a letter" is:', options: ['A letter was written by him.', 'A letter is written by him.', 'A letter is being written by him.'], correct: 'A letter was written by him.' },
    { id: 19, text: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childen'], correct: 'Children' },
    { id: 20, text: 'Choose the correct article: "___ apple a day keeps the doctor away."', options: ['A', 'An', 'The'], correct: 'An' },
  ],
  it_technical: [
    { id: 21, text: 'Which data structure is a LIFO (Last-In, First-Out) structure?', options: ['Queue', 'Stack', 'Array'], correct: 'Stack' },
    { id: 22, text: 'What is the full form of HTML?', options: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyperlink and Text Markup Language'], correct: 'Hyper Text Markup Language' },
    { id: 23, text: 'Which of these is a programming language?', options: ['Photoshop', 'SQL', 'Java'], correct: 'Java' },
    { id: 24, text: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets'], correct: 'Cascading Style Sheets' },
    { id: 25, text: 'What is the main purpose of a "for" loop?', options: ['To create a function', 'To iterate over a sequence of elements', 'To check a condition'], correct: 'To iterate over a sequence of elements' },
    { id: 26, text: 'Which command is used to install a package in Node.js?', options: ['npm start', 'npm install', 'npm run'], correct: 'npm install' },
    { id: 27, text: 'What does "API" stand for?', options: ['Application Programming Interface', 'Application Process Interface', 'Advanced Protocol Integration'], correct: 'Application Programming Interface' },
  ],
  non_it_general: [
    { id: 28, text: 'What is the full form of a "CV"?', options: ['Career View', 'Curriculum Vitae', 'Company Verification'], correct: 'Curriculum Vitae' },
    { id: 29, text: 'Which of these is a key skill for a manager?', options: ['Coding', 'Communication', 'Graphic Design'], correct: 'Communication' },
    { id: 30, text: 'What is a "cover letter"?', options: ['A letter to a friend', 'A letter sent with a resume to a potential employer', 'A letter to the government'], correct: 'A letter sent with a resume to a potential employer' },
    { id: 31, text: 'What does "B2B" stand for in business?', options: ['Business to Business', 'Buy to Business', 'Big to Big'], correct: 'Business to Business' },
    { id: 32, text: 'What is the main goal of a sales team?', options: ['To hire new employees', 'To sell products or services', 'To manage finances'], correct: 'To sell products or services' },
    { id: 33, text: 'Which of these is a core function of HR?', options: ['Marketing', 'Recruitment and Onboarding', 'Product Development'], correct: 'Recruitment and Onboarding' },
    { id: 34, text: 'What is a "P&L statement"?', options: ['Profit and Loss', 'People and Logistics', 'Project and Labor'], correct: 'Profit and Loss' },
  ],
};

const availableTests = [
  { id: 1, title: 'General Aptitude', description: 'Test your logical, numerical, and verbal reasoning skills.', category: 'aptitude' },
  { id: 2, title: 'English Proficiency', description: 'Assess your grammar, vocabulary, and writing skills.', category: 'english' },
  { id: 3, title: 'IT Fundamentals', description: 'A test on core IT and technical concepts.', category: 'it_technical' },
  { id: 4, title: 'Non-IT Professional', description: 'Questions related to business, management, and general knowledge.', category: 'non_it_general' },
  { id: 5, title: 'Data Analyst Skills', description: 'Assess your analytical and data interpretation skills.', category: 'it_technical' },
  { id: 6, title: 'Marketing and Sales', description: 'Test your knowledge of marketing and sales principles.', category: 'non_it_general' },
  { id: 7, title: 'Human Resources', description: 'Assess your understanding of HR functions and practices.', category: 'non_it_general' },
  { id: 8, title: 'Logical Reasoning', description: 'A test on problem-solving and critical thinking.', category: 'aptitude' },
  { id: 9, title: 'Verbal Ability', description: 'Questions on vocabulary, reading comprehension, and sentence correction.', category: 'english' },
  { id: 10, title: 'Programming Basics', description: 'Test your knowledge of fundamental programming concepts.', category: 'it_technical' },
  { id: 11, title: 'Financial Management', description: 'A test on financial concepts, P&L, and accounting.', category: 'non_it_general' },
  { id: 12, title: 'Web Development Basics', description: 'Assess your knowledge of HTML, CSS, and JavaScript.', category: 'it_technical' },
  { id: 13, title: 'Software Engineering', description: 'Test your understanding of software development life cycles and methodologies.', category: 'it_technical' },
  { id: 14, title: 'Customer Support', description: 'Questions on communication, problem-solving, and service skills.', category: 'non_it_general' },
  { id: 15, title: 'Project Management', description: 'Assess your knowledge of project planning and execution.', category: 'non_it_general' },
  { id: 16, title: 'Networking Fundamentals', description: 'Test on basic networking concepts.', category: 'it_technical' },
  { id: 17, title: 'Business Communication', description: 'Assess your verbal and written communication skills in a professional context.', category: 'english' },
  { id: 18, title: 'Quantitative Aptitude', description: 'Questions focused on numerical and mathematical reasoning.', category: 'aptitude' },
  { id: 19, title: 'Verbal Reasoning', description: 'A test of your ability to understand and interpret text.', category: 'english' },
  { id: 20, title: 'General IT Knowledge', description: 'A broad assessment of IT concepts and terminology.', category: 'it_technical' },
];

const AssessmentsSection = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTestList, setShowTestList] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  
  const [education, setEducation] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    let timer;
    if (testStarted && !showResult && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted) {
      setShowResult(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, showResult]);

  const generateQuestions = (testCategory, role, experience) => {
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
    const newQuestions = [];

    // Prioritize questions from the selected category
    const mainCategoryQuestions = allAssessments[testCategory] || [];
    newQuestions.push(...shuffleArray(mainCategoryQuestions));

    // Fill the rest with a mix of other categories
    const otherCategories = Object.keys(allAssessments).filter(cat => cat !== testCategory);
    otherCategories.forEach(cat => {
      newQuestions.push(...shuffleArray(allAssessments[cat]));
    });

    return shuffleArray(newQuestions.slice(0, 20));
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setShowTestList(false);
    setShowForm(true);
  };

  const handleStartTest = () => {
    const newQuestions = generateQuestions(selectedTest.category, role, experience);
    setSelectedQuestions(newQuestions);
    
    setShowForm(false);
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(900);
  };

  const handleAnswer = (option) => {
    if (option === selectedQuestions[currentQuestionIndex].correct) {
      setScore(prevScore => prevScore + 1);
    }
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < selectedQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getCertificateStatus = (finalScore) => {
    if (finalScore >= 18) {
      return { text: "Merit Certificate!", color: "text-yellow-500", icon: <Award size={64} /> };
    } else if (finalScore >= 14) {
      return { text: "Certificate of Distinction", color: "text-blue-500", icon: <Award size={64} /> };
    } else if (finalScore >= 12) {
      return { text: "Certificate of Completion", color: "text-green-500", icon: <Award size={64} /> };
    } else {
      return { text: "You need to score at least 12 marks to get a certificate.", color: "text-red-500", icon: <X size={64} /> };
    }
  };

  const certificateStatus = getCertificateStatus(score);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl m-4 md:m-8 text-gray-800 dark:text-gray-200 min-h-[600px] flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-slate-900 dark:text-white mb-6 drop-shadow-md">
          Skill Assessments
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose an assessment below to test your skills and earn a certificate!
        </p>

        {showTestList && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map(test => (
              <div
                key={test.id}
                onClick={() => handleSelectTest(test)}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-start"
              >
                <div className="p-3 bg-teal-500/10 text-teal-500 rounded-lg mb-4">
                  {test.category === 'aptitude' && <BarChart2 size={24} />}
                  {test.category === 'english' && <BookOpen size={24} />}
                  {test.category === 'it_technical' && <Laptop size={24} />}
                  {test.category === 'non_it_general' && <Briefcase size={24} />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{test.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{test.description}</p>
                <button
                  className="mt-auto inline-flex items-center text-teal-500 font-semibold transition-colors duration-200 hover:text-teal-600"
                >
                  Take Test <ChevronsRight size={16} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Tell us about yourself to tailor your test</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You have selected: <span className="font-semibold text-teal-500">{selectedTest.title}</span></p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative w-full">
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full p-4 pl-4 pr-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select Education</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative w-full">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-4 pl-4 pr-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select Desired Role</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Marketing Specialist">Marketing Specialist</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative w-full">
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-4 pl-4 pr-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select Experience</option>
                  <option value="Fresher">0-1 years</option>
                  <option value="Junior">1-3 years</option>
                  <option value="Mid-level">3-5 years</option>
                  <option value="Senior">5+ years</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <button
              onClick={handleStartTest}
              disabled={!education || !role || !experience}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-transform duration-300 hover:scale-105 transform hover:rotate-2 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={24} className="mr-2" />
              <span>Start Test</span>
            </button>
          </div>
        )}

        {testStarted && !showResult && (
          <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-lg mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Question {currentQuestionIndex + 1} of {selectedQuestions.length}</span>
              <span className="flex items-center space-x-2 text-red-500 font-bold">
                <Timer size={20} />
                <span>{formatTime(timeLeft)}</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {selectedQuestions[currentQuestionIndex].text}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedQuestions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl shadow-md font-medium text-left transition-transform duration-200 hover:scale-105 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowResult(true)}
                className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
              >
                End Test
              </button>
            </div>
          </div>
        )}

        {showResult && (
          <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className={`p-4 rounded-full ${certificateStatus.color}`}>
                {certificateStatus.icon}
              </div>
              <h3 className={`mt-4 text-3xl md:text-4xl font-extrabold ${certificateStatus.color}`}>
                {certificateStatus.text}
              </h3>
            </div>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              Your Score: <span className="font-bold">{score} / {selectedQuestions.length}</span>
            </p>
            {score < 12 && (
              <p className="text-red-500 font-bold mb-6">
                You need a score of 12 or more to be eligible for a certificate.
              </p>
            )}
            {score >= 12 && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Congratulations! To obtain your certificate, please register on the YuvaSaathi portal.
              </p>
            )}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <button
                onClick={() => {
                  setShowForm(false);
                  setTestStarted(false);
                  setShowResult(false);
                  setShowTestList(true); // Return to the test list
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
              >
                <Repeat size={20} className="mr-2" />
                <span>Retake Test</span>
              </button>
              {score >= 12 && (
                <a
                  href="/register"
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <UserRoundPlus size={20} className="mr-2" />
                  <span>Register on YuvaSaathi</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AssessmentsSection;
