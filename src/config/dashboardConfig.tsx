import { ComponentType } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Package,
    TrendingUp,
    FileText,
    MessageSquare,
    Cloud,
    Server,
    CreditCard,
    Globe,
    Brain,
    Store,
    LayoutTemplate,
    Key,
    Mic,
    ShieldCheck,
    Zap,
    Box,
    LucideIcon
} from 'lucide-react';

// Lazy load components for better performance
import { lazy } from 'react';

const DashboardOverview = lazy(() => import('@/components/dashboard/DashboardOverview'));
const ProductsManager = lazy(() => import('@/components/dashboard/ProductsManager'));
const SalesManager = lazy(() => import('@/components/dashboard/SalesManager'));
const StatisticsView = lazy(() => import('@/components/dashboard/StatisticsView'));
const MessagingView = lazy(() => import('@/components/dashboard/MessagingView'));
const SettingsView = lazy(() => import('@/components/dashboard/SettingsView'));
const CloudSpacesBrowser = lazy(() => import('@/components/dashboard/CloudSpacesBrowser'));
const CloudSpacesUpload = lazy(() => import('@/components/dashboard/CloudSpacesUpload'));
const ServersManagement = lazy(() => import('@/components/dashboard/ServersManagement'));
const HostingRequestForm = lazy(() => import('@/components/dashboard/HostingRequestForm'));
const BillingPaymentSystem = lazy(() => import('@/components/dashboard/BillingPaymentSystem'));
const UsersManagement = lazy(() => import('@/components/dashboard/UsersManagement'));
const AnalyticsDashboard = lazy(() => import('@/components/dashboard/AnalyticsDashboard'));
const TicketSupportSystem = lazy(() => import('@/components/dashboard/TicketSupportSystem'));
const SubscriptionSection = lazy(() => import('@/components/dashboard/SubscriptionSection'));
const CrmDashboard = lazy(() => import('@/features/crmhustel/routes/CrmDashboard'));
const SiteBuilder = lazy(() => import('@/features/site-builder/SitesDashboard'));
const ABTestingDashboard = lazy(() => import('@/features/ai-assistant/components/ABTestingDashboard'));
const Storefront = lazy(() => import('@/features/billing/Storefront'));
const APIKeysManager = lazy(() => import('@/features/settings/APIKeysManager'));
const VoiceBuilder = lazy(() => import('@/features/innovation/VoiceBuilder'));
const SecurityScanner = lazy(() => import('@/features/innovation/SecurityScanner'));
const PredictiveCDN = lazy(() => import('@/features/innovation/PredictiveCDN'));
const MetaverseBuilder = lazy(() => import('@/features/innovation/MetaverseBuilder'));

export type UserRole = 'client' | 'seller' | 'admin';

export type Section =
    | 'overview'
    | 'orders'
    | 'invoices'
    | 'services'
    | 'support'
    | 'settings'
    | 'products'
    | 'sales'
    | 'stats'
    | 'messages'
    | 'users'
    | 'analytics'
    | 'config'
    | 'cloud-spaces'
    | 'cloud-upload'
    | 'servers'
    | 'new-hosting'
    | 'subscription'
    | 'crm'
    | 'sites'
    | 'ai-optimization'
    | 'marketplace'
    | 'api-keys'
    | 'voice-builder'
    | 'security-scanner'
    | 'predictive-cdn'
    | 'metaverse';

export interface MenuItem {
    section: Section;
    label: string;
    labelKey?: string; // For i18n translation key
    icon: LucideIcon;
    component: ComponentType<any>;
    wideLayout?: boolean; // For pages that need 80-90% width
}

// Component mapping for all sections
export const SECTION_COMPONENTS: Record<Section, ComponentType<any>> = {
    overview: DashboardOverview,
    products: ProductsManager,
    sales: SalesManager,
    stats: StatisticsView,
    messages: MessagingView,
    settings: SettingsView,
    config: SettingsView,
    'cloud-spaces': CloudSpacesBrowser,
    'cloud-upload': CloudSpacesUpload,
    servers: ServersManagement,
    'new-hosting': HostingRequestForm,
    users: UsersManagement,
    analytics: AnalyticsDashboard,
    support: TicketSupportSystem,
    invoices: BillingPaymentSystem,
    subscription: SubscriptionSection,
    crm: CrmDashboard,
    sites: SiteBuilder,
    'ai-optimization': ABTestingDashboard,
    marketplace: Storefront,
    'api-keys': APIKeysManager,
    'voice-builder': VoiceBuilder,
    'security-scanner': SecurityScanner,
    'predictive-cdn': PredictiveCDN,
    metaverse: MetaverseBuilder,
    orders: DashboardOverview, // Placeholder
    services: DashboardOverview, // Placeholder
};

// Sections that require wide layout (80-95% width)
export const WIDE_LAYOUT_SECTIONS: Section[] = [
    'voice-builder',
    'sites',
    'metaverse',
    'security-scanner',
    'ai-optimization'
];

// Menu configuration for each role
export const MENU_CONFIG: Record<UserRole, MenuItem[]> = {
    client: [
        {
            section: 'overview',
            label: 'Vue d\'ensemble',
            labelKey: 'dashboard.menu.overview',
            icon: LayoutDashboard,
            component: DashboardOverview
        },
        {
            section: 'services',
            label: 'Mes Services',
            labelKey: 'dashboard.menu.services',
            icon: Cloud,
            component: DashboardOverview
        },
        {
            section: 'marketplace',
            label: 'Marketplace',
            icon: Store,
            component: Storefront
        },
        {
            section: 'orders',
            label: 'Commandes',
            labelKey: 'dashboard.menu.orders',
            icon: ShoppingBag,
            component: DashboardOverview
        },
        {
            section: 'invoices',
            label: 'Factures',
            labelKey: 'dashboard.menu.invoices',
            icon: FileText,
            component: BillingPaymentSystem
        },
        {
            section: 'support',
            label: 'Support',
            labelKey: 'dashboard.menu.support',
            icon: MessageSquare,
            component: TicketSupportSystem
        },
        {
            section: 'new-hosting',
            label: 'Commander',
            labelKey: 'dashboard.menu.new_hosting',
            icon: Server,
            component: HostingRequestForm
        },
        {
            section: 'settings',
            label: 'Paramètres',
            labelKey: 'dashboard.menu.settings',
            icon: Settings,
            component: SettingsView
        }
    ],

    seller: [
        {
            section: 'overview',
            label: 'Vue d\'ensemble',
            labelKey: 'dashboard.menu.overview',
            icon: LayoutDashboard,
            component: DashboardOverview
        },
        {
            section: 'crm',
            label: 'CRM Hustel',
            icon: Users,
            component: CrmDashboard
        },
        {
            section: 'sites',
            label: 'Site Builder',
            icon: LayoutTemplate,
            component: SiteBuilder,
            wideLayout: true
        },
        {
            section: 'products',
            label: 'Produits',
            labelKey: 'dashboard.menu.products',
            icon: Package,
            component: ProductsManager
        },
        {
            section: 'sales',
            label: 'Ventes',
            labelKey: 'dashboard.menu.sales',
            icon: TrendingUp,
            component: SalesManager
        },
        {
            section: 'messages',
            label: 'Messages',
            labelKey: 'dashboard.menu.messages',
            icon: MessageSquare,
            component: MessagingView
        },
        {
            section: 'subscription',
            label: 'Abonnement',
            labelKey: 'dashboard.menu.subscription',
            icon: CreditCard,
            component: SubscriptionSection
        },
        {
            section: 'settings',
            label: 'Paramètres',
            labelKey: 'dashboard.menu.settings',
            icon: Settings,
            component: SettingsView
        }
    ],

    admin: [
        {
            section: 'overview',
            label: 'Vue d\'ensemble',
            labelKey: 'dashboard.menu.overview',
            icon: LayoutDashboard,
            component: DashboardOverview
        },
        {
            section: 'voice-builder',
            label: 'Voice AI Builder',
            icon: Mic,
            component: VoiceBuilder,
            wideLayout: true
        },
        {
            section: 'security-scanner',
            label: 'Security Scanner',
            icon: ShieldCheck,
            component: SecurityScanner,
            wideLayout: true
        },
        {
            section: 'predictive-cdn',
            label: 'Predictive CDN',
            icon: Zap,
            component: PredictiveCDN
        },
        {
            section: 'metaverse',
            label: 'Metaverse Builder',
            icon: Box,
            component: MetaverseBuilder,
            wideLayout: true
        },
        {
            section: 'users',
            label: 'Utilisateurs',
            labelKey: 'dashboard.menu.users',
            icon: Users,
            component: UsersManagement
        },
        {
            section: 'crm',
            label: 'CRM Hustel',
            icon: Users,
            component: CrmDashboard
        },
        {
            section: 'sites',
            label: 'Site Builder',
            icon: Globe,
            component: SiteBuilder,
            wideLayout: true
        },
        {
            section: 'ai-optimization',
            label: 'AI & SEO',
            icon: Brain,
            component: ABTestingDashboard,
            wideLayout: true
        },
        {
            section: 'marketplace',
            label: 'Marketplace',
            icon: Store,
            component: Storefront
        },
        {
            section: 'api-keys',
            label: 'API & Mobile Keys',
            icon: Key,
            component: APIKeysManager
        },
        {
            section: 'products',
            label: 'Catalogue',
            labelKey: 'dashboard.menu.products',
            icon: Package,
            component: ProductsManager
        },
        {
            section: 'analytics',
            label: 'Analytique',
            labelKey: 'dashboard.menu.analytics',
            icon: TrendingUp,
            component: AnalyticsDashboard
        },
        {
            section: 'cloud-spaces',
            label: 'Cloud Spaces',
            icon: Cloud,
            component: CloudSpacesBrowser
        },
        {
            section: 'servers',
            label: 'Serveurs',
            labelKey: 'dashboard.menu.servers',
            icon: Server,
            component: ServersManagement
        },
        {
            section: 'support',
            label: 'Tickets',
            icon: MessageSquare,
            component: TicketSupportSystem
        },
        {
            section: 'config',
            label: 'Configuration',
            labelKey: 'dashboard.menu.config',
            icon: Settings,
            component: SettingsView
        }
    ]
};

// Helper to get menu items for a role
export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
    return MENU_CONFIG[role] || MENU_CONFIG.client;
};

// Helper to check if section needs wide layout
export const needsWideLayout = (section: Section): boolean => {
    return WIDE_LAYOUT_SECTIONS.includes(section);
};
