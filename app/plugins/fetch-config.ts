export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Configure global fetch defaults
  globalThis.$fetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    retry: 2,
    retryDelay: 1000,
    timeout: 15000,
    
    onRequest({ options }) {
      // Add delay between requests during build
      if (import.meta.server && import.meta.env.PROD) {
        // Small delay to prevent rate limiting during prerender
        return new Promise(resolve => setTimeout(resolve, 100))
      }
    },
    
    onResponseError({ response, options }) {
      // Handle 429 errors gracefully
      if (response.status === 429) {
        console.warn('Rate limit hit, consider reducing concurrent requests')
      }
    },
  })
})
