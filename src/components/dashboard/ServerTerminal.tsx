
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    MoreVertical,
    TrendingUp,
    ArrowDown,
    ArrowUp,
    Copy,
    Terminal,
    Settings,
    Maximize,
    ChevronRight,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface TerminalLine {
    type: 'success' | 'info' | 'command' | 'output' | 'output-gray' | 'output-rich' | 'error' | 'clear';
    text: string;
}

interface Metrics {
    cpu: number;
    ram: {
        used: number;
        total: number;
        percentage: number;
    };
    network: {
        download: number;
        upload: number;
    };
    disk: {
        used: number;
        total: number;
        percentage: number;
    };
    processes: number;
    timestamp: number;
}

export default function ServerTerminal() {
    const { id } = useParams();
    const [history, setHistory] = useState<TerminalLine[]>([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isConnected, setIsConnected] = useState(false);

    // Métriques en temps réel
    const [cpuUsage, setCpuUsage] = useState(45);
    const [ramUsage, setRamUsage] = useState(2.4);
    const [ramPercentage, setRamPercentage] = useState(30);
    const [networkDown, setNetworkDown] = useState(280);
    const [networkUp, setNetworkUp] = useState(60);

    const socketRef = useRef<Socket | null>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Connexion WebSocket
    useEffect(() => {
        const socket = io('http://localhost:3002');
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Terminal WebSocket connecté');
            setIsConnected(true);

            // Rejoindre la session terminal
            socket.emit('terminal-join', {
                serverId: id || '01',
                userId: 'user-' + Math.random().toString(36).substr(2, 9)
            });
        });

        socket.on('disconnect', () => {
            console.log('❌ Terminal WebSocket déconnecté');
            setIsConnected(false);
        });

        // Recevoir la sortie du terminal
        socket.on('terminal-output', (data: { lines: TerminalLine[] }) => {
            setHistory(prev => {
                // Gérer la commande clear
                if (data.lines.some(line => line.type === 'clear')) {
                    return [];
                }
                return [...prev, ...data.lines];
            });
        });

        // Recevoir les mises à jour de métriques
        socket.on('metrics-update', (metrics: Metrics) => {
            setCpuUsage(Math.round(metrics.cpu * 10) / 10);
            setRamUsage(Math.round(metrics.ram.used * 10) / 10);
            setRamPercentage(Math.round(metrics.ram.percentage));
            setNetworkDown(Math.round(metrics.network.download));
            setNetworkUp(Math.round(metrics.network.upload));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('terminal-leave', {
                    serverId: id || '01',
                    userId: 'user-current'
                });
                socketRef.current.disconnect();
            }
        };
    }, [id]);

    // Auto-scroll vers le bas
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Gérer la soumission de commande
    const handleSubmitCommand = () => {
        if (!currentCommand.trim() || !socketRef.current) return;

        // Ajouter à l'historique des commandes
        setCommandHistory(prev => [...prev, currentCommand]);
        setHistoryIndex(-1);

        // Envoyer la commande au serveur
        socketRef.current.emit('terminal-command', {
            serverId: id || '01',
            command: currentCommand
        });

        // Réinitialiser l'input
        setCurrentCommand('');
    };

    // Gérer les touches clavier
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmitCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1
                    ? commandHistory.length - 1
                    : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCurrentCommand(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setCurrentCommand('');
                } else {
                    setHistoryIndex(newIndex);
                    setCurrentCommand(commandHistory[newIndex]);
                }
            }
        }
    };

    // Focus sur l'input au clic sur le terminal
    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0f0a07] text-white font-sans overflow-hidden rounded-xl border border-white/5 shadow-2xl relative">

            {/* Top App Bar */}
            <div className="flex items-center bg-[#0f0a07]/80 backdrop-blur-md sticky top-0 z-50 p-4 border-b border-white/5 justify-between">
                <Link to="/dashboard" className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></span>
                        <h2 className="text-white text-base font-bold leading-tight tracking-tight">Production-Node-{id || '01'}</h2>
                    </div>
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-0.5">
                        {isConnected ? 'Live Connection' : 'Disconnected'}
                    </p>
                </div>
                <div className="flex w-10 items-center justify-end">
                    <button className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">

                {/* Charts Section (Live Pulse) */}
                <div className="px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-lg font-bold leading-tight tracking-tight">Live Pulse</h3>
                        <span className="text-[11px] text-[#cca78e] bg-[#4a3121] px-2 py-0.5 rounded-full">Real-time</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* CPU Chart */}
                        <div className="flex flex-col gap-2 bg-[#352318]/40 p-4 rounded-xl border border-white/5">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[#cca78e] text-xs font-medium">CPU Usage</p>
                                    <p className="text-white text-3xl font-bold leading-tight">{cpuUsage}%</p>
                                </div>
                                <div className="flex gap-1 items-center mb-1">
                                    <TrendingUp className="text-green-500 w-4 h-4" />
                                    <p className="text-green-500 text-xs font-bold">+2.4%</p>
                                </div>
                            </div>
                            <div className="flex min-h-[80px] flex-1 flex-col py-2 overflow-hidden">
                                {/* Simulated Graph SVG */}
                                <svg fill="none" height="80" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" className="w-full">
                                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_cpu)"></path>
                                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#f97015" strokeLinecap="round" strokeWidth="4"></path>
                                    <defs>
                                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_cpu" x1="236" x2="236" y1="1" y2="149">
                                            <stop stopColor="#f97015" stopOpacity="0.3"></stop>
                                            <stop offset="1" stopColor="#f97015" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        {/* Side-by-Side Mini Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 bg-[#352318]/40 p-4 rounded-xl border border-white/5">
                                <p className="text-[#cca78e] text-xs font-medium">RAM</p>
                                <p className="text-white text-xl font-bold">{ramUsage}GB</p>
                                <div className="w-full bg-[#4a3121] h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div
                                        className="bg-orange-500 h-full rounded-full shadow-[0_0_8px_#f97015] transition-all duration-500"
                                        style={{ width: `${ramPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 bg-[#352318]/40 p-4 rounded-xl border border-white/5">
                                <p className="text-[#cca78e] text-xs font-medium">Network</p>
                                <p className="text-white text-xl font-bold">{networkDown + networkUp}Mbps</p>
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-orange-500 font-bold">
                                    <ArrowDown className="w-3 h-3" /> {networkDown}mb
                                    <ArrowUp className="w-3 h-3 ml-1" /> {networkUp}mb
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Server Status Card */}
                <div className="px-4 pb-6">
                    <div className="flex items-stretch justify-between gap-4 rounded-xl bg-[#352318] p-4 shadow-xl border border-white/5">
                        <div className="flex flex-[2_2_0px] flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500 text-xs font-bold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">STABLE</span>
                                    <p className="text-white text-base font-bold">System Status</p>
                                </div>
                                <p className="text-[#cca78e] text-sm font-normal">Uptime: 14d 5h 22m</p>
                            </div>
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 flex-row-reverse bg-[#4a3121] hover:bg-[#5a4131] transition-colors text-white gap-2 text-sm font-medium w-fit">
                                <Copy className="w-4 h-4" />
                                <span className="truncate">192.168.1.45</span>
                            </button>
                        </div>
                        {/* Abstract Hardware Visual */}
                        <div
                            className="w-24 bg-center bg-no-repeat aspect-square bg-cover rounded-lg border border-white/10"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=200")' }}
                        ></div>
                    </div>
                </div>

                {/* Web Terminal Header */}
                <div className="bg-[#1a110a] border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between px-4 mb-2">
                        <h3 className="text-white text-base font-bold flex items-center gap-2">
                            <Terminal className="text-orange-500 w-5 h-5" />
                            Web Terminal
                        </h3>
                        <div className="flex gap-2">
                            <button className="size-8 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-white">
                                <Settings className="w-4 h-4" />
                            </button>
                            <button className="size-8 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-white">
                                <Maximize className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div
                        className="bg-[#0f0905] p-4 font-mono text-[13px] leading-relaxed min-h-[300px] border-t border-white/5 cursor-text"
                        onClick={handleTerminalClick}
                    >
                        {history.map((line, idx) => (
                            <React.Fragment key={idx}>
                                {line.type === 'success' && <p className="text-green-500 mb-1">{line.text}</p>}
                                {line.type === 'info' && <p className="text-[#cca78e] mb-4">{line.text}</p>}
                                {line.type === 'command' && (
                                    <p className="text-white">
                                        <span className="text-orange-500">root@cloud-nexus</span>:<span className="text-blue-400">~</span># {line.text}
                                    </p>
                                )}
                                {line.type === 'output' && <p className="text-gray-400">{line.text}</p>}
                                {line.type === 'output-gray' && <p className="text-gray-400">{line.text}</p>}
                                {line.type === 'output-rich' && (
                                    <p className="text-gray-400">
                                        {line.text.split('active (running)').map((part, i, arr) => (
                                            <React.Fragment key={i}>
                                                {part}
                                                {i < arr.length - 1 && <span className="text-green-500">active (running)</span>}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                )}
                                {line.type === 'error' && <p className="text-red-500">{line.text}</p>}
                            </React.Fragment>
                        ))}

                        {/* Input actif */}
                        <div className="text-white mt-4 flex items-center">
                            <span className="text-orange-500">root@cloud-nexus</span>:<span className="text-blue-400">~</span>#
                            <input
                                ref={inputRef}
                                type="text"
                                value={currentCommand}
                                onChange={(e) => setCurrentCommand(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent outline-none ml-1 text-white"
                                autoFocus
                                disabled={!isConnected}
                            />
                            <span className="inline-block w-2.5 h-5 bg-orange-500 align-middle animate-pulse border-r-2 border-orange-500"></span>
                        </div>

                        <div ref={terminalEndRef} />
                    </div>
                </div>
            </div>

            {/* Virtual Accessory Bar */}
            <div className="bg-[#1a110a] border-t border-white/10 p-2 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => { setCurrentCommand(prev => prev + '\x1b'); inputRef.current?.focus(); }}
                    className="bg-[#352318] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex-1 min-w-[50px] active:bg-orange-500 active:text-white transition-all"
                >ESC</button>
                <button
                    onClick={() => { setCurrentCommand(prev => prev + '\t'); inputRef.current?.focus(); }}
                    className="bg-[#352318] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex-1 min-w-[50px] active:bg-orange-500 active:text-white transition-all"
                >TAB</button>
                <button
                    onClick={() => inputRef.current?.focus()}
                    className="bg-[#352318] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex-1 min-w-[50px] active:bg-orange-500 active:text-white transition-all"
                >CTRL</button>
                <button
                    onClick={() => inputRef.current?.focus()}
                    className="bg-[#352318] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex-1 min-w-[50px] active:bg-orange-500 active:text-white transition-all"
                >ALT</button>
                <div className="flex gap-1 ml-2">
                    <button
                        onClick={() => { setCurrentCommand(prev => prev.slice(0, -1)); inputRef.current?.focus(); }}
                        className="bg-[#352318] text-white size-8 rounded-lg flex items-center justify-center active:bg-orange-500 hover:bg-[#4a3121]"
                    ><ChevronLeft className="w-4 h-4" /></button>
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => inputRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
                            className="bg-[#352318] text-white size-8 rounded-lg flex items-center justify-center active:bg-orange-500 hover:bg-[#4a3121]"
                        ><ChevronUp className="w-4 h-4" /></button>
                        <button
                            onClick={() => inputRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
                            className="bg-[#352318] text-white size-8 rounded-lg flex items-center justify-center active:bg-orange-500 hover:bg-[#4a3121]"
                        ><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <button
                        onClick={() => inputRef.current?.focus()}
                        className="bg-[#352318] text-white size-8 rounded-lg flex items-center justify-center active:bg-orange-500 hover:bg-[#4a3121]"
                    ><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Safe Area Spacer for iOS */}
            <div className="h-6 bg-[#1a110a]"></div>
        </div>
    );
}
