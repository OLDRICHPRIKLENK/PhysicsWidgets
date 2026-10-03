import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deployment uses /PhysicsWidgets/ base path in production
  base: process.env.NODE_ENV === 'production' ? '/PhysicsWidgets/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
