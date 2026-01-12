import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle, User, Tag, Send, Paperclip, MoreVertical, RefreshCw, Star, TrendingUp } from 'lucide-react';

const TicketSupportSystem = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [replyText, setReplyText] = useState('');

    const stats = [
        { label: 'Tickets Ouverts', value: '24', change: '-8%', icon: AlertCircle, color: 'orange' },
        { label: 'En cours', value: '12', change: '+5%', icon: Clock, color: 'blue' },
        { label: 'Résolus aujourd\'hui', value: '18', change: '+12%', icon: CheckCircle, color: 'green' },
        { label: 'Temps de réponse', value: '2.4h', change: '-15%', icon: TrendingUp, color: 'purple' }
    ];

    const tickets = [
        {
            id: 'TCK-1001',
            subject: 'Problème de connexion au serveur VPS',
            customer: 'Sophie Martin',
            customerEmail: 'sophie.martin@techcorp.fr',
            category: 'Technique',
            priority: 'high',
            status: 'open',
            created: '2024-01-12 10:30',
            updated: '2024-01-12 14:20',
            assignedTo: 'Jean Dupont',
            messages: [
                {
                    id: 1,
                    author: 'Sophie Martin',
                    role: 'customer',
                    message: 'Bonjour, je n\'arrive plus à me connecter à mon serveur VPS depuis ce matin. J\'obtiens une erreur de timeout.',
                    timestamp: '2024-01-12 10:30',
                    attachments: ['screenshot.png']
                },
                {
                    id: 2,
                    author: 'Jean Dupont',
                    role: 'support',
                    message: 'Bonjour Sophie, je vais vérifier votre serveur immédiatement. Pouvez-vous me confirmer l\'adresse IP du serveur concerné ?',
                    timestamp: '2024-01-12 10:45',
                    attachments: []
                },
                {
                    id: 3,
                    author: 'Sophie Martin',
                    role: 'customer',
                    message: 'Oui, c\'est le serveur 192.168.1.100',
                    timestamp: '2024-01-12 11:00',
                    attachments: []
                }
            ]
        },
        {
            id: 'TCK-1002',
            subject: 'Demande d\'upgrade de plan d\'hébergement',
            customer: 'Pierre Dubois',
            customerEmail: 'p.dubois@innolabs.com',
            category: 'Facturation',
            priority: 'medium',
            status: 'in-progress',
            created: '2024-01-12 09:15',
            updated: '2024-01-12 13:00',
            assignedTo: 'Marie Laurent',
            messages: [
                {
                    id: 1,
                    author: 'Pierre Dubois',
                    role: 'customer',
                    message: 'Bonjour, je souhaiterais upgrader mon plan d\'hébergement actuel vers le plan Business.',
                    timestamp: '2024-01-12 09:15',
                    attachments: []
                }
            ]
        },
        {
            id: 'TCK-1003',
            subject: 'Question sur les sauvegardes automatiques',
            customer: 'Marie Lefebvre',
            customerEmail: 'm.lefebvre@digital.fr',
            category: 'Question',
            priority: 'low',
            status: 'open',
            created: '2024-01-12 08:45',
            updated: '2024-01-12 08:45',
            assignedTo: 'Non assigné',
            messages: [
                {
                    id: 1,
                    author: 'Marie Lefebvre',
                    role: 'customer',
                    message: 'Bonjour, pouvez-vous m\'expliquer comment fonctionnent les sauvegardes automatiques sur mon VPS ?',
                    timestamp: '2024-01-12 08:45',
                    attachments: []
                }
            ]
        },
        {
            id: 'TCK-1004',
            subject: 'Certificat SSL ne se renouvelle pas',
            customer: 'Thomas Bernard',
            customerEmail: 't.bernard@startup.io',
            category: 'Technique',
            priority: 'high',
            status: 'open',
            created: '2024-01-11 16:30',
            updated: '2024-01-12 10:00',
            assignedTo: 'Jean Dupont',
            messages: [
                {
                    id: 1,
                    author: 'Thomas Bernard',
                    role: 'customer',
                    message: 'Mon certificat SSL expire dans 3 jours et le renouvellement automatique ne semble pas fonctionner.',
                    timestamp: '2024-01-11 16:30',
                    attachments: []
                }
            ]
        },
        {
            id: 'TCK-1005',
            subject: 'Demande de refund',
            customer: 'Emma Rousseau',
            customerEmail: 'e.rousseau@ecom.fr',
            category: 'Facturation',
            priority: 'medium',
            status: 'resolved',
            created: '2024-01-10 14:00',
            updated: '2024-01-11 16:00',
            assignedTo: 'Marie Laurent',
            messages: [
                {
                    id: 1,
                    author: 'Emma Rousseau',
                    role: 'customer',
                    message: 'Je souhaite obtenir un remboursement pour mon abonnement mensuel.',
                    timestamp: '2024-01-10 14:00',
                    attachments: []
                },
                {
                    id: 2,
                    author: 'Marie Laurent',
                    role: 'support',
                    message: 'Bonjour Emma, votre demande de remboursement a été traitée. Vous recevrez le montant sous 3-5 jours ouvrés.',
                    timestamp: '2024-01-11 16:00',
                    attachments: []
                }
            ]
        }
    ];

    const statusConfig: any = {
        open: { label: 'Ouvert', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
        'in-progress': { label: 'En cours', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
        resolved: { label: 'Résolu', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
        closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400', icon: XCircle }
    };

    const priorityConfig: any = {
        high: { label: 'Haute', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
        medium: { label: 'Moyenne', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
        low: { label: 'Basse', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || ticket.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        console.log('Envoi de la réponse:', replyText);
        setReplyText('');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Support Client
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Gestion des tickets et demandes de support
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewTicket(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau Ticket
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
                                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tickets List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                                {[
                                    { id: 'all', label: 'Tous', count: tickets.length },
                                    { id: 'open', label: 'Ouverts', count: tickets.filter(t => t.status === 'open').length },
                                    { id: 'in-progress', label: 'En cours', count: tickets.filter(t => t.status === 'in-progress').length },
                                    { id: 'resolved', label: 'Résolus', count: tickets.filter(t => t.status === 'resolved').length }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === tab.id
                                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un ticket..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Tickets */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                                {filteredTickets.map(ticket => {
                                    const StatusIcon = statusConfig[ticket.status].icon;
                                    return (
                                        <div
                                            key={ticket.id}
                                            onClick={() => setSelectedTicket(ticket)}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                                                            {ticket.id}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityConfig[ticket.priority].color}`}>
                                                            {priorityConfig[ticket.priority].label}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusConfig[ticket.status].color}`}>
                                                            {statusConfig[ticket.status].label}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                                        {ticket.subject}
                                                    </h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            {ticket.customer}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Tag className="w-4 h-4" />
                                                            {ticket.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Mis à jour
                                                    </div>
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {new Date(ticket.updated).toLocaleString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Ticket Detail */}
                    <div className="lg:col-span-1">
                        {selectedTicket ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                {/* Header */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                                                {selectedTicket.id}
                                            </span>
                                            <h3 className="font-bold text-gray-900 dark:text-white mt-1">
                                                {selectedTicket.subject}
                                            </h3>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Status & Priority */}
                                    <div className="flex gap-2 mb-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusConfig[selectedTicket.status].color}`}>
                                            {statusConfig[selectedTicket.status].label}
                                        </span>
                                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${priorityConfig[selectedTicket.priority].color}`}>
                                            {priorityConfig[selectedTicket.priority].label}
                                        </span>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Client</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {selectedTicket.customer}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedTicket.customerEmail}
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Catégorie:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {selectedTicket.category}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Assigné à:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {selectedTicket.assignedTo}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Créé:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {new Date(selectedTicket.created).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                                    {selectedTicket.messages.map((msg: any) => (
                                        <div
                                            key={msg.id}
                                            className={`${msg.role === 'customer'
                                                    ? 'bg-gray-100 dark:bg-gray-700'
                                                    : 'bg-blue-50 dark:bg-blue-900/20'
                                                } rounded-lg p-3`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'customer'
                                                        ? 'bg-gray-300 dark:bg-gray-600'
                                                        : 'bg-blue-500'
                                                    } text-white text-sm font-semibold`}>
                                                    {msg.author[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                                                        {msg.author}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(msg.timestamp).toLocaleString('fr-FR')}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {msg.message}
                                            </p>
                                            {msg.attachments.length > 0 && (
                                                <div className="mt-2 flex gap-2">
                                                    {msg.attachments.map((att: any, idx: any) => (
                                                        <span key={idx} className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                                                            📎 {att}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Reply Box */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Écrire une réponse..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mb-2"
                                    />
                                    <div className="flex gap-2">
                                        <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleSendReply}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <Send className="w-4 h-4" />
                                            Envoyer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Sélectionnez un ticket pour voir les détails
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Ticket Modal */}
            {showNewTicket && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Nouveau Ticket
                            </h3>
                            <button
                                onClick={() => setShowNewTicket(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sujet
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Décrivez brièvement le problème..."
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Catégorie
                                        </label>
                                        <select className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            <option>Technique</option>
                                            <option>Facturation</option>
                                            <option>Question</option>
                                            <option>Autre</option>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Décrivez le problème en détail..."
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowNewTicket(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => setShowNewTicket(false)}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Créer le ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSupportSystem;
