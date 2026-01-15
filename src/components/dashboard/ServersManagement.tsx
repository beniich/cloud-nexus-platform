import React, { useState } from 'react';
import { Server, Plus, Search, MoreVertical, Power, PowerOff, RefreshCw, Trash2, Edit, Activity, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle, Clock, Database, Globe } from 'lucide-react';

// ============================================
// DONNÉES INITIALES
// ============================================

const INITIAL_SERVERS = [
    {
        id: 'srv-001',
        name: 'Production Web Server',
        ip: '192.168.1.100',
        status: 'running',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: '4 vCPUs',
        ram: '8 GB',
        storage: '160 GB SSD',
        bandwidth: '5 TB',
        uptime: '99.99%',
        lastBackup: '2025-01-12 08:30',
        createdAt: '2024-12-01',
        monthlyPrice: 48,
        tags: ['production', 'web', 'critical']
    },
    {
        id: 'srv-002',
        name: 'Database Server',
        ip: '192.168.1.101',
        status: 'running',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: '8 vCPUs',
        ram: '16 GB',
        storage: '320 GB SSD',
        bandwidth: '6 TB',
        uptime: '99.95%',
        lastBackup: '2025-01-12 06:00',
        createdAt: '2024-11-15',
        monthlyPrice: 96,
        tags: ['production', 'database']
    },
    {
        id: 'srv-003',
        name: 'Development Server',
        ip: '192.168.1.102',
        status: 'stopped',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: '2 vCPUs',
        ram: '4 GB',
        storage: '80 GB SSD',
        bandwidth: '4 TB',
        uptime: '98.50%',
        lastBackup: '2025-01-11 22:00',
        createdAt: '2024-12-10',
        monthlyPrice: 24,
        tags: ['development', 'testing']
    },
    {
        id: 'srv-004',
        name: 'Staging Server',
        ip: '192.168.1.103',
        status: 'running',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: '4 vCPUs',
        ram: '8 GB',
        storage: '160 GB SSD',
        bandwidth: '5 TB',
        uptime: '99.80%',
        lastBackup: '2025-01-12 04:00',
        createdAt: '2024-11-20',
        monthlyPrice: 48,
        tags: ['staging', 'testing']
    }
];

const SERVER_PROVIDERS = ['DigitalOcean', 'AWS', 'Google Cloud', 'Azure', 'Linode'];
const SERVER_REGIONS = ['NYC3', 'SFO3', 'AMS3', 'SGP1', 'LON1', 'FRA1'];
const OS_OPTIONS = ['Ubuntu 22.04', 'Ubuntu 20.04', 'Debian 11', 'CentOS 8', 'Fedora 37'];

// ============================================
// COMPOSANTS
// ============================================

function ServerCard({ server, onAction }) {
    const [showMenu, setShowMenu] = useState(false);

    const statusConfig = {
        running: { color: 'green', icon: CheckCircle, label: 'En ligne' },
        stopped: { color: 'red', icon: PowerOff, label: 'Arrêté' },
        maintenance: { color: 'yellow', icon: Clock, label: 'Maintenance' },
        error: { color: 'red', icon: AlertCircle, label: 'Erreur' }
    };

    const status = statusConfig[server.status] || statusConfig.running;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-${status.color}-100 dark:bg-${status.color}-900 flex items-center justify-center`}>
                        <Server className={`w-6 h-6 text-${status.color}-600`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{server.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{server.ip}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                            <button
                                onClick={() => { onAction('edit', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Modifier
                            </button>
                            <button
                                onClick={() => { onAction(server.status === 'running' ? 'stop' : 'start', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                {server.status === 'running' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                {server.status === 'running' ? 'Arrêter' : 'Démarrer'}
                            </button>
                            <button
                                onClick={() => { onAction('restart', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Redémarrer
                            </button>
                            <button
                                onClick={() => { onAction('delete', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
                <status.icon className={`w-4 h-4 text-${status.color}-600`} />
                <span className={`text-sm font-medium text-${status.color}-600`}>{status.label}</span>
                <span className="text-sm text-gray-500">• Uptime: {server.uptime}</span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Cpu className="w-4 h-4" />
                    <span>{server.cpu}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>{server.ram}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <HardDrive className="w-4 h-4" />
                    <span>{server.storage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Wifi className="w-4 h-4" />
                    <span>{server.bandwidth}</span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {server.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="w-4 h-4 inline mr-1" />
                    {server.region}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${server.monthlyPrice}/mois
                </div>
            </div>
        </div>
    );
}

function CreateServerModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: '2 vCPUs',
        ram: '4 GB',
        storage: '80 GB SSD',
        tags: []
    });

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData({
            name: '',
            provider: 'DigitalOcean',
            region: 'NYC3',
            os: 'Ubuntu 22.04',
            cpu: '2 vCPUs',
            ram: '4 GB',
            storage: '80 GB SSD',
            tags: []
        });
    };

    const addTag = () => {
        if (tagInput && !formData.tags.includes(tagInput)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un nouveau serveur</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Power className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nom du serveur */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nom du serveur *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="ex: Production Web Server"
                        />
                    </div>

                    {/* Provider et Région */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fournisseur
                            </label>
                            <select
                                value={formData.provider}
                                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                {SERVER_PROVIDERS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Région
                            </label>
                            <select
                                value={formData.region}
                                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                {SERVER_REGIONS.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* OS */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Système d'exploitation
                        </label>
                        <select
                            value={formData.os}
                            onChange={(e) => setFormData(prev => ({ ...prev, os: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            {OS_OPTIONS.map(os => (
                                <option key={os} value={os}>{os}</option>
                            ))}
                        </select>
                    </div>

                    {/* Spécifications */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CPU
                            </label>
                            <select
                                value={formData.cpu}
                                onChange={(e) => setFormData(prev => ({ ...prev, cpu: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option>1 vCPU</option>
                                <option>2 vCPUs</option>
                                <option>4 vCPUs</option>
                                <option>8 vCPUs</option>
                                <option>16 vCPUs</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                RAM
                            </label>
                            <select
                                value={formData.ram}
                                onChange={(e) => setFormData(prev => ({ ...prev, ram: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option>2 GB</option>
                                <option>4 GB</option>
                                <option>8 GB</option>
                                <option>16 GB</option>
                                <option>32 GB</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Stockage
                            </label>
                            <select
                                value={formData.storage}
                                onChange={(e) => setFormData(prev => ({ ...prev, storage: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option>50 GB SSD</option>
                                <option>80 GB SSD</option>
                                <option>160 GB SSD</option>
                                <option>320 GB SSD</option>
                                <option>640 GB SSD</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Ajouter un tag..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Ajouter
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Créer le serveur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function ServersManagement() {
    const [servers, setServers] = useState(INITIAL_SERVERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredServers = servers.filter(server => {
        const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            server.ip.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || server.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleServerAction = (action, server) => {
        switch (action) {
            case 'start':
                setServers(prev => prev.map(s =>
                    s.id === server.id ? { ...s, status: 'running' } : s
                ));
                break;
            case 'stop':
                setServers(prev => prev.map(s =>
                    s.id === server.id ? { ...s, status: 'stopped' } : s
                ));
                break;
            case 'restart':
                setServers(prev => prev.map(s =>
                    s.id === server.id ? { ...s, status: 'running' } : s
                ));
                break;
            case 'delete':
                if (confirm(`Supprimer le serveur ${server.name} ?`)) {
                    setServers(prev => prev.filter(s => s.id !== server.id));
                }
                break;
            case 'edit':
                console.log('Edit server:', server);
                break;
        }
    };

    const handleCreateServer = (formData) => {
        const newServer = {
            id: `srv-${Date.now()}`,
            ...formData,
            ip: `192.168.1.${100 + servers.length}`,
            status: 'running',
            bandwidth: '4 TB',
            uptime: '100%',
            lastBackup: new Date().toISOString().slice(0, 16).replace('T', ' '),
            createdAt: new Date().toISOString().split('T')[0],
            monthlyPrice: 24,
            tags: formData.tags || []
        };
        setServers(prev => [...prev, newServer]);
    };

    const stats = {
        total: servers.length,
        running: servers.filter(s => s.status === 'running').length,
        stopped: servers.filter(s => s.status === 'stopped').length,
        totalCost: servers.reduce((acc, s) => acc + s.monthlyPrice, 0)
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Serveurs</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Gérez et surveillez vos serveurs cloud
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau serveur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Serveurs</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <Server className="w-10 h-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">En ligne</p>
                            <p className="text-3xl font-bold text-green-600">{stats.running}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Arrêtés</p>
                            <p className="text-3xl font-bold text-red-600">{stats.stopped}</p>
                        </div>
                        <PowerOff className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Coût mensuel</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalCost}</p>
                        </div>
                        <Activity className="w-10 h-10 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou IP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Filter by status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="running">En ligne</option>
                        <option value="stopped">Arrêtés</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            {/* Servers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServers.map(server => (
                    <ServerCard
                        key={server.id}
                        server={server}
                        onAction={handleServerAction}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredServers.length === 0 && (
                <div className="text-center py-12">
                    <Server className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Aucun serveur trouvé
                    </p>
                </div>
            )}

            {/* Create Modal */}
            <CreateServerModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateServer}
            />
        </div>
    );
}
