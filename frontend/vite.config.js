import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/') || url.pathname.startsWith('/admin/'),
            handler: 'NetworkOnly'
          }
        ]
      },
      manifest: {
        name: 'NEXUS — AIT Pune',
        short_name: 'NEXUS',
        description: 'The project that syncs all the clubs of AIT',
        theme_color: '#4285F4',
        background_color: '#0b1220',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        icons: [
          {
            src: '/image.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/image.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/image.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
