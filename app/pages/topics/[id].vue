<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()"
          class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <h1 class="text-lg font-semibold text-black dark:text-white">{{ topicTitle }}</h1>
      </div>
      <button class="p-1" @click="shareTopic">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
    </div>

    <!-- Search Input -->
    <div class="px-4 py-4 shrink-0">
      <UInput 
        v-model="globalSearchQuery" 
        placeholder="Cari dalam topik ini..." 
        size="lg" 
        class="w-full"
        @keyup.enter="handleGlobalSearch"
      >
        <template #trailing>
          <UButton 
            v-if="globalSearchQuery.trim()" 
            size="sm" 
            class="bg-primary hover:bg-primary/90 text-black font-medium" 
            @click="handleGlobalSearch"
          >
            Cari
          </UButton>
        </template>
      </UInput>
    </div>

    <!-- Content -->
    <div ref="contentContainer" class="flex-1 overflow-y-auto px-4">
      <!-- Global Search Results -->
      <div v-if="hasGlobalSearched" class="pb-4">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            HASIL PENCARIAN "{{ searchedKeyword }}"
          </p>
          <button @click="clearGlobalSearch" class="text-sm text-primary hover:underline">
            Kembali
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isSearching" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>

        <!-- Results List -->
        <div v-else-if="searchResults.length > 0" class="space-y-4">
          <SearchResultCard
            v-for="item in searchResults"
            :key="`${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
            :item="item"
            :is-expanded="expandedSearchItems.has(`${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`)"
            :font-size="16"
            :is-speaking="speakingItemId === `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
            :search-keyword="searchedKeyword"
            @toggle="toggleSearchExpand(item)"
            @navigate="navigateToSearchResult(item)"
            @speak="speakSearchContent(item)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
        </div>
      </div>

      <!-- Original Content -->
      <div v-else>
        <!-- Empty State -->
        <div v-if="categories.length === 0" class="flex flex-col items-center justify-center py-32">
          <div
            class="w-32 h-32 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 relative">
            <Icon name="mdi:package-variant" class="w-16 h-16 text-gray-300 dark:text-gray-600" />
            <div
              class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <Icon name="mdi:cancel" class="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Data tidak tersedia</p>
        </div>

        <!-- Categories List -->
        <div v-else class="pb-4">
          <div v-for="category in categories" :key="category.id" class="mb-2">
            <!-- Category Title with Search -->
            <div v-if="!searchModes[category.id]" class="flex items-center justify-between py-3">
              <h2 class="text-xl font-bold text-black dark:text-white">{{ category.title }}</h2>
              <button @click="openSearch(category.id)" class="p-1">
                <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>

            <!-- Search Input -->
            <div v-else class="flex items-center gap-3 py-3">
              <input v-model="searchQueries[category.id]" type="text" placeholder="Cari..."
                class="flex-1 text-black dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none py-1"
                autofocus />
              <button @click="closeSearch(category.id)" class="p-1">
                <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>

            <!-- Sub Categories -->
            <div v-if="getFilteredSubCategories(category).length > 0"
              class="divide-y divide-gray-200 dark:divide-gray-700">
              <NuxtLink v-for="sub in getFilteredSubCategories(category)" :key="sub.id"
                :to="{ path: '/topics/detail', query: { subId: sub.id, title: sub.title } }"
                class="py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 block">
                <span class="text-lg text-black dark:text-white">{{ sub.title }}</span>
              </NuxtLink>
            </div>
            
            <!-- No results message -->
            <div v-else-if="searchModes[category.id] && searchQueries[category.id]" class="py-4 text-center">
              <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue'
import type { SearchItem } from '~/types/search'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

interface SubCategory {
  id: number
  parent_id: number
  topics_id: number
  title: string
}

interface TopicCategory {
  id: number
  topics_id: number
  title: string
  have_child: number
  sub_category: SubCategory[]
}

const topicId = computed(() => route.params.id as string)
const topicTitle = computed(() => (route.query.title as string) || 'Topic')
const contentContainer = ref<HTMLElement | null>(null)

// Local category search state
const searchModes = ref<Record<number, boolean>>({})
const searchQueries = ref<Record<number, string>>({})

// Global search state
const globalSearchQuery = ref('')
const searchedKeyword = ref('')
const hasGlobalSearched = ref(false)
const isSearching = ref(false)
const searchResults = ref<SearchItem[]>([])
const expandedSearchItems = ref<Set<string>>(new Set())
const speakingItemId = ref<string | null>(null)
const isSpeaking = ref(false)

// Scroll position management
const SCROLL_KEY = `topics-${topicId.value}-scroll`

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

const { data: categoriesData } = await useFetch<{ success: boolean; data: TopicCategory[] }>(
  () => `${config.public.apiBaseUrl}/topics/category/${topicId.value}`
)

const categories = computed(() => {
  return categoriesData.value?.data || []
})

// Get all topic1_category_ids recursively
const getAllCategoryIds = (categories: TopicCategory[]): number[] => {
  const ids: number[] = []
  
  for (const category of categories) {
    ids.push(category.id)
    if (category.sub_category && category.sub_category.length > 0) {
      for (const sub of category.sub_category) {
        ids.push(sub.id)
      }
    }
  }
  
  return ids
}

// Global Search Functions
const handleGlobalSearch = async () => {
  if (!globalSearchQuery.value.trim()) return
  
  searchedKeyword.value = globalSearchQuery.value.trim()
  hasGlobalSearched.value = true
  isSearching.value = true
  searchResults.value = []
  
  try {
    const categoryIds = getAllCategoryIds(categories.value)
    
    const payload = {
      keyword: searchedKeyword.value,
      year: [],
      selectedCategory: ['topik1'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      topic1_category_ids: categoryIds
    }
    
    const response = await $fetch<{
      success: boolean
      message: string
      data: SearchItem[]
    }>(`${config.public.apiBaseUrl}/search?page=1`, {
      method: 'POST',
      body: payload
    })
    
    searchResults.value = response.data || []
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}

const clearGlobalSearch = () => {
  globalSearchQuery.value = ''
  searchedKeyword.value = ''
  hasGlobalSearched.value = false
  searchResults.value = []
  expandedSearchItems.value.clear()
}

const toggleSearchExpand = (item: SearchItem) => {
  const key = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`
  if (expandedSearchItems.value.has(key)) {
    expandedSearchItems.value.delete(key)
  } else {
    expandedSearchItems.value.add(key)
  }
  expandedSearchItems.value = new Set(expandedSearchItems.value)
}

const navigateToSearchResult = (item: SearchItem) => {
  const itemType = item.type.toLowerCase()
  
  // Check which category this item belongs to based on data_category fields
  // If it has data_category_topic1, it means it's audio/video content categorized under topic1
  if (itemType === 'topic1' || itemType === 'topik1') {
    // Topic1 items are actually audio/video content
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'audio') {
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const audioId = parts[1] || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'video') {
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const videoId = parts[1] || ''
    const subtitleId = item.id || ''
    router.push({ path: '/video/detail', query: { video_id: videoId, subtitle_id: subtitleId } })
  } else if (itemType === 'topik2' || itemType === 'topic2') {
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const chapterId = parts[1] || ''
    const page = parts[2] || ''
    router.push({ path: `/topics2/${chapterId}`, query: { page } })
  } else if (itemType === 'topik3' || itemType === 'topic3') {
    const headerId = item.header_id ? String(item.header_id) : ''
    router.push(`/topics3/content/${headerId}`)
  } else if (itemType === 'book' || itemType === 'buku') {
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const [, chapterId, page] = parts
    router.push({ path: `/book/${chapterId}`, query: { page } })
  }
}

const speakSearchContent = (item: SearchItem) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  const itemKey = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

  if (isSpeaking.value && speakingItemId.value === itemKey) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    speakingItemId.value = null
    return
  }

  window.speechSynthesis.cancel()

  const text = item.full_detail
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'id-ID'
  utterance.rate = 1
  utterance.pitch = 1

  utterance.onstart = () => {
    isSpeaking.value = true
    speakingItemId.value = itemKey
  }

  utterance.onend = () => {
    isSpeaking.value = false
    speakingItemId.value = null
  }

  utterance.onerror = () => {
    isSpeaking.value = false
    speakingItemId.value = null
  }

  window.speechSynthesis.speak(utterance)
}

// Filtered categories based on local search
const getFilteredSubCategories = (category: TopicCategory) => {
  const query = searchQueries.value[category.id]
  if (!query || !query.trim()) return category.sub_category
  
  const searchTerm = query.toLowerCase()
  return category.sub_category.filter(sub =>
    sub.title.toLowerCase().includes(searchTerm)
  )
}

const openSearch = (categoryId: number) => {
  searchModes.value[categoryId] = true
  searchQueries.value[categoryId] = ''
}

const closeSearch = (categoryId: number) => {
  searchModes.value[categoryId] = false
  searchQueries.value[categoryId] = ''
}

const shareTopic = async () => {
  const shareData = {
    title: 'Ensiklopedia',
    text: topicTitle.value,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`Lihat Topik "${topicTitle.value}" di\n${window.location.href}`)
    alert('Link berhasil disalin!')
  }
}

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
</script>
