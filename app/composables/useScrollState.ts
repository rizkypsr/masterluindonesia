export const useScrollState = () => {
  const scrollPositions = useState<Record<string, number>>('scroll-positions', () => ({}))

  const saveScrollPosition = (key: string, position: number) => {
    scrollPositions.value[key] = position
  }

  const getScrollPosition = (key: string): number => {
    return scrollPositions.value[key] || 0
  }

  return {
    saveScrollPosition,
    getScrollPosition
  }
}
