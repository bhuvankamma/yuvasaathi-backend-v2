import React, { useState, useEffect } from 'react';
import image9 from '../assets/img2 (9).jpg'
import card from '../assets/card.webp'
import MAR from '../assets/MAR.jpeg'
import MUY from '../assets/MUY.jpeg'
import SN from '../assets/SN.jpeg'
import skill from '../assets/skill.png'
import parivahan from '../assets/parivahan.jpg'
import krishi from '../assets/krishi.jpg'
import sp from '../assets/sp.jpg'
import satat from '../assets/satat.jpg'
import ab from '../assets/ab.jpg'
import db from '../assets/db.jpeg'
import hr from '../assets/hr.webp'
import jh from '../assets/jh.png'
import ep from '../assets/ep.jpg'
import dbb from '../assets/dbb.jpeg'

const welfareSchemes = [
  {
    id: 1,
    title: 'Mukhyamantri Udyami Yojana',
    description: 'Promoting entrepreneurship among youth, women, and SC/ST categories with financial support.',
    image: MUY,
    link: 'https://udyami.bihar.gov.in/',
  },
  {
    id: 2,
    title: 'Saat Nishchay Part-2',
    description: 'Seven resolves for a developed Bihar, focusing on youth, infrastructure, and good governance.',
    image: SN,
    link: 'https://www.bihar.gov.in/en/state-scheme/saat-nishchay-part-2',
  },
  {
    id: 3,
    title: 'Bihar Student Credit Card Scheme',
    description: 'Providing financial assistance up to ₹4 lakhs for higher education to aspiring students.',
    image: card,
    link: 'https://www.7nishchay-bfcc.bihar.gov.in/student-credit-card',
  },
  {
    id: 4,
    title: 'Bihar Skill Development Mission',
    description: skill,
    link: 'http://bsdm.bihar.gov.in/',
  },
  {
    id: 5,
    title: 'Mukhyamantri Alpsankhyak Rojgar Rin Yojana',
    description: 'Providing loans to minority communities for self-employment and small businesses.',
    image: MAR,
    link: 'http://minoritywelfare.bihar.gov.in/schemes.html',
  },
];

const governmentInitiatives = [
  {
    id: 1,
    title: 'Digital Bihar',
    description: 'A comprehensive plan to digitize government services and promote digital literacy.',
    image: dbb,
    link: 'https://state.bihar.gov.in/main/CitizenHome.html',
  },
  {
    id: 2,
    title: 'Health Sector Reforms',
    description: 'Improving healthcare infrastructure and access to quality medical services for all citizens.',
    image: hr,
    link: 'https://health.bih.nic.in/',
  },
  {
    id: 3,
    title: 'Agricultural Roadmap',
    description: 'Modernizing agriculture to increase productivity and farmer income.',
    image: ab,
    link: 'https://krishi.bih.nic.in/',
  },
  {
    id: 4,
    title: 'Education Policy',
    description: 'Enhancing the quality of education from primary to higher levels across the state.',
    image: ep,
    link: 'http://education.bih.nic.in/',
  },
  {
    id: 5,
    title: 'Jal-Jeevan-Hariyali Mission',
    description: 'A campaign focused on environmental conservation and water management.',
    image: jh,
    link: 'https://www.jaljeevanhariyali.bihar.gov.in/',
  },
  {
    id: 6,
    title: 'Urban Development',
    description: 'Focusing on smart city initiatives and improving urban infrastructure.',
    image: db,
    link: 'http://urban.bih.nic.in/',
  },
];

const moreWelfareSchemes = [
  {
    id: 1,
    title: 'Mukhyamantri Gram Parivahan Yojana',
    description: 'Providing financial assistance to purchase vehicles to connect remote villages.',
    image: parivahan,
    // link: 'https://transport.bih.nic.i'n/schemes-and-services/transport-schemes/',
  },
  {
    id: 2,
    title: 'Bihar Krishi Input Anudan Yojana',
    description: 'Financial aid to farmers for crop damage due to natural calamities.',
    image: krishi ,
    link: 'https://dbtagriculture.bihar.gov.in/',
  },
  {
    id: 3,
    title: 'Post Matric Scholarship Scheme',
    description: 'Scholarships for students from Backward and Extremely Backward Classes for higher education.',
    image: sp,
    link: 'https://pmsonline.bihar.gov.in/',
  },
  {
    id: 4,
    title: 'Satat Jeevikoparjan Yojana',
    description: 'Livelihood support for ultra-poor households through skill-building and financial aid.',
    image: satat,
    link: 'https://brlps.in/Schemes',
  },
];

const AboutUs = () => {
  const [currentSchemeIndex, setCurrentSchemeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSchemeIndex((prevIndex) =>
        (prevIndex + 1) % welfareSchemes.length
      );
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentScheme = welfareSchemes[currentSchemeIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 to-emerald-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12 drop-shadow-md">
          About Bihar Government & Yuva Saathi
        </h2>

        {/* Introduction */}
        <div className="text-lg text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto text-center">
          <p>
            The Bihar Government is dedicated to the holistic development and empowerment of its citizens, especially the youth. Through initiatives like "Yuva Saathi," we strive to create a vibrant ecosystem that supports career growth, skill enhancement, and overall well-being. Our commitment is reflected in various welfare schemes designed to provide opportunities and uplift every section of society.
          </p>
        </div>

        {/* Key Welfare Schemes Carousel */}
        <div className="mb-20 relative">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Key Welfare Schemes
          </h3>
          <div className="flex justify-center items-center">
            <a href={currentScheme.link} className="block w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              <div className="relative">
                <img
                  src={currentScheme.image}
                  alt={currentScheme.title}
                  className="w-full h-72 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-end p-8">
                  <div className="text-white">
                    <h4 className="text-2xl font-bold mb-2">{currentScheme.title}</h4>
                    <p className="text-sm md:text-base">{currentScheme.description}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {welfareSchemes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSchemeIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSchemeIndex === index ? 'bg-white scale-125' : 'bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Additional Welfare Schemes - Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Additional Welfare Schemes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {moreWelfareSchemes.map((scheme) => (
              <a href={scheme.link} key={scheme.id} className="block">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform hover:scale-105 transition-transform duration-300">
                  <img src={scheme.image} alt={scheme.title} className="w-full h-48 object-cover" />
                  <div className="p-6 flex-grow">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{scheme.title}</h4>
                    <p className="text-gray-600 text-sm">{scheme.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Other Government Initiatives - Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Other Government Initiatives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {governmentInitiatives.map((initiative) => (
              <a href={initiative.link} key={initiative.id} className="block">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform hover:scale-105 transition-transform duration-300">
                  <img src={initiative.image} alt={initiative.title} className="w-full h-48 object-cover" />
                  <div className="p-6 flex-grow">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{initiative.title}</h4>
                    <p className="text-gray-600 text-sm">{initiative.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
