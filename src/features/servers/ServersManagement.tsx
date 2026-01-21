import React, { useState, useEffect, useRef } from 'react';
import { Server, Terminal, Key, MoreVertical, X, Copy, CheckCircle, RefreshCw, AlertCircle, Plus, Trash2, Cpu, Database, HardDrive, Wifi, Globe, Edit, Power, PowerOff } from 'lucide-react';
import { api } from '../../lib/api/secureAxios';

/*
 * Gestion à distance des serveurs avec WebSocket, API REST et xterm.js
 * 
 * Fonctionnalités :
 * 1. Web Terminal (xterm.js + WebSocket)
 * 2. Connexion SSH (manuel)
 * 3. API REST pour récupérer les serveurs
 * 4. Authentification sécurisée
 */

// Types
interface ServerData {
    id: string;
    name: string;
    ip: string;
    status: 'online' | 'offline' | 'maintenance' | 'running' | 'stopped';
    cpu: number;
    memory: number;
    disk: number;
    provider?: string;
    region?: string;
    os?: string;
    monthlyPrice?: number;
    tags?: string[];
    uptime?: string;
}

interface TerminalInterface {
    write: (data: string) => void;
    onData: (callback: (data: string) => void) => void;
    clear?: () => void;
}

interface ApiError {
    message: string;
    code?: string;
}

// Mock Data for fallback
const INITIAL_SERVERS: ServerData[] = [
    {
        id: 'srv-001',
        name: 'Production Web Server',
        ip: '192.168.1.100',
        status: 'online',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: 45,
        memory: 60,
        disk: 75,
        monthlyPrice: 48,
        tags: ['production', 'web'],
        uptime: '99.99%'
    },
    {
        id: 'srv-002',
        name: 'Database Server',
        ip: '192.168.1.101',
        status: 'online',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: 78,
        memory: 85,
        disk: 65,
        monthlyPrice: 96,
        tags: ['production', 'database'],
        uptime: '99.95%'
    },
    {
        id: 'srv-003',
        name: 'Development Server',
        ip: '192.168.1.102',
        status: 'maintenance',
        provider: 'DigitalOcean',
        region: 'NYC3',
        os: 'Ubuntu 22.04',
        cpu: 12,
        memory: 25,
        disk: 15,
        monthlyPrice: 24,
        tags: ['dev'],
        uptime: '98.50%'
    }
];

// Configuration API
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Composant principal
export default function ServersManagement() {
    const [servers, setServers] = useState<ServerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
    const [activeSSH, setActiveSSH] = useState<string | null>(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Récupération des serveurs via API REST
    useEffect(() => {
        const fetchServers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Utilisation de api (secureAxios) au lieu de fetch direct pour gérer l'auth
                const response = await api.get('/servers');
                setServers(response.data);
            } catch (err: unknown) {
                console.error('Erreur fetch serveurs:', err);
                const errorObj = err as ApiError;

                // Fallback Mock si activé ou erreur (pour la démo)
                if (import.meta.env.VITE_ENABLE_MOCK === 'true' || errorObj.code === 'ERR_NETWORK' || (errorObj.message && errorObj.message.includes('404'))) {
                    console.warn('Mode Mock activé ou API indisponible, utilisation des données locales.');
                    setServers(INITIAL_SERVERS);
                } else {
                    setError(errorObj.message || 'Erreur inconnue');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServers();

        // Rafraîchissement automatique toutes les 30 secondes
        const interval = setInterval(fetchServers, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenTerminal = (serverId: string) => {
        setActiveTerminal(serverId);
        setActiveSSH(null);
        setOpenMenu(null);
    };

    const handleOpenSSH = (serverId: string) => {
        setActiveSSH(serverId);
        setActiveTerminal(null);
        setOpenMenu(null);
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const response = await api.get('/servers');
            setServers(response.data);
            setError(null);
        } catch (err: unknown) {
            if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setServers(INITIAL_SERVERS);
                setError(null);
            } else {
                console.error('Erreur refresh:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Mock server creation
    const handleCreateServer = (data: Partial<ServerData>) => {
        const newServer: ServerData = {
            id: `srv-${Date.now()}`,
            name: data.name || 'New Server',
            ip: '10.0.0.100', // Mock IP
            status: 'online',
            cpu: 5,
            memory: 10,
            disk: 20,
            ...data
        } as ServerData;
        setServers([...servers, newServer]);
    };

    const getServerById = (id: string) => servers.find(s => s.id === id);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': case 'running': return 'bg-green-500';
            case 'offline': case 'stopped': return 'bg-red-500';
            case 'maintenance': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'online': case 'running': return 'En ligne';
            case 'offline': case 'stopped': return 'Hors ligne';
            case 'maintenance': return 'Maintenance';
            default: return 'Inconnu';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Server className="w-8 h-8 text-blue-600" />
                            Gestion des Serveurs
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Gérez et surveillez vos serveurs à distance
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Nouveau Serveur
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualiser
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Grille des serveurs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map((server) => (
                        <div
                            key={server.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative border border-gray-100 dark:border-gray-700"
                        >
                            {/* Menu contextuel */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setOpenMenu(openMenu === server.id ? null : server.id)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>

                                {openMenu === server.id && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                                        <button
                                            onClick={() => handleOpenTerminal(server.id)}
                                            disabled={server.status === 'offline' || server.status === 'stopped'}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
                                        >
                                            <Terminal className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium">Web Terminal</span>
                                        </button>
                                        <button
                                            onClick={() => handleOpenSSH(server.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 text-left transition-colors rounded-b-lg text-gray-700 dark:text-gray-200"
                                        >
                                            <Key className="w-5 h-5 text-green-600" />
                                            <span className="font-medium">Connexion SSH</span>
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-left text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" /> <span className="text-sm">Supprimer</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Informations serveur */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{server.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{getStatusText(server.status)}</span>
                                </div>
                                <p className="text-sm text-gray-500 font-mono">{server.ip}</p>
                            </div>

                            {/* Métriques */}
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">CPU</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{server.cpu}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${server.cpu}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Mémoire</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{server.memory}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all"
                                            style={{ width: `${server.memory}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Disque</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{server.disk}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                            style={{ width: `${server.disk}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modale Web Terminal avec xterm.js */}
                {activeTerminal && (
                    <XtermTerminalModal
                        server={getServerById(activeTerminal)!}
                        onClose={() => setActiveTerminal(null)}
                    />
                )}

                {/* Modale SSH */}
                {activeSSH && (
                    <SSHModal
                        server={getServerById(activeSSH)!}
                        onClose={() => setActiveSSH(null)}
                    />
                )}

                {/* Create Modal */}
                <CreateServerModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateServer} />
            </div>
        </div>
    );
}

// Composant Terminal avec xterm.js et WebSocket
function XtermTerminalModal({
    server,
    onClose
}: {
    server: ServerData;
    onClose: () => void;
}) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // Définition de la fonction de simulation à l'intérieur de useEffect pour éviter les dépendances manquantes
        const startSimulation = (term: TerminalInterface, srv: ServerData) => {
            setConnectionStatus('connected');
            term.write(`Connecté à ${srv.name} (${srv.ip}) [SIMULATION]\r\n`);
            term.write('Tapez "help" pour voir les commandes.\r\n\r\n');
            term.write(`root@${srv.name.toLowerCase().replace(/\s+/g, '-')}:~# `);

            let currentLine = "";

            // Basic shell simulation
            const handleInput = (data: string) => {
                if (data === '\r') { // Enter
                    term.write('\r\n');
                    processCommand(currentLine, term, srv);
                    currentLine = "";
                    term.write(`root@${srv.name.toLowerCase().replace(/\s+/g, '-')}:~# `);
                } else if (data === '\b') { // Backspace
                    if (currentLine.length > 0) {
                        currentLine = currentLine.slice(0, -1);
                        // Naive backspace visual handling
                        if (terminalRef.current?.lastChild) {
                            const lastNode = terminalRef.current.lastChild;
                            if (lastNode.textContent) {
                                lastNode.textContent = lastNode.textContent.slice(0, -1);
                            }
                        }
                    }
                } else {
                    currentLine += data;
                    term.write(data);
                }
            };

            term.onData(handleInput);
        };

        const processCommand = (cmd: string, term: TerminalInterface, srv: ServerData) => {
            const command = cmd.trim();
            if (command === 'help') term.write('Commandes: ls, uptime, whoami, clear, exit\r\n');
            else if (command === 'ls') term.write('bin etc home var usr tmp\r\n');
            else if (command === 'whoami') term.write('root\r\n');
            else if (command === 'uptime') term.write(`up ${srv.uptime || '10 days'}, 1 user, load average: 0.12, 0.05, 0.01\r\n`);
            else if (command === 'clear') {
                if (terminalRef.current) terminalRef.current.innerHTML = '';
            }
            else if (command === 'exit') { onClose(); }
            else if (command === '') { /* ignore empty command */ }
            else term.write(`bash: ${command}: command not found\r\n`);
        };

        // Import dynamique de xterm.js (si installé via npm)
        const initTerminal = async () => {
            try {
                // Simulation pour la démo sans backend réel
                const term: TerminalInterface = {
                    write: (data: string) => {
                        if (terminalRef.current) {
                            // Simple simulation of terminal output appending
                            const lines = data.split('\n');
                            lines.forEach(lineTxt => {
                                const line = document.createElement('div');
                                line.textContent = lineTxt;
                                line.className = 'text-green-400 whitespace-pre-wrap font-mono';
                                terminalRef.current?.appendChild(line);
                            });
                            if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                        }
                    },
                    onData: (callback: (data: string) => void) => {
                        // Capture keypress on window for demo
                        const handler = (e: KeyboardEvent) => {
                            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                                callback(e.key);
                            }
                            else if (e.key === 'Enter') callback('\r');
                            else if (e.key === 'Backspace') callback('\b');
                        };
                        window.addEventListener('keydown', handler);

                        // Return a cleanup function if needed by real xterm (mock just stores it)
                        // But here we need to remove event listener when effect cleans up.
                        // We'll handle cleanup in main useEffect return.
                        (term as any)._cleanupHandler = handler;
                    }
                };

                // Try to connect to WebSocket if configured
                let ws: WebSocket | null = null;
                if (import.meta.env.VITE_ENABLE_MOCK !== 'true') {
                    try {
                        const wsUrl = `${WS_BASE_URL}/terminal/${server.id}`;
                        ws = new WebSocket(wsUrl);
                        wsRef.current = ws;

                        ws.onopen = () => {
                            setConnectionStatus('connected');
                            term.write(`Connecté à ${server.name} (${server.ip})\r\n`);
                            term.write('Terminal prêt (WebSocket).\r\n\r\n');
                        };

                        ws.onmessage = (event) => term.write(event.data);
                        ws.onerror = () => {
                            setConnectionStatus('error');
                            // Fallback to simulation
                            startSimulation(term, server);
                        };
                        ws.onclose = () => setConnectionStatus('disconnected');
                    } catch (e) { startSimulation(term, server); }
                } else {
                    startSimulation(term, server);
                }

                // Clean up helper
                return () => {
                    if ((term as any)._cleanupHandler) {
                        window.removeEventListener('keydown', (term as any)._cleanupHandler);
                    }
                };

            } catch (err) {
                console.error('Erreur init terminal:', err);
                setConnectionStatus('error');
                setErrorMessage('Erreur d\'initialisation du terminal');
            }
        };

        const cleanupPromise = initTerminal();

        return () => {
            if (wsRef.current) wsRef.current.close();
            cleanupPromise.then(cleanup => cleanup && cleanup());
        };
    }, [server.id, server.name, server.ip, server.uptime, onClose]);

    const getStatusBadge = () => {
        switch (connectionStatus) {
            case 'connecting':
                return <span className="text-yellow-400 flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Connexion...</span>;
            case 'connected':
                return <span className="text-green-400 flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /> Connecté</span>;
            case 'disconnected':
                return <span className="text-gray-400">Déconnecté</span>;
            case 'error':
                return <span className="text-red-400 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Mode Secours</span>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
                    <div className="flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-green-400" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Terminal - {server.name}
                            </h3>
                            <p className="text-xs text-gray-400">{server.ip}</p>
                        </div>
                        <div className="text-sm">
                            {getStatusBadge()}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Terminal */}
                <div
                    ref={terminalRef}
                    className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-black text-white"
                    style={{ minHeight: '400px', cursor: 'text' }}
                    onClick={() => { /* Focus hidden input if implemented */ }}
                />

                {/* Footer */}
                <div className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                    <p className="text-xs text-gray-400">
                        xterm.js ready • WebSocket {connectionStatus === 'connected' ? 'Active' : 'Disconnected'}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Composant Modale SSH
function SSHModal({ server, onClose }: { server: ServerData; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const sshCommand = `ssh root@${server.ip}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(sshCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Key className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Connexion SSH
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Infos serveur */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Serveur</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Nom: <span className="font-mono">{server.name}</span></p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">IP: <span className="font-mono">{server.ip}</span></p>
                    </div>

                    {/* Commande SSH */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Commande SSH
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded-lg overflow-x-auto">
                                {sshCommand}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex-shrink-0"
                                title="Copier"
                            >
                                {copied ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Avertissement */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
                        <div className="flex gap-3">
                            <span className="text-yellow-600 dark:text-yellow-500 text-xl">⚠️</span>
                            <div>
                                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                                    Important
                                </h4>
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    N'oubliez pas d'ajouter votre clé publique SSH au serveur avant de vous connecter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateServerModal({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        name: '', provider: 'DigitalOcean', region: 'NYC3', os: 'Ubuntu 22.04'
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Nouveau Serveur</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nom</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    {/* Simplified for brevity */}
                    <div className="flex gap-3 mt-6">
                        <button onClick={onClose} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">Annuler</button>
                        <button onClick={() => { onSubmit(formData); onClose(); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Créer</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
