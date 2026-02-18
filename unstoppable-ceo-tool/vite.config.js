import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2015',
    cssCodeSplit: false,
    outDir: 'dist'
  },
  server: {
    port: 3000,
    host: true
  }
})
