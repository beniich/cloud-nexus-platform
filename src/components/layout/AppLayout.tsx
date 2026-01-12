import React, { useEffect } from 'react';
import { Outlet, navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config/menu';
import { Search, Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR, false);
    const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="relative hidden lg:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                {darkMode ? '🌞' : '🌙'}
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
