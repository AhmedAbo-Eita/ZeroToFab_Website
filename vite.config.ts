import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

/**
 * Production Content-Security-Policy injected into `dist/index.html` at build time.
 * Applied only during `vite build` so `@vitejs/plugin-react` Fast Refresh inline
 * preamble scripts continue working cleanly in `vite dev`.
 */
const PRODUCTION_CSP = [
  "default-src 'self'",
  "script-src 'self' https://accounts.google.com/gsi/client",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "frame-src https://drive.google.com https://www.youtube.com https://www.youtube-nocookie.com https://accounts.google.com",
  "connect-src 'self' https://www.googleapis.com https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

/** Injects `PRODUCTION_CSP` as a `<meta http-equiv="Content-Security-Policy">` tag during production builds. */
function injectProductionCsp(): Plugin {
  return {
    name: 'inject-production-csp',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: PRODUCTION_CSP,
          },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/',
  plugins: [react(), tailwindcss(), injectProductionCsp()],
})
