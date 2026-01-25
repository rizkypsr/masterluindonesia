import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  
  // Disable payload extraction for static hosting without Node.js
  experimental: {
    payloadExtraction: false,
  },
  
  // Disable route rules (causes "Cannot read properties of undefined" error)
  routeRules: {},
  
  // Use static preset for shared hosting
  nitro: {
    preset: 'static',
  },
  
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
  ],
  colorMode: {
    preference: 'light'
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
})