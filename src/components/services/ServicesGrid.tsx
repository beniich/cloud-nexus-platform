import React, { useState } from 'react';
import ServiceCard from './ServiceCard';
import { servicesData, categories, Service } from './servicesData';
import { Search, SlidersHorizontal } from 'lucide-react';

const ServicesGrid: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('Tous les services');
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeploy = (service: Service) => {
        console.log('Déploiement du service:', service);
        // Ajoutez ici votre logique de déploiement
        alert(`Déploiement de ${service.title} en cours...`);
    };

    const filteredServices = servicesData.filter(service => {
        const matchesCategory = selectedCategory === 'Tous les services' || service.category === selectedCategory;
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* En-tête avec design premium */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Nos <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Services Cloud</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Propulsez vos projets vers de nouveaux sommets avec notre infrastructure cloud de haute performance, sécurisée et évolutive.
                    </p>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="max-w-4xl mx-auto mb-16 space-y-8">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher un service (ex: instances, stockage, sécurité...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-16 py-5 rounded-2xl bg-white border border-gray-200 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-lg transition-all"
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2">
                            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                            <span>Filtrer par catégorie</span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grille de services avec espacement amélioré */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onDeploy={handleDeploy}
                        />
                    ))}
                </div>

                {/* État vide premium */}
                {filteredServices.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun service trouvé</h3>
                        <p className="text-gray-500 text-lg">
                            Désolé, nous n'avons trouvé aucun service correspondant à "{searchTerm}"
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('Tous les services'); }}
                            className="mt-6 text-orange-500 font-bold hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {/* Footer info */}
                <div className="mt-20 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">Besoin d'une solution sur mesure ?</h3>
                        <p className="text-gray-400">Nos architectes cloud sont là pour vous aider à concevoir l'infrastructure parfaite.</p>
                    </div>
                    <button className="whitespace-nowrap bg-white text-gray-900 font-bold py-4 px-10 rounded-2xl hover:bg-orange-50 transition-colors shadow-xl">
                        Contacter un expert
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServicesGrid;
