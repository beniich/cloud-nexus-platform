import { Suspense } from 'react';
import { Package } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ToastContainer } from '@/components/notifications/ToastContainer';
import { SECTION_COMPONENTS, needsWideLayout } from '@/config/dashboardConfig';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

// Mock stats for DashboardOverview
const mockStats = [
  { label: "Revenu Total", value: "€24,500", change: "+12%" },
  { label: "Clients Actifs", value: "1,240", change: "+18%" },
  { label: "Commandes", value: "345", change: "+5%" },
  { label: "Support", value: "12", change: "-2%" }
];

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500">Chargement...</p>
    </div>
  </div>
);

// Main dashboard content renderer
const DashboardContent = () => {
  const { activeSection, currentRole, isNotificationOpen, setIsNotificationOpen } = useDashboard();

  // Get component for active section
  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  // Determine if current section needs wide layout
  const isWideLayout = needsWideLayout(activeSection);

  if (!ActiveComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Package className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Section en construction</p>
        <p className="text-sm">La section {activeSection} sera bientôt disponible.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-subtl">
        <DashboardHeader />

        <div className="flex">
          <DashboardSidebar />

          <main className="flex-1 p-8">
            <div
              className={`${isWideLayout ? 'max-w-[95%]' : 'max-w-7xl'
                } mx-auto transition-all duration-300`}
            >
              <Suspense fallback={<LoadingFallback />}>
                {activeSection === 'overview' ? (
                  <DashboardOverview stats={mockStats} role={currentRole} />
                ) : (
                  <ActiveComponent />
                )}
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <ToastContainer />
    </>
  );
};

// Main Dashboard component with provider
export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
