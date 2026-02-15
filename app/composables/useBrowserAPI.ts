// Safe browser API access for SSR compatibility
export const useBrowserAPI = () => {
  const isClient = import.meta.client

  const safeLocalStorage = {
    getItem: (key: string): string | null => {
      if (!isClient) return null
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      if (!isClient) return
      try {
        localStorage.setItem(key, value)
      } catch {
        // Silent fail
      }
    },
    removeItem: (key: string): void => {
      if (!isClient) return
      try {
        localStorage.removeItem(key)
      } catch {
        // Silent fail
      }
    }
  }

  const safeWindow = {
    scrollTo: (options: ScrollToOptions): void => {
      if (!isClient || typeof window === 'undefined') return
      window.scrollTo(options)
    },
    open: (url: string, target: string): void => {
      if (!isClient || typeof window === 'undefined') return
      window.open(url, target)
    },
    getLocation: () => {
      if (!isClient || typeof window === 'undefined') return { href: '', origin: '', pathname: '' }
      return {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname
      }
    }
  }

  const safeNavigator = {
    share: async (data: ShareData): Promise<void> => {
      if (!isClient || typeof navigator === 'undefined' || !navigator.share) {
        throw new Error('Share API not available')
      }
      return navigator.share(data)
    },
    clipboard: {
      writeText: async (text: string): Promise<void> => {
        if (!isClient || typeof navigator === 'undefined' || !navigator.clipboard) {
          throw new Error('Clipboard API not available')
        }
        return navigator.clipboard.writeText(text)
      }
    }
  }

  return {
    isClient,
    localStorage: safeLocalStorage,
    window: safeWindow,
    navigator: safeNavigator
  }
}
