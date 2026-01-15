import React, { useState } from 'react';
import { X, CheckCheck, Trash2, Bell, Filter, Settings } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        unreadCount
    } = useNotifications();

    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread' && n.read) return false;
        if (filter === 'read' && !n.read) return false;
        if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
        return true;
    });

    const categories = [...new Set(notifications.map(n => n.category))];

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
                        {categories.map(cat => (
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
                        filteredNotifications.map(notification => (
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
