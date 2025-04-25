import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importa as traduções
import enTranslations from './translations/en';
import ptTranslations from './translations/pt';
import esTranslations from './translations/es';
import frTranslations from './translations/fr';
import ruTranslations from './translations/ru';
import deTranslations from './translations/de';
import zhTranslations from './translations/zh';
import jaTranslations from './translations/ja';

// Configuração do i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations || enTranslations },
      es: { translation: esTranslations || enTranslations },
      fr: { translation: frTranslations || enTranslations },
      ru: { translation: ruTranslations || enTranslations },
      de: { translation: deTranslations || enTranslations },
      zh: { translation: zhTranslations || enTranslations },
      ja: { translation: jaTranslations || enTranslations },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    lng: Localization.locale.split('-')[0],
  });

export default i18n;