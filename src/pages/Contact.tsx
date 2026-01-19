import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulate form submission
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+33 1 23 45 67 89",
      description: "Mon-Fri 9am-6pm",
      action: "Call us"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "contact@cloudnexus.com",
      description: "Response within 24h",
      action: "Write to us"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      value: "Available",
      description: "Instant support",
      action: "Start chat"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office",
      value: "Paris, France",
      description: "La Défense, Tour Cyber",
      action: "Get directions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Contact
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our team is here to help you. Whether you have a technical question or need a personalized quote.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {contactMethods.map((method, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-1">{method.title}</h3>
                      <p className="text-lg font-semibold text-slate-700 mb-1">{method.value}</p>
                      <p className="text-sm text-slate-500 mb-3">{method.description}</p>
                      <button className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1">
                        {method.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Priority Support</h3>
                  <p className="text-slate-300 mb-6 font-light">
                    Enterprise customers benefit from a dedicated technical account manager and 24/7 support.
                  </p>
                  <button className="w-full py-3 bg-white text-slate-900 rounded-lg hover:bg-orange-50 transition-colors font-medium">
                    Contact Enterprise Sales
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 lg:p-12 shadow-xl">
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Send us a message</h2>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700">
                      Thank you for contacting us. We will get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                      >
                        <option value="">Select a subject...</option>
                        <option value="sales">Commercial / Sales</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Message</label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-xl hover:shadow-orange-400/30 transition-all transform hover:scale-[1.02] font-bold text-lg flex items-center justify-center gap-2"
                    >
                      Send Message
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
