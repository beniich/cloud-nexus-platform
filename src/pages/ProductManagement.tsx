import React, { useState, useMemo } from 'react';
import {
    Package,
    Plus,
    Search,
    ShoppingCart,
    Server,
    Cloud,
    Database,
    Zap,
    HardDrive,
    Shield,
    Layers,
    CheckCircle2,
    X,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import { uploadProductImage } from '@/lib/supabase';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type ProductCategory = 'vps' | 'hosting' | 'dedicated' | 'storage' | 'security' | 'services';

interface Product {
    id: number;
    name: string;
    slug: string;
    category: ProductCategory;
    tier: 'starter' | 'pro' | 'business' | 'enterprise' | null;
    description: string;
    shortSpecs: string;           // ex: "4 vCPU • 8 Go • 160 Go NVMe"
    priceMonthly: number;
    priceYearly: number;          // -15% ou -20% selon stratégie
    priceTriennial?: number;      // optionnel
    status: 'active' | 'draft' | 'archived';
    isFeatured: boolean;
    isConfigurable: boolean;
    popular: boolean;
    salesCount: number;
    tags: string[];
    mainSpecs: Record<string, string>;
    imageUrl: string;
}

const CATEGORIES = [
    { id: 'all', label: 'Tous les produits', icon: Layers, count: 0 },
    { id: 'vps', label: 'VPS', icon: Server, count: 0 },
    { id: 'hosting', label: 'Hébergement mutualisé', icon: Cloud, count: 0 },
    { id: 'dedicated', label: 'Serveurs Dédiés', icon: Database, count: 0 },
    { id: 'storage', label: 'Stockage & Backup', icon: HardDrive, count: 0 },
    { id: 'security', label: 'Sécurité', icon: Shield, count: 0 },
    { id: 'services', label: 'Services additionnels', icon: Zap, count: 0 },
] as const;

// ────────────────────────────────────────────────
// Données (exemple réaliste pro 2026)
// ────────────────────────────────────────────────
const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'VPS Pro',
        slug: 'vps-pro',
        category: 'vps',
        tier: 'pro',
        description: 'Serveur virtuel haute performance – idéal applications métier, e-commerce moyen, environnements de dev/test intensifs',
        shortSpecs: '4 vCPU • 8 Go RAM • 160 Go NVMe • 4 To',
        priceMonthly: 29.90,
        priceYearly: 299.00, // ≈ -17%
        status: 'active',
        isFeatured: true,
        isConfigurable: true,
        popular: true,
        salesCount: 284,
        tags: ['populaire', 'pro', 'nvme'],
        mainSpecs: {
            cpu: '4 vCPU Ryzen/EPYC',
            ram: '8 Go DDR5 ECC',
            storage: '160 Go NVMe Gen4',
            bandwidth: '4 To/mois – 1 Gbps',
            os: 'Linux / Windows optionnel',
        },
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef0d7d4b0d5c?auto=format&fit=crop&q=80&w=800', // serveur virtuel moderne / cloud infra
    },
    {
        id: 2,
        name: 'VPS Business',
        slug: 'vps-business',
        category: 'vps',
        tier: 'business',
        description: 'Solution robuste pour entreprises – bases de données, API, multiples sites critiques',
        shortSpecs: '6 vCPU • 16 Go • 320 Go NVMe • 6 To',
        priceMonthly: 59.90,
        priceYearly: 599.00,
        status: 'active',
        isFeatured: true,
        isConfigurable: true,
        popular: false,
        salesCount: 142,
        tags: ['business', 'haute-dispo', 'ssd'],
        mainSpecs: {
            cpu: '6 vCPU',
            ram: '16 Go ECC',
            storage: '320 Go NVMe',
            bandwidth: '6 To/mois',
            ip: 'IPv4 + IPv6 /64',
        },
        imageUrl: 'https://images.unsplash.com/photo-1551288049-b1f4d2e39e6a?auto=format&fit=crop&q=80&w=800', // infra entreprise / data center stylisé
    },
    {
        id: 3,
        name: 'Hébergement WordPress Pro',
        slug: 'wp-pro',
        category: 'hosting',
        tier: 'pro',
        description: 'Hébergement optimisé WordPress / WooCommerce – cache avancé, CDN inclus, staging intégré',
        shortSpecs: '∞ sites • 60 Go SSD • ∞ trafic • Imunify360',
        priceMonthly: 19.90,
        priceYearly: 199.00,
        status: 'active',
        isFeatured: true,
        isConfigurable: false,
        popular: true,
        salesCount: 531,
        tags: ['wordpress', 'e-commerce', 'optimisé'],
        mainSpecs: {
            sites: 'Illimité',
            storage: '60 Go SSD NVMe',
            bandwidth: 'Illimité (fair-use)',
            security: 'Imunify360 + WAF',
            backup: 'Quotidien 30j',
        },
        imageUrl: 'https://images.unsplash.com/photo-1460925898913-fff6a3e2e3f0?auto=format&fit=crop&q=80&w=800', // wordpress dashboard / site web clean
    },
    {
        id: 4,
        name: 'Serveur Dédié Ryzen 9',
        slug: 'dedie-ryzen9',
        category: 'dedicated',
        tier: 'business',
        description: 'Serveur physique Ryzen 9 – excellent rapport perf/prix pour rendering, IA, bases de données',
        shortSpecs: '12 cœurs • 64 Go • 2×1 To NVMe',
        priceMonthly: 149.90,
        priceYearly: 1499.00,
        priceTriennial: 4197.00, // -7% supplémentaire
        status: 'active',
        isFeatured: false,
        isConfigurable: true,
        popular: false,
        salesCount: 38,
        tags: ['bare-metal', 'ryzen', 'haute-perf'],
        mainSpecs: {
            cpu: 'AMD Ryzen 9 5900X / 5950X',
            ram: '64 Go DDR4 ECC (ext. 128 Go)',
            storage: '2 × 1 To NVMe',
            bandwidth: '1 Gbps – illimité',
        },
        imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800', // serveur bare-metal / rack haute perf
    },
    // ... vous pouvez ajouter beaucoup plus
];

// ────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────
export default function ProductManagementPro() {
    const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(p => {
            const matchSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.shortSpecs.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat = activeCategory === 'all' || p.category === activeCategory;
            return matchSearch && matchCat;
        });
    }, [searchTerm, activeCategory]);

    const openModal = (product?: Product) => {
        setEditingProduct(product || null);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/70 dark:bg-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Catalogue Produits & Services
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Gérez l’ensemble de votre offre commerciale – VPS, hébergement, serveurs dédiés, sécurité…
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    >
                        <Plus size={18} />
                        Nouveau produit/service
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats rapides */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {[
                        { label: 'Produits actifs', value: PRODUCTS.length, icon: Package, color: 'orange' },
                        { label: 'Ventes 30j', value: '1 842', change: '+14%', icon: ShoppingCart, color: 'green' },
                        { label: 'Revenus récurrents MRR', value: '€128.4K', change: '+19%', icon: DollarSign, color: 'purple' },
                        { label: 'Taux de popularité', value: '92%', icon: TrendingUp, color: 'amber' },
                    ].map(s => (
                        <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-${s.color}-100/60 dark:bg-${s.color}-950/40`}>
                                    <s.icon className={`w-6 h-6 text-${s.color}-600 dark:text-${s.color}-400`} />
                                </div>
                                {s.change && (
                                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">{s.change}</span>
                                )}
                            </div>
                            <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filtres catégories */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-8 overflow-x-auto">
                    <div className="flex gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${activeCategory === cat.id
                                    ? 'bg-orange-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <cat.icon size={18} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Barre de recherche */}
                <div className="relative mb-8 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="search"
                        placeholder="Rechercher un produit, une référence, un mot-clé…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                </div>

                {/* Grille produits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 shadow-sm hover:shadow-xl"
                        >
                            {/* IMAGE EN TÊTE – plein largeur */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1558494949-ef0d7d4b0d5c?auto=format&fit=crop&q=80&w=800'; // Fallback
                                    }}
                                />
                                {/* Overlay gradient + badge populaire/tier */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div className="text-white">
                                        <h3 className="text-xl font-bold drop-shadow-md">{product.name}</h3>
                                        <p className="text-sm opacity-90">{product.shortSpecs}</p>
                                    </div>
                                    {product.popular && (
                                        <span className="px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full shadow">
                                            Populaire
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contenu dessous */}
                            <div className="p-6">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex items-end justify-between mb-5">
                                    <div>
                                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                            €{product.priceMonthly.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            / mois • Annuel: €{product.priceYearly.toFixed(0)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{product.salesCount} ventes</div>
                                        <div className="flex items-center gap-1 justify-end text-green-600 dark:text-green-400 text-xs mt-1">
                                            <CheckCircle2 size={14} />
                                            Actif
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {product.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">
                                        Voir détails
                                    </button>
                                    <button
                                        onClick={() => openModal(product)}
                                        className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                    >
                                        Modifier
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        Aucun produit ne correspond à votre recherche ou catégorie sélectionnée.
                    </div>
                )}
            </main>

            {/* Modal amélioration significative */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold">
                                {editingProduct ? 'Modifier le produit' : 'Créer un nouveau produit/service'}
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1.5">Image du produit</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group relative">
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // TODO: Ajouter un loader ici si nécessaire
                                                    const publicUrl = await uploadProductImage(file);
                                                    if (publicUrl && editingProduct) {
                                                        setEditingProduct({ ...editingProduct, imageUrl: publicUrl });
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="space-y-1 text-center">
                                            <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors">
                                                {editingProduct?.imageUrl ? (
                                                    <img src={editingProduct.imageUrl} alt="Preview" className="h-full w-full object-cover rounded shadow-sm" />
                                                ) : (
                                                    <Cloud className="mx-auto h-12 w-12" />
                                                )}
                                            </div>
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                                <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    Télécharger un fichier
                                                </span>
                                                <p className="pl-1">ou glisser-déposer</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                PNG, JPG, WEBP jusqu'à 5Mo
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Nom – Catégorie – Tier */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1.5">Nom commercial</label>
                                    <input
                                        defaultValue={editingProduct?.name}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500/40"
                                        placeholder="ex : VPS Business NVMe – 8 Go"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Catégorie</label>
                                    <select
                                        defaultValue={editingProduct?.category}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                                    >
                                        <option value="vps">VPS</option>
                                        <option value="hosting">Hébergement mutualisé</option>
                                        <option value="dedicated">Serveur dédié</option>
                                        <option value="storage">Stockage / Sauvegarde</option>
                                        <option value="security">Sécurité / SSL</option>
                                        <option value="services">Services additionnels</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Positionnement / Tier</label>
                                    <select
                                        defaultValue={editingProduct?.tier || ''}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                                    >
                                        <option value="">Aucun positionnement</option>
                                        <option value="starter">Starter</option>
                                        <option value="pro">Pro</option>
                                        <option value="business">Business</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>

                                {/* Prix */}
                                <div className="md:col-span-2 mt-4 border-t border-gray-200 dark:border-gray-800 pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Tarification</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Prix mensuel HT</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    defaultValue={editingProduct?.priceMonthly}
                                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Prix annuel HT</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    defaultValue={editingProduct?.priceYearly}
                                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Prix triennal HT (option)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    defaultValue={editingProduct?.priceTriennial || ''}
                                                    placeholder="—"
                                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-4 border-t border-gray-200 dark:border-gray-800 pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Description courte ou slogans</label>
                                        <textarea
                                            defaultValue={editingProduct?.description}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 h-24"
                                            placeholder="Une brève description pour attirer l'attention..."
                                        />
                                    </div>
                                </div>

                                {/* Actions finales */}
                                <div className="md:col-span-2 mt-8 flex gap-4 justify-end">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-6 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Annuler
                                    </button>
                                    <button className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm">
                                        {editingProduct ? 'Enregistrer les modifications' : 'Créer le produit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
