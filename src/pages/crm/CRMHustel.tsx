import React, { useState, useMemo } from 'react';
import {
    Users,
    TrendingUp,
    DollarSign,
    Target,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface Lead {
    id: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
    value: string;
    priority: 'high' | 'medium' | 'low';
    source: string;
    lastContact: string;
    tags: string[];
}

interface Client {
    id: number;
    name: string;
    contact: string;
    email: string;
    phone: string;
    since: string;
    revenue: string;
    status: 'active' | 'inactive' | 'pending';
    plan: string;
    servers: number;
    tickets: number;
}

interface Activity {
    id: number;
    type: 'call' | 'email' | 'meeting' | 'note';
    title: string;
    lead: string;
    time: string;
    icon: React.ElementType;
    color: string;
}

interface Stat {
    label: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface PipelineStage {
    stage: string;
    label: string;
    count: number;
    value: string;
    color: string;
}

// ────────────────────────────────────────────────
// Données (demo)
// ────────────────────────────────────────────────
const STATS: Stat[] = [
    { label: 'Total Leads', value: '2,847', change: '+12.5%', icon: Users, color: 'blue' },
    { label: 'Conversions', value: '1,234', change: '+8.3%', icon: TrendingUp, color: 'green' },
    { label: 'Revenus', value: '€458K', change: '+23.1%', icon: DollarSign, color: 'purple' },
    { label: 'Taux de Conversion', value: '43.3%', change: '+5.2%', icon: Target, color: 'orange' },
];

const PIPELINE_STAGES: PipelineStage[] = [
    { stage: 'new', label: 'Nouveaux Leads', count: 24, value: '€360K', color: 'bg-blue-600' },
    { stage: 'qualified', label: 'Qualifiés', count: 18, value: '€450K', color: 'bg-indigo-600' },
    { stage: 'proposal', label: 'Propositions', count: 12, value: '€540K', color: 'bg-purple-600' },
    { stage: 'negotiation', label: 'Négociations', count: 8, value: '€280K', color: 'bg-pink-600' },
    { stage: 'won', label: 'Gagnés', count: 15, value: '€825K', color: 'bg-green-600' },
];

const STAGE_LABELS: Record<string, string> = {
    new: 'Nouveau',
    qualified: 'Qualifié',
    proposal: 'Proposition',
    negotiation: 'Négociation',
    won: 'Gagné',
    lost: 'Perdu',
};

const PRIORITY_LABELS: Record<string, string> = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
};

// ────────────────────────────────────────────────
// Styles réutilisables
// ────────────────────────────────────────────────
const stageBadgeStyles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    qualified: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    proposal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    negotiation: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
    won: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const priorityBadgeStyles: Record<string, string> = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
};

const statusBadgeStyles: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
};

// ────────────────────────────────────────────────
// Composant principal
// ────────────────────────────────────────────────
export default function CRMHustle() {
    const [activeTab, setActiveTab] = useState<'leads' | 'clients' | 'activities'>('leads');
    const [selectedStage, setSelectedStage] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add-lead' | 'edit-lead'>('add-lead');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // ─── Données démo ───
    const leads = useMemo<Lead[]>(() => [
        {
            id: 1,
            name: 'Sophie Martin',
            company: 'TechCorp SA',
            email: 'sophie.martin@techcorp.fr',
            phone: '+33 6 12 34 56 78',
            stage: 'qualified',
            value: '€25,000',
            priority: 'high',
            source: 'Website',
            lastContact: '2024-01-10',
            tags: ['Enterprise', 'SaaS'],
        },
        {
            id: 2,
            name: 'Pierre Dubois',
            company: 'Innovation Labs',
            email: 'p.dubois@innolabs.com',
            phone: '+33 6 23 45 67 89',
            stage: 'proposal',
            value: '€45,000',
            priority: 'high',
            source: 'Référence',
            lastContact: '2024-01-11',
            tags: ['Cloud', 'Infrastructure']
        },
        {
            id: 3,
            name: 'Marie Lefebvre',
            company: 'Digital Solutions',
            email: 'm.lefebvre@digital.fr',
            phone: '+33 6 34 56 78 90',
            stage: 'negotiation',
            value: '€35,000',
            priority: 'medium',
            source: 'LinkedIn',
            lastContact: '2024-01-09',
            tags: ['Hosting', 'VPS']
        },
        {
            id: 4,
            name: 'Thomas Bernard',
            company: 'StartUp Inc',
            email: 't.bernard@startup.io',
            phone: '+33 6 45 67 89 01',
            stage: 'new',
            value: '€15,000',
            priority: 'low',
            source: 'Email Campaign',
            lastContact: '2024-01-12',
            tags: ['Startup', 'Web']
        },
        {
            id: 5,
            name: 'Emma Rousseau',
            company: 'E-Commerce Plus',
            email: 'e.rousseau@ecom.fr',
            phone: '+33 6 56 78 90 12',
            stage: 'won',
            value: '€55,000',
            priority: 'high',
            source: 'Partner',
            lastContact: '2024-01-08',
            tags: ['E-commerce', 'CDN']
        }
    ], []);

    const clients = useMemo<Client[]>(() => [
        {
            id: 1,
            name: 'Global Tech SARL',
            contact: 'Jean Dupont',
            email: 'j.dupont@globaltech.fr',
            phone: '+33 1 23 45 67 89',
            since: '2022-03-15',
            revenue: '€125,000',
            status: 'active',
            plan: 'Enterprise',
            servers: 12,
            tickets: 3
        },
        {
            id: 2,
            name: 'Cloud Systems',
            contact: 'Anne Laurent',
            email: 'a.laurent@cloudsys.com',
            phone: '+33 1 34 56 78 90',
            since: '2021-08-22',
            revenue: '€95,000',
            status: 'active',
            plan: 'Business',
            servers: 8,
            tickets: 1
        },
        {
            id: 3,
            name: 'WebHost Pro',
            contact: 'Marc Simon',
            email: 'm.simon@webhostpro.fr',
            phone: '+33 1 45 67 89 01',
            since: '2023-01-10',
            revenue: '€45,000',
            status: 'active',
            plan: 'Standard',
            servers: 5,
            tickets: 0
        },
        {
            id: 4,
            name: 'Data Solutions',
            contact: 'Claire Moreau',
            email: 'c.moreau@datasol.fr',
            phone: '+33 1 56 78 90 12',
            since: '2020-11-05',
            revenue: '€185,000',
            status: 'active',
            plan: 'Enterprise',
            servers: 18,
            tickets: 5
        }
    ], []);

    const activities = useMemo<Activity[]>(() => [
        {
            id: 1,
            type: 'call',
            title: 'Appel avec Sophie Martin',
            lead: 'Sophie Martin',
            time: 'Il y a 2 heures',
            icon: Phone,
            color: 'text-blue-500'
        },
        {
            id: 2,
            type: 'email',
            title: 'Email envoyé à Pierre Dubois',
            lead: 'Pierre Dubois',
            time: 'Il y a 4 heures',
            icon: Mail,
            color: 'text-purple-500'
        },
        {
            id: 3,
            type: 'meeting',
            title: 'Réunion avec Marie Lefebvre',
            lead: 'Marie Lefebvre',
            time: 'Hier à 14:30',
            icon: Calendar,
            color: 'text-green-500'
        },
        {
            id: 4,
            type: 'note',
            title: 'Note ajoutée pour Thomas Bernard',
            lead: 'Thomas Bernard',
            time: 'Hier à 16:45',
            icon: Edit,
            color: 'text-orange-500'
        }
    ], []);

    const filteredLeads = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return leads.filter(
            (lead) =>
                (lead.name.toLowerCase().includes(term) || lead.company.toLowerCase().includes(term)) &&
                (selectedStage === 'all' || lead.stage === selectedStage)
        );
    }, [leads, searchTerm, selectedStage]);

    const filteredClients = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return clients.filter(
            (client) =>
                (client.name.toLowerCase().includes(term) || client.contact.toLowerCase().includes(term) || client.email.toLowerCase().includes(term))
        );
    }, [clients, searchTerm]);

    const openLeadModal = (type: 'add-lead' | 'edit-lead', lead?: Lead) => {
        setModalType(type);
        setSelectedLead(lead || null);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold">CRM Hustle</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gestion des leads & clients</p>
                    </div>
                    <button
                        onClick={() => openLeadModal('add-lead')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Nouveau Lead
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-950/40 text-${stat.color}-600 dark:text-${stat.color}-400`}
                                >
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-green-600 dark:text-green-400 text-sm font-semibold">{stat.change}</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Pipeline */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-10 shadow-sm">
                    <h2 className="text-lg font-semibold mb-5">Pipeline de ventes</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {PIPELINE_STAGES.map((s) => (
                            <div key={s.stage} className="text-center">
                                <div className={`${s.color} text-white rounded-xl py-4 px-3 mb-3 shadow-sm`}>
                                    <div className="text-3xl font-bold mb-1">{s.count}</div>
                                    <div className="text-sm font-medium opacity-95">{s.label}</div>
                                </div>
                                <div className="text-xl font-semibold">{s.value}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Onglets + contenu */}
                <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        {(['leads', 'clients', 'activities'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3.5 px-6 font-medium text-center transition-colors ${activeTab === tab
                                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab === 'leads'
                                    ? `Leads (${leads.length})`
                                    : tab === 'clients'
                                        ? `Clients (${clients.length})`
                                        : `Activités (${activities.length})`}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {(activeTab === 'leads' || activeTab === 'clients') && (
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="search"
                                        placeholder={activeTab === 'leads' ? "Rechercher un lead, une entreprise..." : "Rechercher un client..."}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                </div>

                                {activeTab === 'leads' && (
                                    <select
                                        value={selectedStage}
                                        onChange={(e) => setSelectedStage(e.target.value)}
                                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg min-w-[180px]"
                                    >
                                        <option value="all">Tous les stades</option>
                                        {Object.entries(STAGE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* ─── Tableau Leads ─── */}
                        {activeTab === 'leads' && (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50">
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Lead</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Stade</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Valeur</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Priorité</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Source</th>
                                            <th className="text-center py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.map((lead) => (
                                            <tr
                                                key={lead.id}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="font-medium">{lead.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex flex-col">
                                                        <span>{lead.email}</span>
                                                        <span className="text-xs text-gray-500">{lead.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${stageBadgeStyles[lead.stage]}`}
                                                    >
                                                        {STAGE_LABELS[lead.stage] ?? lead.stage}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-medium">{lead.value}</td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${priorityBadgeStyles[lead.priority]}`}
                                                    >
                                                        {PRIORITY_LABELS[lead.priority]}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{lead.source}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            title="Voir"
                                                            aria-label="Voir le lead"
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            title="Modifier"
                                                            aria-label="Modifier le lead"
                                                            onClick={() => openLeadModal('edit-lead', lead)}
                                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            title="Supprimer"
                                                            aria-label="Supprimer le lead"
                                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ─── Tableau Clients ─── */}
                        {activeTab === 'clients' && (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50">
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Client</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Plan</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Revenus</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Serveurs</th>
                                            <th className="text-left py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Statut</th>
                                            <th className="text-center py-3.5 px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClients.map((client) => (
                                            <tr
                                                key={client.id}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="font-medium">{client.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Depuis {client.since}</div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900 dark:text-gray-200">{client.contact}</span>
                                                        <span className="text-xs text-gray-500">{client.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                                        {client.plan}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-medium">{client.revenue}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{client.servers} serveurs</td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusBadgeStyles[client.status]}`}
                                                    >
                                                        {client.status === 'active' ? 'Actif' : client.status === 'inactive' ? 'Inactif' : 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            title="Voir"
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            title="Modifier"
                                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            title="Plus"
                                                            className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ─── Liste Activités ─── */}
                        {activeTab === 'activities' && (
                            <div className="space-y-4">
                                {activities.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                        <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${activity.color}`}>
                                            <activity.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{activity.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Concerne: <span className="font-medium text-indigo-600 dark:text-indigo-400">{activity.lead}</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                <Clock size={14} />
                                                {activity.time}
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Modal Lead */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-semibold">
                                {modalType === 'add-lead' ? 'Nouveau Lead' : 'Modifier le Lead'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedLead?.name}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                                        placeholder="Ex: Jean Dupont"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Entreprise
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedLead?.company}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                                        placeholder="Ex: Acme Corp"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={selectedLead?.email}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                                        placeholder="jean@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue={selectedLead?.phone}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                                        placeholder="+33 6 00 00 00 00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Priorité
                                    </label>
                                    <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                                        <option value="low">Basse</option>
                                        <option value="medium">Moyenne</option>
                                        <option value="high">Haute</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                        Source
                                    </label>
                                    <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                                        <option value="website">Site Web</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="referral">Recommandation</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 mt-4 flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-2.5 px-5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button className="flex-1 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/20">
                                        {modalType === 'add-lead' ? 'Créer le lead' : 'Enregistrer'}
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
