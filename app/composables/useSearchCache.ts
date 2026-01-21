interface SearchItem {
  id: number
  header_id: string
  title: string
  detail: string
  full_detail: string
  timestamp: number
  type: string
  description_wa: string
}

interface CacheEntry {
  data: SearchItem[]
  timestamp: number
  totalPages: number
}

interface SearchCache {
  [key: string]: CacheEntry
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function generateCacheKey(keyword: string, filters: object, page: number): string {
  return `${keyword}:${JSON.stringify(filters)}:${page}`
}

export function useSearchCache() {
  const cache = useState<SearchCache>('search-cache', () => ({}))

  function get(keyword: string, filters: object, page: number): SearchItem[] | null {
    const key = generateCacheKey(keyword, filters, page)
    const entry = cache.value[key]

    if (!entry) return null

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      delete cache.value[key]
      return null
    }

    return entry.data
  }

  function set(keyword: string, filters: object, page: number, data: SearchItem[]): void {
    const key = generateCacheKey(keyword, filters, page)
    cache.value[key] = {
      data,
      timestamp: Date.now(),
      totalPages: page
    }
  }

  function invalidate(keyword?: string): void {
    if (keyword) {
      // Remove all entries matching this keyword
      Object.keys(cache.value).forEach(key => {
        if (key.startsWith(`${keyword}:`)) {
          delete cache.value[key]
        }
      })
    } else {
      // Clear all cache
      cache.value = {}
    }
  }

  function clearExpired(): void {
    const now = Date.now()
    Object.keys(cache.value).forEach(key => {
      if (now - cache.value[key].timestamp > CACHE_TTL) {
        delete cache.value[key]
      }
    })
  }

  return {
    get,
    set,
    invalidate,
    clearExpired
  }
}
