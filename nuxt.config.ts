// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // Static SPA: no Node process in production (shared hosting NPROC limit).
  // All data is fetched client-side from the external API.
  ssr: false,
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
    preset: 'static',
    compressPublicAssets: { gzip: true, brotli: true },
    // Cache-Control is served by Apache — see public/.htaccess
  },
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxt/image', '@pinia/nuxt', '@vueuse/nuxt', 'nuxt-ripple'],
  icon: {
    // No server bundle to fall back on in a static build — inline the scanned
    // icons into the client bundle so nothing is fetched from the Iconify API.
    mode: 'css',
    serverBundle: false,
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      // Referenced via Nuxt UI's `i-*` class syntax, which the scanner misses
      icons: ['simple-icons:google', 'lucide:loader-circle'],
    },
  },
  ripple: {
    mode: 'click',
    color: 'rgba(255, 165, 0, 0.3)', // Orange color with transparency
    duration: 300,
    scale: 1,
    overflow: false,
  },
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
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
      apiV2BaseUrl: process.env.NUXT_PUBLIC_API_V2_BASE_URL || '',
    },
  },
})