import React, { useState } from 'react';
import { Cloud, Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
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
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contactPage.methods.email.title'),
      value: "contact@cloudnexus.com",
      description: t('contactPage.methods.email.desc')
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contactPage.methods.phone.title'),
      value: "+33 1 23 45 67 89",
      description: t('contactPage.methods.phone.desc')
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('contactPage.methods.chat.title'),
      value: t('contactPage.methods.chat.value'),
      description: t('contactPage.methods.chat.desc')
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contactPage.methods.address.title'),
      value: "123 Avenue des Champs-Élysées",
      description: "75008 Paris, France"
    }
  ];

  const subjects = [
    { value: 'general', label: t('contactPage.form.subjects.general') },
    { value: 'sales', label: t('contactPage.form.subjects.sales') },
    { value: 'support', label: t('contactPage.form.subjects.support') },
    { value: 'partnership', label: t('contactPage.form.subjects.partnership') },
    { value: 'billing', label: t('contactPage.form.subjects.billing') },
    { value: 'other', label: t('contactPage.form.subjects.other') }
  ];

  const reasons = [
    {
      icon: <Headphones className="w-12 h-12" />,
      title: t('contactPage.reasons.expert.title'),
      description: t('contactPage.reasons.expert.desc')
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: t('contactPage.reasons.fast.title'),
      description: t('contactPage.reasons.fast.desc')
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: t('contactPage.reasons.custom.title'),
      description: t('contactPage.reasons.custom.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Navigation */}
      <nav className="border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="lg" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.home')}</Link>
              <Link to="/services" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.services')}</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">{t('navbar.pricing')}</Link>
              <Link to="/contact" className="text-orange-600 font-semibold">{t('navbar.contact')}</Link>
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                {t('contactPage.nav.start')}
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
              {t('contactPage.hero.titlePrefix')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {t('contactPage.hero.titleSuffix')}
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('contactPage.hero.desc')}
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
              <h2 className="text-3xl font-bold mb-6 text-slate-800">{t('contactPage.form.title')}</h2>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{t('contactPage.form.success.title')}</h3>
                  <p className="text-slate-600 mb-6">
                    {t('contactPage.form.success.message')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    {t('contactPage.form.success.button')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        {t('contactPage.form.labels.name')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        placeholder={t('contactPage.form.placeholders.name')}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">
                        {t('contactPage.form.labels.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        placeholder={t('contactPage.form.placeholders.email')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      {t('contactPage.form.labels.company')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      placeholder={t('contactPage.form.placeholders.company')}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      {t('contactPage.form.labels.subject')} *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
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
                      {t('contactPage.form.labels.message')} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none"
                      placeholder={t('contactPage.form.placeholders.message')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-orange-400/50 transition-all flex items-center justify-center gap-2 group"
                  >
                    {t('contactPage.form.button')}
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-slate-600 text-sm text-center">
                    {t('contactPage.form.privacy')}
                  </p>
                </form>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Why Contact Us */}
              <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">{t('contactPage.reasons.title')}</h3>
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
                <h3 className="text-2xl font-bold mb-6">{t('contactPage.hours.title')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-3 border-b border-white/30">
                    <span className="font-medium">{t('contactPage.hours.weekdays')}</span>
                    <span className="font-bold">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/30">
                    <span className="font-medium">{t('contactPage.hours.saturday')}</span>
                    <span className="font-bold">10h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t('contactPage.hours.sunday')}</span>
                    <span className="font-bold">{t('contactPage.hours.closed')}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-sm">
                    {t('contactPage.hours.emergency')}
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
              {t('contactPage.faq.title')}
            </h3>
            <p className="text-slate-600 mb-6">
              {t('contactPage.faq.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:shadow-lg transition-all border border-orange-200">
                {t('contactPage.faq.helpCenter')}
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                {t('contactPage.faq.faqButton')}
              </button>
            </div>
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

export default Contact;
