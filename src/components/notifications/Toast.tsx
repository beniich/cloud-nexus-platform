import React from 'react';
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastData } from '@/contexts/NotificationContext';

interface ToastProps {
    toast: ToastData;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const icons = {
        success: <Check className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const colors = {
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
