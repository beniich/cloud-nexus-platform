import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Permission } from '@/lib/permissions/permissionSystem';
import { lazy } from "react";

// Providers
import { CartProvider } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import AppLayout from "./shared/layout/AppLayout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { MockModeBanner } from './shared/components/MockModeBanner';
import { AIProvider } from "./features/ai-assistant/contexts/AIContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { SecureLoginForm } from '@/features/auth/components/SecureLoginForm';
import CloudSpaces from "./pages/CloudSpaces";
import Servers from "./pages/Servers";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import HostingRequest from "./pages/HostingRequest";
import CRM from "./pages/CRM";
import Settings from "./pages/Settings";

// Demo/Feature Components
import LivePulse from "./features/crm/components/LivePulse";
import TicketSupportSystem from "./features/crm/components/TicketSupportSystem";
import SalesPipeline from "./features/crm/components/SalesPipeline";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MockModeBanner />
          {/* Note: In main.tsx we should wrap with I18nextProvider and potentially AIProvider external if needed, 
              but internal wrapping here is fine as long as order is correct. 
              Ideally main.tsx does core setup.
          */}
          <AuthProvider>
            <AIProvider>
              <ProductProvider>
                <CartProvider>
                  <NotificationProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<SecureLoginForm />} />

                      {/* Protected Routes */}
                      <Route element={<AppLayout />}>
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/cloud-spaces/*"
                          element={
                            <ProtectedRoute requiredPermissions={[Permission.FILES_VIEW]}>
                              <CloudSpaces />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/servers"
                          element={
                            <ProtectedRoute requiredPermissions={[Permission.SERVERS_VIEW]}>
                              <Servers />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/products"
                          element={
                            <ProtectedRoute>
                              <Products />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/users"
                          element={
                            <ProtectedRoute requiredPermissions={[Permission.USERS_VIEW]}>
                              <Users />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/analytics"
                          element={
                            <ProtectedRoute requiredPermissions={[Permission.ANALYTICS_VIEW]}>
                              <Analytics />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/hosting-request"
                          element={
                            <ProtectedRoute>
                              <HostingRequest />
                            </ProtectedRoute>
                          }
                        />

                        {/* CRM Feature Routes */}
                        <Route
                          path="/crm"
                          element={
                            <ProtectedRoute>
                              <CRM />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/crm/live-pulse"
                          element={
                            <ProtectedRoute>
                              <LivePulse />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/crm/tickets"
                          element={
                            <ProtectedRoute>
                              <TicketSupportSystem />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/crm/pipeline"
                          element={
                            <ProtectedRoute>
                              <SalesPipeline />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </NotificationProvider>
                </CartProvider>
              </ProductProvider>
            </AIProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
