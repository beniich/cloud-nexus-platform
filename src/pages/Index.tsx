import React, { useState, useEffect } from 'react';
import { Cloud, Zap, Shield, Globe, ArrowRight, CheckCircle, Star, Users, TrendingUp, Sparkles, Code, Database, Lock, Rocket, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Infrastructure",
      description: "Déployez votre infrastructure en quelques clics",
      color: "from-orange-400 to-amber-500"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Site Builder",
      description: "Créez des sites web professionnels sans code",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Management",
      description: "Gérez vos données en toute sécurité",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security First",
      description: "Protection avancée de vos ressources",
      color: "from-amber-400 to-yellow-500"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime", icon: <TrendingUp /> },
    { number: "10K+", label: "Clients Actifs", icon: <Users /> },
    { number: "24/7", label: "Support", icon: <Sparkles /> },
    { number: "150+", label: "Pays", icon: <Globe /> }
  ];

  const features = [
    { icon: <Zap />, title: "Performance Maximale", desc: "Infrastructure optimisée pour des temps de réponse ultra-rapides" },
    { icon: <Lock />, title: "Sécurité Renforcée", desc: "Chiffrement de bout en bout et conformité RGPD" },
    { icon: <Rocket />, title: "Déploiement Rapide", desc: "Lancez vos projets en quelques minutes, pas en heures" },
    { icon: <Globe />, title: "Présence Mondiale", desc: "Datacenters répartis sur 5 continents" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 text-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-500"
          style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0005})` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="z-50 border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-300/50">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Cloud Nexus
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Services</a>
              <a href="#features" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Fonctionnalités</a>
              <a href="#pricing" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Tarifs</a>
              <Link to="/login" className="px-6 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200 font-medium">
                Connexion
              </Link>
              <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                Démarrer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center space-y-8"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.002)
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full text-sm shadow-sm">
              <Lightbulb className="w-4 h-4 text-orange-600" />
              <span className="text-slate-700 font-medium">Nouveau : Site Builder avec IA intégrée</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                Propulsez votre
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                entreprise vers le cloud
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Infrastructure cloud puissante, outils de développement intuitifs et support expert.
              Tout ce dont vous avez besoin pour réussir dans le digital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/login" className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-2xl hover:shadow-orange-400/50 transition-all transform hover:scale-105 flex items-center gap-2 font-semibold text-lg">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white border-2 border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all font-semibold text-lg">
                Voir la démo
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:bg-white transition-all group shadow-sm hover:shadow-lg"
                  style={{
                    transform: `translateY(${Math.max(0, scrollY * 0.05 - idx * 20)}px)`,
                  }}
                >
                  <div className="text-orange-500 mb-2 group-hover:scale-110 transition-transform inline-block">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section id="services" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center mb-16"
            style={{
              transform: `translateY(${Math.max(0, 300 - scrollY * 0.5)}px)`,
              opacity: Math.min(1, scrollY * 0.003)
            }}
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Services Cloud Complets
            </h2>
            <p className="text-slate-600 text-xl">Une plateforme, des possibilités infinies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`group p-8 rounded-2xl border transition-all duration-500 cursor-pointer ${activeService === idx
                  ? 'bg-white border-orange-300 scale-105 shadow-xl shadow-orange-200/50'
                  : 'bg-white/70 border-orange-200 hover:bg-white hover:shadow-lg'
                  }`}
                onMouseEnter={() => setActiveService(idx)}
                style={{
                  transform: `translateY(${Math.max(0, 400 - scrollY * 0.3 + idx * 20)}px)`,
                  opacity: Math.min(1, scrollY * 0.002)
                }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <div className="text-white">{service.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">{service.title}</h3>
                <p className="text-slate-600">{service.description}</p>
                <div className="mt-6 flex items-center gap-2 text-orange-500 group-hover:gap-3 transition-all font-medium">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className="space-y-8"
              style={{
                transform: `translateX(${Math.max(-100, -200 + scrollY * 0.2)}px)`,
                opacity: Math.min(1, (scrollY - 300) * 0.003)
              }}
            >
              <h2 className="text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Pourquoi choisir
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Cloud Nexus ?
                </span>
              </h2>

              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-6 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:bg-white transition-all group shadow-sm hover:shadow-lg"
                  style={{
                    transform: `translateX(${Math.max(-50, -100 + scrollY * 0.15 - idx * 10)}px)`,
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="relative"
              style={{
                transform: `translateX(${Math.max(-100, -200 + scrollY * 0.2)}px) scale(${Math.min(1, 0.8 + scrollY * 0.0003)})`,
                opacity: Math.min(1, (scrollY - 300) * 0.003)
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative p-8 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-3xl shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg text-slate-700">Infrastructure haute disponibilité</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg text-slate-700">Scaling automatique</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg text-slate-700">Monitoring en temps réel</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg text-slate-700">Backup automatique quotidien</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg text-slate-700">API RESTful complète</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg text-slate-700">Support prioritaire 24/7</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-slate-700 italic">
                    "Cloud Nexus a transformé notre infrastructure. Performance exceptionnelle et support réactif !"
                  </p>
                  <p className="text-slate-600 text-sm mt-4 font-medium">— Sarah L., CTO chez TechStart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative overflow-hidden p-12 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl"
            style={{
              transform: `scale(${Math.min(1, 0.9 + scrollY * 0.0001)})`,
              opacity: Math.min(1, (scrollY - 600) * 0.002)
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

            <div className="relative text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Prêt à propulser votre business ?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Rejoignez plus de 10 000 entreprises qui font confiance à Cloud Nexus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/login" className="group px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 font-semibold text-lg">
                  Essai gratuit 14 jours
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl hover:bg-white/30 transition-all font-semibold text-lg">
                  Parler à un expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <p className="text-slate-600">
                La plateforme cloud nouvelle génération pour les entreprises ambitieuses.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-800">Produits</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Cloud Hosting</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Site Builder</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Databases</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-800">Entreprise</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-800">Légal</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">RGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-orange-200 pt-8 text-center text-slate-600">
            <p>© 2025 Cloud Nexus Platform. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
