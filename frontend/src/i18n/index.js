import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationEN from './translations/en';
import translationPT from './translations/pt';
import translationES from './translations/es';
import translationFR from './translations/fr';
import translationRU from './translations/ru';
import translationDE from './translations/de';
import translationZH from './translations/zh';
import translationJA from './translations/ja';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  pt: {
    translation: translationPT
  },
  es: {
    translation: translationES
  },
  fr: {
    translation: translationFR
  },
  ru: {
    translation: translationRU
  },
  de: {
    translation: translationDE
  },
  zh: {
    translation: translationZH
  },
  ja: {
    translation: translationJA
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
