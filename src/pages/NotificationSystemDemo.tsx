import React, { useState, useEffect, createContext, useContext } from 'react';
import { Bell, X, Check, AlertTriangle, Info, AlertCircle, Trash2, CheckCheck, Settings, Filter } from 'lucide-react';

import NotificationSystemDemo, { NotificationProvider } from './pages/NotificationSystemDemo'; // Self-reference fix for App.tsx if needed, but actually we are editing App.tsx separately.
// No action needed here, just verifying content. The file was written correctly.

import { Bell, X, Check, AlertTriangle, Info, AlertCircle, Trash2, CheckCheck, Settings, Filter } from 'lucide-react';

// Context pour les notifications
const NotificationContext = createContext<any>(null);

// Hook pour utiliser les notifications
export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};

// Provider de notifications
export const NotificationProvider = ({ children }: any) => {
    const [notifications, setNotifications] = useState([
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

    const [toasts, setToasts] = useState<any[]>([]);

    const addNotification = (notification: any) => {
        const newNotif = {
            id: Date.now(),
            time: 'À l\'instant',
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotif, ...prev]);
        showToast(notification.type, notification.title, notification.message);
    };

    const showToast = (type: string, title: string, message: string) => {
        const toast = {
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

// Composant Toast
const Toast = ({ toast, onClose }: any) => {
    const icons: any = {
        success: <Check className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const colors: any = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-orange-500',
        info: 'bg-blue-500'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-80 max-w-md animate-slideIn">
            <div className="flex items-start gap-3">
                <div className={`${colors[toast.type]} text-white p-2 rounded-lg flex-shrink-0`}>
                    {icons[toast.type]}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {toast.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {toast.message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Composant ToastContainer
const ToastContainer = () => {
    const { toasts } = useNotificationContext();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast: any) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={() => { }}
                />
            ))}
        </div>
    );
};

// Composant NotificationBell
export const NotificationBell = ({ onClick }: any) => {
    const { unreadCount } = useNotificationContext();

    return (
        <button
            onClick={onClick}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
};

// Composant NotificationItem
const NotificationItem = ({ notification, onRead, onDelete }: any) => {
    const icons: any = {
        success: { icon: Check, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
        error: { icon: AlertCircle, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
        warning: { icon: AlertTriangle, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
        info: { icon: Info, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' }
    };

    const { icon: Icon, color } = icons[notification.type];

    return (
        <div
            className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {notification.title}
                            {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {notification.time}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {notification.category}
                        </span>
                        {!notification.read && (
                            <button
                                onClick={() => onRead(notification.id)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Marquer comme lu
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(notification.id)}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline ml-auto"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant NotificationCenter
export const NotificationCenter = ({ isOpen, onClose }: any) => {
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        unreadCount
    } = useNotificationContext();

    const [filter, setFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredNotifications = notifications.filter((n: any) => {
        if (filter === 'unread' && n.read) return false;
        if (filter === 'read' && !n.read) return false;
        if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
        return true;
    });

    const categories = [...new Set(notifications.map((n: any) => n.category))];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-end pt-16 pr-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-slideInRight">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Notifications
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {unreadCount} non lues
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Toutes
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === 'unread'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Non lues
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === 'read'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Lues
                        </button>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map((cat: any) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Tout marquer comme lu
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Tout supprimer
                    </button>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                                Aucune notification
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification: any) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={markAsRead}
                                onDelete={deleteNotification}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Settings className="w-4 h-4" />
                        Paramètres de notification
                    </button>
                </div>
            </div>
        </div>
    );
};

// Composant principal (DEMO PAGE)
export default function NotificationSystemDemo() {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { addNotification } = useNotificationContext(); // Use correct hook name

    const demoNotifications = [
        {
            type: 'success',
            title: 'Déploiement réussi',
            message: 'L\'application a été déployée avec succès sur le serveur de production.',
            category: 'deployment'
        },
        {
            type: 'error',
            title: 'Erreur de connexion',
            message: 'Impossible de se connecter à la base de données principale.',
            category: 'database'
        },
        {
            type: 'warning',
            title: 'Espace disque faible',
            message: 'Le serveur "storage-01" n\'a plus que 15% d\'espace disponible.',
            category: 'monitoring'
        },
        {
            type: 'info',
            title: 'Mise à jour disponible',
            message: 'Une nouvelle version du système est disponible.',
            category: 'système'
        }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Système de Notifications
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Centre de notifications interactif avec filtrage
                        </p>
                    </div>
                    <NotificationBell onClick={() => setNotificationOpen(!notificationOpen)} />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Demo Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Simuler des Notifications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {demoNotifications.map((notif, idx) => (
                            <button
                                key={idx}
                                onClick={() => addNotification(notif)}
                                className={`p-4 text-white rounded-lg transition-all text-left hover:scale-105 active:scale-95 ${notif.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                    notif.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                        notif.type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                            'bg-gradient-to-r from-blue-500 to-blue-600'
                                    }`}
                            >
                                <div className="font-semibold mb-1 flex items-center gap-2">
                                    {notif.type === 'success' && <Check className="w-4 h-4" />}
                                    {notif.type === 'error' && <AlertCircle className="w-4 h-4" />}
                                    {notif.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                                    {notif.title}
                                </div>
                                <div className="text-xs opacity-90">{notif.message}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            Notifications Temps Réel
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Recevez des alertes instantanées pour tous les événements importants (Socket.io ready)
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mb-4">
                            <Filter className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            Filtres Avancés
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Filtrez par type (info, erreur...), catégorie et statut de lecture pour garder le contrôle.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                            <CheckCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            Gestion Simplifiée
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Marquez comme lu, supprimez ou gérez en masse avec une interface fluide.
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Center et Toasts injectés via Portal ou fixes */}
            <NotificationCenter
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
            />

            <ToastContainer />

            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
      `}</style>
        </div>
    );
}
