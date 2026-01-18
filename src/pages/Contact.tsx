import React, { useState } from 'react';
import { Cloud, Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '', subject: 'general', message: '' });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "contact@cloudnexus.com",
      description: "Réponse sous 24h"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      value: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Chat en direct",
      value: "Disponible maintenant",
      description: "Réponse immédiate"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      value: "123 Avenue des Champs-Élysées",
      description: "75008 Paris, France"
    }
  ];

  const subjects = [
    { value: 'general', label: 'Question générale' },
    { value: 'sales', label: 'Ventes & Devis' },
    { value: 'support', label: 'Support technique' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'billing', label: 'Facturation' },
    { value: 'other', label: 'Autre' }
  ];

  const reasons = [
    {
      icon: <Headphones className="w-12 h-12" />,
      title: "Support Expert",
      description: "Notre équipe technique répond à toutes vos questions"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Réponse Rapide",
      description: "Nous nous engageons à répondre sous 24h maximum"
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Solutions Sur Mesure",
      description: "Des recommandations adaptées à vos besoins"
    }
  ];

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
              <Link to="/services" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Services</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Tarifs</Link>
              <Link to="/contact" className="text-orange-600 font-semibold">Contact</Link>
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
              Contactez
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Notre Équipe
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Une question ? Un projet ? Notre équipe est là pour vous accompagner dans votre transformation digitale.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, idx) => (
              <div key={idx} className="p-6 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-lg transition-all text-center group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-4 mx-auto text-white group-hover:scale-110 transition-transform shadow-lg">
                  {method.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{method.title}</h3>
                <p className="text-orange-600 font-semibold mb-1">{method.value}</p>
                <p className="text-slate-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">Envoyez-nous un message</h2>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Message envoyé !</h3>
                  <p className="text-slate-600 mb-6">
                    Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        placeholder="john@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      placeholder="Votre entreprise"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Sujet *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    >
                      {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none"
                      placeholder="Décrivez votre projet ou votre question..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-orange-400/50 transition-all flex items-center justify-center gap-2 group"
                  >
                    Envoyer le message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-slate-600 text-sm text-center">
                    En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Why Contact Us */}
              <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Pourquoi nous contacter ?</h3>
                <div className="space-y-6">
                  {reasons.map((reason, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                        {reason.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">{reason.title}</h4>
                        <p className="text-slate-600 text-sm">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-8 shadow-2xl text-white">
                <h3 className="text-2xl font-bold mb-6">Horaires d'ouverture</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-3 border-b border-white/30">
                    <span className="font-medium">Lundi - Vendredi</span>
                    <span className="font-bold">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/30">
                    <span className="font-medium">Samedi</span>
                    <span className="font-bold">10h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dimanche</span>
                    <span className="font-bold">Fermé</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-sm">
                    ⚡ Support d'urgence disponible 24/7 pour les clients Enterprise
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl overflow-hidden shadow-xl">
                <div className="h-64 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                    <p className="text-slate-700 font-medium">123 Avenue des Champs-Élysées</p>
                    <p className="text-slate-600">75008 Paris, France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-orange-100 border border-orange-200 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Vous n'avez pas trouvé la réponse à votre question ?
            </h3>
            <p className="text-slate-600 mb-6">
              Consultez notre centre d'aide ou notre FAQ pour trouver rapidement des réponses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:shadow-lg transition-all border border-orange-200">
                Centre d'aide
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                Consulter la FAQ
              </button>
            </div>
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

export default ContactPage;
