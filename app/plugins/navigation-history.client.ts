export default defineNuxtPlugin(() => {
  const router = useRouter()
  const navigationHistory = useState<string[]>('navigation-history', () => [])

  // Add initial route
  if (navigationHistory.value.length === 0) {
    navigationHistory.value.push(router.currentRoute.value.fullPath)
  }

  // Track route changes
  router.afterEach((to, from) => {
    const lastPath = navigationHistory.value[navigationHistory.value.length - 1]
    
    // Only add if it's a new navigation (not going back)
    if (to.fullPath !== lastPath) {
      navigationHistory.value.push(to.fullPath)
    }
  })
})
