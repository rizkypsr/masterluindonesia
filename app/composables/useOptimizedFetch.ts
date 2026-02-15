// Optimized data fetching with smart caching
export const useOptimizedFetch = <T>(
  url: string,
  options?: {
    key?: string
    cache?: 'default' | 'force-cache' | 'no-cache'
    ttl?: number // Time to live in seconds
    lazy?: boolean
  }
) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  // Generate unique cache key
  const cacheKey = options?.key || `fetch:${url}`

  // Use useFetch for SSR-safe data fetching
  return useFetch<T>(url, {
    baseURL,
    key: cacheKey,
    lazy: options?.lazy ?? false,
    
    // Cache control
    getCachedData(key) {
      if (options?.cache === 'no-cache') return undefined
      
      const data = useNuxtData(key)
      if (!data.data.value) return undefined
      
      // Check TTL if specified
      if (options?.ttl) {
        const cached = data.data.value as any
        if (cached._cachedAt) {
          const age = Date.now() - cached._cachedAt
          if (age > options.ttl * 1000) {
            return undefined // Cache expired
          }
        }
      }
      
      return data.data.value
    },
    
    // Add cache timestamp
    transform(data: any) {
      if (options?.ttl) {
        return {
          ...data,
          _cachedAt: Date.now()
        }
      }
      return data
    },
  })
}

// Example usage:
// const { data, pending, error } = await useOptimizedFetch('/books', {
//   key: 'books-list',
//   ttl: 3600, // Cache for 1 hour
//   lazy: true
// })
