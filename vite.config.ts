import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8085,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - React core (optimized)
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-core';
            }

            // UI libraries - Radix UI (split by usage frequency)
            if (id.includes('@radix-ui')) {
              return 'ui-radix';
            }

            // Charts library (large, separate chunk)
            if (id.includes('recharts')) {
              return 'charts';
            }

            // Heavy backend/API libraries
            if (id.includes('stripe') || id.includes('socket.io') || id.includes('@prisma')) {
              return 'api-libs';
            }

            // Utilities (smaller libraries)
            if (id.includes('clsx') ||
              id.includes('tailwind-merge') ||
              id.includes('class-variance-authority') ||
              id.includes('date-fns')) {
              return 'utils';
            }

            // Icons
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons';
            }

            // Form libraries (only if actually used)
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers')) {
              return 'forms';
            }

            // Validation
            if (id.includes('zod')) {
              return 'forms';
            }

            // All other smaller node_modules
            return 'vendor';
          }

          // Feature-based chunks
          if (id.includes('/src/features/cloud/') || id.includes('/src/app/cloud/')) {
            return 'feature-cloud';
          }

          if (id.includes('/src/features/cms/')) {
            return 'feature-cms';
          }

          if (id.includes('/src/features/livepulse/') ||
            id.includes('/src/app/routes/livepulse/') ||
            id.includes('/src/components/livepulse/')) {
            return 'feature-livepulse';
          }

          if (id.includes('/src/features/auth/')) {
            return 'feature-auth';
          }

          if (id.includes('/src/features/service-request/')) {
            return 'feature-service-request';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: mode !== 'production',
  },
}));
