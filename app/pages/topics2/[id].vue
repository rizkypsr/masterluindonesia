<template>
  <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden relative">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center gap-4">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">{{ topicTitle }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <button class="p-1" @click="shareTopic">
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
      </div>
    </div>

    <!-- Find In Page Component -->
    <FindInPage
      :is-open="showFindInPage"
      target-selector="#topics2-content"
      @close="showFindInPage = false"
    />

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
    <div id="topics2-content" class="flex-1 overflow-y-auto px-4 pb-4">
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
        <template v-if="isLoading">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <USkeleton class="h-6 w-3/4 mb-4" />
            <USkeleton class="h-4 w-full mb-2" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </template>

        <template v-else-if="treeItems.length > 0">
          <ClientOnly>
            <div v-for="item in treeItems" :key="item.id" class="mb-4">
              <Topics2TreeNode 
                :item="item"
                :font-size="fontSize"
                :category-search-modes="categorySearchModes"
                :category-search-queries="categorySearchQueries"
                :category-search-loading="categorySearchLoading"
                :category-search-results="categorySearchResults"
                :expanded-category-search-items="expandedCategorySearchItems"
                :speaking-category-item-id="speakingCategoryItemId"
                @open-search="openCategorySearch"
                @close-search="closeCategorySearch"
                @handle-search="handleCategorySearch"
                @toggle-expand="toggleCategorySearchExpand"
                @navigate="navigateToSearchResult"
                @speak="speakCategorySearchContent"
              />
            </div>
            <template #fallback>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <USkeleton class="h-6 w-3/4 mb-4" />
                <USkeleton class="h-4 w-full mb-2" />
                <USkeleton class="h-4 w-2/3" />
              </div>
            </template>
          </ClientOnly>
        </template>

        <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p class="text-gray-500 dark:text-gray-400">Tidak ada data</p>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
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
import type { TreeItem } from '@nuxt/ui'
import type { SearchItem } from '~/types/search'

interface Topic2TreeItem {
  id: number
  topics2_id: number
  title: string
  children?: Topic2TreeItem[]
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const topicId = computed(() => route.params.id as string)
const topicTitle = computed(() => (route.query.title as string) || 'Detail Topik')

// Global search state
const globalSearchQuery = ref('')
const searchedKeyword = ref('')
const hasGlobalSearched = ref(false)
const isSearching = ref(false)
const searchResults = ref<SearchItem[]>([])
const expandedSearchItems = ref<Set<string>>(new Set())
const speakingItemId = ref<string | null>(null)
const isSpeaking = ref(false)

// Per-category search state
const categorySearchModes = ref<Record<number, boolean>>({})
const categorySearchQueries = ref<Record<number, string>>({})
const categorySearchResults = ref<Record<number, SearchItem[]>>({})
const categorySearchLoading = ref<Record<number, boolean>>({})
const expandedCategorySearchItems = ref<Record<number, Set<string>>>({})
const speakingCategoryItemId = ref<Record<number, string | null>>({})

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
  const scrollContainer = document.querySelector('.flex-1.overflow-y-auto')
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const { data, status } = useAsyncData(`topics2Detail-${topicId.value}`, () =>
  $fetch<{ success: boolean; data: Topic2TreeItem[] }>(`${config.public.apiBaseUrl}/topics2/${topicId.value}`)
)

// Transform API data to TreeItem format
const treeItems = computed<TreeItem[]>(() => {
  const apiData = data.value?.data || []

  function transformToTreeItem(item: Topic2TreeItem): TreeItem {
    const hasChildren = item.children && item.children.length > 0

    const treeItem: TreeItem = {
      id: item.id,
      label: item.title,
      defaultExpanded: true
    }

    if (hasChildren) {
      treeItem.children = item.children!.map(transformToTreeItem)
      // Prevent parent items from being selected
      treeItem.onSelect = (e: Event) => {
        e.preventDefault()
      }
    }

    return treeItem
  }

  return apiData.map(transformToTreeItem)
})

const isLoading = computed(() => status.value === 'pending')

// Get all chapter IDs recursively
const getAllChapterIds = (items: Topic2TreeItem[]): number[] => {
  const ids: number[] = []
  
  const extractIds = (items: Topic2TreeItem[]) => {
    for (const item of items) {
      ids.push(item.id)
      if (item.children && item.children.length > 0) {
        extractIds(item.children)
      }
    }
  }
  
  extractIds(items)
  return ids
}

// Get chapter IDs for a specific category (including its children)
const getCategoryChapterIds = (categoryId: number, items: Topic2TreeItem[]): number[] => {
  const ids: number[] = []
  
  const findAndExtract = (items: Topic2TreeItem[]): boolean => {
    for (const item of items) {
      if (item.id === categoryId) {
        // Found the category, extract all IDs from here
        const extractIds = (items: Topic2TreeItem[]) => {
          for (const child of items) {
            ids.push(child.id)
            if (child.children && child.children.length > 0) {
              extractIds(child.children)
            }
          }
        }
        
        ids.push(item.id)
        if (item.children && item.children.length > 0) {
          extractIds(item.children)
        }
        return true
      }
      
      if (item.children && item.children.length > 0) {
        if (findAndExtract(item.children)) {
          return true
        }
      }
    }
    return false
  }
  
  findAndExtract(items)
  return ids
}

// Per-category search functions
const handleCategorySearch = async (categoryId: number) => {
  const query = categorySearchQueries.value[categoryId]
  if (!query || !query.trim()) {
    categorySearchResults.value[categoryId] = []
    return
  }
  
  categorySearchLoading.value[categoryId] = true
  
  try {
    const chapterIds = getCategoryChapterIds(categoryId, data.value?.data || [])
    
    const payload = {
      keyword: query.trim(),
      year: [],
      selectedCategory: ['topik2'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      topic2_chapter_ids: chapterIds
    }
    
    const response = await $fetch<{
      success: boolean
      message: string
      data: SearchItem[]
    }>(`${config.public.apiBaseUrl}/search?page=1`, {
      method: 'POST',
      body: payload
    })
    
    categorySearchResults.value[categoryId] = response.data || []
  } catch (error) {
    console.error('Category search failed:', error)
    categorySearchResults.value[categoryId] = []
  } finally {
    categorySearchLoading.value[categoryId] = false
  }
}

const toggleCategorySearchExpand = (categoryId: number, item: SearchItem) => {
  if (!expandedCategorySearchItems.value[categoryId]) {
    expandedCategorySearchItems.value[categoryId] = new Set()
  }
  
  const key = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`
  const expandedSet = expandedCategorySearchItems.value[categoryId]
  
  if (expandedSet.has(key)) {
    expandedSet.delete(key)
  } else {
    expandedSet.add(key)
  }
  
  expandedCategorySearchItems.value[categoryId] = new Set(expandedSet)
}

const speakCategorySearchContent = (categoryId: number, item: SearchItem) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  const itemKey = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

  if (speakingCategoryItemId.value[categoryId] === itemKey) {
    window.speechSynthesis.cancel()
    speakingCategoryItemId.value[categoryId] = null
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
    speakingCategoryItemId.value[categoryId] = itemKey
  }

  utterance.onend = () => {
    speakingCategoryItemId.value[categoryId] = null
  }

  utterance.onerror = () => {
    speakingCategoryItemId.value[categoryId] = null
  }

  window.speechSynthesis.speak(utterance)
}

const openCategorySearch = (categoryId: number) => {
  // Close all other open search inputs
  Object.keys(categorySearchModes.value).forEach(key => {
    const id = Number(key)
    if (id !== categoryId && categorySearchModes.value[id]) {
      closeCategorySearch(id)
    }
  })
  
  categorySearchModes.value[categoryId] = true
  categorySearchQueries.value[categoryId] = ''
  categorySearchResults.value[categoryId] = []
  if (!expandedCategorySearchItems.value[categoryId]) {
    expandedCategorySearchItems.value[categoryId] = new Set()
  }
}

const closeCategorySearch = (categoryId: number) => {
  categorySearchModes.value[categoryId] = false
  categorySearchQueries.value[categoryId] = ''
  categorySearchResults.value[categoryId] = []
  if (expandedCategorySearchItems.value[categoryId]) {
    expandedCategorySearchItems.value[categoryId].clear()
  }
  speakingCategoryItemId.value[categoryId] = null
  window.speechSynthesis.cancel()
}

// Global Search Functions
const handleGlobalSearch = async () => {
  if (!globalSearchQuery.value.trim()) return
  
  searchedKeyword.value = globalSearchQuery.value.trim()
  hasGlobalSearched.value = true
  isSearching.value = true
  searchResults.value = []
  
  try {
    const chapterIds = getAllChapterIds(data.value?.data || [])
    
    const payload = {
      keyword: searchedKeyword.value,
      year: [],
      selectedCategory: ['topik2'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      topic2_chapter_ids: chapterIds
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
  
  if (itemType === 'topik2' || itemType === 'topic2') {
    const headerId = item.header_id ? String(item.header_id) : ''
    router.push(`/topics2/content/${headerId}`)
  } else if (itemType === 'audio') {
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'video') {
    const videoId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/video/detail', query: { video_id: videoId, subtitle_id: subtitleId } })
  } else if (itemType === 'topik1' || itemType === 'topic1') {
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
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

const shareTopic = async () => {
  const shareData = {
    title: 'Topik',
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
</script>
