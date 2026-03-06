import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@tests/utils';
import { MetricsCard } from '@components/dashboard/MetricsCard';

describe('MetricsCard', () => {
  it('should render with correct title and value', () => {
    render(
      <MetricsCard 
        title="CPU Usage" 
        value={75} 
        unit="%" 
        icon="memory"
      />
    );
    
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should apply correct color based on value threshold', () => {
    const { rerender } = render(
      <MetricsCard 
        title="Memory" 
        value={50} 
        unit="%" 
        icon="storage"
      />
    );
    
    // Valeur normale (< 70)
    expect(screen.getByTestId('metrics-card')).toHaveClass('text-cyan-400');
    
    // Valeur élevée (70-89)
    rerender(
      <MetricsCard 
        title="Memory" 
        value={75} 
        unit="%" 
        icon="storage"
      />
    );
    expect(screen.getByTestId('metrics-card')).toHaveClass('text-yellow-400');
    
    // Valeur critique (>= 90)
    rerender(
      <MetricsCard 
        title="Memory" 
        value={95} 
        unit="%" 
        icon="storage"
      />
    );
    expect(screen.getByTestId('metrics-card')).toHaveClass('text-red-400');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    
    render(
      <MetricsCard 
        title="Storage" 
        value={60} 
        unit="GB" 
        icon="database"
        onClick={handleClick}
      />
    );
    
    const card = screen.getByTestId('metrics-card');
    card.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display trend indicator when provided', () => {
    render(
      <MetricsCard 
        title="Network" 
        value={30} 
        unit="Mbps" 
        icon="wifi"
        trend={{ value: 5, direction: 'up' }}
      />
    );
    
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(screen.getByTestId('trend-up')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    const { container } = render(
      <MetricsCard 
        title="CPU Usage" 
        value={75} 
        unit="%" 
        icon="memory"
      />
    );
    
    // Vérifier que le composant a un rôle approprié
    expect(container.firstChild).toHaveAttribute('role', 'article');
    
    // Vérifier qu'il y a un label accessible
    expect(screen.getByLabelText(/cpu usage/i)).toBeInTheDocument();
  });
});
