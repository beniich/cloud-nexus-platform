import React, { useState } from 'react';
import { Cloud, Code, Database, Shield, Server, Globe, Zap, Lock, BarChart, Cpu, HardDrive, Wifi, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tous les Services', icon: <Globe className="w-5 h-5" /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Server className="w-5 h-5" /> },
    { id: 'development', label: 'Développement', icon: <Code className="w-5 h-5" /> },
    { id: 'security', label: 'Sécurité', icon: <Shield className="w-5 h-5" /> },
    { id: 'data', label: 'Données', icon: <Database className="w-5 h-5" /> }
  ];

  const services = [
    {
      category: 'infrastructure',
      icon: <Cloud className="w-12 h-12" />,
      title: "Cloud Hosting",
      description: "Hébergement cloud haute performance avec garantie 99.9% uptime",
      features: [
        "Serveurs SSD ultra-rapides",
        "Scaling automatique",
        "CDN mondial inclus",
        "Backup quotidien automatique",
        "Support 24/7"
      ],
      price: "À partir de 9€/mois",
      popular: true
    },
    {
      category: 'infrastructure',
      icon: <Server className="w-12 h-12" />,
      title: "Serveurs Dédiés",
      description: "Serveurs dédiés personnalisables pour des performances maximales",
      features: [
        "Ressources 100% dédiées",
        "Configuration sur mesure",
        "Accès root complet",
        "RAID pour sécurité des données",
        "IP dédiée"
      ],
      price: "À partir de 79€/mois"
    },
    {
      category: 'development',
      icon: <Code className="w-12 h-12" />,
      title: "Site Builder",
      description: "Créez des sites professionnels sans coder avec notre éditeur IA",
      features: [
        "Éditeur drag & drop intuitif",
        "100+ templates premium",
        "IA pour génération de contenu",
        "SEO optimisé automatiquement",
        "Responsive design"
      ],
      price: "À partir de 19€/mois",
      popular: true
    },
    {
      category: 'development',
      icon: <Cpu className="w-12 h-12" />,
      title: "API Management",
      description: "Gérez et sécurisez vos APIs avec notre plateforme complète",
      features: [
        "Gateway API haute performance",
        "Authentification avancée",
        "Rate limiting & throttling",
        "Analytics en temps réel",
        "Documentation automatique"
      ],
      price: "À partir de 29€/mois"
    },
    {
      category: 'data',
      icon: <Database className="w-12 h-12" />,
      title: "Bases de Données",
      description: "Solutions de bases de données managées et optimisées",
      features: [
        "PostgreSQL, MySQL, MongoDB",
        "Réplication automatique",
        "Backups continus",
        "Scaling vertical & horizontal",
        "Monitoring avancé"
      ],
      price: "À partir de 15€/mois"
    },
    {
      category: 'data',
      icon: <HardDrive className="w-12 h-12" />,
      title: "Object Storage",
      description: "Stockage illimité pour vos fichiers et médias",
      features: [
        "99.99% durabilité",
        "Compatible S3",
        "CDN intégré",
        "Versioning des fichiers",
        "Chiffrement automatique"
      ],
      price: "0.02€/GB/mois"
    },
    {
      category: 'security',
      icon: <Shield className="w-12 h-12" />,
      title: "DDoS Protection",
      description: "Protection avancée contre les attaques DDoS",
      features: [
        "Détection en temps réel",
        "Mitigation automatique",
        "Jusqu'à 10 Tbps de protection",
        "Analytics des menaces",
        "Certificats SSL gratuits"
      ],
      price: "À partir de 49€/mois",
      popular: true
    },
    {
      category: 'security',
      icon: <Lock className="w-12 h-12" />,
      title: "Firewall Managé",
      description: "Pare-feu intelligent avec règles personnalisables",
      features: [
        "Règles personnalisables",
        "IP whitelisting/blacklisting",
        "Protection WAF",
        "Logs détaillés",
        "Alertes instantanées"
      ],
      price: "À partir de 25€/mois"
    },
    {
      category: 'infrastructure',
      icon: <Wifi className="w-12 h-12" />,
      title: "Load Balancing",
      description: "Répartition intelligente de la charge sur vos serveurs",
      features: [
        "Algorithmes multiples",
        "Health checks automatiques",
        "SSL/TLS termination",
        "Session persistence",
        "Géo-routing"
      ],
      price: "À partir de 35€/mois"
    },
    {
      category: 'data',
      icon: <BarChart className="w-12 h-12" />,
      title: "Analytics & Monitoring",
      description: "Surveillance complète de votre infrastructure",
      features: [
        "Métriques en temps réel",
        "Alertes personnalisables",
        "Dashboards interactifs",
        "Logs centralisés",
        "Rapports automatiques"
      ],
      price: "À partir de 19€/mois"
    },
    {
      category: 'development',
      icon: <Zap className="w-12 h-12" />,
      title: "Serverless Functions",
      description: "Exécutez du code sans gérer de serveurs",
      features: [
        "Auto-scaling instantané",
        "Facturation à la milliseconde",
        "Support multi-langages",
        "Déploiement Git intégré",
        "Edge computing"
      ],
      price: "Pay-as-you-go"
    },
    {
      category: 'infrastructure',
      icon: <Globe className="w-12 h-12" />,
      title: "CDN Global",
      description: "Réseau de distribution de contenu ultra-rapide",
      features: [
        "150+ points de présence",
        "Cache intelligent",
        "Compression automatique",
        "HTTP/3 & QUIC",
        "Real-time purging"
      ],
      price: "À partir de 0.05€/GB"
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
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-300/50">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Cloud Nexus
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Accueil</Link>
              <Link to="/services" className="text-orange-600 font-semibold">Services</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Tarifs</Link>
              <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Contact</Link>
              <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                Démarrer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Nos Services
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Cloud Complets
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Des solutions cloud puissantes et flexibles pour propulser votre entreprise vers le succès digital
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
                    ⭐ Populaire
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
                      <p className="text-sm text-slate-600">Prix</p>
                      <p className="text-xl font-bold text-orange-600">{service.price}</p>
                    </div>
                    <button className="group/btn px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium">
                      Choisir
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
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
              Besoin d'une solution personnalisée ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Notre équipe d'experts est là pour concevoir une infrastructure sur mesure adaptée à vos besoins
            </p>
            <Link to="/contact" className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg inline-block">
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 py-12 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-slate-600">
          <p>© 2025 Cloud Nexus Platform. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
