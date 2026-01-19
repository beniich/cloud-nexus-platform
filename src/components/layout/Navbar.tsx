import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../ui/LanguageSelector';

const Navbar = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Common links
    const links = [
        { href: '/', label: t('nav.home', 'Home') },
        { href: '/services', label: t('nav.services', 'Services') },
        { href: '/pricing', label: t('nav.pricing', 'Pricing') },
        { href: '/about', label: t('nav.about', 'About') },
        { href: '/blog', label: t('nav.blog', 'Blog') },
        { href: '/contact', label: t('nav.contact', 'Contact') }
    ];

    return (
        <nav className="z-50 border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-300/50">
                            <Cloud className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent hidden sm:block">
                            Cloud Nexus
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="text-slate-600 hover:text-orange-600 transition-colors font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        <LanguageSelector />

                        <Link
                            to="/login"
                            className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200 font-medium text-sm"
                        >
                            {t('nav.login', 'Login')}
                        </Link>
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium text-sm"
                        >
                            {t('nav.start', 'Get Started')}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <LanguageSelector />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-orange-100 bg-white px-6 py-4 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-5">
                    <div className="flex flex-col gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-slate-600 hover:text-orange-600 font-medium py-2 border-b border-slate-50 last:border-0"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Link
                                to="/login"
                                className="px-4 py-3 text-center bg-slate-100 rounded-lg font-medium"
                            >
                                {t('nav.login', 'Login')}
                            </Link>
                            <Link
                                to="/login"
                                className="px-4 py-3 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium shadow-lg"
                            >
                                {t('nav.start', 'Start')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
