import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Package,
  TrendingUp,
  FileText,
  MessageSquare,
  LogOut,
  Cloud,
  Upload,
  Server,
  Sun,
  Moon,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config/menu';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProductsManager from '@/components/dashboard/ProductsManager';
import SalesManager from '@/components/dashboard/SalesManager';
import StatisticsView from '@/components/dashboard/StatisticsView';
import MessagingView from '@/components/dashboard/MessagingView';
import SettingsView from '@/components/dashboard/SettingsView';
import CloudSpacesBrowser from '@/components/dashboard/CloudSpacesBrowser';
import CloudSpacesUpload from '@/components/dashboard/CloudSpacesUpload';
import ServersManagement from '@/components/dashboard/ServersManagement';
import HostingRequestForm from '@/components/dashboard/HostingRequestForm';
import BillingPaymentSystem from '@/components/dashboard/BillingPaymentSystem';
import UsersManagement from '@/components/dashboard/UsersManagement';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';
import TicketSupportSystem from '@/components/dashboard/TicketSupportSystem';
import SubscriptionSection from '@/components/dashboard/SubscriptionSection';
import { Logo } from '@/components/Logo';

import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { ToastContainer } from "@/components/notifications/ToastContainer";

type UserRole = 'client' | 'seller' | 'admin';
type Section = 'overview' | 'orders' | 'invoices' | 'services' | 'support' | 'settings' | 'products' | 'sales' | 'stats' | 'messages' | 'users' | 'analytics' | 'config' | 'cloud-spaces' | 'cloud-upload' | 'servers' | 'new-hosting' | 'subscription';


export default function Dashboard() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-subtl">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 mb-2">
        <div className="flex items-center gap-4">
          {/* Title removed as requested */}
        </div>

        {/* Context Controls Only */}
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
          <span className="font-medium text-gray-500 uppercase text-xs tracking-wider">{t('dashboard.mode')}:</span>
          <Select value={currentRole} onValueChange={(v: UserRole) => setCurrentRole(v)}>
            <SelectTrigger className="w-[110px] h-8 border-none bg-transparent focus:ring-0 font-semibold text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="seller">Vendeur</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 relative`}
        >
          {/* Logo in Sidebar */}
          <div className={`mb-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-2'}`}>
            <Logo size="sm" showText={!isSidebarCollapsed} />
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-all z-10"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <nav className="space-y-2">
            {menuItems[currentRole].map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.section
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
                  } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {!isSidebarCollapsed && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
              <p className="text-xs text-muted-foreground mb-3">Consultez notre documentation ou contactez le support.</p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="w-full">
                  Contacter le support
                </Button>
              </Link>
            </div>
          )}
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <ToastContainer />
    </div >
  );
}
