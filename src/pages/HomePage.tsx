import React, { useEffect, useRef, useState } from 'react';
import { Shield, Zap, TrendingUp, Users, Cloud, ArrowRight, CheckCircle, Lock, Server, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Shield className="w-8 h-8 text-orange-500" />,
            title: t('new_home.features.security.title'),
            description: t('new_home.features.security.desc')
        },
        {
            icon: <Zap className="w-8 h-8 text-orange-500" />,
            title: t('new_home.features.performance.title'),
            description: t('new_home.features.performance.desc')
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
            title: t('new_home.features.scalability.title'),
            description: t('new_home.features.scalability.desc')
        }
    ];

    const stats = [
        { value: "99.99%", label: t('new_home.stats.availability') },
        { value: "500+", label: t('new_home.stats.clients') },
        { value: "50ms", label: t('new_home.stats.latency') },
        { value: "24/7", label: t('new_home.stats.support') }
    ];

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Navbar with floating effect */}
            {/* Navbar with floating effect */}



            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
                    {/* Left: Logo & Phrase */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <Logo size="md" variant={scrollY > 50 ? 'light' : 'light'} />
                        </Link>
                        <div className="hidden xl:block w-px h-8 bg-slate-200"></div>
                        <span className="hidden xl:block text-xs font-medium text-slate-500 max-w-[150px] leading-tight">
                            Solutions digitales et services cloud
                        </span>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link to="/" className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors">{t('navbar.home')}</Link>
                        <Link to="/services" className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors">{t('navbar.services')}</Link>
                        <Link to="/pricing" className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors">{t('navbar.pricing')}</Link>
                        <Link to="/about" className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors">{t('navbar.about')}</Link>
                    </div>

                    {/* Right: CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/contact" className="px-5 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium">
                            {t('navbar.contact')}
                        </Link>
                        <Link to="/login" className="px-5 py-2 text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 font-medium">
                            {t('navbar.clientArea')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent -z-10" />
                <div className="absolute top-20 right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse -z-10" />
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold shadow-sm border border-orange-200">
                                <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping" />
                                {t('new_home.hero.update_badge')}
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-slate-900">
                                {t('new_home.hero.title_prefix')} <br />
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{t('new_home.hero.title_highlight')}</span>
                            </h1>

                            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                                {t('new_home.hero.description')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/40 transition-all transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-2">
                                    {t('new_home.hero.start_free')}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/services" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-orange-200 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                    {t('new_home.hero.view_services')}
                                </Link>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-500 pt-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden z-${10 - i}`}>
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p>{t('new_home.hero.joined_by')}</p>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
                            {/* 3D-like Dashboard Preview */}
                            <div className="relative w-full max-w-lg aspect-[4/3] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 group">
                                <div className="absolute top-0 left-0 w-full h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="p-6 pt-16 space-y-4 bg-slate-50 h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-32 h-8 bg-slate-200 rounded animate-pulse" />
                                        <div className="w-24 h-8 bg-orange-100 rounded animate-pulse" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-32 bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg mb-4" />
                                            <div className="w-16 h-4 bg-slate-100 rounded mb-2" />
                                            <div className="w-20 h-6 bg-slate-200 rounded" />
                                        </div>
                                        <div className="h-32 bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg mb-4" />
                                            <div className="w-16 h-4 bg-slate-100 rounded mb-2" />
                                            <div className="w-20 h-6 bg-slate-200 rounded" />
                                        </div>
                                        <div className="h-32 bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg mb-4" />
                                            <div className="w-16 h-4 bg-slate-100 rounded mb-2" />
                                            <div className="w-20 h-6 bg-slate-200 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-48 bg-white rounded-xl shadow-sm border border-slate-100 mt-6 overflow-hidden relative">
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-50 to-transparent" />
                                        <div className="w-full h-full flex items-end justify-between px-4 pb-4">
                                            {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                                                <div key={i} style={{ height: `${h}%` }} className="w-8 bg-orange-400/80 rounded-t-sm" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -right-12 top-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{t('new_home.dashboard_preview.deployment_success')}</p>
                                            <p className="text-xs text-slate-500">2 min ago</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -left-8 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float-delayed">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Server className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{t('new_home.dashboard_preview.server_optimized')}</p>
                                            <p className="text-xs text-slate-500">CPU: 45%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -z-10" />

                        <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="pt-8 md:pt-0 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-400 font-medium tracking-wide uppercase text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900">
                            {t('new_home.features.why_choose')} <span className="text-orange-600">Cloud Nexus</span> ?
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {t('new_home.features.why_choose_subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    {t('new_home.features.learn_more')} <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                                {t('new_home.infrastructure.title')} <br />
                                <span className="text-orange-600">{t('new_home.infrastructure.title_highlight')}</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: t('new_home.infrastructure.deploy_click.title'), desc: t('new_home.infrastructure.deploy_click.desc') },
                                    { title: t('new_home.infrastructure.monitoring.title'), desc: t('new_home.infrastructure.monitoring.desc') },
                                    { title: t('new_home.infrastructure.support.title'), desc: t('new_home.infrastructure.support.desc') }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                        <div className="mt-1">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                                alt="Dashboard"
                                className="rounded-2xl w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
                            {t('new_home.cta.title')}
                        </h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
                            {t('new_home.cta.subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1">
                                {t('new_home.cta.start_trial')}
                            </Link>
                            <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                                {t('new_home.cta.talk_expert')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-4">
                            <Link to="/" className="flex items-center gap-2">
                                <Logo size="sm" />
                            </Link>
                            <p className="text-slate-600 leading-relaxed">
                                {t('new_home.features.why_choose_subtitle')}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">{t('footer.product')}</h4>
                            <ul className="space-y-4 text-slate-600">
                                <li><Link to="/services" className="hover:text-orange-600 transition-colors">{t('navbar.services')}</Link></li>
                                <li><Link to="/pricing" className="hover:text-orange-600 transition-colors">{t('navbar.pricing')}</Link></li>
                                <li><Link to="/careers" className="hover:text-orange-600 transition-colors">{t('footer.careers')}</Link></li>
                                <li><Link to="/blog" className="hover:text-orange-600 transition-colors">{t('footer.blog')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">{t('footer.legal')}</h4>
                            <ul className="space-y-4 text-slate-600">
                                <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.legalNotice')}</Link></li>
                                <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.privacy')}</Link></li>
                                <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.terms')}</Link></li>
                                <li><Link to="/legal" className="hover:text-orange-600 transition-colors">{t('footer.security')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">{t('footer.contactUs')}</h4>
                            <ul className="space-y-4 text-slate-600">
                                <li className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-orange-500" />
                                    Paris, France
                                </li>
                                <li>support@cloudnexus.com</li>
                                <li>+33 1 23 45 67 89</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 text-center text-slate-500">
                        <p>© 2025 Cloud Nexus Platform. {t('footer.allRightsReserved')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
