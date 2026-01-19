import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="relative z-10 border-t border-orange-200 py-12 px-6 mt-20 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-300/50">
                                <Cloud className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">Cloud Nexus</span>
                        </div>
                        <p className="text-slate-600 text-sm">
                            {t('hero.subtitle', 'Powerful cloud infrastructure for ambitious companies.')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-slate-800">{t('footer.products', 'Products')}</h4>
                        <ul className="space-y-2 text-slate-600 text-sm">
                            <li><Link to="/services" className="hover:text-orange-600 transition-colors">Cloud Hosting</Link></li>
                            <li><Link to="/services" className="hover:text-orange-600 transition-colors">Site Builder</Link></li>
                            <li><Link to="/services" className="hover:text-orange-600 transition-colors">Databases</Link></li>
                            <li><Link to="/services" className="hover:text-orange-600 transition-colors">Analytics</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-slate-800">{t('footer.company', 'Company')}</h4>
                        <ul className="space-y-2 text-slate-600 text-sm">
                            <li><Link to="/about" className="hover:text-orange-600 transition-colors">{t('nav.about', 'About')}</Link></li>
                            <li><Link to="/careers" className="hover:text-orange-600 transition-colors">{t('nav.careers', 'Careers')}</Link></li>
                            <li><Link to="/blog" className="hover:text-orange-600 transition-colors">{t('nav.blog', 'Blog')}</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-600 transition-colors">{t('nav.contact', 'Contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-slate-800">{t('footer.legal', 'Legal')}</h4>
                        <ul className="space-y-2 text-slate-600 text-sm">
                            <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.privacy', 'Privacy Policy')}</Link></li>
                            <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.terms', 'Terms of Service')}</Link></li>
                            <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.security', 'Security')}</Link></li>
                            <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.gdpr', 'GDPR')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-orange-200 pt-8 text-center text-slate-600 text-sm">
                    <p>{t('footer.rights', '© 2025 Cloud Nexus Platform. All rights reserved.')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
