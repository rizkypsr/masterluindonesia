<template>
  <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <h1 class="text-lg font-semibold text-black dark:text-white">Detail Buku</h1>
      </div>
      <div class="flex items-center gap-3">
        <button class="p-1" @click="addToBookmark">
          <Icon :name="isBookBookmarked ? 'mdi:star' : 'mdi:star-outline'" 
                :class="isBookBookmarked ? 'text-yellow-500' : 'text-black dark:text-white'"
                class="w-6 h-6" />
        </button>
        <button class="p-1" @click="shareBook">
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

    <!-- Find In Page Component -->
    <FindInPage
      :is-open="showFindInPage"
      target-selector="#book-content"
      @close="showFindInPage = false"
    />

    <!-- Scrollable Content Area -->
    <div id="book-content" ref="mainScrollContainer" class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Book Info -->
      <div class="px-4 py-6 flex items-center gap-4">
        <NuxtImg :src="bookCover" :alt="bookTitle" class="w-24 h-32 object-cover rounded-xl shrink-0" loading="lazy"
          format="webp" width="96" height="128" />
        <h2 class="font-semibold text-black dark:text-white" :style="{ fontSize: (fontSize + 4) + 'px' }">{{ bookTitle }}</h2>
      </div>

      <!-- Search Input -->
      <div class="px-4 pb-4">
        <UInput 
          v-model="searchQuery" 
          placeholder="Cari dalam buku ini..." 
          size="lg" 
          class="w-full"
          @keyup.enter="handleSearch"
        >
          <template #trailing>
            <UButton 
              v-if="searchQuery.trim()" 
              size="sm" 
              class="bg-primary hover:bg-primary/90 text-black font-medium" 
              @click="handleSearch"
            >
              Cari
            </UButton>
          </template>
        </UInput>
      </div>

      <!-- Content -->
      <div class="px-4 pb-4">
        <!-- Search Results -->
        <div v-if="hasSearched">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              HASIL PENCARIAN "{{ searchedKeyword }}"
            </p>
            <button @click="clearSearch" class="text-sm text-black dark:text-primary hover:underline">
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

        <!-- Original Content (Chapters List) -->
        <div v-else>
          <!-- Empty State -->
          <div v-if="chapters.length === 0" class="flex flex-col items-center justify-center py-32">
            <div class="w-32 h-32 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 relative">
              <Icon name="mdi:package-variant" class="w-16 h-16 text-gray-300 dark:text-gray-600" />
              <div class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <Icon name="mdi:cancel" class="w-6 h-6 text-gray-300 dark:text-gray-600" />
              </div>
            </div>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Data tidak tersedia</p>
          </div>

          <!-- Chapters List -->
          <div v-else>
            <h3 class="font-semibold text-black dark:text-white mb-4" :style="{ fontSize: (fontSize + 2) + 'px' }">Daftar Isi</h3>

            <div class="pb-4">
              <div v-for="chapter in chapters" :key="chapter.id" :id="`chapter-${chapter.id}`" class="mb-4">
                <!-- Chapter Title with Search -->
                <div v-if="!chapterSearchModes[chapter.id]" class="flex items-center justify-between py-2">
                  <h4 class="font-semibold text-black dark:text-white" :style="{ fontSize: fontSize + 'px' }">{{ chapter.title }}</h4>
                  <div class="flex items-center gap-2">
                    <button @click="shareChapter(chapter)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                      <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
                    </button>
                    <button @click="openChapterSearch(chapter.id)" class="p-1">
                      <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
                    </button>
                  </div>
                </div>

                <!-- Chapter Search Input -->
                <div v-else class="flex items-center gap-3 py-2">
                  <input 
                    v-model="chapterSearchQueries[chapter.id]" 
                    type="text" 
                    placeholder="Cari dalam bab ini..."
                    class="flex-1 text-black dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none py-1"
                    @keyup.enter="handleChapterSearch(chapter.id)"
                    autofocus 
                  />
                  <button 
                    v-if="chapterSearchQueries[chapter.id]?.trim()" 
                    @click="handleChapterSearch(chapter.id)"
                    class="px-3 py-1 bg-primary hover:bg-primary/90 text-black text-sm font-medium rounded"
                  >
                    Cari
                  </button>
                  <button @click="closeChapterSearch(chapter.id)" class="p-1">
                    <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
                  </button>
                </div>

                <!-- Chapter Search Results -->
                <div v-if="chapterSearchLoading[chapter.id] || chapterSearchResults[chapter.id]?.length > 0 || (chapterSearchModes[chapter.id] && chapterSearchQueries[chapter.id]?.trim() && !chapterSearchLoading[chapter.id] && chapterSearchResults[chapter.id]?.length === 0)">
                  <!-- Loading -->
                  <div v-if="chapterSearchLoading[chapter.id]" class="flex justify-center py-8">
                    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
                  </div>

                  <!-- Results List -->
                  <div v-else-if="chapterSearchResults[chapter.id]?.length > 0" class="space-y-4 mb-4">
                    <SearchResultCard
                      v-for="item in chapterSearchResults[chapter.id]"
                      :key="`chap-${chapter.id}-${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
                      :item="item"
                      :is-expanded="expandedChapterSearchItems[chapter.id]?.has(`${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`)"
                      :font-size="fontSize"
                      :is-speaking="speakingChapterItemId[chapter.id] === `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
                      :search-keyword="chapterSearchQueries[chapter.id]"
                      @toggle="toggleChapterSearchExpand(chapter.id, item)"
                      @navigate="navigateToSearchResult(item)"
                      @speak="speakChapterSearchContent(chapter.id, item)"
                    />
                  </div>

                  <!-- Empty State -->
                  <div v-else class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
                  </div>
                </div>

                <!-- Sub Chapters (show when not searching OR when search input is empty) -->
                <div v-if="(!chapterSearchModes[chapter.id] || !chapterSearchResults[chapter.id]?.length)">
                  <ChapterItem 
                    v-if="chapter.sub_chapters && chapter.sub_chapters.length > 0"
                    v-for="sub in chapter.sub_chapters" 
                    :key="sub.id"
                    :chapter="sub"
                    :book-id="bookId"
                    :font-size="fontSize"
                    :level="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with FAB -->
    <div class="shrink-0 relative pb-[env(safe-area-inset-bottom)]">
      <!-- Floating Action Button - Lazy loaded -->
      <ClientOnly>
        <LazyFabZoom 
          v-model:isOpen="showFabMenu"
          class="absolute right-4 bottom-4 z-10 mb-[env(safe-area-inset-bottom)]"
          @zoomIn="zoomIn"
          @zoomOut="zoomOut"
          @scrollTop="scrollToTop"
        />
      </ClientOnly>
    </div>

    <!-- Bookmark Modal - Lazy loaded -->
    <LazyBookmarkModal />
    
    <!-- Playlist Modal - Lazy loaded -->
    <LazyPlaylistModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, onBeforeUnmount, nextTick } from 'vue'
import { useBookmark } from '~/composables/useBookmark'
import { useHistory } from '~/composables/useHistory'
import type { SearchItem } from '~/types/search'

// Enable keepalive for this page
definePageMeta({
  keepalive: true
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { saveScrollPosition, getScrollPosition } = useScrollState()

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(18)
const showMenu = ref(false)
const showFindInPage = ref(false)

const openFindInPage = () => {
  showMenu.value = false
  showFindInPage.value = true
}
const mainScrollContainer = ref<HTMLElement | null>(null)

// Search State
const searchQuery = ref('')
const searchedKeyword = ref('')
const hasSearched = ref(false)
const isSearching = ref(false)
const searchResults = ref<SearchItem[]>([])
const expandedSearchItems = ref<Set<string>>(new Set())
const speakingItemId = ref<string | null>(null)
const isSpeaking = ref(false)

// Per-chapter search state
const chapterSearchModes = ref<Record<number, boolean>>({})
const chapterSearchQueries = ref<Record<number, string>>({})
const chapterSearchResults = ref<Record<number, SearchItem[]>>({})
const chapterSearchLoading = ref<Record<number, boolean>>({})
const expandedChapterSearchItems = ref<Record<number, Set<string>>>({})
const speakingChapterItemId = ref<Record<number, string | null>>({})

// Bookmark
const { createBookBookmark, fetchBookmarksByType, isBookmarked } = useBookmark()

// Playlist
const { openPlaylistModal } = usePlaylist()

// History
const { saveBookHistory } = useHistory()

const bookId = computed(() => route.params.id as string)
const bookTitle = computed(() => (route.query.title as string) || 'Buku')
const bookCover = computed(() => (route.query.cover as string) || '/fallback.svg')

const isBookBookmarked = computed(() => {
  return isBookmarked(3, bookTitle.value)
})

const restoreScroll = () => {
  if (mainScrollContainer.value) {
    const savedPosition = getScrollPosition(`book-${bookId.value}`)
    if (savedPosition > 0) {
      mainScrollContainer.value.scrollTop = savedPosition
    }
  }
}

const saveScroll = () => {
  if (mainScrollContainer.value) {
    const position = mainScrollContainer.value.scrollTop
    saveScrollPosition(`book-${bookId.value}`, position)
  }
}

onMounted(async () => {
  await fetchBookmarksByType(3)
  
  // Save to history
  saveBookHistory(bookTitle.value, Number(bookId.value))

  // Restore scroll position
  if (import.meta.client) {
    nextTick(() => {
      const chapterId = route.query.chapterId as string
      
      if (chapterId) {
        // Scroll to specific chapter
        setTimeout(() => {
          const chapterElement = document.getElementById(`chapter-${chapterId}`)
          if (chapterElement && mainScrollContainer.value) {
            const containerTop = mainScrollContainer.value.offsetTop
            const chapterTop = chapterElement.offsetTop
            const scrollPosition = chapterTop - containerTop - 16
            mainScrollContainer.value.scrollTop = scrollPosition
          }
        }, 200)
      } else {
        // Normal scroll restoration
        setTimeout(restoreScroll, 200)
      }
    })
  }
})

onBeforeUnmount(() => {
  saveScroll()
})

onActivated(() => {
  if (import.meta.client) {
    nextTick(() => {
      setTimeout(restoreScroll, 100)
    })
  }
})

onBeforeRouteLeave(() => {
  saveScroll()
})

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 28)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

const scrollToTop = () => {
  if (mainScrollContainer.value) {
    mainScrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

interface SubChapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub?: SubChapter[]
}

interface Chapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub_chapters: SubChapter[]
}

const { data: chaptersData } = await useFetch<{ success: boolean; data: Chapter[] }>(
  () => `${config.public.apiBaseUrl}/books/${bookId.value}`
)

const chapters = computed(() => {
  if (chaptersData.value?.data) {
    return chaptersData.value.data.sort((a, b) => a.seq - b.seq)
  }
  return []
})

// Get all chapter IDs recursively
const getAllChapterIds = (chapters: Chapter[]): number[] => {
  const ids: number[] = []
  
  const extractIds = (items: (Chapter | SubChapter)[]) => {
    for (const item of items) {
      ids.push(item.id)
      if ('sub_chapters' in item && item.sub_chapters) {
        extractIds(item.sub_chapters)
      }
      if ('sub' in item && item.sub) {
        extractIds(item.sub)
      }
    }
  }
  
  extractIds(chapters)
  return ids
}

// Get chapter IDs for a specific chapter (including its sub_chapters)
const getChapterIds = (chapter: Chapter): number[] => {
  const ids: number[] = [chapter.id]
  
  const extractIds = (items: SubChapter[]) => {
    for (const item of items) {
      ids.push(item.id)
      if (item.sub && item.sub.length > 0) {
        extractIds(item.sub)
      }
    }
  }
  
  if (chapter.sub_chapters && chapter.sub_chapters.length > 0) {
    extractIds(chapter.sub_chapters)
  }
  
  return ids
}

// Per-chapter search functions
const handleChapterSearch = async (chapterId: number) => {
  const query = chapterSearchQueries.value[chapterId]
  if (!query || !query.trim()) {
    chapterSearchResults.value[chapterId] = []
    return
  }
  
  chapterSearchLoading.value[chapterId] = true
  
  try {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (!chapter) return
    
    const chapterIds = getChapterIds(chapter)
    
    const payload = {
      keyword: query.trim(),
      year: [],
      selectedCategory: ['Buku'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      chapter_ids: chapterIds
    }
    
    const response = await $fetch<{
      success: boolean
      message: string
      data: SearchItem[]
    }>(`${config.public.apiBaseUrl}/search?page=1`, {
      method: 'POST',
      body: payload
    })
    
    chapterSearchResults.value[chapterId] = response.data || []
  } catch (error) {
    console.error('Chapter search failed:', error)
    chapterSearchResults.value[chapterId] = []
  } finally {
    chapterSearchLoading.value[chapterId] = false
  }
}

const toggleChapterSearchExpand = (chapterId: number, item: SearchItem) => {
  if (!expandedChapterSearchItems.value[chapterId]) {
    expandedChapterSearchItems.value[chapterId] = new Set()
  }
  
  const key = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`
  const expandedSet = expandedChapterSearchItems.value[chapterId]
  
  if (expandedSet.has(key)) {
    expandedSet.delete(key)
  } else {
    expandedSet.add(key)
  }
  
  expandedChapterSearchItems.value[chapterId] = new Set(expandedSet)
}

const speakChapterSearchContent = (chapterId: number, item: SearchItem) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  const itemKey = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

  if (speakingChapterItemId.value[chapterId] === itemKey) {
    window.speechSynthesis.cancel()
    speakingChapterItemId.value[chapterId] = null
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
    speakingChapterItemId.value[chapterId] = itemKey
  }

  utterance.onend = () => {
    speakingChapterItemId.value[chapterId] = null
  }

  utterance.onerror = () => {
    speakingChapterItemId.value[chapterId] = null
  }

  window.speechSynthesis.speak(utterance)
}

const openChapterSearch = (chapterId: number) => {
  // Close all other open search inputs
  Object.keys(chapterSearchModes.value).forEach(key => {
    const id = Number(key)
    if (id !== chapterId && chapterSearchModes.value[id]) {
      closeChapterSearch(id)
    }
  })
  
  chapterSearchModes.value[chapterId] = true
  chapterSearchQueries.value[chapterId] = ''
  chapterSearchResults.value[chapterId] = []
  if (!expandedChapterSearchItems.value[chapterId]) {
    expandedChapterSearchItems.value[chapterId] = new Set()
  }
}

const closeChapterSearch = (chapterId: number) => {
  chapterSearchModes.value[chapterId] = false
  chapterSearchQueries.value[chapterId] = ''
  chapterSearchResults.value[chapterId] = []
  if (expandedChapterSearchItems.value[chapterId]) {
    expandedChapterSearchItems.value[chapterId].clear()
  }
  speakingChapterItemId.value[chapterId] = null
  window.speechSynthesis.cancel()
}

// Search Functions
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  searchedKeyword.value = searchQuery.value.trim()
  hasSearched.value = true
  isSearching.value = true
  searchResults.value = []
  
  try {
    const chapterIds = getAllChapterIds(chapters.value)
    
    const payload = {
      keyword: searchedKeyword.value,
      year: [],
      selectedCategory: ['Buku'],
      selectedKeyword: [],
      listShowKeyword: [],
      listHideKeyword: [],
      chapter_ids: chapterIds
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

const clearSearch = () => {
  searchQuery.value = ''
  searchedKeyword.value = ''
  hasSearched.value = false
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
  
  if (itemType === 'book' || itemType === 'buku') {
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

const shareBook = async () => {
  const shareData = {
    title: `Baca Buku "${bookTitle.value}"`,
    text: `Baca Buku "${bookTitle.value}" di`,
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
    await navigator.clipboard.writeText(`Baca Buku "${bookTitle.value}" di\n${window.location.href}`)
    alert('Link berhasil disalin!')
  }
}

const addToBookmark = () => {
  createBookBookmark(
    bookTitle.value,
    Number(bookId.value),
    chapters.value[0]?.sub_chapters?.[0]?.id || 0,
    1
  )
}

const addToPlaylist = () => {
  openPlaylistModal(3, {
    bookId: Number(bookId.value),
    chapterId: chapters.value[0]?.sub_chapters?.[0]?.id || 0
  })
}

const shareChapter = async (chapter: any) => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?title=${encodeURIComponent(bookTitle.value)}&chapterId=${chapter.id}`
  
  const shareData = {
    title: 'Buku',
    text: `${bookTitle.value} - ${chapter.title}`,
    url: shareUrl
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`Lihat "${chapter.title}" di\n${shareUrl}`)
    alert('Link berhasil disalin!')
  }
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
</style>
