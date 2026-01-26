import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/components/Logo';
import { useDashboard } from '@/contexts/DashboardContext';
import { getMenuItemsForRole } from '@/config/dashboardConfig';
import { useTranslation } from 'react-i18next';

export const DashboardSidebar = () => {
    const { t } = useTranslation();
    const {
        currentRole,
        activeSection,
        setActiveSection,
        isSidebarCollapsed,
        toggleSidebar
    } = useDashboard();

    const menuItems = getMenuItemsForRole(currentRole);

    return (
        <aside
            className={`${isSidebarCollapsed ? 'w-20' : 'w-64'
                } bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 relative`}
        >
            {/* Logo */}
            <div className={`mb-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-2'}`}>
                <Logo size="sm" showText={!isSidebarCollapsed} />
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-all z-10"
            >
                {isSidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
            </button>

            {/* Navigation Menu */}
            <nav className="space-y-2">
                {menuItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveSection(item.section)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.section
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                            } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                        title={isSidebarCollapsed ? (item.labelKey ? t(item.labelKey) : item.label) : ''}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isSidebarCollapsed && (
                            <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                {item.labelKey ? t(item.labelKey) : item.label}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Help Section */}
            {!isSidebarCollapsed && (
                <div className="mt-8 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
                    <p className="text-xs text-muted-foreground mb-3">
                        Consultez notre documentation ou contactez le support.
                    </p>
                    <Link to="/contact">
                        <Button variant="outline" size="sm" className="w-full">
                            Contacter le support
                        </Button>
                    </Link>
                </div>
            )}
        </aside>
    );
};
