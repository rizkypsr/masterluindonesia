// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      title: 'Master Lu Indonesia',
      titleTemplate: '%s | Master Lu Indonesia',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'Master Lu' },
        { name: 'description', content: 'Platform pembelajaran dengan koleksi audio, buku, paritta, dan materi edukasi lengkap' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        // Preconnect to external domains for faster resource loading
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://firebasestorage.googleapis.com' },
      ],
    },
    buildAssetsDir: '/_nuxt/',
  },
  nitro: {
    preset: 'node-server',
    routeRules: {
      // Disable caching for HTML pages
      '/**': { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } },
      // Cache static assets with versioning
      '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '/assets/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
  ],
  image: {
    provider: 'none',
    domains: ['masterluindonesia.com', 'masterlu.buildbyriz.io', 'api.masterluindonesia.com', 'firebasestorage.googleapis.com'],
  },
  colorMode: {
    preference: 'light'
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      googleClientId: '',
      apiBaseUrl: '',
    },
  },
})
