// Performance monitoring utilities
export const usePerformance = () => {
  const isClient = import.meta.client

  // Measure component render time
  const measureRender = (componentName: string) => {
    if (!isClient || !window.performance) return

    const startMark = `${componentName}-start`
    const endMark = `${componentName}-end`
    const measureName = `${componentName}-render`

    onMounted(() => {
      performance.mark(startMark)
    })

    onUpdated(() => {
      performance.mark(endMark)
      try {
        performance.measure(measureName, startMark, endMark)
        const measure = performance.getEntriesByName(measureName)[0]
        if (measure && import.meta.dev) {
          console.log(`⚡ ${componentName} rendered in ${measure.duration.toFixed(2)}ms`)
        }
      } catch (e) {
        // Ignore measurement errors
      }
    })
  }

  // Track Core Web Vitals
  const trackWebVitals = () => {
    if (!isClient) return

    // LCP - Largest Contentful Paint
    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry && import.meta.dev) {
            console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime)
          }
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // Browser doesn't support LCP
      }
    }

    // FID - First Input Delay
    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (import.meta.dev) {
              console.log('📊 FID:', entry.processingStart - entry.startTime)
            }
          })
        })
        observer.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // Browser doesn't support FID
      }
    }

    // CLS - Cumulative Layout Shift
    const observeCLS = () => {
      try {
        let clsScore = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value
              if (import.meta.dev) {
                console.log('📊 CLS:', clsScore)
              }
            }
          }
        })
        observer.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // Browser doesn't support CLS
      }
    }

    onMounted(() => {
      observeLCP()
      observeFID()
      observeCLS()
    })
  }

  // Preload critical resources
  const preloadResource = (url: string, type: 'script' | 'style' | 'font' | 'image') => {
    if (!isClient) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    link.as = type
    
    if (type === 'font') {
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
  }

  // Lazy load images when they enter viewport
  const lazyLoadImage = (imgRef: Ref<HTMLImageElement | null>) => {
    if (!isClient) return

    onMounted(() => {
      if (!imgRef.value) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            if (src) {
              img.src = src
              img.removeAttribute('data-src')
            }
            observer.unobserve(img)
          }
        })
      })

      observer.observe(imgRef.value)
    })
  }

  return {
    measureRender,
    trackWebVitals,
    preloadResource,
    lazyLoadImage,
  }
}

// Example usage:
// const { measureRender, trackWebVitals } = usePerformance()
// measureRender('MyComponent')
// trackWebVitals()
