import React, { useState } from 'react';
import { Cloud, Database, Shield, Code, Zap, Globe, Cpu, Server, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'compute', label: 'Compute' },
    { id: 'storage', label: 'Storage' },
    { id: 'network', label: 'Network' },
    { id: 'security', label: 'Security' }
  ];

  const services = [
    {
      id: 1,
      title: "Cloud Instances",
      description: "Virtual machines available on demand with fully configurable CPU/RAM performance.",
      icon: <Cpu className="w-8 h-8" />,
      category: "compute",
      price: "From €5/mo",
      features: ["99.9% Uptime", "SSD Storage", "DDoS Protection"]
    },
    {
      id: 2,
      title: "Managed Kubernetes",
      description: "Orchestrate your containerized applications effortlessly with our managed K8s service.",
      icon: <Cloud className="w-8 h-8" />,
      category: "compute",
      price: "From €20/mo",
      features: ["Auto-scaling", "Auto-healing", "Integrated Monitoring"]
    },
    {
      id: 3,
      title: "Block Storage",
      description: "High-performance persistent storage volumes for your instances.",
      icon: <Database className="w-8 h-8" />,
      category: "storage",
      price: "€0.05/GB/mo",
      features: ["NVMe Performance", "Snapshots", "Redundancy"]
    },
    {
      id: 4,
      title: "Object Storage",
      description: "S3-compatible scalable storage specifically for your static data and backups.",
      icon: <Server className="w-8 h-8" />,
      category: "storage",
      price: "€0.01/GB/mo",
      features: ["Unlimited API", "Global CDN", "Lifecycle Rules"]
    },
    {
      id: 5,
      title: "Load Balancer",
      description: "Distribute traffic across your instances to ensure performance and availability.",
      icon: <Globe className="w-8 h-8" />,
      category: "network",
      price: "€10/mo",
      features: ["SSL Termination", "Health Checks", "Anycast IP"]
    },
    {
      id: 6,
      title: "Private Networks",
      description: "Create isolated and secure networks between your cloud resources.",
      icon: <Lock className="w-8 h-8" />,
      category: "network",
      price: "Free",
      features: ["VLAN Isolation", "Low Latency", "Unlimited Traffic"]
    },
    {
      id: 7,
      title: "DDoS Protection",
      description: "Advanced protection against volumetric and application-layer attacks included by default.",
      icon: <Shield className="w-8 h-8" />,
      category: "security",
      price: "Included",
      features: ["Always-on", "L3/L4/L7", "Real-time Mitigation"]
    },
    {
      id: 8,
      title: "Managed Databases",
      description: "PostgreSQL, MySQL, and Redis databases managed, secured, and backed up automatically.",
      icon: <Code className="w-8 h-8" />,
      category: "storage",
      price: "From €15/mo",
      features: ["Auto-backups", "High Availability", "Point-in-time Recovery"]
    }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Our Cloud
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Scalable infrastructure and powerful tools to build, deploy, and scale your applications globally.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'bg-white border border-orange-200 text-slate-600 hover:bg-orange-50'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 min-h-[60px]">{service.description}</p>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-orange-100">
                  <div className="text-lg font-bold text-orange-600">{service.price}</div>
                  <Link to="/pricing" className="flex items-center gap-2 text-slate-600 hover:text-orange-600 font-medium transition-colors">
                    Deploy
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Need a custom solution?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Our architects are here to help you design the perfect infrastructure for your needs.
              </p>
              <Link to="/contact" className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
