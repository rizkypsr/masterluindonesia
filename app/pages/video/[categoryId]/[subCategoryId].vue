<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button @click="$router.back()" class="p-1">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white flex-1">{{ pageTitle }}</h1>
      <button @click="shareContent" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
    </div>

    <!-- Content -->
    <div ref="contentContainer" class="flex-1 overflow-y-auto p-4">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div class="space-y-2 pl-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Video Groups -->
      <div v-else>
        <div v-for="group in videoGroups" :key="group.id"
          class="border-b border-gray-400 dark:border-gray-600 pb-2 mb-4">
          <!-- Group Title -->
          <h2 class="text-xl font-semibold text-black dark:text-white mb-3">{{ group.title }}</h2>

          <!-- Video Items -->
          <div class="space-y-2">
            <NuxtLink v-for="video in group.sub_category" :key="video.id"
              :to="{ path: `/video/play/${video.id}`, query: { title: video.title } }"
              class="block py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
              <!-- Video Title -->
              <span class="text-xl text-gray-700 dark:text-gray-300">{{ video.title }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, onDeactivated, onBeforeUnmount } from "vue"

interface VideoItem {
  id: number
  parent_id: number
  category_id: number
  sub_category_id: number
  title: string
  order: number
  translate_id: number
  translate_ch: number
}

interface VideoGroup {
  id: number
  parent_id: number | null
  category_id: number
  sub_category_id: number
  title: string
  order: number
  translate_id: number
  translate_ch: number
  sub_category: VideoItem[]
}

const route = useRoute()
const config = useRuntimeConfig()
const toast = useToast()
const categoryId = computed(() => route.params.categoryId)
const subCategoryId = computed(() => route.params.subCategoryId)
const pageTitle = computed(() => (route.query.title as string) || 'Video')
const contentContainer = ref<HTMLElement | null>(null)

// Scroll position management
const SCROLL_KEY = `video-${categoryId.value}-${subCategoryId.value}-scroll`

const getStoredScrollPosition = () => {
  if (import.meta.client) {
    return parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10)
  }
  return 0
}

const saveScrollPosition = (position: number) => {
  if (import.meta.client) {
    sessionStorage.setItem(SCROLL_KEY, String(position))
  }
}

const { data: videoData, pending } = await useFetch<{ success: boolean; data: VideoGroup[] }>(
  () => `${config.public.apiBaseUrl}/videoCategory?category_id=${categoryId.value}&sub_category_id=${subCategoryId.value}`
)

const videoGroups = computed(() => videoData.value?.data?.sort((a, b) => a.order - b.order) || [])

// Restore scroll position on mount
onMounted(() => {
  if (import.meta.client && contentContainer.value) {
    setTimeout(() => {
      const savedPosition = getStoredScrollPosition()
      if (savedPosition > 0 && contentContainer.value) {
        contentContainer.value.scrollTop = savedPosition
      }
    }, 100)
  }
})

// Save scroll position when navigating away
onBeforeUnmount(() => {
  if (import.meta.client && contentContainer.value) {
    saveScrollPosition(contentContainer.value.scrollTop)
  }
})

// Handle keepalive activation/deactivation
onActivated(() => {
  if (import.meta.client && contentContainer.value) {
    setTimeout(() => {
      const savedPosition = getStoredScrollPosition()
      if (savedPosition > 0 && contentContainer.value) {
        contentContainer.value.scrollTop = savedPosition
      }
    }, 50)
  }
})

onDeactivated(() => {
  if (import.meta.client && contentContainer.value) {
    saveScrollPosition(contentContainer.value.scrollTop)
  }
})

const shareContent = () => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?title=${encodeURIComponent(pageTitle.value)}`
  const shareTitle = pageTitle.value

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareTitle,
      url: shareUrl
    }).catch(err => {
      // User cancelled or error - silently ignore
      console.log('Share cancelled or failed:', err)
    })
  } else {
    // Fallback: copy to clipboard
    const shareText = `${shareTitle}\n${shareUrl}`
    navigator.clipboard.writeText(shareText).then(() => {
      toast.add({
        title: 'Link disalin ke clipboard',
        color: 'success'
      })
    }).catch(err => {
      console.error('Failed to copy:', err)
      toast.add({
        title: 'Gagal menyalin link',
        color: 'error'
      })
    })
  }
}
</script>
