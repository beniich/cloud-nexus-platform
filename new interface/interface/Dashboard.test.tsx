import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@tests/utils';
import { Dashboard } from '@pages/Dashboard';
import { createMockUser, createMockMetrics } from '@tests/utils';

// Mock du service Gemini
vi.mock('@services/geminiService', () => ({
  geminiService: {
    generateContent: vi.fn(),
    getInsights: vi.fn(),
  },
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with user greeting', () => {
    const mockUser = createMockUser({ username: 'John Doe' });
    
    render(<Dashboard />, {
      contextValue: { user: mockUser },
    });
    
    expect(screen.getByText(/bienvenue, john doe/i)).toBeInTheDocument();
  });

  it('should display metrics cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('Network')).toBeInTheDocument();
  });

  it('should load and display real-time metrics', async () => {
    const mockMetrics = createMockMetrics({ cpu: 85 });
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  it('should render quick actions', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Deploy App')).toBeInTheDocument();
    expect(screen.getByText('Create Instance')).toBeInTheDocument();
    expect(screen.getByText('View Logs')).toBeInTheDocument();
  });

  it('should navigate to correct page on quick action click', () => {
    const { user } = render(<Dashboard />);
    
    const deployButton = screen.getByText('Deploy App');
    deployButton.click();
    
    // Vérifier la navigation (si vous utilisez React Router)
    expect(window.location.pathname).toBe('/deploy');
  });

  it('should show holographic graph', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('hologram-graph')).toBeInTheDocument();
  });

  it('should update metrics every 5 seconds', async () => {
    vi.useFakeTimers();
    
    render(<Dashboard />);
    
    const initialValue = screen.getByTestId('cpu-value').textContent;
    
    // Avancer de 5 secondes
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      const newValue = screen.getByTestId('cpu-value').textContent;
      expect(newValue).not.toBe(initialValue);
    });
    
    vi.useRealTimers();
  });

  it('should handle error state gracefully', async () => {
    // Simuler une erreur de chargement
    vi.mocked(geminiService.getInsights).mockRejectedValueOnce(
      new Error('Failed to load')
    );
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/erreur de chargement/i)).toBeInTheDocument();
    });
  });

  it('should be responsive', () => {
    const { container } = render(<Dashboard />);
    
    // Vérifier les classes responsive
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
  });
});
