import React, { useState } from 'react';
import { Package, Plus, Search, Edit, Eye, TrendingUp, DollarSign, ShoppingCart, Star, Filter, MoreVertical, Server, Cloud, Database, Zap } from 'lucide-react';

interface ProductSpec {
  [key: string]: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  priceMonthly: number;
  priceYearly: number | null;
  stock: string | number;
  sales: number;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  specs: ProductSpec;
  tags: string[];
}

const ProductsManager = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les produits', icon: Package, count: 24 },
    { id: 'vps', label: 'VPS', icon: Server, count: 8 },
    { id: 'hosting', label: 'Hébergement', icon: Cloud, count: 6 },
    { id: 'storage', label: 'Stockage', icon: Database, count: 5 },
    { id: 'services', label: 'Services', icon: Zap, count: 5 }
  ];

  const stats = [
    { label: 'Produits Actifs', value: '24', change: '+3', icon: Package, color: 'blue' },
    { label: 'Ventes ce mois', value: '342', change: '+12%', icon: ShoppingCart, color: 'green' },
    { label: 'Revenus', value: '€48.5K', change: '+23%', icon: DollarSign, color: 'purple' },
    { label: 'Produits Populaires', value: '8', change: '+2', icon: TrendingUp, color: 'orange' }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'VPS Starter',
      category: 'vps',
      description: 'Serveur virtuel idéal pour débuter',
      price: 9.99,
      priceMonthly: 9.99,
      priceYearly: 99.99,
      stock: 'unlimited',
      sales: 145,
      status: 'active',
      featured: true,
      specs: {
        cpu: '2 vCPU',
        ram: '4 GB',
        storage: '80 GB SSD',
        bandwidth: '2 TB'
      },
      tags: ['Populaire', 'Débutant']
    },
    {
      id: 2,
      name: 'VPS Pro',
      category: 'vps',
      description: 'Performance optimale pour applications professionnelles',
      price: 29.99,
      priceMonthly: 29.99,
      priceYearly: 299.99,
      stock: 'unlimited',
      sales: 98,
      status: 'active',
      featured: true,
      specs: {
        cpu: '4 vCPU',
        ram: '8 GB',
        storage: '160 GB SSD',
        bandwidth: '4 TB'
      },
      tags: ['Professionnel', 'Performance']
    },
    {
      id: 3,
      name: 'VPS Enterprise',
      category: 'vps',
      description: 'Puissance maximale pour entreprises',
      price: 79.99,
      priceMonthly: 79.99,
      priceYearly: 799.99,
      stock: 'unlimited',
      sales: 56,
      status: 'active',
      featured: false,
      specs: {
        cpu: '8 vCPU',
        ram: '16 GB',
        storage: '320 GB SSD',
        bandwidth: '8 TB'
      },
      tags: ['Enterprise', 'Haute Performance']
    },
    {
      id: 4,
      name: 'Hébergement Web Basic',
      category: 'hosting',
      description: 'Hébergement web partagé économique',
      price: 4.99,
      priceMonthly: 4.99,
      priceYearly: 49.99,
      stock: 'unlimited',
      sales: 234,
      status: 'active',
      featured: true,
      specs: {
        websites: '1 site',
        storage: '10 GB',
        bandwidth: '100 GB',
        email: '5 comptes'
      },
      tags: ['Économique', 'Web']
    },
    {
      id: 5,
      name: 'Hébergement WordPress',
      category: 'hosting',
      description: 'Optimisé pour WordPress avec cache intégré',
      price: 14.99,
      priceMonthly: 14.99,
      priceYearly: 149.99,
      stock: 'unlimited',
      sales: 187,
      status: 'active',
      featured: true,
      specs: {
        websites: '3 sites',
        storage: '30 GB SSD',
        bandwidth: 'Illimité',
        email: '20 comptes'
      },
      tags: ['WordPress', 'Optimisé']
    },
    {
      id: 6,
      name: 'Cloud Storage 100GB',
      category: 'storage',
      description: 'Stockage cloud sécurisé et accessible',
      price: 2.99,
      priceMonthly: 2.99,
      priceYearly: 29.99,
      stock: 'unlimited',
      sales: 312,
      status: 'active',
      featured: false,
      specs: {
        storage: '100 GB',
        backup: 'Automatique',
        sharing: 'Illimité',
        encryption: 'AES-256'
      },
      tags: ['Cloud', 'Sécurisé']
    },
    {
      id: 7,
      name: 'Cloud Storage 500GB',
      category: 'storage',
      description: 'Espace de stockage étendu pour professionnels',
      price: 9.99,
      priceMonthly: 9.99,
      priceYearly: 99.99,
      stock: 'unlimited',
      sales: 156,
      status: 'active',
      featured: false,
      specs: {
        storage: '500 GB',
        backup: 'Automatique',
        sharing: 'Illimité',
        encryption: 'AES-256'
      },
      tags: ['Cloud', 'Pro']
    },
    {
      id: 8,
      name: 'SSL Certificate',
      category: 'services',
      description: 'Certificat SSL pour sécuriser votre site',
      price: 49.99,
      priceMonthly: 49.99,
      priceYearly: 499.99,
      stock: 'unlimited',
      sales: 423,
      status: 'active',
      featured: true,
      specs: {
        validation: 'DV/OV/EV',
        warranty: '€1M',
        support: '24/7',
        validity: '1 an'
      },
      tags: ['Sécurité', 'SSL']
    },
    {
      id: 9,
      name: 'Migration Service',
      category: 'services',
      description: 'Migration complète de votre site web',
      price: 99.99,
      priceMonthly: 99.99,
      priceYearly: null,
      stock: 'limited',
      sales: 67,
      status: 'active',
      featured: false,
      specs: {
        sites: '1 site',
        database: 'Inclus',
        dns: 'Configuration',
        support: 'Dédié'
      },
      tags: ['Migration', 'Support']
    },
    {
      id: 10,
      name: 'Dedicated Server',
      category: 'vps',
      description: 'Serveur dédié haute performance',
      price: 199.99,
      priceMonthly: 199.99,
      priceYearly: 1999.99,
      stock: 12,
      sales: 23,
      status: 'active',
      featured: true,
      specs: {
        cpu: 'Intel Xeon E5',
        ram: '32 GB DDR4',
        storage: '2x 1TB SSD',
        bandwidth: 'Illimité'
      },
      tags: ['Dédié', 'Performance']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (product: Product | null = null) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Produits
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Catalogue complet de vos produits et services
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </button>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${activeCategory === cat.id
                      ? 'bg-white/20'
                      : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Filter className="w-5 h-5" />
              Filtres
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{product.category}</p>
                    </div>
                  </div>
                  {product.featured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
              </div>

              {/* Specs */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400 capitalize block text-xs mb-0.5">{key}:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 flex-wrap">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      €{product.priceMonthly}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">par mois</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {product.sales} ventes
                    </div>
                    <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${product.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {product.status === 'active' ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedProduct?.name}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={selectedProduct?.description}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    defaultValue={selectedProduct?.category}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="vps">VPS</option>
                    <option value="hosting">Hébergement</option>
                    <option value="storage">Stockage</option>
                    <option value="services">Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    defaultValue={selectedProduct?.status}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prix Mensuel (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedProduct?.priceMonthly}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prix Annuel (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={selectedProduct?.priceYearly || ''}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedProduct?.tags.join(', ')}
                    placeholder="Populaire, Performance, Pro..."
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={selectedProduct?.featured}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Produit en vedette</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {selectedProduct ? 'Mettre à jour' : 'Créer le produit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
