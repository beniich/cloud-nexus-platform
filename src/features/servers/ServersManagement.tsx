import React, { useState } from 'react';
import { Server, Plus, Search, Filter, MoreVertical, Power, PowerOff, RefreshCw, Trash2, Edit, Activity, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle, Clock, Database, Globe } from 'lucide-react';

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
    }
];

const SERVER_PROVIDERS = ['DigitalOcean', 'AWS', 'Google Cloud', 'Azure', 'Linode'];
const SERVER_REGIONS = ['NYC3', 'SFO3', 'AMS3', 'SGP1', 'LON1', 'FRA1'];
const OS_OPTIONS = ['Ubuntu 22.04', 'Ubuntu 20.04', 'Debian 11', 'CentOS 8', 'Fedora 37'];

function ServerCard({ server, onAction }) {
    const [showMenu, setShowMenu] = useState(false);

    // Status configuration helper
    const getStatusConfig = (status) => {
        switch (status) {
            case 'running': return { color: 'green', icon: CheckCircle, label: 'En ligne' };
            case 'stopped': return { color: 'red', icon: PowerOff, label: 'Arrêté' };
            case 'maintenance': return { color: 'yellow', icon: Clock, label: 'Maintenance' };
            default: return { color: 'red', icon: AlertCircle, label: 'Erreur' };
        }
    };

    const status = getStatusConfig(server.status);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
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
                            <button onClick={() => { onAction('edit', server); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                <Edit className="w-4 h-4" /> Modifier
                            </button>
                            <button onClick={() => { onAction(server.status === 'running' ? 'stop' : 'start', server); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                {server.status === 'running' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                {server.status === 'running' ? 'Arrêter' : 'Démarrer'}
                            </button>
                            <button onClick={() => { onAction('delete', server); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <status.icon className={`w-4 h-4 text-${status.color}-600`} />
                <span className={`text-sm font-medium text-${status.color}-600`}>{status.label}</span>
                <span className="text-sm text-gray-500">• Uptime: {server.uptime}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Cpu className="w-4 h-4" /><span>{server.cpu}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Database className="w-4 h-4" /><span>{server.ram}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><HardDrive className="w-4 h-4" /><span>{server.storage}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Wifi className="w-4 h-4" /><span>{server.bandwidth}</span></div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {server.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">{tag}</span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400"><Globe className="w-4 h-4 inline mr-1" />{server.region}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">${server.monthlyPrice}/mois</div>
            </div>
        </div>
    );
}

function CreateServerModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '', provider: 'DigitalOcean', region: 'NYC3', os: 'Ubuntu 22.04', cpu: '2 vCPUs', ram: '4 GB', storage: '80 GB SSD', tags: []
    });
    const [tagInput, setTagInput] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!formData.name) return alert('Le nom du serveur est requis');
        onSubmit(formData);
        onClose();
    };

    const addTag = () => {
        if (tagInput && !formData.tags.includes(tagInput)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
            setTagInput('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un nouveau serveur</h2>
                    <button onClick={onClose}><Power className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Nom du serveur *</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" placeholder="ex: Production Web Server" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Fournisseur</label>
                            <select value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700">{SERVER_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Région</label>
                            <select value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700">{SERVER_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">OS</label>
                        <select value={formData.os} onChange={e => setFormData({ ...formData, os: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700">{OS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
                    </div>
                    {/* Simplified resource selection for brevity */}
                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-100">Annuler</button>
                        <button onClick={handleSubmit} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Créer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServersManagement() {
    const [servers, setServers] = useState(INITIAL_SERVERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredServers = servers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleCreateServer = (data) => {
        setServers([...servers, { ...data, id: `srv-${Date.now()}`, ip: '10.0.0.1', status: 'running', monthlyPrice: 20, uptime: '100%', tags: data.tags }]);
    };

    const handleServerAction = (action, server) => {
        if (action === 'delete') {
            setServers(servers.filter(s => s.id !== server.id));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Serveurs</h1>
                <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Plus className="w-5 h-5" /> Nouveau</button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServers.map(server => (
                    <ServerCard key={server.id} server={server} onAction={handleServerAction} />
                ))}
            </div>

            <CreateServerModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateServer} />
        </div>
    );
}
