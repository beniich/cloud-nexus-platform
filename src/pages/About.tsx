import React from 'react';
import { Cloud, Users, Target, Heart, Globe, Award, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    const stats = [
        { label: t('aboutPage.stats.clients'), value: "10k+" },
        { label: t('aboutPage.stats.countries'), value: "30+" },
        { label: t('aboutPage.stats.team'), value: "200+" },
        { label: t('aboutPage.stats.uptime'), value: "99.99%" }
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8 text-orange-500" />,
            title: t('aboutPage.values.innovation.title'),
            description: t('aboutPage.values.innovation.desc')
        },
        {
            icon: <Heart className="w-8 h-8 text-orange-500" />,
            title: t('aboutPage.values.engagement.title'),
            description: t('aboutPage.values.engagement.desc')
        },
        {
            icon: <Users className="w-8 h-8 text-orange-500" />,
            title: t('aboutPage.values.transparency.title'),
            description: t('aboutPage.values.transparency.desc')
        },
        {
            icon: <Globe className="w-8 h-8 text-orange-500" />,
            title: t('aboutPage.values.sustainability.title'),
            description: t('aboutPage.values.sustainability.desc')
        }
    ];

    const team = [
        {
            name: "Thomas Dubois",
            role: "CEO & Founder",
            image: "https://i.pravatar.cc/300?img=11"
        },
        {
            name: "Sarah Martin",
            role: "CTO",
            image: "https://i.pravatar.cc/300?img=5"
        },
        {
            name: "Alexandre Chen",
            role: "Head of Product",
            image: "https://i.pravatar.cc/300?img=3"
        },
        {
            name: "Marie Laurent",
            role: "VP Engineering",
            image: "https://i.pravatar.cc/300?img=9"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navigation */}
            <nav className="border-b border-orange-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Logo size="lg" />
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.home')}</Link>
                            <Link to="/services" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.services')}</Link>
                            <Link to="/about" className="text-orange-600 font-bold">{t('navbar.about')}</Link>
                            <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.contact')}</Link>
                            <button className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium">
                                {t('aboutPage.nav.join')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50 to-transparent -z-10" />
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100/50 text-orange-700 rounded-full text-sm font-semibold border border-orange-200">
                                <span>{t('aboutPage.hero.badge')}</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                                {t('aboutPage.hero.title')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                                    {t('aboutPage.hero.titleHighlight')}
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                {t('aboutPage.hero.desc')}
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Link to="/careers" className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-bold flex items-center gap-2">
                                    {t('aboutPage.hero.cta')}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                                    alt="Team collaboration"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-orange-100 hidden lg:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{t('aboutPage.cert.title')}</p>
                                        <p className="text-sm text-slate-500">{t('aboutPage.cert.desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-6 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('aboutPage.values.title')}</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {t('aboutPage.values.subtitle')}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <div key={idx} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all group">
                                <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('aboutPage.team.title')}</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {t('aboutPage.team.subtitle')}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all">
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <div className="text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <p className="font-bold text-lg">{member.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                    <p className="text-orange-600 font-medium">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-12 px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center text-slate-600">
                    <p>© 2025 Cloud Nexus Platform. {t('footer.allRightsReserved')}</p>
                </div>
            </footer>
        </div>
    );
};

export default About;
