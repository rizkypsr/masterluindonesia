import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
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
        { rel: 'preconnect', href: 'https://api.cms.masterluindonesia.com' },
        { rel: 'dns-prefetch', href: 'https://api.cms.masterluindonesia.com' },
      ],
    },
  },
  

  
  routeRules: {
    // Home page - SSR with cache headers for performance
    '/': { ssr: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    
    '/edukasi/**': { prerender: true, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/tentang/**': { prerender: true, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/contact': { prerender: true, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/lainnya': { prerender: true, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    
    // Dynamic content pages - SSR with cache headers
    '/audio/**': { ssr: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    '/books/**': { ssr: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    '/recipes/**': { ssr: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    '/paritta/**': { ssr: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    '/community-playlists/**': { ssr: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
    
    '/bookmark': { ssr: false },
    '/bookmark-manager': { ssr: false },
    '/article-history': { ssr: false },
    '/search': { ssr: false },
    
    // Static assets - long cache
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    
    // API routes
    '/api/**': { cors: true, headers: { 'cache-control': 'max-age=300' } },
  },
  
  // Use Node.js preset for SSR on shared hosting
  nitro: {
    preset: 'node-server',
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    minify: true,
    sourceMap: false,
    prerender: {
      failOnError: false,
      crawlLinks: true,
      ignore: [
        '/api',
      ],
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
  
  features: {
    inlineStyles: false,
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-pinia': ['pinia'],
          },
        },
      },
    },
  },
  
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    viewTransition: false,
    inlineRouteRules: true,
  },
  runtimeConfig: {
    public: {
      googleClientId: '',
      apiBaseUrl: 'https://api.cms.masterluindonesia.com/api',
    },
  },
})