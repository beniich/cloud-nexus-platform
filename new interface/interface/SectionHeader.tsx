import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  label?: string;
  title: string;
  description?: string;
  accentColor?: 'cyan' | 'purple' | 'green' | 'orange' | 'rose' | 'yellow';
  align?: 'left' | 'center';
  children?: ReactNode;
}

const colorClasses = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  rose: 'text-rose-400',
  yellow: 'text-yellow-400',
};

export function SectionHeader({
  icon: Icon,
  label,
  title,
  description,
  accentColor = 'cyan',
  align = 'left',
  children,
}: SectionHeaderProps) {
  const textAlign = align === 'center' ? 'text-center' : 'text-left';
  const itemsAlign = align === 'center' ? 'items-center' : 'items-start';

  return (
    <div className={`mb-12 space-y-4 ${textAlign}`}>
      {/* Label with icon */}
      {(label || Icon) && (
        <div className={`flex gap-3 ${itemsAlign} ${align === 'center' ? 'justify-center' : ''}`}>
          {Icon && (
            <Icon className={`w-5 h-5 ${colorClasses[accentColor]}`} />
          )}
          {label && (
            <span
              className={`${colorClasses[accentColor]} uppercase text-xs sm:text-sm 
                         font-mono tracking-wider font-medium`}
            >
              {label}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white 
                     leading-tight tracking-tight">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className={`text-lg sm:text-xl text-gray-400 leading-relaxed
                      ${align === 'center' ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}>
          {description}
        </p>
      )}

      {/* Optional children (e.g., CTA buttons) */}
      {children && (
        <div className={`pt-4 ${align === 'center' ? 'flex justify-center' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// Section wrapper component
interface SectionProps {
  id?: string;
  className?: string;
  background?: 'dark' | 'darker' | 'gradient';
  children: ReactNode;
}

export function Section({
  id,
  className = '',
  background = 'dark',
  children,
}: SectionProps) {
  const bgClasses = {
    dark: 'bg-[#0a0e27]',
    darker: 'bg-[#050816]',
    gradient: 'bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]',
  };

  return (
    <section
      id={id}
      className={`relative py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16
                  ${bgClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
}

// Container component (max-width wrapper)
export function Container({
  size = 'default',
  className = '',
  children,
}: {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  className?: string;
  children: ReactNode;
}) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto w-full ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Example usage
export function ExampleSection() {
  return (
    <Section background="gradient">
      <Container>
        <SectionHeader
          icon={() => <span className="text-2xl">🔐</span>}
          label="Sécurité et Conformité"
          title="Toutes les cases à cocher"
          description="Nous prenons la sécurité et la conformité au sérieux pour que vous n'ayez pas à le faire."
          accentColor="green"
          align="center"
        >
          <button className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600
                           text-white font-bold transition-all duration-300
                           shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            En savoir plus
          </button>
        </SectionHeader>

        {/* Section content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Add your content here */}
        </div>
      </Container>
    </Section>
  );
}
