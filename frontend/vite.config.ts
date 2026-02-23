import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler'],],
      },
    }),
    tsconfigPaths(),
    tailwindcss() as PluginOption,
    VitePWA({
      registerType: 'autoUpdate', // permet de mettre à jour l'application automatiquement
      workbox: {
        // Precache : tous les assets du build (JS, CSS, HTML)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Runtime caching : stratégie pour les appels API
        runtimeCaching: [
          {
            // Toutes les requêtes vers ton backend Render
            urlPattern: /^https:\/\/snippets-manager\.onrender\.com\/.*/i,
            handler: 'NetworkFirst', // Essaie le réseau, fallback sur le cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,            // Max 50 réponses en cache
                maxAgeSeconds: 60 * 60 * 24, // 24h max
              },
              networkTimeoutSeconds: 10,   // Si pas de réponse en 10s → cache
            },
          },
        ],
      },
      manifest: {
        name: 'Snippets Manager',
        short_name: 'Snippets',
        description: 'Gérez vos snippets de code',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone', // permet d'afficher l'application dans l'écran d'accueil
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
