export const useScrollState = () => {
  const saveScrollPosition = (key: string, position: number) => {
    if (import.meta.client) {
      sessionStorage.setItem(`scroll-${key}`, String(position))
    }
  }

  const getScrollPosition = (key: string): number => {
    if (import.meta.client) {
      const position = parseInt(sessionStorage.getItem(`scroll-${key}`) || '0', 10)
      return position
    }
    return 0
  }

  const clearScrollPosition = (key: string) => {
    if (import.meta.client) {
      sessionStorage.removeItem(`scroll-${key}`)
    }
  }

  return {
    saveScrollPosition,
    getScrollPosition,
    clearScrollPosition
  }
}
