import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Monorepo safety net: force a single React instance regardless of how
  // npm's resolver nests react/react-dom under apps/admin/node_modules
  // vs. the hoisted root copy — avoids "Invalid hook call" from duplicate copies.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
