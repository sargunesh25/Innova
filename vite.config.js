import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'tslib',
      '@supabase/supabase-js',
      '@supabase/functions-js',
    ],
  },
  build: {
    rollupOptions: {
      // Silence the tslib warning treated as error by rolldown
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message?.includes('tslib')) return;
        warn(warning);
      },
    },
  },
})

