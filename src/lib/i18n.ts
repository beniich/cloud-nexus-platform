import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
// In a larger app, these would be in separate JSON files
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services",
        features: "Features",
        pricing: "Pricing",
        about: "About",
        blog: "Blog",
        contact: "Contact",
        careers: "Careers",
        login: "Login",
        start: "Get Started"
      },
      footer: {
        rights: "© 2025 Cloud Nexus Platform. All rights reserved.",
        products: "Products",
        company: "Company",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        security: "Security",
        gdpr: "GDPR Compliance"
      },
      hero: {
        title_prefix: "Propel your",
        title_suffix: "business to the cloud",
        subtitle: "Powerful cloud infrastructure, intuitive developer tools, and expert support. Everything you need to succeed in the digital age.",
        cta_start: "Start for free",
        cta_demo: "View Demo",
        new_badge: "New: AI-Powered Site Builder"
      },
      common: {
        read_more: "Read more",
        subscribe: "Subscribe",
        search_placeholder: "Search...",
        apply_now: "Apply Now",
        view_offers: "View Openings"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        services: "Services",
        features: "Fonctionnalités",
        pricing: "Tarifs",
        about: "À propos",
        blog: "Blog",
        contact: "Contact",
        careers: "Carrières",
        login: "Connexion",
        start: "Démarrer"
      },
      footer: {
        rights: "© 2025 Cloud Nexus Platform. Tous droits réservés.",
        products: "Produits",
        company: "Entreprise",
        legal: "Légal",
        privacy: "Confidentialité",
        terms: "Conditions",
        security: "Sécurité",
        gdpr: "RGPD"
      },
      hero: {
        title_prefix: "Propulsez votre",
        title_suffix: "entreprise vers le cloud",
        subtitle: "Infrastructure cloud puissante, outils de développement intuitifs et support expert. Tout ce dont vous avez besoin pour réussir dans le digital.",
        cta_start: "Commencer gratuitement",
        cta_demo: "Voir la démo",
        new_badge: "Nouveau : Site Builder avec IA intégrée"
      },
      common: {
        read_more: "En savoir plus",
        subscribe: "S'abonner",
        search_placeholder: "Rechercher...",
        apply_now: "Postuler",
        view_offers: "Voir nos offres"
      }
    }
  },
  // Adding structure for other languages with English fallback for now
  es: { translation: { nav: { home: "Inicio", services: "Servicios", pricing: "Precios", contact: "Contacto", about: "Nosotros" } } },
  de: { translation: { nav: { home: "Startseite", services: "Dienstleistungen", pricing: "Preise", contact: "Kontakt", about: "Über uns" } } },
  it: { translation: { nav: { home: "Home", services: "Servizi", pricing: "Prezzi", contact: "Contatti", about: "Chi siamo" } } },
  pt: { translation: { nav: { home: "Início", services: "Serviços", pricing: "Preços", contact: "Contato", about: "Sobre" } } },
  zh: { translation: { nav: { home: "首页", services: "服务", pricing: "价格", contact: "联系我们", about: "关于我们" } } },
  ar: { translation: { nav: { home: "الرئيسية", services: "خدمات", pricing: "الأسعار", contact: "اتصل بنا", about: "من نحن" } } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // English is default
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
