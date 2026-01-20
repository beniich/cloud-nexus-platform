import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HeaderNavigation } from './HeaderNavigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config/menu';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { useSettings } from '@/hooks/useSettings';
import { Search, Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

import ProfessionalChat from '@/components/chat/ProfessionalChat';

export default function AppLayout() {
    const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false);
    const { settings } = useSettings();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar logoUrl={settings.logoUrl} />
            </div>

            {/* Mobile Sidebar (Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <div className="relative z-50 h-full">
                        <Sidebar
                            logoUrl={settings.logoUrl}
                            isCollapsed={false}
                            onToggleCollapse={() => { }} // Always expanded on mobile
                        />
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-[-40px] p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content - Full Width now */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Header */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex-shrink-0 z-10 relative shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div className="relative hidden lg:block w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md border-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
                                title="Changer la langue"
                            >
                                <span className="text-xs font-bold border border-current rounded px-1">FR</span>
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                {darkMode ? '🌞' : '🌙'}
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Professional Chat Widget */}
            <ProfessionalChat />
        </div>
    );
}
