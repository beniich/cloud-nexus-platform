import React, { useState, useEffect } from 'react';
import { Server as ServerIcon, Plus, Search, Filter, MoreVertical, Power, PowerOff, RefreshCw, Trash2, Edit, Activity, Cpu, HardDrive, Wifi, AlertCircle, CheckCircle, Clock, Database, Globe, Lock, Terminal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropletService } from '../../features/cloud/services/DropletService';
import { toast } from 'sonner';

// ============================================
// DONNÉES & INTERFACES
// ============================================

interface ServerData {
    id: string;
    name: string;
    ip: string;
    status: 'running' | 'stopped' | 'maintenance' | 'error' | 'archive' | 'new';
    provider: string;
    region: string;
    os: string;
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
    uptime: string;
    lastBackup: string;
    createdAt: string;
    monthlyPrice: number;
    tags: string[];
}

const SERVER_PROVIDERS = ['DigitalOcean', 'AWS', 'Google Cloud', 'Azure', 'Linode'];
const SERVER_REGIONS = ['NYC3', 'SFO3', 'AMS3', 'SGP1', 'LON1', 'FRA1'];
const OS_OPTIONS = ['Ubuntu 22.04', 'Ubuntu 20.04', 'Debian 11', 'CentOS 8', 'Fedora 37'];

// ============================================
// COMPOSANTS
// ============================================

interface ServerCardProps {
    server: ServerData;
    onAction: (action: string, server: ServerData) => void;
    isProcessing?: boolean;
}

function ServerCard({ server, onAction, isProcessing }: ServerCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
        running: { color: 'green', icon: CheckCircle, label: 'En ligne' },
        active: { color: 'green', icon: CheckCircle, label: 'En ligne' }, // API uses 'active' sometimes or 'running'
        stopped: { color: 'red', icon: PowerOff, label: 'Arrêté' },
        off: { color: 'red', icon: PowerOff, label: 'Arrêté' },
        maintenance: { color: 'yellow', icon: Clock, label: 'Maintenance' },
        error: { color: 'red', icon: AlertCircle, label: 'Erreur' },
        archive: { color: 'gray', icon: Database, label: 'Archivé' },
        new: { color: 'blue', icon: Activity, label: 'Création...' }
    };

    // Fallback for unknown status
    const normalizedStatus = server.status === 'active' ? 'running' : (server.status === 'off' ? 'stopped' : server.status);
    const status = statusConfig[normalizedStatus] || statusConfig.error;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 relative">
            {isProcessing && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-20 flex items-center justify-center rounded-xl backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-${status.color}-100 dark:bg-${status.color}-900 flex items-center justify-center`}>
                        <ServerIcon className={`w-6 h-6 text-${status.color}-600`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{server.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{server.ip || 'IP en attente...'}</p>
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
                                onClick={() => { onAction('terminal', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600 dark:text-blue-400"
                            >
                                <Terminal className="w-4 h-4" />
                                Terminal
                            </button>
                            <button
                                onClick={() => { onAction('edit', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Modifier
                            </button>
                            <button
                                onClick={() => { onAction(normalizedStatus === 'running' ? 'stop' : 'start', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                {normalizedStatus === 'running' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                {normalizedStatus === 'running' ? 'Arrêter' : 'Démarrer'}
                            </button>
                            <button
                                onClick={() => { onAction('restart', server); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Redémarrer
                            </button>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
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
                {server.tags && server.tags.map(tag => (
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

interface CreateServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<ServerData>) => void;
    isSubmitting?: boolean;
    initialData?: ServerData | null;
    mode?: 'create' | 'edit';
}

function CreateServerModal({ isOpen, onClose, onSubmit, isSubmitting, initialData, mode = 'create' }: CreateServerModalProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        provider: initialData?.provider || 'DigitalOcean',
        region: initialData?.region || 'NYC3',
        os: initialData?.os || 'Ubuntu 22.04',
        cpu: initialData?.cpu || '2v-4gb',
        ram: initialData?.ram || '4 GB',
        storage: initialData?.storage || '80 GB SSD',
        tags: initialData?.tags || [] as string[]
    });

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = () => {
        if (!formData.name) {
            toast.error('Le nom du serveur est requis');
            return;
        }
        onSubmit(formData);
    };

    const addTag = () => {
        if (tagInput && !formData.tags.includes(tagInput)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mode === 'create' ? 'Créer un nouveau serveur' : 'Modifier le serveur'}
                    </h2>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Power className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Nom du serveur */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nom du serveur *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="ex: Production Web Server"
                            disabled={isSubmitting}
                        />
                    </div>

                    {mode === 'create' && (
                        <>
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                >
                                    {OS_OPTIONS.map(os => (
                                        <option key={os} value={os}>{os}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Spécifications (Simplifié pour l'exemple) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Configuration (Size)
                                </label>
                                <select
                                    value={formData.cpu}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cpu: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    disabled={isSubmitting}
                                >
                                    <option value="s-1vcpu-1gb">1 vCPU / 1 GB RAM / 25 GB Disk ($6/mo)</option>
                                    <option value="s-1vcpu-2gb">1 vCPU / 2 GB RAM / 50 GB Disk ($12/mo)</option>
                                    <option value="s-2vcpu-2gb">2 vCPUs / 2 GB RAM / 60 GB Disk ($18/mo)</option>
                                    <option value="s-2vcpu-4gb">2 vCPUs / 4 GB RAM / 80 GB Disk ($24/mo)</option>
                                </select>
                            </div>
                        </>
                    )}

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
                                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Ajouter un tag..."
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={addTag}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                Ajouter
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                                    {tag}
                                    <button onClick={() => removeTag(tag)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {mode === 'create' ? 'Création...' : 'Enregistrement...'}
                                </>
                            ) : (
                                mode === 'create' ? 'Créer le serveur' : 'Enregistrer'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

interface ServersManagementProps {
    role?: 'client' | 'seller' | 'admin';
}

export default function ServersManagement({ role = 'admin' }: ServersManagementProps) {
    const navigate = useNavigate();
    const [servers, setServers] = useState<ServerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showEditModal, setShowEditModal] = useState(false);
    const [serverToEdit, setServerToEdit] = useState<ServerData | null>(null);

    // ... existing loadServers ...

    const handleServerAction = async (action: string, server: ServerData) => {
        setProcessingServerId(server.id);

        try {
            switch (action) {
                case 'terminal':
                    navigate(`/servers/${server.id}/terminal`);
                    break;
                case 'start':
                case 'restart':
                    await DropletService.reboot(server.id);
                    toast.success('Redémarrage du serveur initié...');
                    setTimeout(loadServers, 5000);
                    break;
                case 'stop':
                    toast.info('Arrêt non supporté via cette API pour le moment');
                    break;
                case 'delete':
                    if (confirm(`Êtes-vous sûr de vouloir SUPPRIMER le serveur ${server.name} ? Cette action est irréversible.`)) {
                        await DropletService.delete(server.id);
                        toast.success('Serveur supprimé avec succès');
                        setServers(prev => prev.filter(s => s.id !== server.id));
                    }
                    break;
                case 'edit':
                    setServerToEdit(server);
                    setShowEditModal(true);
                    break;
            }
        } catch (err: any) {
            console.error('Erreur action serveur:', err);
            toast.error(`Erreur: ${err.message || 'Action échouée'}`);
        } finally {
            setProcessingServerId(null);
        }
    };

    const handleEditServer = async (formData: Partial<ServerData>) => {
        if (!serverToEdit) return;
        setIsSubmitting(true);
        try {
            // Mock update since API might not have rename
            // await DropletService.update(serverToEdit.id, formData); 
            // For now, assume success and update local state
            toast.success(`Serveur renommé en "${formData.name}" (Simulation)`);

            setServers(prev => prev.map(s =>
                s.id === serverToEdit.id ? { ...s, ...formData } : s
            ));
            setShowEditModal(false);
            setServerToEdit(null);
        } catch (err: any) {
            toast.error(`Erreur modification: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... existing code ...

    {/* Edit Modal */ }
    {
        showEditModal && serverToEdit && (
            <CreateServerModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setServerToEdit(null); }}
                onSubmit={handleEditServer}
                isSubmitting={isSubmitting}
                initialData={serverToEdit}
                mode="edit"
            />
        )
    }


    const stats = {
        total: servers.length,
        running: servers.filter(s => s.status === 'running' || s.status === 'active').length,
        stopped: servers.filter(s => s.status === 'stopped' || s.status === 'off').length,
        totalCost: servers.reduce((acc, s) => acc + s.monthlyPrice, 0)
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {role === 'client' ? 'Mes Services' : 'Gestion des Serveurs'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {role === 'client' ? 'Gérez vos services actifs' : 'Gérez et surveillez vos serveurs cloud'}
                    </p>
                </div>
                {role !== 'client' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau serveur
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Serveurs</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '-' : stats.total}</p>
                        </div>
                        <ServerIcon className="w-10 h-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">En ligne</p>
                            <p className="text-3xl font-bold text-green-600">{isLoading ? '-' : stats.running}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Arrêtés</p>
                            <p className="text-3xl font-bold text-red-600">{isLoading ? '-' : stats.stopped}</p>
                        </div>
                        <PowerOff className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Coût mensuel</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">${isLoading ? '-' : stats.totalCost}</p>
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

                    <button
                        onClick={() => loadServers()}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Rafraîchir"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && servers.length === 0 && (
                <div className="text-center py-24">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Chargement de vos serveurs...</p>
                </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-6 rounded-xl flex items-center justify-center gap-4">
                    <AlertCircle className="w-6 h-6" />
                    <p>{error}</p>
                    <button onClick={() => loadServers()} className="underline hover:no-underline font-semibold">Réessayer</button>
                </div>
            )}

            {/* Servers Grid */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServers.map(server => (
                        <ServerCard
                            key={server.id}
                            server={server}
                            onAction={handleServerAction}
                            isProcessing={processingServerId === server.id}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredServers.length === 0 && (
                <div className="text-center py-12">
                    <ServerIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
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
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
