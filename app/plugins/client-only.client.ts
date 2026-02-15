// Client-only plugin for browser APIs
export default defineNuxtPlugin(() => {
  // This plugin only runs on the client side
  // Use it for initializing browser-specific features
  
  if (import.meta.client) {
    // Any global client-side initialization can go here
    console.log('Client-side initialized')
  }
})
