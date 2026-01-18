import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./shared/layout/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SecureLoginForm } from "./features/auth/components/SecureLoginForm";
import { Permission } from "./lib/permissions/permissionSystem";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProductProvider } from "./contexts/ProductContext";
import { AIProvider } from "./features/ai-assistant/contexts/AIContext";
import { MockModeBanner } from "./shared/components/MockModeBanner";
import { PaymentConfigProvider } from "./contexts/PaymentConfigContext";
import { PlatformConfigProvider } from "./contexts/PlatformConfigContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CloudSpaces from "./pages/CloudSpaces";
import Servers from "./pages/Servers";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import CRM from "./pages/CRM";
import HostingRequest from "./pages/HostingRequest";
import HeadlessCMS from "./features/cms/HeadlessCMS";
import ServiceRequestForm from "./features/service-request/ServiceRequestForm";
import ServiceRequestWizard from "./features/service-request/ServiceRequestWizard";
import CrmDashboard from "./features/crmhustel/routes/CrmDashboard";
import AdminOrdersValidation from "./pages/admin/AdminOrdersValidation";
import InvoiceView from "./pages/InvoiceView";
import SitesDashboard from "./features/site-builder/SitesDashboard";
import ABTestingDashboard from "./features/ai-assistant/components/ABTestingDashboard";
import PaymentSettings from "./pages/admin/PaymentSettings";
import { CheckoutPage } from "./pages/CheckoutPage";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <MockModeBanner />
          <AuthProvider>
            <PlatformConfigProvider>
              <PaymentConfigProvider>
                <AIProvider>
                  <ProductProvider>
                    <CartProvider>
                      <NotificationProvider>
                        <Toaster />
                        <Sonner />
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<SecureLoginForm />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/pricing" element={<Pricing />} />
                          <Route path="/contact" element={<Contact />} />

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
                              path="/crm/*"
                              element={
                                <ProtectedRoute>
                                  <CRM />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/crm/dashboard"
                              element={
                                <ProtectedRoute>
                                  <CrmDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/cms"
                              element={
                                <ProtectedRoute>
                                  <HeadlessCMS />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/service-request"
                              element={
                                <ProtectedRoute>
                                  <ServiceRequestForm />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/service-request/wizard"
                              element={
                                <ProtectedRoute>
                                  <ServiceRequestWizard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/orders"
                              element={
                                <ProtectedRoute requiredPermissions={[Permission.ADMIN]}>
                                  <AdminOrdersValidation />
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
                            <Route
                              path="/invoices/:id"
                              element={
                                <ProtectedRoute>
                                  <InvoiceView />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/sites"
                              element={
                                <ProtectedRoute>
                                  <SitesDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/ai-optimization"
                              element={
                                <ProtectedRoute>
                                  <ABTestingDashboard />
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
                            {/* Payment & Admin Routes */}
                            <Route
                              path="/admin/payment-settings"
                              element={
                                <ProtectedRoute requiredPermissions={[Permission.ADMIN]}>
                                  <PaymentSettings />
                                </ProtectedRoute>
                              }
                            />
                            <Route path="/checkout" element={<CheckoutPage />} />
                          </Route>

                          {/* Fallback */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </NotificationProvider>
                    </CartProvider>
                  </ProductProvider>
                </AIProvider>
              </PaymentConfigProvider>
            </PlatformConfigProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
