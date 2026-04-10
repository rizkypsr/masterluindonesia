<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden relative">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button @click="$router.back()" class="p-1">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white flex-1">{{ pageTitle }}</h1>
      <button @click="shareContent" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <div class="relative">
        <button class="p-1" @click="showMenu = !showMenu">
          <Icon name="mdi:dots-vertical" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <button
            @click="openFindInPage"
            class="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 rounded-lg"
          >
            <Icon name="mdi:magnify" class="w-5 h-5" />
            <span>Cari di Halaman</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Find In Page Component -->
    <FindInPage
      :is-open="showFindInPage"
      target-selector="#video-content"
      @close="showFindInPage = false"
    />

    <!-- Search Input -->
    <div class="px-4 py-4 bg-white dark:bg-gray-800 shrink-0">
      <UInput 
        v-model="globalSearchQuery" 
        placeholder="Cari dalam video ini..." 
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
    <div id="video-content" ref="contentContainer" class="flex-1 overflow-y-auto p-4">
      <!-- Search Results -->
      <div v-if="hasGlobalSearched">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            HASIL PENCARIAN "{{ searchedKeyword }}"
          </p>
          <button @click="clearGlobalSearch" class="text-sm text-black dark:text-primary hover:underline">
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
            :font-size="fontSize"
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
            <!-- Group Title with Search -->
            <div v-if="!subCategorySearchModes[group.id]" class="flex items-center justify-between mb-3">
              <h2 class="font-semibold text-black dark:text-white" :style="{ fontSize: (fontSize + 4) + 'px' }">{{ group.title }}</h2>
              <button @click="openSubCategorySearch(group.id)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>

            <!-- Sub-category Search Input -->
            <div v-else class="flex items-center gap-3 mb-3">
              <input 
                v-model="subCategorySearchQueries[group.id]" 
                type="text" 
                placeholder="Cari dalam kategori ini..."
                class="flex-1 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                @keyup.enter="handleSubCategorySearch(group.id)"
                autofocus 
              />
              <button 
                v-if="subCategorySearchQueries[group.id]?.trim()" 
                @click="handleSubCategorySearch(group.id)"
                class="px-3 py-2 bg-primary hover:bg-primary/90 text-black text-sm font-medium rounded"
              >
                Cari
              </button>
              <button @click="closeSubCategorySearch(group.id)" class="p-1">
                <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>

            <!-- Sub-category Search Results -->
            <div v-if="subCategorySearchModes[group.id] && (subCategorySearchLoading[group.id] || subCategorySearchResults[group.id]?.length > 0 || subCategorySearchQueries[group.id]?.trim())">
              <!-- Loading -->
              <div v-if="subCategorySearchLoading[group.id]" class="flex justify-center py-8">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
              </div>

              <!-- Results List -->
              <div v-else-if="subCategorySearchResults[group.id]?.length > 0" class="space-y-4 mb-4">
                <SearchResultCard
                  v-for="item in subCategorySearchResults[group.id]"
                  :key="`subcat-${group.id}-${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
                  :item="item"
                  :is-expanded="expandedSubCategorySearchItems[group.id]?.has(`${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`)"
                  :font-size="fontSize"
                  :is-speaking="speakingSubCategoryItemId[group.id] === `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
                  :search-keyword="subCategorySearchQueries[group.id]"
                  @toggle="toggleSubCategorySearchExpand(group.id, item)"
                  @navigate="navigateToSearchResult(item)"
                  @speak="speakSubCategorySearchContent(group.id, item)"
                />
              </div>

              <!-- Empty State -->
              <div v-else-if="subCategorySearchQueries[group.id]?.trim()" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
              </div>
            </div>

            <!-- Video Items (only show when not in search mode) -->
            <div v-if="!subCategorySearchModes[group.id]" class="space-y-2">
              <NuxtLink v-for="video in group.sub_category" :key="video.id"
                :to="{ path: `/video/play/${video.id}`, query: { title: video.title } }"
                class="block py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                <!-- Video Title -->
                <span class="text-gray-700 dark:text-gray-300" :style="{ fontSize: fontSize + 'px' }">{{ video.title }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button - positioned relative to container -->
    <ClientOnly>
      <LazyFabZoom 
        v-model:isOpen="showFabMenu"
        class="absolute right-4 bottom-4 z-10"
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @scrollTop="scrollToTop"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, onDeactivated, onBeforeUnmount } from "vue"
import type { SearchItem } from '~/types/search'

interface VideoItem {
  id: number
  parent_id: number
  category_id: number
  sub_category_id: number
  title: string
  order: number
  translate_id: number
  translate_ch: number
  video?: {
    id: number
    title: string
    synopsis: string
    url: string
    url_audio: string | null
    date: string | null
    seq: number | null
  }
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
  video?: {
    id: number
    title: string
    synopsis: string
    url: string
    url_audio: string | null
    date: string | null
    seq: number | null
  }
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const toast = useToast()
const categoryId = computed(() => route.params.categoryId)
const subCategoryId = computed(() => route.params.subCategoryId)
const pageTitle = computed(() => (route.query.title as string) || 'Video')
const contentContainer = ref<HTMLElement | null>(null)

// Global search state
const globalSearchQuery = ref('')
const searchedKeyword = ref('')
const hasGlobalSearched = ref(false)
const isSearching = ref(false)
const searchResults = ref<SearchItem[]>([])
const expandedSearchItems = ref<Set<string>>(new Set())
const speakingItemId = ref<string | null>(null)
const isSpeaking = ref(false)

// Per-sub-category search state
const subCategorySearchModes = ref<Record<number, boolean>>({})
const subCategorySearchQueries = ref<Record<number, string>>({})
const subCategorySearchResults = ref<Record<number, SearchItem[]>>({})
const subCategorySearchLoading = ref<Record<number, boolean>>({})
const expandedSubCategorySearchItems = ref<Record<number, Set<string>>>({})
const speakingSubCategoryItemId = ref<Record<number, string | null>>({})

// FAB and font size state
const showFabMenu = ref(false)
const fontSize = ref(18)
const showMenu = ref(false)
const showFindInPage = ref(false)

const openFindInPage = () => {
  showMenu.value = false
  showFindInPage.value = true
}

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 28)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

const scrollToTop = () => {
  if (contentContainer.value) {
    contentContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

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

// Get all video IDs from videoCategory API response
const getAllVideoIds = (): number[] => {
  const ids: number[] = []
  
  for (const group of videoGroups.value) {
    // Check if group itself has a video
    if (group.video?.id) {
      ids.push(group.video.id)
    }
    
    // Check sub_category items for videos
    if (group.sub_category && Array.isArray(group.sub_category)) {
      for (const subCat of group.sub_category) {
        if (subCat.video?.id) {
          ids.push(subCat.video.id)
        }
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
    const videoIds = getAllVideoIds()
    
    const payload = {
      keyword: searchedKeyword.value,
      year: [],
      selectedCategory: ['Video'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      video_ids: videoIds
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
  
  if (itemType === 'video') {
    const videoId = item.header_id || ''
    const title = item.title || ''
    router.push({ path: `/video/play/sub/${videoId}`, query: { title } })
  } else if (itemType === 'audio') {
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'topik1' || itemType === 'topic1') {
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'topik2' || itemType === 'topic2') {
    const headerId = item.header_id ? String(item.header_id) : ''
    router.push(`/topics2/content/${headerId}`)
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

// Get video IDs for a specific sub_category group
const getSubCategoryVideoIds = (groupId: number): number[] => {
  const ids: number[] = []
  
  const group = videoGroups.value.find(g => g.id === groupId)
  if (!group) return ids
  
  // Check if group itself has a video
  if (group.video?.id) {
    ids.push(group.video.id)
  }
  
  // Check all sub_category items for videos
  if (group.sub_category && Array.isArray(group.sub_category)) {
    for (const subCat of group.sub_category) {
      if (subCat.video?.id) {
        ids.push(subCat.video.id)
      }
    }
  }
  
  return ids
}

// Per-sub-category search functions
const handleSubCategorySearch = async (subCatId: number) => {
  const query = subCategorySearchQueries.value[subCatId]
  if (!query || !query.trim()) {
    subCategorySearchResults.value[subCatId] = []
    return
  }
  
  subCategorySearchLoading.value[subCatId] = true
  
  try {
    const videoIds = getSubCategoryVideoIds(subCatId)
    
    const payload = {
      keyword: query.trim(),
      year: [],
      selectedCategory: ['Video'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      video_ids: videoIds
    }
    
    const response = await $fetch<{
      success: boolean
      message: string
      data: SearchItem[]
    }>(`${config.public.apiBaseUrl}/search?page=1`, {
      method: 'POST',
      body: payload
    })
    
    subCategorySearchResults.value[subCatId] = response.data || []
  } catch (error) {
    console.error('Sub-category search failed:', error)
    subCategorySearchResults.value[subCatId] = []
  } finally {
    subCategorySearchLoading.value[subCatId] = false
  }
}

const toggleSubCategorySearchExpand = (subCatId: number, item: SearchItem) => {
  if (!expandedSubCategorySearchItems.value[subCatId]) {
    expandedSubCategorySearchItems.value[subCatId] = new Set()
  }
  
  const key = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`
  const expandedSet = expandedSubCategorySearchItems.value[subCatId]
  
  if (expandedSet.has(key)) {
    expandedSet.delete(key)
  } else {
    expandedSet.add(key)
  }
  
  expandedSubCategorySearchItems.value[subCatId] = new Set(expandedSet)
}

const speakSubCategorySearchContent = (subCatId: number, item: SearchItem) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  const itemKey = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

  if (speakingSubCategoryItemId.value[subCatId] === itemKey) {
    window.speechSynthesis.cancel()
    speakingSubCategoryItemId.value[subCatId] = null
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
    speakingSubCategoryItemId.value[subCatId] = itemKey
  }

  utterance.onend = () => {
    speakingSubCategoryItemId.value[subCatId] = null
  }

  utterance.onerror = () => {
    speakingSubCategoryItemId.value[subCatId] = null
  }

  window.speechSynthesis.speak(utterance)
}

const openSubCategorySearch = (subCatId: number) => {
  subCategorySearchModes.value[subCatId] = true
  subCategorySearchQueries.value[subCatId] = ''
  subCategorySearchResults.value[subCatId] = []
  if (!expandedSubCategorySearchItems.value[subCatId]) {
    expandedSubCategorySearchItems.value[subCatId] = new Set()
  }
}

const closeSubCategorySearch = (subCatId: number) => {
  subCategorySearchModes.value[subCatId] = false
  subCategorySearchQueries.value[subCatId] = ''
  subCategorySearchResults.value[subCatId] = []
  if (expandedSubCategorySearchItems.value[subCatId]) {
    expandedSubCategorySearchItems.value[subCatId].clear()
  }
  speakingSubCategoryItemId.value[subCatId] = null
  window.speechSynthesis.cancel()
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
