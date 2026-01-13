import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languagedetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        lng: 'en',
        fallbackLng: 'en',
        supportedLngs: ['fr', 'en', 'ar', 'de', 'es', 'sv'],
        load: 'languageOnly', // This prevents loading fr-FR, en-US, etc. Only loads 'fr', 'en'
        debug: false, // Désactivé pour la production

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },

        react: {
            useSuspense: false, // Permet le chargement asynchrone
        },
    });

// Auto-detect RTL pour l'arabe
i18n.on('languageChanged', (lng) => {
    const direction = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
});

// Initialiser la direction au chargement
const currentLang = i18n.language || 'en';
if (currentLang === 'ar') {
    document.documentElement.dir = 'rtl';
} else {
    document.documentElement.dir = 'ltr';
}

export default i18n;
