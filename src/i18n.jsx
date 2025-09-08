// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './en.json';
import translationHI from './hi.json';

// Create a resources object
const resources = {
  en: {
    translation: translationEN,
  },
  hi: {
    translation: translationHI,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources, // Use the imported resources object
    fallbackLng: 'hi', // Set Hindi as the default language
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;