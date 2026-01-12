import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Target, Phone, Mail, MapPin, Calendar, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Star, Clock, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const CRMHustel = () => {
    const [activeTab, setActiveTab] = useState('leads');
    const [selectedStage, setSelectedStage] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Données de démonstration
    const stats = [
        { label: 'Total Leads', value: '2,847', change: '+12.5%', icon: Users, color: 'blue' },
        { label: 'Conversions', value: '1,234', change: '+8.3%', icon: TrendingUp, color: 'green' },
        { label: 'Revenus', value: '€458K', change: '+23.1%', icon: DollarSign, color: 'purple' },
        { label: 'Taux de Conversion', value: '43.3%', change: '+5.2%', icon: Target, color: 'orange' }
    ];

    const leads = [
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
            tags: ['Enterprise', 'SaaS']
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
    ];

    const clients = [
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
    ];

    const pipeline = [
        { stage: 'new', label: 'Nouveaux Leads', count: 24, value: '€360K', color: 'bg-blue-500' },
        { stage: 'qualified', label: 'Qualifiés', count: 18, value: '€450K', color: 'bg-indigo-500' },
        { stage: 'proposal', label: 'Propositions', count: 12, value: '€540K', color: 'bg-purple-500' },
        { stage: 'negotiation', label: 'Négociations', count: 8, value: '€280K', color: 'bg-pink-500' },
        { stage: 'won', label: 'Gagnés', count: 15, value: '€825K', color: 'bg-green-500' }
    ];

    const activities = [
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
    ];

    const priorityColors: any = {
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    };

    const stageColors: any = {
        new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        qualified: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        proposal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        negotiation: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        won: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const statusColors: any = {
        active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
        pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
        return matchesSearch && matchesStage;
    });

    const openModal = (type: any, item: any = null) => {
        setModalType(type);
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRM Hustel</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Gestion complète des clients et leads
                        </p>
                    </div>
                    <button
                        onClick={() => openModal('add-lead')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau Lead
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
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

                {/* Pipeline */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pipeline de Ventes</h2>
                    <div className="grid grid-cols-5 gap-4">
                        {pipeline.map((stage, idx) => (
                            <div key={idx} className="text-center">
                                <div className={`${stage.color} text-white rounded-lg p-4 mb-3`}>
                                    <div className="text-2xl font-bold mb-1">{stage.count}</div>
                                    <div className="text-sm opacity-90">{stage.label}</div>
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">{stage.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'leads'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            Leads ({leads.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'clients'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            Clients ({clients.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('activities')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'activities'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            Activités ({activities.length})
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Search and Filters */}
                        {(activeTab === 'leads' || activeTab === 'clients') && (
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                {activeTab === 'leads' && (
                                    <select
                                        value={selectedStage}
                                        onChange={(e) => setSelectedStage(e.target.value)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    >
                                        <option value="all">Tous les stages</option>
                                        <option value="new">Nouveaux</option>
                                        <option value="qualified">Qualifiés</option>
                                        <option value="proposal">Propositions</option>
                                        <option value="negotiation">Négociations</option>
                                        <option value="won">Gagnés</option>
                                    </select>
                                )}
                            </div>
                        )}

                        {/* Leads Table */}
                        {activeTab === 'leads' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Lead</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Stage</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Valeur</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Priorité</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Source</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.map(lead => (
                                            <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-gray-900 dark:text-white">{lead.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">{lead.email}</span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">{lead.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${stageColors[lead.stage]}`}>
                                                        {pipeline.find(p => p.stage === lead.stage)?.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-semibold text-gray-900 dark:text-white">{lead.value}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[lead.priority]}`}>
                                                        {lead.priority === 'high' ? 'Haute' : lead.priority === 'medium' ? 'Moyenne' : 'Basse'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{lead.source}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openModal('edit-lead', lead)}
                                                            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Clients Table */}
                        {activeTab === 'clients' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Client</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Plan</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Revenus</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Serveurs</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map(client => (
                                            <tr key={client.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-gray-900 dark:text-white">{client.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Client depuis {client.since}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{client.contact}</span>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">{client.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-semibold">
                                                        {client.plan}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-semibold text-gray-900 dark:text-white">{client.revenue}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{client.servers} serveurs</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[client.status]}`}>
                                                        {client.status === 'active' ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Activities */}
                        {activeTab === 'activities' && (
                            <div className="space-y-4">
                                {activities.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className={`p-2 ${activity.color} bg-opacity-10 rounded-lg`}>
                                            <activity.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Lead: {activity.lead}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {modalType === 'add-lead' ? 'Nouveau Lead' : 'Modifier Lead'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedItem?.name}
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Entreprise
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedItem?.company}
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={selectedItem?.email}
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue={selectedItem?.phone}
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Source
                                    </label>
                                    <select className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                        <option>Site Web</option>
                                        <option>LinkedIn</option>
                                        <option>Email</option>
                                        <option>Téléphone</option>
                                        <option>Partenaire</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priorité
                                    </label>
                                    <select className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                        <option>Basse</option>
                                        <option>Moyenne</option>
                                        <option>Haute</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Notes
                                    </label>
                                    <textarea className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg h-24" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Annuler
                                </button>
                                <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Enregistrer le Lead
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMHustel;
