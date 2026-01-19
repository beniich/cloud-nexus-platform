import React, { useState } from 'react';
import { Cloud, Calendar, User, Tag, ArrowRight, TrendingUp, BookOpen, Code, Shield, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', label: 'Tous les articles', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'cloud', label: 'Cloud Computing', icon: <Cloud className="w-4 h-4" /> },
        { id: 'development', label: 'Développement', icon: <Code className="w-4 h-4" /> },
        { id: 'security', label: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
        { id: 'performance', label: 'Performance', icon: <Zap className="w-4 h-4" /> }
    ];

    const articles = [
        {
            id: 1,
            title: "Les tendances du Cloud Computing en 2025",
            excerpt: "Découvrez les innovations qui vont révolutionner l'industrie du cloud cette année : IA générative, edge computing et serverless à grande échelle.",
            category: "cloud",
            author: "Sophie Martin",
            date: "15 Jan 2025",
            readTime: "5 min",
            image: "📊",
            featured: true,
            tags: ["Cloud", "Tendances", "Innovation"]
        },
        {
            id: 2,
            title: "Optimiser les performances de vos applications React",
            excerpt: "Guide complet pour améliorer les performances de vos applications React : lazy loading, code splitting, mémoisation et optimisation du rendu.",
            category: "development",
            author: "Thomas Dubois",
            date: "12 Jan 2025",
            readTime: "8 min",
            image: "⚛️",
            featured: true,
            tags: ["React", "Performance", "JavaScript"]
        },
        {
            id: 3,
            title: "Sécuriser votre infrastructure cloud : Guide complet",
            excerpt: "Les meilleures pratiques pour protéger vos données et applications dans le cloud : chiffrement, gestion des accès, monitoring et conformité.",
            category: "security",
            author: "Marie Laurent",
            date: "10 Jan 2025",
            readTime: "10 min",
            image: "🔒",
            featured: true,
            tags: ["Sécurité", "DevSecOps", "Best Practices"]
        },
        {
            id: 4,
            title: "Kubernetes vs Docker Swarm : Quel orchestrateur choisir ?",
            excerpt: "Comparaison détaillée des deux principales solutions d'orchestration de conteneurs pour vous aider à faire le bon choix.",
            category: "cloud",
            author: "Alexandre Chen",
            date: "8 Jan 2025",
            readTime: "7 min",
            image: "🐳",
            tags: ["Kubernetes", "Docker", "DevOps"]
        },
        {
            id: 5,
            title: "Serverless Architecture : Avantages et pièges à éviter",
            excerpt: "Tout ce que vous devez savoir avant de migrer vers une architecture serverless : coûts, performances, limitations et cas d'usage.",
            category: "cloud",
            author: "Sophie Martin",
            date: "5 Jan 2025",
            readTime: "6 min",
            image: "⚡",
            tags: ["Serverless", "AWS Lambda", "Architecture"]
        },
        {
            id: 6,
            title: "TypeScript : Pourquoi votre équipe devrait l'adopter",
            excerpt: "Les avantages concrets de TypeScript pour améliorer la qualité et la maintenabilité de votre code JavaScript.",
            category: "development",
            author: "Thomas Dubois",
            date: "3 Jan 2025",
            readTime: "5 min",
            image: "📘",
            tags: ["TypeScript", "JavaScript", "Code Quality"]
        },
        {
            id: 7,
            title: "Zero Trust Security : Le nouveau paradigme de sécurité",
            excerpt: "Comment implémenter une stratégie de sécurité Zero Trust dans votre organisation pour mieux protéger vos ressources.",
            category: "security",
            author: "Marie Laurent",
            date: "1 Jan 2025",
            readTime: "9 min",
            image: "🛡️",
            tags: ["Zero Trust", "Cybersécurité", "IAM"]
        },
        {
            id: 8,
            title: "Monitoring et Observabilité : Guide pratique",
            excerpt: "Mise en place d'une stratégie complète de monitoring et d'observabilité pour vos applications cloud avec Prometheus et Grafana.",
            category: "performance",
            author: "Alexandre Chen",
            date: "28 Déc 2024",
            readTime: "11 min",
            image: "📈",
            tags: ["Monitoring", "Observability", "DevOps"]
        },
        {
            id: 9,
            title: "CI/CD : Automatiser vos déploiements avec GitHub Actions",
            excerpt: "Tutorial complet pour mettre en place des pipelines CI/CD robustes et automatisés avec GitHub Actions.",
            category: "development",
            author: "Thomas Dubois",
            date: "25 Déc 2024",
            readTime: "12 min",
            image: "🚀",
            tags: ["CI/CD", "GitHub Actions", "Automation"]
        }
    ];

    const filteredArticles = articles.filter(article => {
        const matchCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const featuredArticles = articles.filter(a => a.featured);

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
                            <Link to="/blog" className="text-orange-600 font-semibold">Blog</Link>
                            <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Contact</Link>
                            <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-orange-400/50 transition-all transform hover:scale-105 font-medium">
                                S'abonner
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
                            Le Blog
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Cloud Nexus
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Actualités, tutoriels et insights sur le cloud computing, le développement web et la sécurité
                    </p>
                </div>
            </section>

            {/* Search & Filters */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 mb-8">
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un article..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat.id
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                            : 'bg-white border border-orange-200 text-slate-700 hover:bg-orange-50'
                                        }`}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            {selectedCategory === 'all' && searchTerm === '' && (
                <section className="px-6 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                            <h2 className="text-3xl font-bold text-slate-800">Articles à la une</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {featuredArticles.map((article) => (
                                <div key={article.id} className="group bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all">
                                    <div className="h-48 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-6xl">
                                        {article.image}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase">
                                                {article.category}
                                            </span>
                                            <span className="text-slate-500 text-sm">{article.readTime} de lecture</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <User className="w-4 h-4 text-orange-500" />
                                                <span>{article.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <span>{article.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Articles */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8">
                        {selectedCategory === 'all' ? 'Tous les articles' : categories.find(c => c.id === selectedCategory)?.label}
                    </h2>

                    <div className="space-y-6">
                        {filteredArticles.map((article) => (
                            <div key={article.id} className="group bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-8 hover:shadow-xl transition-all">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="w-full md:w-48 h-48 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-6xl flex-shrink-0">
                                        {article.image}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase">
                                                {article.category}
                                            </span>
                                            {article.tags.map((tag, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 leading-relaxed">{article.excerpt}</p>

                                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium">{article.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <span>{article.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-orange-500" />
                                                <span>{article.readTime} de lecture</span>
                                            </div>
                                        </div>

                                        <button className="group/btn mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                                            Lire l'article
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-600 text-lg">Aucun article ne correspond à votre recherche.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden p-12 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Restez informé des dernières actualités
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Recevez nos meilleurs articles directement dans votre boîte mail
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold whitespace-nowrap">
                                S'abonner
                            </button>
                        </div>
                        <p className="text-white/80 text-sm mt-4">
                            Pas de spam, désinscription en 1 clic
                        </p>
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

export default BlogPage;
