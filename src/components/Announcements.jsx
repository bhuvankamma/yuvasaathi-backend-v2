import React from 'react';
import { Megaphone, MessageSquareText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Announcements = () => {
  const { t } = useTranslation();

  // Define a single key for the announcement text
  const announcementText = t('announcement_text');

  return (
    <section className="bg-gray-800 text-white shadow-xl overflow-hidden py-2 md:py-3 border-t-2 border-b-2 border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center sm:justify-start">
          <span className="flex-shrink-0 text-yellow-300 font-bold text-lg md:text-xl mr-4 flex items-center">
            <Megaphone size={24} className="mr-2 animate-wiggle" />
            <span className="hidden sm:inline">{t('latest_updates')}:</span>
          </span>
          <div className="flex-grow min-w-0">
            <div className="overflow-hidden whitespace-nowrap">
              {/* This div contains the single scrolling paragraph */}
              <div className="inline-block animate-scroll-left text-base md:text-base">
                <span className="inline-block font-medium hover:text-yellow-400 transition-colors duration-300 px-4">
                  <span className="flex items-center space-x-2">
                    <MessageSquareText size={16} className="text-yellow-300 flex-shrink-0" />
                    <span>{announcementText}</span>
                  </span>
                </span>
                <span className="inline-block font-medium hover:text-yellow-400 transition-colors duration-300 px-4">
                  <span className="flex items-center space-x-2">
                    <MessageSquareText size={16} className="text-yellow-300 flex-shrink-0" />
                    <span>{announcementText}</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-scroll-left {
          animation: scroll-left 25s linear infinite; /* Adjusted speed for readability */
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Announcements;