
// ============================================================
// 1. INTERNATIONALIZATION (i18n) SERVICE
// ============================================================

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import express from 'express';

const router = express.Router();

// Initialize i18next
i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr', 'es', 'de', 'ja', 'ar'],
        preload: ['en', 'fr', 'es'],
        backend: {
            loadPath: './locales/{{lng}}/{{ns}}.json',
            addPath: './locales/{{lng}}/{{ns}}.missing.json'
        },
        detection: {
            order: ['querystring', 'cookie', 'header'],
            caches: ['cookie']
        },
        saveMissing: true
    });

export class I18nService {

    async translate(key, lng = 'en', options = {}) {
        return i18next.t(key, { lng, ...options });
    }

    async addTranslation(lng, namespace, key, value) {
        if (!i18next.hasResourceBundle(lng, namespace)) {
            i18next.addResourceBundle(lng, namespace, {});
        }
        i18next.addResource(lng, namespace, key, value);
    }

    getSupportedLanguages() {
        return i18next.languages;
    }
}

// Translations structure example (in-memory fallback/demo)
const translations = {
    en: {
        common: {
            welcome: 'Welcome to Cloud Nexus',
            dashboard: 'Dashboard',
            logout: 'Logout'
        }
    },
    fr: {
        common: {
            welcome: 'Bienvenue sur Cloud Nexus',
            dashboard: 'Tableau de bord',
            logout: 'Déconnexion'
        }
    }
};

// API Routes
router.get('/languages', (req, res) => {
    res.json({ languages: i18next.languages });
});

router.post('/translate', (req, res) => {
    const { key, lng, options } = req.body;
    res.json({ translation: i18next.t(key, { lng, ...options }) });
});

export const i18nService = new I18nService();
export default router;
