export default defineNuxtPlugin(() => {
  // Load Google Fonts asynchronously to avoid render blocking
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    link.media = 'print'
    link.onload = function() {
      // @ts-ignore
      this.media = 'all'
    }
    document.head.appendChild(link)
  }
})
