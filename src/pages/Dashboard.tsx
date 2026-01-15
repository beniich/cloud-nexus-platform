import { useState } from 'react';
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
} from 'lucide-react';
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

import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { ToastContainer } from "@/components/notifications/ToastContainer";

type UserRole = 'client' | 'seller' | 'admin';
type Section = 'overview' | 'orders' | 'invoices' | 'services' | 'support' | 'settings' | 'products' | 'sales' | 'stats' | 'messages' | 'users' | 'analytics' | 'config' | 'cloud-spaces' | 'cloud-upload' | 'servers' | 'new-hosting';

export default function Dashboard() {
  const [currentRole, setCurrentRole] = useState<UserRole>('seller');
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const menuItems = {
    client: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: ShoppingBag, label: 'Commander', section: 'new-hosting' as Section },
      { icon: ShoppingBag, label: 'Mes commandes', section: 'orders' as Section },
      { icon: FileText, label: 'Mes factures', section: 'invoices' as Section },
      { icon: Package, label: 'Services achetés', section: 'services' as Section },
      { icon: MessageSquare, label: 'Support', section: 'support' as Section },
      { icon: Settings, label: 'Paramètres', section: 'settings' as Section },
    ],
    seller: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: Cloud, label: 'Cloud Spaces', section: 'cloud-spaces' as Section },
      { icon: Upload, label: 'Upload Fichiers', section: 'cloud-upload' as Section },
      { icon: Server, label: 'Mes Serveurs', section: 'servers' as Section },
      { icon: Package, label: 'Mes produits', section: 'products' as Section },
      { icon: ShoppingBag, label: 'Ventes', section: 'sales' as Section },
      { icon: TrendingUp, label: 'Statistiques', section: 'stats' as Section },
      { icon: MessageSquare, label: 'Messages', section: 'messages' as Section },
      { icon: Settings, label: 'Paramètres', section: 'settings' as Section },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: Cloud, label: 'Cloud Spaces', section: 'cloud-spaces' as Section },
      { icon: Upload, label: 'Upload Fichiers', section: 'cloud-upload' as Section },
      { icon: Server, label: 'Gérer Serveurs', section: 'servers' as Section },
      { icon: Users, label: 'Utilisateurs', section: 'users' as Section },
      { icon: Package, label: 'Produits', section: 'products' as Section },
      { icon: TrendingUp, label: 'Analytics', section: 'analytics' as Section },
      { icon: Settings, label: 'Configuration', section: 'config' as Section },
    ],
  };

  const stats = {
    client: [
      { label: 'Commandes', value: '12', change: '+2 ce mois' },
      { label: 'Services actifs', value: '3', change: '2 expirent bientôt' },
      { label: 'Factures', value: '8', change: '2 en attente' },
      { label: 'Tickets support', value: '1', change: 'Ouvert' },
    ],
    seller: [
      { label: 'Ventes ce mois', value: '15.600€', change: '+12%' },
      { label: 'Produits actifs', value: '24', change: '3 en rupture' },
      { label: 'Commandes en cours', value: '8', change: '2 à expédier' },
      { label: 'Note moyenne', value: '4.8/5', change: '156 avis' },
    ],
    admin: [
      { label: 'Utilisateurs totaux', value: '1.234', change: '+45 ce mois' },
      { label: 'Ventes totales', value: '89.500€', change: '+18%' },
      { label: 'Produits', value: '156', change: '12 en attente' },
      { label: 'Uptime', value: '99.9%', change: 'Excellent' },
    ],
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
      case 'cloud-spaces':
        return <CloudSpacesBrowser />;
      case 'cloud-upload':
        return <CloudSpacesUpload />;
      case 'orders':
      case 'invoices':
        return <BillingPaymentSystem />;
      case 'servers':
        return <ServersManagement role={currentRole} />;
      case 'services':
        return <ServersManagement role={currentRole} />;
      case 'products':
        return <ProductsManager />;
      case 'sales':
        return <SalesManager />;
      case 'stats':
        return <StatisticsView />;
      case 'messages':
      case 'support':
        return <TicketSupportSystem />;
      case 'settings':
      case 'config':
        return <SettingsView />;
      case 'users':
        return <UsersManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'new-hosting':
        return <HostingRequestForm />;
      default:
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtl">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Cloud Industrie" className="h-10 w-auto mr-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {menuItems[currentRole].find(item => item.section === activeSection)?.label}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
            <Select value={currentRole} onValueChange={(v: UserRole) => setCurrentRole(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="seller">Vendeur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <NotificationBell onClick={() => setIsNotificationOpen(true)} />

          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            {menuItems[currentRole].map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.section
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
            <p className="text-xs text-muted-foreground mb-3">Consultez notre documentation ou contactez le support.</p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="w-full">
                Contacter le support
              </Button>
            </Link>
          </div>
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
    </div>
  );
}
