import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './Locales/en';
import ru from './Locales/ru';

// The site is published in Russian only (see `i18n.locales` in next.config.js).
// The language is fixed rather than detected from the browser: detection ran
// only on the client, so a visitor with an English browser got Russian HTML
// from the server and English text after hydration, which broke hydration.
i18n.use(initReactI18next).init({
  resources: {
    en: { translations: { ...en } },
    ru: { translations: { ...ru } },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  ns: ['translations'],
  defaultNS: 'translations',
});

export default i18n;
