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
          // Vendor chunks - React core
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-core';
            }

            // UI libraries - Radix UI
            if (id.includes('@radix-ui')) {
              return 'ui-radix';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'form-libs';
            }

            // Charts
            if (id.includes('recharts')) {
              return 'charts';
            }

            // Icons
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons';
            }

            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }

            // All other node_modules
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
