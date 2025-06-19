import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@mui')) {
            return 'mui';
          }
          if (id.includes('firebase')) {
            return 'firebase';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
})
