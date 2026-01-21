import React, { useState } from 'react';
import { Cloud, MapPin, Clock, Briefcase, Users, Heart, Rocket, Coffee, Dumbbell, Plane, GraduationCap, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');

    const benefits = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Assurance Santé Premium",
            description: "Couverture santé complète pour vous et votre famille"
        },
        {
            icon: <Plane className="w-8 h-8" />,
            title: "5 Semaines de Congés",
            description: "Plus RTT et jours fériés pour un bon équilibre vie pro/perso"
        },
        {
            icon: <Coffee className="w-8 h-8" />,
            title: "Télétravail Flexible",
            description: "Travaillez d'où vous voulez, quand vous voulez"
        },
        {
            icon: <GraduationCap className="w-8 h-8" />,
            title: "Formation Continue",
            description: "Budget annuel de 3000€ pour votre développement"
        },
        {
            icon: <Dumbbell className="w-8 h-8" />,
            title: "Salle de Sport",
            description: "Accès gratuit à notre salle de sport partenaire"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Stock Options",
            description: "Participez à la croissance de l'entreprise"
        }
    ];

    const jobs = [
        {
            id: 1,
            title: "Senior Backend Engineer",
            department: "Engineering",
            location: "Paris, France",
            type: "CDI",
            description: "Nous recherchons un développeur backend senior pour rejoindre notre équipe infrastructure cloud.",
            skills: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"],
            salary: "65-85K€"
        },
        {
            id: 2,
            title: "Frontend Developer React",
            department: "Engineering",
            location: "Paris, France / Remote",
            type: "CDI",
            description: "Créez des interfaces utilisateur exceptionnelles pour notre plateforme cloud.",
            skills: ["React", "TypeScript", "TailwindCSS", "Vite"],
            salary: "55-75K€"
        },
        {
            id: 3,
            title: "DevOps Engineer",
            department: "Engineering",
            location: "Lyon, France",
            type: "CDI",
            description: "Optimisez notre infrastructure cloud et nos pipelines de déploiement.",
            skills: ["AWS", "Terraform", "CI/CD", "Monitoring"],
            salary: "60-80K€"
        },
        {
            id: 4,
            title: "Product Manager",
            department: "Product",
            location: "Paris, France",
            type: "CDI",
            description: "Définissez la vision produit et pilotez le développement de nouvelles fonctionnalités.",
            skills: ["Product Strategy", "Analytics", "UX", "Agile"],
            salary: "70-90K€"
        },
        {
            id: 5,
            title: "UX/UI Designer",
            department: "Design",
            location: "Remote",
            type: "CDI",
            description: "Concevez des expériences utilisateur intuitives et visuellement attrayantes.",
            skills: ["Figma", "Design System", "User Research", "Prototyping"],
            salary: "50-70K€"
        },
        {
            id: 6,
            title: "Sales Account Executive",
            department: "Sales",
            location: "Paris, France",
            type: "CDI",
            description: "Développez notre portefeuille clients et dépassez vos objectifs commerciaux.",
            skills: ["SaaS Sales", "B2B", "Négociation", "CRM"],
            salary: "45K€ + Commission"
        },
        {
            id: 7,
            title: "Customer Success Manager",
            department: "Support",
            location: "Paris, France / Remote",
            type: "CDI",
            description: "Assurez la satisfaction et la fidélisation de nos clients entreprise.",
            skills: ["Customer Support", "Cloud", "Communication", "Problem Solving"],
            salary: "40-55K€"
        },
        {
            id: 8,
            title: "Data Scientist",
            department: "Data",
            location: "Paris, France",
            type: "CDI",
            description: "Exploitez nos données pour améliorer nos produits et services.",
            skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
            salary: "60-80K€"
        }
    ];

    const departments = ['all', 'Engineering', 'Product', 'Design', 'Sales', 'Support', 'Data'];
    const locations = ['all', 'Paris, France', 'Lyon, France', 'Remote'];

    const filteredJobs = jobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
        const matchLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
        return matchSearch && matchDepartment && matchLocation;
    });

    const values = [
        {
            title: "Innovation",
            description: "Nous encourageons l'expérimentation et la prise de risques calculés"
        },
        {
            title: "Collaboration",
            description: "Le travail d'équipe est au cœur de notre réussite"
        },
        {
            title: "Excellence",
            description: "Nous visons l'excellence dans tout ce que nous faisons"
        },
        {
            title: "Diversité",
            description: "Nous célébrons la diversité et l'inclusion"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Navigation */}
            <nav className="border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
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
                            <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Accueil</Link>
                            <Link to="/about" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">À propos</Link>
                            <Link to="/careers" className="text-orange-600 font-semibold">Carrières</Link>
                            <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Contact</Link>
                            <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                                Postuler
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
                            Rejoignez
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Notre Équipe
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                        Construisez l'avenir du cloud computing avec les meilleurs talents de l'industrie
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Users className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">200+ Employés</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">5 Bureaux</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Rocket className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">En croissance</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Avantages & Bénéfices</h2>
                        <p className="text-slate-600 text-xl">Nous prenons soin de nos équipes</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="p-8 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl hover:shadow-xl transition-all group">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform shadow-lg">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">{benefit.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-12 shadow-2xl">
                        <h2 className="text-4xl font-bold text-white mb-8 text-center">Nos Valeurs</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, idx) => (
                                <div key={idx} className="p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                                    <h3 className="text-2xl font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-white/90">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800">Postes Ouverts</h2>
                        <p className="text-slate-600 text-xl">{filteredJobs.length} opportunités disponibles</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 mb-8">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un poste..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept === 'all' ? 'Tous les départements' : dept}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="px-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>
                                        {loc === 'all' ? 'Tous les emplacements' : loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Jobs Grid */}
                    <div className="space-y-6">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-8 hover:shadow-xl transition-all group">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                                {job.title}
                                            </h3>
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                {job.type}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-medium">{job.department}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-medium">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-medium">{job.salary}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 mb-4 leading-relaxed">{job.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="group/btn px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all flex items-center gap-2 font-medium whitespace-nowrap">
                                        Postuler
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-600 text-lg">Aucun poste ne correspond à vos critères de recherche.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-12 text-center shadow-xl">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Vous ne trouvez pas le poste idéal ?
                        </h2>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                            Envoyez-nous votre candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels !
                        </p>
                        <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-2xl hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-semibold text-lg">
                            Candidature spontanée
                        </button>
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

export default Careers;
