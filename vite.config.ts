import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack/react-query')) return 'query';
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            if (
              id.includes('@radix-ui/react-dialog') ||
              id.includes('@radix-ui/react-select') ||
              id.includes('@radix-ui/react-tabs')
            ) {
              return 'ui';
            }
            if (
              id.includes('/react/') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor';
            }
          }
        },
      },
    },
  },
});