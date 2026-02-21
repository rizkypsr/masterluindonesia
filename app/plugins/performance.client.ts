export default defineNuxtPlugin(() => {
  // Preload critical Firebase Storage images on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = 'https://firebasestorage.googleapis.com'
      document.head.appendChild(link)
    })
  }
})
