import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { createRequire } from 'node:module'

// https://vite.dev/config/

// Monorepo safety net: npm has repeatedly nested a second copy of
// react/react-dom (a different version than the "real" one) somewhere in
// this dependency tree -- seen both in local dev (apps/admin/node_modules
// vs. the hoisted root copy) and now in Vercel's isolated build too (where
// the directory depth guess a plain relative path makes doesn't hold).
// `resolve.dedupe` alone doesn't fix it. Rather than guess which directory
// layout applies, ask Node's own `require.resolve` to walk up node_modules
// the same way a real `import 'react'` would and alias to whatever it
// actually finds -- correct regardless of hoisting depth or environment.
const req = createRequire(import.meta.url)
function resolveRealPackageDir(pkg: string) {
  return path.dirname(req.resolve(`${pkg}/package.json`))
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: resolveRealPackageDir('react'),
      'react-dom': resolveRealPackageDir('react-dom'),
    },
  },
})
