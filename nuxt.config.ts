import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: { interaction: true },
      },
    },
    payloadExtraction: true,
  },
  
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'Master Lu' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
  

  
  routeRules: {
    // Home page - ISR instead of prerender (has dynamic content from API)
    '/': { isr: 3600 },
    
    '/edukasi/**': { prerender: true },
    '/tentang/**': { prerender: true },
    '/contact': { prerender: true },
    '/lainnya': { prerender: true },
    
    '/audio/**': { isr: 3600 },
    '/books/**': { isr: 3600 },
    '/recipes/**': { isr: 3600 },
    '/paritta/**': { isr: 3600 },
    '/community-playlists/**': { isr: 3600 },
    
    '/bookmark': { ssr: false },
    '/bookmark-manager': { ssr: false },
    '/article-history': { ssr: false },
    '/search': { ssr: false },
    
    // API routes - no prerendering
    '/api/**': { cors: true, headers: { 'cache-control': 'max-age=300' } },
  },
  
  // Use Node.js preset for SSR on shared hosting
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    minify: true,
    sourceMap: false,
    prerender: {
      failOnError: false, // Don't fail build on prerender errors
      crawlLinks: true,
      ignore: [
        '/api',
        '/_ipx', // Ignore image optimization routes during prerender
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
    format: ['webp'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    domains: ['masterluindonesia.com', 'masterlu.buildbyriz.io', 'api.masterluindonesia.com'],
    alias: {
      masterlu: 'https://masterluindonesia.com',
      api: 'https://api.masterluindonesia.com',
    },
    // Don't optimize external images during prerender
    provider: 'ipx',
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year cache
    },
  },
  colorMode: {
    preference: 'light'
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      googleClientId: '',
      apiBaseUrl: 'https://api.cms.masterluindonesia.com/api',
    },
  },
})