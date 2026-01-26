import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config/menu';
import { UserRole, Section, getMenuItemsForRole } from '@/config/dashboardConfig';

interface DashboardContextType {
    // User & Role
    currentRole: UserRole;
    setCurrentRole: (role: UserRole) => void;

    // Navigation
    activeSection: Section;
    setActiveSection: (section: Section) => void;

    // UI State
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;

    // Notifications
    isNotificationOpen: boolean;
    setIsNotificationOpen: (open: boolean) => void;
    toggleNotifications: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
    const [currentRole, setCurrentRole] = useLocalStorage<UserRole>(
        STORAGE_KEYS.USER + '_role',
        'client'
    );

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
        STORAGE_KEYS.SIDEBAR + '_collapsed',
        false
    );

    const [activeSection, setActiveSection] = useState<Section>('overview');
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    // Ensure active section exists for current role
    useEffect(() => {
        const currentMenu = getMenuItemsForRole(currentRole);
        const sectionExists = currentMenu.find(item => item.section === activeSection);

        if (!sectionExists && currentMenu.length > 0) {
            setActiveSection(currentMenu[0].section);
        }
    }, [currentRole, activeSection]);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);

    const value: DashboardContextType = {
        currentRole,
        setCurrentRole,
        activeSection,
        setActiveSection,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isNotificationOpen,
        setIsNotificationOpen,
        toggleNotifications
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
