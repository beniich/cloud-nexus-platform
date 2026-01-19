import React, { useState } from 'react';
import { Cloud, Calendar, User, Tag, ArrowRight, TrendingUp, BookOpen, Code, Shield, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const BlogPage = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', label: t('blog.categories.all', 'All Articles'), icon: <BookOpen className="w-4 h-4" /> },
        { id: 'cloud', label: t('blog.categories.cloud', 'Cloud Computing'), icon: <Cloud className="w-4 h-4" /> },
        { id: 'development', label: t('blog.categories.development', 'Development'), icon: <Code className="w-4 h-4" /> },
        { id: 'security', label: t('blog.categories.security', 'Security'), icon: <Shield className="w-4 h-4" /> },
        { id: 'performance', label: t('blog.categories.performance', 'Performance'), icon: <Zap className="w-4 h-4" /> }
    ];

    const articles = [
        {
            id: 1,
            title: "Cloud Computing Trends in 2025",
            excerpt: "Discover the innovations that will revolutionize the cloud industry this year: Generative AI, Edge Computing, and large-scale Serverless.",
            category: "cloud",
            author: "Sophie Martin",
            date: "Jan 15, 2025",
            readTime: "5 min read",
            image: "📊",
            featured: true,
            tags: ["Cloud", "Trends", "Innovation"]
        },
        {
            id: 2,
            title: "Optimizing React Application Performance",
            excerpt: "Complete guide to improving your React apps performance: lazy loading, code splitting, memoization, and render optimization.",
            category: "development",
            author: "Thomas Dubois",
            date: "Jan 12, 2025",
            readTime: "8 min read",
            image: "⚛️",
            featured: true,
            tags: ["React", "Performance", "JavaScript"]
        },
        {
            id: 3,
            title: "Securing Your Cloud Infrastructure: Complete Guide",
            excerpt: "Best practices to protect your data and applications in the cloud: encryption, access management, monitoring, and compliance.",
            category: "security",
            author: "Marie Laurent",
            date: "Jan 10, 2025",
            readTime: "10 min read",
            image: "🔒",
            featured: true,
            tags: ["Security", "DevSecOps", "Best Practices"]
        },
        {
            id: 4,
            title: "Kubernetes vs Docker Swarm: Which Orchestrator to Choose?",
            excerpt: "Detailed comparison of the two main container orchestration solutions to help you make the right choice.",
            category: "cloud",
            author: "Alexandre Chen",
            date: "Jan 8, 2025",
            readTime: "7 min read",
            image: "🐳",
            tags: ["Kubernetes", "Docker", "DevOps"]
        },
        {
            id: 5,
            title: "Serverless Architecture: Benefits and Pitfalls",
            excerpt: "Everything you need to know before migrating to a serverless architecture: costs, performance, limitations, and use cases.",
            category: "cloud",
            author: "Sophie Martin",
            date: "Jan 5, 2025",
            readTime: "6 min read",
            image: "⚡",
            tags: ["Serverless", "AWS Lambda", "Architecture"]
        },
        {
            id: 6,
            title: "TypeScript: Why Your Team Should Adopt It",
            excerpt: "Concrete benefits of TypeScript for improving the quality and maintainability of your JavaScript code.",
            category: "development",
            author: "Thomas Dubois",
            date: "Jan 3, 2025",
            readTime: "5 min read",
            image: "📘",
            tags: ["TypeScript", "JavaScript", "Code Quality"]
        },
        {
            id: 7,
            title: "Zero Trust Security: The New Security Paradigm",
            excerpt: "How to implement a Zero Trust security strategy in your organization to better protect your resources.",
            category: "security",
            author: "Marie Laurent",
            date: "Jan 1, 2025",
            readTime: "9 min read",
            image: "🛡️",
            tags: ["Zero Trust", "Cybersecurity", "IAM"]
        },
        {
            id: 8,
            title: "Monitoring and Observability: Practical Guide",
            excerpt: "Setting up a complete monitoring and observability strategy for your cloud applications with Prometheus and Grafana.",
            category: "performance",
            author: "Alexandre Chen",
            date: "Dec 28, 2024",
            readTime: "11 min read",
            image: "📈",
            tags: ["Monitoring", "Observability", "DevOps"]
        },
        {
            id: 9,
            title: "CI/CD: Automating Deployments with GitHub Actions",
            excerpt: "Complete tutorial to set up robust and automated CI/CD pipelines with GitHub Actions.",
            category: "development",
            author: "Thomas Dubois",
            date: "Dec 25, 2024",
            readTime: "12 min read",
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
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            {t('blog.hero.title_prefix', 'The Cloud Nexus')}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            {t('blog.hero.title_suffix', 'Blog')}
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        {t('blog.hero.subtitle', 'News, tutorials, and insights on cloud computing, web development, and security.')}
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
                                placeholder={t('blog.search_placeholder', 'Search an article...')}
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
                            <h2 className="text-3xl font-bold text-slate-800">{t('blog.featured', 'Featured Articles')}</h2>
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
                                            <span className="text-slate-500 text-sm">{article.readTime}</span>
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
                        {selectedCategory === 'all' ? t('blog.categories.all', 'All Articles') : categories.find(c => c.id === selectedCategory)?.label}
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
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>

                                        <button className="group/btn mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                                            {t('blog.read_more', 'Read Article')}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-600 text-lg">{t('blog.no_results', 'No articles match your search.')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden p-12 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-2xl text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            {t('blog.newsletter.title', 'Stay updated with the latest news')}
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            {t('blog.newsletter.subtitle', 'Receive our best articles directly in your inbox')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder={t('blog.newsletter.placeholder', 'your@email.com')}
                                className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <button className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold whitespace-nowrap">
                                {t('blog.newsletter.button', 'Subscribe')}
                            </button>
                        </div>
                        <p className="text-white/80 text-sm mt-4">
                            {t('blog.newsletter.disclaimer', 'No spam, unsubscribe in 1 click')}
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogPage;
