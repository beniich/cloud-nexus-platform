import React from 'react';
import { Target, Users, Award, Globe, Rocket, Heart, Shield, Zap } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AboutPage = () => {
    const stats = [
        { number: "2018", label: "Founded" },
        { number: "50+", label: "Experts" },
        { number: "10k+", label: "Clients" },
        { number: "5", label: "Datacenters" }
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Mission",
            description: "Democratize access to a high-performance, secure, and sovereign cloud for companies of all sizes."
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Excellence",
            description: "We strive for technical perfection in every line of code and every server we deploy."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community",
            description: "We believe in open-source and active collaboration with our developer community."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Privacy",
            description: "Your data is yours. We guarantee total sovereignty and strict compliance with GDPR."
        }
    ];

    const team = [
        {
            name: "Thomas Anderson",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
            bio: "Former Google Engineer, Cloud Architecture Expert."
        },
        {
            name: "Sarah Connors",
            role: "CTO",
            image: "https://images.unsplash.com/photo-1573496359-0796d9552d00?auto=format&fit=crop&q=80&w=400",
            bio: "Infrastructure security specialist and AI enthusiast."
        },
        {
            name: "David Chen",
            role: "Head of Product",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
            bio: "10 years experience in SaaS product development."
        },
        {
            name: "Elena Rodriguez",
            role: "Head of Sales",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
            bio: "Focused on customer success and strategic partnerships."
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
                            Building the Future
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            of Cloud Computing
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
                        Cloud Nexus was born from a simple idea: complexity shouldn't be a barrier to innovation.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-6 bg-white/60 backdrop-blur rounded-2xl border border-orange-100">
                                <div className="text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
                                <div className="text-slate-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((val, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-sm border border-orange-200 p-8 rounded-3xl hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{val.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {val.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    Founded in 2018 in Paris, Cloud Nexus started as a small team of passionate developers frustrated by the complexity of existing cloud solutions.
                                </p>
                                <p>
                                    We spent two years building our proprietary orchestration engine from scratch, focusing on performance, security, and developer experience.
                                </p>
                                <p>
                                    Today, we are proud to serve over 10,000 customers worldwide, from solo developers to large enterprises, helping them deploy their dreams to the cloud.
                                </p>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl rotate-3 opacity-20 transform scale-105"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                alt="Team working together"
                                className="relative rounded-2xl shadow-lg w-full object-cover h-64 md:h-80"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-12">Leadership Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="group">
                                <div className="relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-orange-100 group-hover:border-orange-300 transition-all shadow-lg">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                                <p className="text-orange-600 font-medium mb-2">{member.role}</p>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
