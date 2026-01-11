import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Cloud,
  Menu,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProductsManager from '@/components/dashboard/ProductsManager';
import SalesManager from '@/components/dashboard/SalesManager';
import StatisticsView from '@/components/dashboard/StatisticsView';
import MessagingView from '@/components/dashboard/MessagingView';
import SettingsView from '@/components/dashboard/SettingsView';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionManager from '@/components/dashboard/SubscriptionManager';
import ChatWidget from '@/components/ChatWidget';
import OrdersManager from '@/components/dashboard/OrdersManager';
import InvoicesManager from '@/components/dashboard/InvoicesManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import UsersManager from '@/components/dashboard/UsersManager';

// Import de la nouvelle Sidebar dynamique
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Package, TrendingUp, FileText, MessageSquare, Users } from 'lucide-react'; // Gardés pour les stats

type Section = 'overview' | 'orders' | 'invoices' | 'services' | 'support' | 'settings' | 'products' | 'sales' | 'stats' | 'messages' | 'users' | 'analytics' | 'config' | 'executive';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentRole = user?.role || 'client';
  // @ts-ignore - Simple cast for default section logic
  const defaultSection: Section = currentRole === 'admin' ? 'users' : 'overview';

  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Stats configs (kept locally for overview component)
  const stats = {
    client: [
      { label: 'Commandes', value: '12', change: '+2 ce mois', icon: ShoppingBag },
      { label: 'Services actifs', value: '3', change: '2 expirent bientôt', icon: Cloud },
      { label: 'Factures', value: '8', change: '2 en attente', icon: FileText },
      { label: 'Tickets support', value: '1', change: 'Ouvert', icon: MessageSquare },
    ],
    seller: [
      { label: 'Ventes ce mois', value: '15.600€', change: '+12%', icon: TrendingUp },
      { label: 'Produits actifs', value: '24', change: '3 en rupture', icon: Package },
      { label: 'Commandes en cours', value: '8', change: '2 à expédier', icon: ShoppingBag },
      { label: 'Note moyenne', value: '4.8/5', change: '156 avis', icon: Users },
    ],
    admin: [
      { label: 'Utilisateurs totaux', value: '1.234', change: '+45 ce mois', icon: Users },
      { label: 'Ventes totales', value: '89.500€', change: '+18%', icon: TrendingUp },
      { label: 'Produits', value: '156', change: '12 en attente', icon: Package },
      { label: 'Uptime', value: '99.9%', change: 'Excellent', icon: Cloud },
    ],
    owner: [
      { label: 'Utilisateurs totaux', value: '1.234', change: '+45 ce mois', icon: Users },
      { label: 'Ventes totales', value: '89.500€', change: '+18%', icon: TrendingUp },
      { label: 'Produits', value: '156', change: '12 en attente', icon: Package },
      { label: 'Uptime', value: '99.9%', change: 'Excellent', icon: Cloud },
    ],
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        // @ts-ignore
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
      case 'orders':
        return <OrdersManager />;
      case 'invoices':
        return <InvoicesManager />;
      case 'products':
        return <ProductsManager />;
      case 'sales':
        return <SalesManager />;
      case 'stats':
      case 'analytics':
        return <StatisticsView />;
      case 'executive':
        return <ExecutiveDashboard />;
      case 'users':
        return <UsersManager />;
      case 'messages':
      case 'support':
        return <MessagingView />;
      case 'settings':
      case 'config':
        return <SettingsView />;
      case 'services': // Reusing 'services' section for subscriptions for clients
        return <SubscriptionManager />;
      default:
        // @ts-ignore
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <header className="bg-background border-b border-border sticky top-0 z-20 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Cloud className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
              {!isSidebarCollapsed && <span className="font-display font-bold text-xl hidden md:block">Cloud Industrie</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/shop">
              <Button variant="default" size="sm" className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Commander
              </Button>
            </Link>
            <ThemeToggle />

            <div className="flex items-center gap-2 mr-4 hidden sm:flex">
              <span className="text-sm font-medium text-muted-foreground">
                {user?.name} ({currentRole})
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Nouvelle Sidebar Dynamique */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-8 overflow-auto dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
