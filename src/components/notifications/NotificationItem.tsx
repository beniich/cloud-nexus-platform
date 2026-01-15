import React from 'react';
import { Check, AlertCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { Notification } from '@/contexts/NotificationContext';

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: number) => void;
    onDelete: (id: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, onDelete }) => {
    const icons = {
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
