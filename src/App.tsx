import { Toaster } from "@/shared/ui/toaster"; // shadcn
import { Toaster as Sonner } from "@/shared/ui/sonner"; // sonner
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { initGA, logPageView } from '@/lib/analytics';
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LivePulseProvider } from "@/contexts/LivePulseContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppLayout from "./shared/layout/AppLayout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { toast } from 'sonner';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthCallback from "./features/auth/routes/AuthCallback";

// New Pages (Migrated to Features)
const Login = lazy(() => import("./features/auth/routes/Login"));
const CloudSpaces = lazy(() => import("./features/cloud-spaces/CloudSpacesPage"));
const ServersManagement = lazy(() => import("./features/servers/ServersManagement"));
const UsersManagement = lazy(() => import("./features/users/UsersManagement"));
const AnalyticsPage = lazy(() => import("./features/analytics/AnalyticsDashboard"));
const ProductsPage = lazy(() => import("./pages/Products"));
const HostingRequestForm = lazy(() => import("./pages/HostingRequest"));
const NotificationSystemDemo = lazy(() => import("./pages/NotificationSystemDemo").then(module => ({ default: module.default })));
const CRMHustel = lazy(() => import("./pages/crm/CRMHustel"));
const SupportTickets = lazy(() => import("./pages/crm/TicketSupportSystem"));
const ProductManagement = lazy(() => import("./pages/ProductManagement"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// CRM Sub-pages
const LivePulseDashboard = lazy(() => import("./pages/crm/LivePulse"));
const SalesPipeline = lazy(() => import("./pages/crm/Pipeline"));

// Legacy/Existing Pages
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Contact = lazy(() => import("./pages/Contact"));
const Storefront = lazy(() => import("./pages/Storefront"));
const PrivacyPolicy = lazy(() => import("./pages/Legal").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/Legal").then(m => ({ default: m.TermsOfService })));
const Security = lazy(() => import("./pages/Legal").then(m => ({ default: m.Security })));
const HeadlessCMS = lazy(() => import("./features/cms/HeadlessCMS"));
const ServiceRequestForm = lazy(() => import("./features/service-request/ServiceRequestForm"));
const HostingManagement = lazy(() => import("./features/hosting/routes/HostingManagement"));
const CrmDashboard = lazy(() => import("./features/crmhustel/routes/CrmDashboard"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default App;
