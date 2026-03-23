<template>
  <NuxtLayout>
    <NuxtPage :keepalive="{ max: 10 }" :page-key="route => route.fullPath" />
  </NuxtLayout>
  <UToaster />
</template>

<script setup lang="ts">
// Save scroll positions before navigation
const router = useRouter()
const scrollPositions = new Map<string, number>()

router.beforeEach((to, from) => {
  if (import.meta.client) {
    // Save home page scroll
    if (from.path === '/') {
      const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
      if (container) {
        scrollPositions.set(from.fullPath, container.scrollTop)
      }
    }
    // Save topics page scroll
    if (from.path.startsWith('/topics/') && from.path !== '/topics/detail') {
      const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
      if (container) {
        sessionStorage.setItem(`topics-scroll-${from.params.id}`, String(container.scrollTop))
      }
    }
    // Save video page scroll
    if (from.path.startsWith('/video/') && !from.path.startsWith('/video/play')) {
      const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
      if (container) {
        sessionStorage.setItem(`video-scroll-${from.params.categoryId}-${from.params.subCategoryId}`, String(container.scrollTop))
      }
    }
  }
})

router.afterEach((to) => {
  if (import.meta.client) {
    setTimeout(() => {
      // Restore home page scroll
      if (to.path === '/') {
        const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
        const savedPosition = scrollPositions.get(to.fullPath)
        if (container && savedPosition) {
          container.scrollTop = savedPosition
        }
      }
      // Restore topics page scroll
      if (to.path.startsWith('/topics/') && to.path !== '/topics/detail') {
        const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
        const savedPosition = sessionStorage.getItem(`topics-scroll-${to.params.id}`)
        if (container && savedPosition) {
          container.scrollTop = parseInt(savedPosition, 10)
        }
      }
      // Restore video page scroll
      if (to.path.startsWith('/video/') && !to.path.startsWith('/video/play')) {
        const container = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
        const savedPosition = sessionStorage.getItem(`video-scroll-${to.params.categoryId}-${to.params.subCategoryId}`)
        if (container && savedPosition) {
          container.scrollTop = parseInt(savedPosition, 10)
        }
      }
    }, 150)
  }
})
</script>

<style>
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
