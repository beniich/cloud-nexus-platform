import { useState, useEffect } from 'react';

export interface Notification {
    id: number;
    message: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    useEffect(() => {
        // Simuler notifications en temps réel
        const interval = setInterval(() => {
            setNotifications(prev => [...prev, { id: Date.now(), message: 'Nouvelle activité détectée' }]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    return notifications;
}
