// TODO: rethink later
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from './Locales/en';
import ru from './Locales/ru';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        // not sure, but anyway use spread syntax to remove links
        translations: { ...en },
      },
      ru: {
        translations: { ...ru },
      }
    },
    // fallbackLng: 'en',
    fallbackLng: 'ru',
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',
  });

export default i18n;
