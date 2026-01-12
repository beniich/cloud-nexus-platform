import { Toaster } from "@/components/ui/toaster"; // shadcn
import { Toaster as Sonner } from "@/components/ui/sonner"; // sonner
import { TooltipProvider } from "@/components/ui/tooltip";
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
import AppLayout from "@/components/layout/AppLayout";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from 'sonner';

// Eager loaded components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./features/auth/routes/Login";
import AuthCallback from "./features/auth/routes/AuthCallback";

// New Pages
const CloudSpaces = lazy(() => import("./pages/CloudSpaces"));
const ServersManagement = lazy(() => import("./pages/Servers"));
const UsersManagement = lazy(() => import("./pages/Users"));
const AnalyticsPage = lazy(() => import("./pages/Analytics"));
const ProductsPage = lazy(() => import("./pages/Products"));
const HostingRequestForm = lazy(() => import("./pages/HostingRequest"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// CRM Sub-pages
const LivePulseDashboard = lazy(() => import("./pages/crm/LivePulse"));
const SupportTickets = lazy(() => import("./pages/crm/Support"));
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

// Analytics & Notifications
const AppContent = () => {
  const location = useLocation();
  const notifications = useNotifications();

  useEffect(() => {
    logPageView();
  }, [location]);

  useEffect(() => {
    if (notifications.length > 0) {
      const last = notifications[notifications.length - 1];
      toast(last.message, { description: 'Nouvelle notification' });
    }
  }, [notifications]);

  return null;
};

const App = () => {
  useEffect(() => {
    initGA();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .catch((err) => console.log('SW registration failed:', err));
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <TooltipProvider>
                <LivePulseProvider>
                  <Toaster />
                  <Sonner position="top-right" />
                  <BrowserRouter>
                    <AppContent />
                    <Suspense fallback={<LoadingSpinner size="lg" text="Chargement..." fullScreen />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/shop/:id" element={<ProductDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/store/:slug" element={<Storefront />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/security" element={<Security />} />
                        <Route path="/vrd" element={<Navigate to="/login?role=seller" replace />} />
                        <Route path="/adm-secure" element={<Navigate to="/login?role=admin" replace />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* App Layout (Dashboard & Features) */}
                        <Route element={
                          <ProtectedRoute>
                            <AppLayout />
                          </ProtectedRoute>
                        }>
                          <Route path="/dashboard" element={<Dashboard />} />

                          {/* Cloud Spaces */}
                          <Route path="/cloud-spaces/*" element={<CloudSpaces />} />

                          {/* Main Features */}
                          <Route path="/servers" element={<ServersManagement />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/users" element={<UsersManagement />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                          <Route path="/hosting-request" element={<HostingRequestForm />} />
                          <Route path="/settings" element={<div className="p-10">Settings (WIP)</div>} />

                          {/* CRM Sub-routes */}
                          <Route path="/crm" element={<Navigate to="/crm/live-pulse" replace />} />
                          <Route path="/crm/live-pulse" element={<LivePulseDashboard />} />
                          <Route path="/crm/tickets" element={<SupportTickets />} />
                          <Route path="/crm/pipeline" element={<SalesPipeline />} />
                        </Route>

                        {/* Legacy Protected Routes (Separate Layout or No Layout) */}
                        <Route path="/cart" element={
                          <ProtectedRoute allowedRoles={['client']}>
                            <Cart />
                          </ProtectedRoute>
                        } />

                        {/* Existing standalone features */}
                        <Route path="/cms" element={<HeadlessCMS />} />
                        <Route path="/hosting" element={<HostingManagement />} />
                        <Route path="/crm-hustel" element={<CrmDashboard />} />
                        <Route path="/request-service" element={<ServiceRequestForm />} />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                </LivePulseProvider>
              </TooltipProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider >
  );
};

export default App;