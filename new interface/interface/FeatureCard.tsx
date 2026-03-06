import { ReactNode } from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor?: 'cyan' | 'purple' | 'green' | 'orange' | 'rose';
  onClick?: () => void;
}

const colorClasses = {
  cyan: {
    icon: 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    border: 'group-hover:border-cyan-500/50',
    arrow: 'group-hover:text-cyan-400',
    glow: 'from-cyan-500 to-cyan-600',
  },
  purple: {
    icon: 'bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    border: 'group-hover:border-purple-500/50',
    arrow: 'group-hover:text-purple-400',
    glow: 'from-purple-500 to-purple-600',
  },
  green: {
    icon: 'bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    border: 'group-hover:border-green-500/50',
    arrow: 'group-hover:text-green-400',
    glow: 'from-green-500 to-green-600',
  },
  orange: {
    icon: 'bg-orange-500/10 text-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    border: 'group-hover:border-orange-500/50',
    arrow: 'group-hover:text-orange-400',
    glow: 'from-orange-500 to-orange-600',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    border: 'group-hover:border-rose-500/50',
    arrow: 'group-hover:text-rose-400',
    glow: 'from-rose-500 to-rose-600',
  },
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  accentColor = 'cyan',
  onClick,
}: FeatureCardProps) {
  const colors = colorClasses[accentColor];

  return (
    <div
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow}
                    rounded-xl opacity-0 group-hover:opacity-30 blur-lg 
                    transition duration-500`}
      />

      {/* Card */}
      <div
        className={`relative h-full bg-[#1a1f3a] backdrop-blur-xl bg-opacity-70
                    border border-white/10 ${colors.border}
                    rounded-xl p-6 sm:p-8
                    transition-all duration-300
                    group-hover:transform group-hover:scale-[1.02]`}
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4
                      ${colors.icon}
                      transition-transform duration-300
                      group-hover:scale-110`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-bold text-white mb-3
                      ${colors.arrow.replace('group-hover:', '')}
                      transition-colors duration-300`}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
          {description}
        </p>

        {/* Arrow indicator */}
        <ArrowRight
          className={`absolute top-6 right-6 w-5 h-5 text-gray-600
                      ${colors.arrow}
                      group-hover:translate-x-1
                      transition-all duration-300`}
        />
      </div>
    </div>
  );
}

// Feature Grid Component
interface FeatureGridProps {
  features: Array<{
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    accentColor?: 'cyan' | 'purple' | 'green' | 'orange' | 'rose';
    onClick?: () => void;
  }>;
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
    </div>
  );
}
