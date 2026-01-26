export const useSmartBack = () => {
  const router = useRouter()
  const navigationHistory = useState<string[]>('navigation-history', () => [])

  const goBack = () => {
    if (navigationHistory.value.length > 1) {
      // Remove current page from history
      navigationHistory.value.pop()
      // Go back
      router.back()
    } else {
      // No internal history, force go to home
      window.location.href = '/'
    }
  }

  return { goBack }
}
