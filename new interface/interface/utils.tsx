import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock du contexte de l'application
interface MockAppContextValue {
  user: any;
  setUser: (user: any) => void;
  settings: any;
  updateSettings: (settings: any) => void;
}

const defaultContextValue: MockAppContextValue = {
  user: null,
  setUser: () => {},
  settings: {
    theme: 'dark',
    language: 'fr',
    notifications: true,
  },
  updateSettings: () => {},
};

// Wrapper personnalisé avec providers
interface AllTheProvidersProps {
  children: ReactNode;
  contextValue?: Partial<MockAppContextValue>;
}

function AllTheProviders({ 
  children, 
  contextValue = {} 
}: AllTheProvidersProps) {
  const value = { ...defaultContextValue, ...contextValue };
  
  return (
    <BrowserRouter>
      {/* Ajoutez ici votre AppContext.Provider si nécessaire */}
      {children}
    </BrowserRouter>
  );
}

// Render personnalisé
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  contextValue?: Partial<MockAppContextValue>;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { contextValue, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders contextValue={contextValue}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
}

// Helper pour créer un mock d'utilisateur
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    role: 'USER',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// Helper pour créer des mock data
export function createMockMetrics(overrides = {}) {
  return {
    cpu: 45,
    memory: 60,
    storage: 75,
    network: 30,
    timestamp: Date.now(),
    ...overrides,
  };
}

// Export de tout ce dont on a besoin
export * from '@testing-library/react';
export { customRender as render };
