import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
    const { toasts } = useNotifications();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        onClose={() => { }}
                    />
                ))}
            </div>
        </div>
    );
};
