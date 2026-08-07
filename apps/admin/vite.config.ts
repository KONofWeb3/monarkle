import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'

// https://vite.dev/config/

// Monorepo safety net: this npm environment has repeatedly re-nested a
// second copy of react/react-dom under apps/admin/node_modules (different
// version than the hoisted root copy) on every reinstall, regardless of
// exact version pins, cache clears, or root "overrides". `resolve.dedupe`
// alone did not fix it (still saw continuous re-optimization + "Invalid
// hook call" from two live React instances). Hard-aliasing to one exact
// file path bypasses npm's resolver entirely and is unconditional.
function resolveReactPath(pkg: string) {
  const rootPath = path.resolve(import.meta.dirname, '../../node_modules', pkg)
  if (fs.existsSync(rootPath)) return rootPath
  return path.resolve(import.meta.dirname, 'node_modules', pkg)
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: resolveReactPath('react'),
      'react-dom': resolveReactPath('react-dom'),
    },
  },
})
