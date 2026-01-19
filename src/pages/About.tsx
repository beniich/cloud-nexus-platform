import React from 'react';
import { Cloud, Target, Heart, Users, Award, Zap, Globe, Shield, TrendingUp, Rocket, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const stats = [
        { number: "2018", label: "Année de création", icon: <Rocket /> },
        { number: "10K+", label: "Clients satisfaits", icon: <Users /> },
        { number: "150+", label: "Pays couverts", icon: <Globe /> },
        { number: "99.9%", label: "Uptime garanti", icon: <TrendingUp /> }
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Innovation",
            description: "Nous repoussons constamment les limites de la technologie cloud pour offrir les solutions les plus avancées du marché."
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Passion",
            description: "Notre équipe est passionnée par la technologie et dédiée à la réussite de chaque client."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Sécurité",
            description: "La protection de vos données est notre priorité absolue avec des standards de sécurité de niveau entreprise."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Collaboration",
            description: "Nous travaillons main dans la main avec nos clients pour comprendre et dépasser leurs attentes."
        }
    ];

    const team = [
        {
            name: "Sophie Martin",
            role: "CEO & Co-fondatrice",
            image: "SM",
            bio: "15 ans d'expérience dans le cloud computing"
        },
        {
            name: "Thomas Dubois",
            role: "CTO & Co-fondateur",
            image: "TD",
            bio: "Expert en architecture cloud et DevOps"
        },
        {
            name: "Marie Laurent",
            role: "VP Engineering",
            image: "ML",
            bio: "Spécialiste en infrastructure distribuée"
        },
        {
            name: "Alexandre Chen",
            role: "VP Sales",
            image: "AC",
            bio: "Passionné par la relation client"
        }
    ];

    const milestones = [
        {
            year: "2018",
            title: "Lancement de Cloud Nexus",
            description: "Début de l'aventure avec 100 premiers clients"
        },
        {
            year: "2020",
            title: "Expansion internationale",
            description: "Ouverture de datacenters en Europe et Asie"
        },
        {
            year: "2022",
            title: "Innovation majeure",
            description: "Lancement du Site Builder avec IA intégrée"
        },
        {
            year: "2024",
            title: "Leadership du marché",
            description: "10 000+ clients et reconnaissance industrie"
        }
    ];

    const achievements = [
        { icon: <Award />, text: "Meilleur fournisseur Cloud 2024" },
        { icon: <Star />, text: "4.9/5 satisfaction client" },
        { icon: <Shield />, text: "Certification ISO 27001" },
        { icon: <Zap />, text: "Innovation Award 2023" }
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
                            <Link to="/about" className="text-orange-600 font-semibold">À propos</Link>
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
                            Notre Mission :
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Démocratiser le Cloud
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Depuis 2018, nous aidons les entreprises de toutes tailles à exploiter la puissance du cloud pour accélérer leur transformation digitale.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-8 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl text-center hover:shadow-xl transition-all group">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-4 mx-auto text-white group-hover:scale-110 transition-transform shadow-lg">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
                                <div className="text-slate-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 text-slate-800">Notre Histoire</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    Cloud Nexus est né en 2018 d'une vision simple : rendre le cloud computing accessible à toutes les entreprises, des startups aux grandes organisations.
                                </p>
                                <p>
                                    Fondée par Sophie Martin et Thomas Dubois, deux passionnés de technologie cloud, notre entreprise a rapidement évolué pour devenir un acteur majeur du marché européen.
                                </p>
                                <p>
                                    Aujourd'hui, nous servons plus de 10 000 clients dans 150 pays, avec une équipe de 200+ experts dédiés à votre succès.
                                </p>
                                <p>
                                    Notre engagement : fournir des solutions cloud performantes, sécurisées et innovantes, tout en maintenant un support client exceptionnel.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {achievements.map((achievement, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-orange-100 rounded-xl">
                                        <div className="text-orange-600">{achievement.icon}</div>
                                        <span className="text-sm font-medium text-slate-700">{achievement.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-200 to-amber-200 rounded-3xl p-8 shadow-2xl">
                            <div className="space-y-4">
                                {milestones.map((milestone, idx) => (
                                    <div key={idx} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-orange-200">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                {milestone.year.slice(2)}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800">{milestone.title}</h3>
                                        </div>
                                        <p className="text-slate-600">{milestone.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Nos Valeurs</h2>
                        <p className="text-slate-600 text-xl">Les principes qui guident chacune de nos décisions</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <div key={idx} className="p-8 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-xl transition-all group text-center">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-6 mx-auto text-white group-hover:scale-110 transition-transform shadow-lg">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-800">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Notre Équipe de Direction</h2>
                        <p className="text-slate-600 text-xl">Les visionnaires derrière Cloud Nexus</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="group">
                                <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-8 hover:shadow-xl transition-all text-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-4 mx-auto text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                                        {member.image}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
                                    <p className="text-orange-600 font-semibold mb-3">{member.role}</p>
                                    <p className="text-slate-600 text-sm">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden p-12 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Rejoignez l'Aventure Cloud Nexus
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Nous recrutons des talents passionnés pour façonner l'avenir du cloud computing
                        </p>
                        <Link to="/careers" className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg">
                            Voir nos offres d'emploi
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

export default AboutPage;
