import React, { useState } from 'react';
import { Cloud, Code, Database, Shield, Server, Globe, Zap, Lock, BarChart, Cpu, HardDrive, Wifi, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('servicesPage.categories.all'), icon: <Globe className="w-5 h-5" /> },
    { id: 'infrastructure', label: t('servicesPage.categories.infrastructure'), icon: <Server className="w-5 h-5" /> },
    { id: 'development', label: t('servicesPage.categories.development'), icon: <Code className="w-5 h-5" /> },
    { id: 'security', label: t('servicesPage.categories.security'), icon: <Shield className="w-5 h-5" /> },
    { id: 'data', label: t('servicesPage.categories.data'), icon: <Database className="w-5 h-5" /> }
  ];

  const services = [
    {
      category: 'infrastructure',
      icon: <Cloud className="w-12 h-12" />,
      title: t('servicesPage.services.cloudHosting.title'),
      description: t('servicesPage.services.cloudHosting.desc'),
      features: t('servicesPage.services.cloudHosting.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '9€' }) + t('servicesPage.pricing.perMonth'),
      popular: true
    },
    {
      category: 'infrastructure',
      icon: <Server className="w-12 h-12" />,
      title: t('servicesPage.services.dedicatedServers.title'),
      description: t('servicesPage.services.dedicatedServers.desc'),
      features: t('servicesPage.services.dedicatedServers.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '79€' }) + t('servicesPage.pricing.perMonth')
    },
    {
      category: 'development',
      icon: <Code className="w-12 h-12" />,
      title: t('servicesPage.services.siteBuilder.title'),
      description: t('servicesPage.services.siteBuilder.desc'),
      features: t('servicesPage.services.siteBuilder.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '19€' }) + t('servicesPage.pricing.perMonth'),
      popular: true
    },
    {
      category: 'development',
      icon: <Cpu className="w-12 h-12" />,
      title: t('servicesPage.services.apiManagement.title'),
      description: t('servicesPage.services.apiManagement.desc'),
      features: t('servicesPage.services.apiManagement.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '29€' }) + t('servicesPage.pricing.perMonth')
    },
    {
      category: 'data',
      icon: <Database className="w-12 h-12" />,
      title: t('servicesPage.services.databases.title'),
      description: t('servicesPage.services.databases.desc'),
      features: t('servicesPage.services.databases.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '15€' }) + t('servicesPage.pricing.perMonth')
    },
    {
      category: 'data',
      icon: <HardDrive className="w-12 h-12" />,
      title: t('servicesPage.services.objectStorage.title'),
      description: t('servicesPage.services.objectStorage.desc'),
      features: t('servicesPage.services.objectStorage.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.perGbMonth')
    },
    {
      category: 'security',
      icon: <Shield className="w-12 h-12" />,
      title: t('servicesPage.services.ddosProtection.title'),
      description: t('servicesPage.services.ddosProtection.desc'),
      features: t('servicesPage.services.ddosProtection.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '49€' }) + t('servicesPage.pricing.perMonth'),
      popular: true
    },
    {
      category: 'security',
      icon: <Lock className="w-12 h-12" />,
      title: t('servicesPage.services.managedFirewall.title'),
      description: t('servicesPage.services.managedFirewall.desc'),
      features: t('servicesPage.services.managedFirewall.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '25€' }) + t('servicesPage.pricing.perMonth')
    },
    {
      category: 'infrastructure',
      icon: <Wifi className="w-12 h-12" />,
      title: t('servicesPage.services.loadBalancing.title'),
      description: t('servicesPage.services.loadBalancing.desc'),
      features: t('servicesPage.services.loadBalancing.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '35€' }) + t('servicesPage.pricing.perMonth')
    },
    {
      category: 'data',
      icon: <BarChart className="w-12 h-12" />,
      title: t('servicesPage.services.analytics.title'),
      description: t('servicesPage.services.analytics.desc'),
      features: t('servicesPage.services.analytics.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '19€' }) + t('servicesPage.pricing.perMonth')
    },
    {
      category: 'development',
      icon: <Zap className="w-12 h-12" />,
      title: t('servicesPage.services.serverless.title'),
      description: t('servicesPage.services.serverless.desc'),
      features: t('servicesPage.services.serverless.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.payAsYouGo')
    },
    {
      category: 'infrastructure',
      icon: <Globe className="w-12 h-12" />,
      title: t('servicesPage.services.cdn.title'),
      description: t('servicesPage.services.cdn.desc'),
      features: t('servicesPage.services.cdn.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '0.05€/GB' })
    }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Navigation */}


      <nav className="border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.home')}</Link>
              <Link to="/services" className="text-orange-600 font-semibold">{t('navbar.services')}</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.pricing')}</Link>
              <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.contact')}</Link>
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                {t('common.create')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {t('servicesPage.title')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {t('servicesPage.subtitle')}
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('servicesPage.desc')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-400/50'
                  : 'bg-white border border-orange-200 text-slate-700 hover:bg-orange-50'
                  }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <div
                key={idx}
                className="group relative p-8 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2"
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                    ⭐ {t('servicesPage.labels.popular')}
                  </div>
                )}

                <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg text-white">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3 text-slate-800">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-orange-200 pt-6 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{t('servicesPage.labels.price')}</p>
                      <p className="text-xl font-bold text-orange-600">{service.price}</p>
                    </div>
                    <Link
                      to={`/hosting-request?type=${service.title === 'Cloud Hosting' ? 'cloud' : service.title === 'Serveurs Dédiés' ? 'dedicated' : 'shared'}`}
                      className="group/btn px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                    >
                      {t('servicesPage.labels.choose')}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden p-12 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('servicesPage.cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('servicesPage.cta.subtitle')}
            </p>
            <button className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg">
              {t('servicesPage.cta.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 py-12 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-slate-600">
          <p>© 2025 Cloud Nexus Platform. {t('footer.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Services;
