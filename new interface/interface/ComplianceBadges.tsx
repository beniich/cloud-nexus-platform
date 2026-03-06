import { Check } from 'lucide-react';

interface Badge {
  id: string;
  label: string;
  description?: string;
}

interface ComplianceBadgesProps {
  badges: Badge[];
  columns?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplianceBadges({
  badges,
  columns = 2,
  size = 'md',
}: ComplianceBadgesProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const sizes = {
    sm: {
      badge: 'px-3 py-1.5 text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      badge: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      badge: 'px-5 py-3 text-base',
      icon: 'w-5 h-5',
    },
  };

  const sizeClasses = sizes[size];

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="group relative"
        >
          <div
            className={`flex items-center gap-3 rounded-full
                       bg-green-500/10 border border-green-500/30
                       hover:bg-green-500/20 hover:border-green-500/50
                       transition-all duration-300
                       ${sizeClasses.badge}`}
          >
            <div className="flex-shrink-0 p-1 rounded-full bg-green-500/20
                          group-hover:bg-green-500/30 transition-colors">
              <Check className={`${sizeClasses.icon} text-green-400`} />
            </div>
            <span className="text-green-300 font-medium whitespace-nowrap">
              {badge.label}
            </span>
          </div>

          {/* Tooltip on hover */}
          {badge.description && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                          opacity-0 group-hover:opacity-100 pointer-events-none
                          transition-opacity duration-300 z-10">
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2
                            shadow-xl whitespace-nowrap">
                <p className="text-gray-300 text-xs">{badge.description}</p>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 
                            w-0 h-0 border-l-4 border-r-4 border-t-4
                            border-transparent border-t-gray-700" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Compliance section with title
interface ComplianceSectionProps {
  title?: string;
  subtitle?: string;
  badges: Badge[];
}

export function ComplianceSection({
  title = "Conformité et Sécurité",
  subtitle,
  badges,
}: ComplianceSectionProps) {
  return (
    <div className="py-12 px-6 rounded-2xl bg-gradient-to-br from-[#1a1f3a] to-[#0a0e27]
                    border border-green-500/20">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="text-xl">🔐</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        {subtitle && (
          <p className="text-gray-400">{subtitle}</p>
        )}
      </div>

      {/* Badges grid */}
      <ComplianceBadges badges={badges} columns={3} size="md" />

      {/* Trust center link */}
      <div className="mt-8 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300
                     transition-colors font-medium group"
        >
          <span>Centre de confiance</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

// Example usage
export function ExampleCompliance() {
  const complianceBadges: Badge[] = [
    { id: '1', label: 'SOC2 Type II', description: 'Certified SOC2 Type II compliance' },
    { id: '2', label: 'RGPD', description: 'GDPR compliant data handling' },
    { id: '3', label: 'HIPAA et BAA', description: 'HIPAA compliant with BAA available' },
    { id: '4', label: 'CCPA', description: 'California Consumer Privacy Act compliant' },
    { id: '5', label: 'RBAC', description: 'Role-based access control' },
    { id: '6', label: 'SSO et SCIM', description: 'Single Sign-On and SCIM provisioning' },
    { id: '7', label: 'Résidence des données', description: 'Data residency options' },
    { id: '8', label: 'Journaux d\'audit', description: 'Comprehensive audit logging' },
    { id: '9', label: 'Marque blanche', description: 'White-label options available' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] p-8">
      <div className="max-w-6xl mx-auto">
        <ComplianceSection
          title="Toutes les cases à cocher"
          subtitle="Sécurité et conformité de niveau entreprise"
          badges={complianceBadges}
        />

        {/* Simple badge list */}
        <div className="mt-12">
          <h4 className="text-white text-xl font-bold mb-6">Certifications</h4>
          <ComplianceBadges
            badges={complianceBadges.slice(0, 4)}
            columns={4}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
