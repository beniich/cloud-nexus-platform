import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

// URL du backend (ajustez si nécessaire)
// Utiliser import.meta.env en production
const SOCKET_URL = 'http://localhost:3002';

export interface Notification {
    id: number;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
    data?: any;
}

// Singleton socket instance pour éviter les reconnexions multiples
let socket: Socket;

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialisation
        if (!socket) {
            socket = io(SOCKET_URL, {
                transports: ['websocket'], // Force websocket
                reconnectionAttempts: 5
            });
        }

        // Handlers
        const onConnect = () => {
            console.log('✅ Connecté au serveur de notifications');
            setIsConnected(true);
        };

        const onDisconnect = () => {
            console.log('❌ Déconnecté du serveur de notifications');
            setIsConnected(false);
        };

        const onNewRequest = (data: any) => {
            console.log('🔔 Nouvelle notification reçue:', data);

            const newNotif: Notification = {
                id: Date.now(),
                message: `Nouvelle demande d'hébergement de ${data.name || 'Client inconnu'}`,
                type: 'info',
                timestamp: new Date().toISOString(),
                read: false,
                data: data
            };

            setNotifications(prev => [newNotif, ...prev]);
            toast.info(`Nouvelle demande : ${data.serverType || 'Service'}`, {
                description: `De : ${data.email}`
            });
        };

        // Attach listeners
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('newRequest', onNewRequest);

        // Initial check
        if (socket.connected) setIsConnected(true);

        return () => {
            // Cleanup listerners but keep socket open for other components
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('newRequest', onNewRequest);
        };
    }, []);

    const emitNewRequest = (data: any) => {
        if (socket && socket.connected) {
            socket.emit('newHostingRequest', data);
        } else {
            console.warn('Socket not connected, cannot emit event');
        }
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        unreadCount,
        isConnected,
        emitNewRequest,
        markAsRead
    };
}
