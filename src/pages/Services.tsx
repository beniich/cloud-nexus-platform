import React, { useState } from 'react';
import { 
  Cloud, Code, Database, Shield, Server, Globe, Zap, Lock, 
  BarChart, Cpu, HardDrive, Wifi, ArrowRight, CheckCircle, 
  Star, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('servicesPage.categories.all'), icon: Globe },
    { id: 'infrastructure', label: t('servicesPage.categories.infrastructure'), icon: Server },
    { id: 'development', label: t('servicesPage.categories.development'), icon: Code },
    { id: 'security', label: t('servicesPage.categories.security'), icon: Shield },
    { id: 'data', label: t('servicesPage.categories.data'), icon: Database }
  ];

  const accentColors = {
    cyan: {
      icon: 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      border: 'group-hover:border-cyan-500/50',
      price: 'text-cyan-400',
      glow: 'from-cyan-500 to-cyan-600',
    },
    purple: {
      icon: 'bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      border: 'group-hover:border-purple-500/50',
      price: 'text-purple-400',
      glow: 'from-purple-500 to-purple-600',
    },
    green: {
      icon: 'bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      border: 'group-hover:border-green-500/50',
      price: 'text-green-400',
      glow: 'from-green-500 to-green-600',
    },
  };

  const services = [
    {
      category: 'infrastructure',
      icon: Cloud,
      title: t('servicesPage.services.cloudHosting.title'),
      description: t('servicesPage.services.cloudHosting.desc'),
      features: t('servicesPage.services.cloudHosting.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '9€' }) + t('servicesPage.pricing.perMonth'),
      popular: true,
      accentColor: 'cyan' as const
    },
    {
      category: 'infrastructure',
      icon: Server,
      title: t('servicesPage.services.dedicatedServers.title'),
      description: t('servicesPage.services.dedicatedServers.desc'),
      features: t('servicesPage.services.dedicatedServers.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '79€' }) + t('servicesPage.pricing.perMonth'),
      accentColor: 'purple' as const
    },
    {
      category: 'development',
      icon: Code,
      title: t('servicesPage.services.siteBuilder.title'),
      description: t('servicesPage.services.siteBuilder.desc'),
      features: t('servicesPage.services.siteBuilder.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '19€' }) + t('servicesPage.pricing.perMonth'),
      popular: true,
      accentColor: 'green' as const
    },
    {
      category: 'development',
      icon: Cpu,
      title: t('servicesPage.services.apiManagement.title'),
      description: t('servicesPage.services.apiManagement.desc'),
      features: t('servicesPage.services.apiManagement.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '29€' }) + t('servicesPage.pricing.perMonth'),
      accentColor: 'cyan' as const
    },
    {
      category: 'data',
      icon: Database,
      title: t('servicesPage.services.databases.title'),
      description: t('servicesPage.services.databases.desc'),
      features: t('servicesPage.services.databases.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '15€' }) + t('servicesPage.pricing.perMonth'),
      accentColor: 'purple' as const
    },
    {
      category: 'data',
      icon: HardDrive,
      title: t('servicesPage.services.objectStorage.title'),
      description: t('servicesPage.services.objectStorage.desc'),
      features: t('servicesPage.services.objectStorage.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.perGbMonth'),
      accentColor: 'green' as const
    },
    {
      category: 'security',
      icon: Shield,
      title: t('servicesPage.services.ddosProtection.title'),
      description: t('servicesPage.services.ddosProtection.desc'),
      features: t('servicesPage.services.ddosProtection.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '49€' }) + t('servicesPage.pricing.perMonth'),
      popular: true,
      accentColor: 'green' as const
    },
    {
      category: 'security',
      icon: Lock,
      title: t('servicesPage.services.managedFirewall.title'),
      description: t('servicesPage.services.managedFirewall.desc'),
      features: t('servicesPage.services.managedFirewall.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '25€' }) + t('servicesPage.pricing.perMonth'),
      accentColor: 'cyan' as const
    },
    {
      category: 'infrastructure',
      icon: Wifi,
      title: t('servicesPage.services.loadBalancing.title'),
      description: t('servicesPage.services.loadBalancing.desc'),
      features: t('servicesPage.services.loadBalancing.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '35€' }) + t('servicesPage.pricing.perMonth'),
      accentColor: 'purple' as const
    },
    {
      category: 'data',
      icon: BarChart,
      title: t('servicesPage.services.analytics.title'),
      description: t('servicesPage.services.analytics.desc'),
      features: t('servicesPage.services.analytics.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '19€' }) + t('servicesPage.pricing.perMonth'),
      accentColor: 'cyan' as const
    },
    {
      category: 'development',
      icon: Zap,
      title: t('servicesPage.services.serverless.title'),
      description: t('servicesPage.services.serverless.desc'),
      features: t('servicesPage.services.serverless.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.payAsYouGo'),
      accentColor: 'purple' as const
    },
    {
      category: 'infrastructure',
      icon: Globe,
      title: t('servicesPage.services.cdn.title'),
      description: t('servicesPage.services.cdn.desc'),
      features: t('servicesPage.services.cdn.features', { returnObjects: true }) as string[],
      price: t('servicesPage.pricing.from', { price: '0.05€/GB' }),
      accentColor: 'cyan' as const
    }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 dots-background opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#0a0e27]/50 to-[#0a0e27]" />

      {/* Navigation */}
      <nav className="relative border-b border-white/10 backdrop-blur-xl bg-[#1a1f3a]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                {t('navbar.home')}
              </Link>
              <Link to="/services" className="text-cyan-400 font-semibold">
                {t('navbar.services')}
              </Link>
              <Link to="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                {t('navbar.pricing')}
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                {t('navbar.contact')}
              </Link>
              <button className="group relative px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 
                               text-white font-medium shadow-[0_0_30px_rgba(6,182,212,0.5)]
                               hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] transition-all">
                <span className="relative z-10">{t('common.create')}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
                        bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Services Cloud de Nouvelle Génération</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">
              {t('servicesPage.title')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 
                           bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
              {t('servicesPage.subtitle')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('servicesPage.desc')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium 
                            transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400'
                  }`}
                >
                  {!isActive && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 
                                  rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition duration-500" />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => {
              const Icon = service.icon;
              const colors = accentColors[service.accentColor];
              
              return (
                <div
                  key={idx}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow}
                                  rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition duration-500`} />

                  {/* Card */}
                  <div className={`relative h-full bg-[#1a1f3a] backdrop-blur-xl bg-opacity-70
                                  border border-white/10 ${colors.border}
                                  rounded-xl p-6 sm:p-8 transition-all duration-300
                                  group-hover:transform group-hover:scale-[1.02]`}>
                    
                    {/* Popular badge */}
                    {service.popular && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full
                                    bg-gradient-to-r from-yellow-500 to-orange-500 
                                    text-white text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {t('servicesPage.labels.popular')}
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6
                                    ${colors.icon} transition-transform duration-300
                                    group-hover:scale-110`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price & CTA */}
                    <div className="border-t border-white/10 pt-6 mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{t('servicesPage.labels.price')}</p>
                          <p className={`text-xl font-bold ${colors.price}`}>
                            {service.price}
                          </p>
                        </div>
                        <Link
                          to={`/hosting-request?type=${service.title === 'Cloud Hosting' ? 'cloud' : service.title === 'Serveurs Dédiés' ? 'dedicated' : 'shared'}`}
                          className="group/btn px-4 py-2 rounded-lg bg-white/5 border border-white/10
                                   hover:bg-white/10 hover:border-cyan-500/50
                                   text-cyan-400 font-medium transition-all flex items-center gap-2"
                        >
                          {t('servicesPage.labels.choose')}
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden p-12 rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27]
                        border border-cyan-500/20 text-center">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" 
                   style={{
                     backgroundImage: `radial-gradient(circle, rgba(6,182,212,0.3) 1px, transparent 1px)`,
                     backgroundSize: '50px 50px'
                   }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500
                            flex items-center justify-center mx-auto mb-6
                            shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-4xl font-black text-white mb-4">
                {t('servicesPage.cta.title')}
              </h2>
              
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                {t('servicesPage.cta.subtitle')}
              </p>
              
              <button className="group px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600
                               text-white font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.5)]
                               hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] transition-all
                               relative overflow-hidden">
                <span className="relative z-10">{t('servicesPage.cta.button')}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6 bg-[#1a1f3a]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 Cloud Nexus Platform. {t('footer.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Services;
