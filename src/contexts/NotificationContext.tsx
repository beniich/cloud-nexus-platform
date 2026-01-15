import React, { createContext, useState } from 'react';

export interface Notification {
    id: number;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    time: string;
    read: boolean;
    category: string;
}

export interface ToastData {
    id: number;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
}

interface NotificationContextType {
    notifications: Notification[];
    toasts: ToastData[];
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
    showToast: (type: ToastData['type'], title: string, message: string) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: number) => void;
    clearAll: () => void;
    unreadCount: number;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'success',
            title: 'Serveur créé avec succès',
            message: 'Le serveur "web-prod-01" a été créé et est maintenant en ligne.',
            time: '2 min',
            read: false,
            category: 'serveurs'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Utilisation CPU élevée',
            message: 'Le serveur "db-master" utilise 89% du CPU disponible.',
            time: '15 min',
            read: false,
            category: 'monitoring'
        },
        {
            id: 3,
            type: 'info',
            title: 'Nouveau utilisateur inscrit',
            message: 'John Doe vient de créer un compte sur la plateforme.',
            time: '1h',
            read: true,
            category: 'utilisateurs'
        },
        {
            id: 4,
            type: 'error',
            title: 'Échec de sauvegarde',
            message: 'La sauvegarde automatique du serveur "backup-01" a échoué.',
            time: '2h',
            read: false,
            category: 'backup'
        },
        {
            id: 5,
            type: 'success',
            title: 'Paiement reçu',
            message: 'Paiement de 149.99€ reçu pour le plan Premium.',
            time: '3h',
            read: true,
            category: 'facturation'
        }
    ]);

    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = (type: ToastData['type'], title: string, message: string) => {
        const toast: ToastData = {
            id: Date.now(),
            type,
            title,
            message
        };
        setToasts(prev => [...prev, toast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, 5000);
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
        const newNotif: Notification = {
            id: Date.now(),
            time: 'À l\'instant',
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotif, ...prev]);
        showToast(notification.type, notification.title, notification.message);
    };

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            toasts,
            addNotification,
            showToast,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearAll,
            unreadCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
