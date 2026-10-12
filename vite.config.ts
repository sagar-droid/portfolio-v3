import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // React + Router + Motion + Lenis ≈ 160 kB gzipped; fine for a portfolio
  build: { chunkSizeWarningLimit: 600 },
})
