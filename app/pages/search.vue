<script setup lang="ts">
const router = useRouter()
const searchCache = useSearchCache()

interface SearchItem {
  id: number
  header_id: string | number
  title: string
  detail: string
  full_detail: string
  timestamp: number
  type: string
  description_wa: string
  related_chapters?: Array<{
    type: string
    chapter_id: number
    chapter_title: string
    parent_title: string
  }>
}

interface ApiResponse {
  success: boolean
  message: string
  data: SearchItem[]
}

interface FilterPayload {
  keyword: string
  year: number[]
  selectedCategory: string[]
  selectedKeyword: string[]
  listShowKeyword: string[]
  listHideKeyword: string[]
  chapter_ids?: number[]
  video_ids?: number[]
}

interface BookChapter {
  id: number
  title: string
  have_child: number
  children?: BookChapter[]
}

interface BookData {
  book_id: number
  book_title: string
  chapters: BookChapter[]
}

interface AudioVideo {
  id: number
  title: string
}

interface AudioSubGroup {
  sub_group_id: number
  sub_group_name: string
  videos: AudioVideo[]
}

interface AudioData {
  sub_group_id: number
  sub_group_name: string
  videos: AudioVideo[]
}

interface VideoData {
  sub_group_id: number
  sub_group_name: string
  videos: AudioVideo[]
}

// Persist search state across navigation using useState
const searchQuery = useState('search-query', () => '')
const currentPage = useState('search-page', () => 1)
const hasSearched = useState('search-has-searched', () => false)
const results = useState<SearchItem[]>('search-results', () => [])
const filterPayload = useState<FilterPayload>('search-filter', () => ({
  keyword: '',
  year: [],
  selectedCategory: [],
  selectedKeyword: [],
  listShowKeyword: [],
  listHideKeyword: []
}))

// Local state (no need to persist)
const isFilterOpen = ref(false)
const isDeepSearchOpen = ref(false)
const config = useRuntimeConfig()
const expandedItems = ref<Set<string>>(new Set())
const hideKeywordInput = ref('')
const showKeywordInput = ref('')

// Deep search state for books
const bookChapters = ref<BookData[]>([])
const selectedChapterIds = ref<number[]>([])
const isLoadingBookChapters = ref(false)

// Deep search state for audio
const audioList = ref<AudioData[]>([])
const selectedVideoIds = ref<number[]>([])
const isLoadingAudioList = ref(false)

// Deep search state for video
const videoList = ref<VideoData[]>([])
const isLoadingVideoList = ref(false)

// Deep search filter
const deepSearchQuery = ref('')

const categoryOptions = [
  { label: 'Buku', value: 'Buku' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Video', value: 'Video' },
  { label: 'Ensiklopedia', value: 'topik1' },
  { label: 'Topik', value: 'topik2' },
  { label: 'Kumpulan Tanya Jawab', value: 'topik3' }
]

// Computed property to get the label of the first selected category
const selectedCategoryLabel = computed(() => {
  if (filterPayload.value.selectedCategory.length === 0) return null
  const firstSelected = filterPayload.value.selectedCategory[0]
  const category = categoryOptions.find(cat => cat.value === firstSelected)
  return category ? category.label : null
})

// Filtered book chapters based on search query
const filteredBookChapters = computed(() => {
  if (!deepSearchQuery.value.trim()) return bookChapters.value
  
  const query = deepSearchQuery.value.toLowerCase()
  return bookChapters.value.map(book => {
    const filteredChapters = book.chapters.filter(chapter => {
      const titleMatch = chapter.title.toLowerCase().includes(query)
      const childMatch = chapter.children?.some(child => 
        child.title.toLowerCase().includes(query)
      )
      return titleMatch || childMatch
    }).map(chapter => {
      if (chapter.children) {
        return {
          ...chapter,
          children: chapter.children.filter(child =>
            child.title.toLowerCase().includes(query) ||
            chapter.title.toLowerCase().includes(query)
          )
        }
      }
      return chapter
    })
    
    return {
      ...book,
      chapters: filteredChapters
    }
  }).filter(book => book.chapters.length > 0)
})

// Filtered audio list based on search query
const filteredAudioList = computed(() => {
  if (!deepSearchQuery.value.trim()) return audioList.value
  
  const query = deepSearchQuery.value.toLowerCase()
  return audioList.value.map(subGroup => {
    const filteredVideos = subGroup.videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      subGroup.sub_group_name.toLowerCase().includes(query)
    )
    
    return {
      ...subGroup,
      videos: filteredVideos
    }
  }).filter(subGroup => subGroup.videos.length > 0)
})

// Filtered video list based on search query
const filteredVideoList = computed(() => {
  if (!deepSearchQuery.value.trim()) return videoList.value
  
  const query = deepSearchQuery.value.toLowerCase()
  return videoList.value.map(subGroup => {
    const filteredVideos = subGroup.videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      subGroup.sub_group_name.toLowerCase().includes(query)
    )
    
    return {
      ...subGroup,
      videos: filteredVideos
    }
  }).filter(subGroup => subGroup.videos.length > 0)
})
const dynamicFilters = ref<Array<{
  title: string
  keyword: string[]
}>>([])
const yearOptions = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008]

const isLoading = ref(false)

// Fetch filter options from API
async function fetchFilterOptions() {
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: Array<{
        title: string
        keyword: string[]
      }>
    }>(`${config.public.apiBaseUrl}/search/keyword`)

    if (response.success && response.data) {
      // Show all items with non-empty keywords, exclude only "Buku"
      dynamicFilters.value = response.data.filter(item => 
        item.keyword && item.keyword.length > 0 && item.title !== 'Buku'
      )
    }
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
    // Fallback to default values if API fails
    dynamicFilters.value = [
      { title: 'Surat Tanya Jawab', keyword: ['2015', '2016'] },
      { title: 'Acara Program Radio', keyword: ['Wenda', 'Zhishuo', 'Zongshu', 'Shuohua'] },
      { title: 'Video', keyword: ['Totem', 'Ceramah', 'Tanya Jawab', 'Kisah Buddhis'] }
    ]
  }
}

// Auto-search on mount if coming from index page with keyword
onMounted(async () => {
  // Fetch filter options first
  await fetchFilterOptions()
  
  if (hasSearched.value && searchQuery.value && results.value.length === 0) {
    fetchResults()
  }
})

// Get current filters for cache key (excluding keyword)
function getCurrentFilters() {
  return {
    year: filterPayload.value.year,
    selectedCategory: filterPayload.value.selectedCategory,
    selectedKeyword: filterPayload.value.selectedKeyword,
    listShowKeyword: filterPayload.value.listShowKeyword,
    listHideKeyword: filterPayload.value.listHideKeyword,
    chapter_ids: filterPayload.value.chapter_ids,
    video_ids: filterPayload.value.video_ids
  }
}

async function fetchResults() {
  const keyword = searchQuery.value
  const filters = getCurrentFilters()

  // Check cache first
  const cachedData = searchCache.get(keyword, filters, currentPage.value)
  if (cachedData) {
    if (currentPage.value === 1) {
      results.value = cachedData
    } else {
      results.value = [...results.value, ...cachedData]
    }
    return
  }

  isLoading.value = true
  try {
    const body: FilterPayload = {
      ...filterPayload.value,
      keyword
    }

    const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/search?page=${currentPage.value}`, {
      method: 'POST',
      body
    })

    const data = response.data || []

    // Cache the results
    searchCache.set(keyword, filters, currentPage.value, data)

    if (currentPage.value === 1) {
      results.value = data
    } else {
      results.value = [...results.value, ...data]
    }
  } catch (e) {
    console.error('Search failed', e)
  } finally {
    isLoading.value = false
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function copyFullDetail(item: SearchItem) {
  const text = stripHtml(item.full_detail)
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function getItemKey(item: SearchItem): string {
  const itemType = item.type.toLowerCase()
  if (itemType === 'book' || itemType === 'buku') {
    // For books, header_id is unique (format: bookId#chapterId#page)
    return String(item.header_id)
  }
  // For audio/video, use type-id combination
  return `${item.type}-${item.id}`
}

function toggleExpand(item: SearchItem) {
  const key = getItemKey(item)
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key)
  } else {
    expandedItems.value.add(key)
  }
  expandedItems.value = new Set(expandedItems.value)
}

function handleSearch() {
  if (!searchQuery.value.trim()) return
  currentPage.value = 1
  hasSearched.value = true
  fetchResults()
}

function toggleCategory(value: string) {
  const idx = filterPayload.value.selectedCategory.indexOf(value)
  if (idx > -1) {
    filterPayload.value.selectedCategory.splice(idx, 1)
  } else {
    filterPayload.value.selectedCategory.push(value)
  }
}

// Fetch book chapters for deep search
async function fetchBookChapters() {
  isLoadingBookChapters.value = true
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: BookData[]
    }>(`${config.public.apiBaseUrl}/search/book/chapters`)
    
    if (response.success && response.data) {
      bookChapters.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch book chapters:', error)
  } finally {
    isLoadingBookChapters.value = false
  }
}

// Fetch audio list for deep search
async function fetchAudioList() {
  isLoadingAudioList.value = true
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: AudioData[]
    }>(`${config.public.apiBaseUrl}/search/audio/list`)
    
    if (response.success && response.data) {
      audioList.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch audio list:', error)
  } finally {
    isLoadingAudioList.value = false
  }
}

// Fetch video list for deep search
async function fetchVideoList() {
  isLoadingVideoList.value = true
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: VideoData[]
    }>(`${config.public.apiBaseUrl}/search/video/list`)
    
    if (response.success && response.data) {
      videoList.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch video list:', error)
  } finally {
    isLoadingVideoList.value = false
  }
}

// Toggle chapter selection
function toggleChapterSelection(chapterId: number, chapter: BookChapter) {
  const idx = selectedChapterIds.value.indexOf(chapterId)
  if (idx > -1) {
    // Unselect this chapter and all its children
    selectedChapterIds.value.splice(idx, 1)
    if (chapter.children) {
      unselectAllChildren(chapter.children)
    }
  } else {
    // Select this chapter and all its children
    selectedChapterIds.value.push(chapterId)
    if (chapter.children) {
      selectAllChildren(chapter.children)
    }
  }
}

// Toggle video selection for audio
function toggleVideoSelection(videoId: number) {
  const idx = selectedVideoIds.value.indexOf(videoId)
  if (idx > -1) {
    selectedVideoIds.value.splice(idx, 1)
  } else {
    selectedVideoIds.value.push(videoId)
  }
}

// Toggle all videos in a sub group
function toggleSubGroupVideos(subGroup: AudioSubGroup) {
  const allSelected = subGroup.videos.every(video => selectedVideoIds.value.includes(video.id))
  
  if (allSelected) {
    // Unselect all videos in this sub group
    subGroup.videos.forEach(video => {
      const idx = selectedVideoIds.value.indexOf(video.id)
      if (idx > -1) {
        selectedVideoIds.value.splice(idx, 1)
      }
    })
  } else {
    // Select all videos in this sub group
    subGroup.videos.forEach(video => {
      if (!selectedVideoIds.value.includes(video.id)) {
        selectedVideoIds.value.push(video.id)
      }
    })
  }
}

// Check if all videos in sub group are selected
function isSubGroupSelected(subGroup: AudioSubGroup): boolean {
  return subGroup.videos.every(video => selectedVideoIds.value.includes(video.id))
}

// Select all children recursively
function selectAllChildren(children: BookChapter[]) {
  children.forEach(child => {
    if (!selectedChapterIds.value.includes(child.id)) {
      selectedChapterIds.value.push(child.id)
    }
    if (child.children) {
      selectAllChildren(child.children)
    }
  })
}

// Unselect all children recursively
function unselectAllChildren(children: BookChapter[]) {
  children.forEach(child => {
    const idx = selectedChapterIds.value.indexOf(child.id)
    if (idx > -1) {
      selectedChapterIds.value.splice(idx, 1)
    }
    if (child.children) {
      unselectAllChildren(child.children)
    }
  })
}

function toggleYear(year: number) {
  const idx = filterPayload.value.year.indexOf(year)
  if (idx > -1) {
    filterPayload.value.year.splice(idx, 1)
  } else {
    filterPayload.value.year.push(year)
  }
}

function toggleKeyword(keyword: string) {
  const idx = filterPayload.value.selectedKeyword.indexOf(keyword)
  if (idx > -1) {
    filterPayload.value.selectedKeyword.splice(idx, 1)
  } else {
    filterPayload.value.selectedKeyword.push(keyword)
  }
}

// Toggle filter item - all items go to selectedKeyword
function toggleFilterItem(_filterTitle: string, item: string) {
  toggleKeyword(item)
}

// Check if filter item is selected - all items check selectedKeyword
function isFilterItemSelected(_filterTitle: string, item: string): boolean {
  return filterPayload.value.selectedKeyword.includes(item)
}

// Navigate to related chapter
function navigateToRelatedChapter(chapter: { type: string; chapter_id: number; chapter_title: string; parent_title: string }) {
  if (chapter.type === 'book') {
    router.push({
      path: `/book/${chapter.chapter_id}`,
      query: { title: chapter.chapter_title }
    })
  } else if (chapter.type === 'topic2') {
    router.push({
      path: `/topics2/content/${chapter.chapter_id}`,
      query: { chapter: chapter.chapter_title }
    })
  } else if (chapter.type === 'topic3') {
    router.push({
      path: `/topics3/content/${chapter.chapter_id}`,
      query: { title: chapter.chapter_title }
    })
  }
}

function applyFilter() {
  // Add chapter_ids or video_ids to filter payload based on selections
  if (selectedChapterIds.value.length > 0) {
    filterPayload.value.chapter_ids = selectedChapterIds.value
  } else {
    delete filterPayload.value.chapter_ids
  }
  
  if (selectedVideoIds.value.length > 0) {
    filterPayload.value.video_ids = selectedVideoIds.value
  } else {
    delete filterPayload.value.video_ids
  }
  
  isFilterOpen.value = false
  currentPage.value = 1
  fetchResults()
}

function openDeepSearch() {
  // Load data based on selected category
  const firstCategory = filterPayload.value.selectedCategory[0]
  
  if (firstCategory === 'Buku' && !bookChapters.value.length) {
    fetchBookChapters()
  } else if (firstCategory === 'Audio' && !audioList.value.length) {
    fetchAudioList()
  } else if (firstCategory === 'Video' && !videoList.value.length) {
    fetchVideoList()
  }
  
  isDeepSearchOpen.value = true
}

function applyDeepSearch() {
  const firstCategory = filterPayload.value.selectedCategory[0]
  
  // Add chapter_ids or video_ids based on category
  if (firstCategory === 'Buku') {
    if (selectedChapterIds.value.length > 0) {
      filterPayload.value.chapter_ids = selectedChapterIds.value
    } else {
      delete filterPayload.value.chapter_ids
    }
    delete filterPayload.value.video_ids
  } else if (firstCategory === 'Audio' || firstCategory === 'Video') {
    if (selectedVideoIds.value.length > 0) {
      filterPayload.value.video_ids = selectedVideoIds.value
    } else {
      delete filterPayload.value.video_ids
    }
    delete filterPayload.value.chapter_ids
  }
  
  isDeepSearchOpen.value = false
  currentPage.value = 1
  
  // Ensure search is triggered
  if (searchQuery.value.trim()) {
    hasSearched.value = true
    fetchResults()
  }
}

function resetDeepSearch() {
  selectedChapterIds.value = []
  selectedVideoIds.value = []
  deepSearchQuery.value = ''
  delete filterPayload.value.chapter_ids
  delete filterPayload.value.video_ids
}

function resetFilter() {
  filterPayload.value = {
    keyword: '',
    year: [],
    selectedCategory: [],
    selectedKeyword: [],
    listShowKeyword: [],
    listHideKeyword: []
  }
  hideKeywordInput.value = ''
  showKeywordInput.value = ''
  selectedChapterIds.value = []
}

function loadMore() {
  currentPage.value++
  fetchResults()
}

function navigateToDetail(item: SearchItem) {
  const itemType = item.type.toLowerCase()

  if (itemType === 'book' || itemType === 'buku') {
    // header_id format: "bookId#chapterId#page" for books
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const [, chapterId, page] = parts
    router.push({
      path: `/book/${chapterId}`,
      query: { page }
    })
  } else if (itemType === 'audio') {
    // header_id is the audio_id for audio items
    const audioId = item.header_id || item.id
    router.push({
      path: '/audio/detail',
      query: {
        audio_id: audioId,
        title: item.title
      }
    })
  } else if (itemType === 'video') {
    router.push({
      path: `/video/play/sub/${item.id}`,
      query: { title: item.title }
    })
  } else if (itemType === 'topik1' || itemType === 'ensiklopedia') {
    // Navigate to topics (topik1) detail page
    router.push({
      path: `/topics/detail`,
      query: { 
        subId: item.id,
        title: item.title 
      }
    })
  } else if (itemType === 'topik2' || itemType === 'topik') {
    // Navigate to topics2 content page
    router.push({
      path: `/topics2/content/${item.id}`,
      query: { chapter: item.title }
    })
  } else if (itemType === 'topik3' || itemType === 'kumpulan tanya jawab') {
    // Navigate to topics3 content page
    router.push({
      path: `/topics3/content/${item.id}`,
      query: { title: item.title }
    })
  }
}
</script>

<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <h1 class="text-lg font-semibold text-black dark:text-white">Pencarian</h1>
    </div>

    <!-- Initial Search View (when no search performed) -->
    <div v-if="!hasSearched" class="flex flex-col flex-1 overflow-hidden">
      <div class="flex-1 px-6 pt-4">
        <UInput v-model="searchQuery" placeholder="Masukan kata kunci" size="xl" class="w-full"
          @keyup.enter="handleSearch" />
      </div>

      <div class="px-6 pb-24">
        <UButton block size="xl" variant="solid"
          :class="searchQuery.trim() ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 dark:bg-gray-600'"
          :disabled="!searchQuery.trim()" @click="handleSearch">
          <span class="text-black font-medium">Cari</span>
        </UButton>
      </div>
    </div>

    <!-- Search Results View -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="px-4 py-4">
        <!-- Filter Buttons -->
        <div class="mb-2 flex gap-2">
          <UButton size="lg" class="bg-primary hover:bg-primary/90 text-black rounded-full font-bold"
            @click="isFilterOpen = true">
            Filter
            <Icon name="mdi:tune-variant" class="w-4 h-4 ml-1" />
          </UButton>
          <UButton v-if="selectedCategoryLabel" size="lg" class="bg-primary hover:bg-primary/90 text-black rounded-full font-bold"
            @click="openDeepSearch">
            {{ selectedCategoryLabel }}
            <Icon name="mdi:book-search" class="w-4 h-4 ml-1" />
          </UButton>
        </div>

        <!-- Kesaksian Label -->
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wide">
          MENAMPILKAN "{{ searchQuery }}"
        </p>

        <!-- Loading (only show when no results yet) -->
        <div v-if="isLoading && results.length === 0" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>

        <!-- Results List -->
        <div v-else class="space-y-4">
          <div v-for="item in results" :key="getItemKey(item)" class="rounded-xl overflow-hidden"
            :class="expandedItems.has(getItemKey(item)) ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'">
            <!-- Card Header -->
            <div class="p-4 cursor-pointer"
              :class="expandedItems.has(getItemKey(item)) ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'"
              @click="toggleExpand(item)">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-bold"
                    :class="expandedItems.has(getItemKey(item)) ? 'text-black' : 'text-black dark:text-white'">
                    {{ item.title }}</h3>
                  <p :class="expandedItems.has(getItemKey(item)) ? 'text-black' : 'text-black dark:text-gray-300'"
                    class="mt-1 line-clamp-6">{{ item.detail }}</p>
                </div>
                <button @click.stop="navigateToDetail(item)" class="p-2">
                  <Icon name="mdi:arrow-right" class="w-6 h-6 text-primary dark:text-yellow-400 shrink-0" />
                </button>
              </div>
            </div>

            <!-- Expandable Content (Kesaksian) -->
            <div v-if="expandedItems.has(getItemKey(item))" class="m-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <p class="text-black dark:text-white leading-relaxed whitespace-pre-wrap">
                {{ stripHtml(item.full_detail) }}
              </p>
              
              <!-- Related Chapters Section -->
              <div v-if="item.related_chapters && item.related_chapters.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bab Terkait:</h4>
                <div class="space-y-2">
                  <button v-for="(chapter, idx) in item.related_chapters" :key="idx"
                    @click.stop="navigateToRelatedChapter(chapter)"
                    class="w-full text-left p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="text-sm text-gray-900 dark:text-white font-medium">{{ chapter.chapter_title }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ chapter.parent_title }}</div>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                <button @click.stop="copyFullDetail(item)"
                  class="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:font-bold">
                  <Icon name="mdi:content-copy" class="w-4 h-4" />
                  <span>Salin</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="results.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="results.length > 0" class="mt-6 pb-6">
          <UButton block variant="outline" :loading="isLoading" @click="loadMore">
            Muat Lebih Banyak
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filter Drawer -->
    <UDrawer v-model:open="isFilterOpen" direction="bottom" title="Filter Pencarian">
      <template #content>
        <div class="p-4 space-y-6 overflow-y-auto max-h-[80vh] bg-white dark:bg-gray-900">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-black dark:text-white">Filter Pencarian</h2>
            <button class="text-gray-500 dark:text-gray-400 text-sm" @click="resetFilter">Reset Filter</button>
          </div>

          <!-- Kategori -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3">Kategori</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="cat in categoryOptions" :key="cat.value"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" :class="filterPayload.selectedCategory.includes(cat.value)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleCategory(cat.value)">
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Dynamic Filters from API -->
          <div v-for="filter in dynamicFilters" :key="filter.title">
            <h3 class="font-semibold text-black dark:text-white mb-3">{{ filter.title }}</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="item in filter.keyword" :key="item"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" 
                :class="isFilterItemSelected(filter.title, item)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleFilterItem(filter.title, item)">
                {{ item }}
              </button>
            </div>
          </div>

          <!-- Sembunyikan kata kunci -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3">Sembunyikan kata kunci</h3>
            <UInput v-model="hideKeywordInput" placeholder="Masukan kata kunci" size="md" />
          </div>

          <!-- Tambahkan kata kunci -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3">Tambahkan kata kunci</h3>
            <UInput v-model="showKeywordInput" placeholder="Masukan kata kunci" size="md" />
          </div>

          <!-- Tahun (Static) -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3">Tahun</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="year in yearOptions" :key="year"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" :class="filterPayload.year.includes(year)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleYear(year)">
                {{ year }}
              </button>
            </div>
          </div>

          <!-- Terapkan Button -->
          <div class="pt-4">
            <UButton block size="lg" class="bg-primary hover:bg-primary/90 text-black" @click="applyFilter">
              Terapkan
            </UButton>
          </div>
        </div>
      </template>
    </UDrawer>

    <!-- Deep Search Drawer -->
    <UDrawer v-model:open="isDeepSearchOpen" direction="bottom" :title="selectedCategoryLabel || 'Pencarian Mendalam'">
      <template #content>
        <div class="p-4 space-y-4 overflow-y-auto max-h-[80vh] bg-white dark:bg-gray-900">
          <!-- Header with Apply Button -->
          <div class="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 pb-3 border-b border-gray-200 dark:border-gray-700 z-10">
            <div>
              <h2 class="text-lg font-semibold text-black dark:text-white">{{ selectedCategoryLabel || 'Pencarian Mendalam' }}</h2>
              <p v-if="filterPayload.selectedCategory[0] === 'Buku' && selectedChapterIds.length > 0" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ selectedChapterIds.length }} bab dipilih
              </p>
              <p v-else-if="(filterPayload.selectedCategory[0] === 'Audio' || filterPayload.selectedCategory[0] === 'Video') && selectedVideoIds.length > 0" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ selectedVideoIds.length }} video dipilih
              </p>
            </div>
            <div class="flex gap-2">
              <button class="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300" @click="resetDeepSearch">
                Reset
              </button>
              <UButton size="md" class="bg-primary hover:bg-primary/90 text-black" @click="applyDeepSearch">
                Terapkan
              </UButton>
            </div>
          </div>

          <!-- Description -->
          <p v-if="filterPayload.selectedCategory[0] === 'Buku'" class="text-sm text-gray-600 dark:text-gray-400">
            Pilih bab buku untuk pencarian yang lebih spesifik dalam konten buku
          </p>
          <p v-else-if="filterPayload.selectedCategory[0] === 'Audio'" class="text-sm text-gray-600 dark:text-gray-400">
            Pilih audio untuk pencarian yang lebih spesifik
          </p>
          <p v-else-if="filterPayload.selectedCategory[0] === 'Video'" class="text-sm text-gray-600 dark:text-gray-400">
            Pilih video untuk pencarian yang lebih spesifik
          </p>

          <!-- Search Input -->
          <div class="sticky top-18 bg-white dark:bg-gray-900 z-10 pb-2">
            <UInput v-model="deepSearchQuery" placeholder="Cari..." size="md" class="w-full">
              <template #leading>
                <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
              </template>
              <template #trailing v-if="deepSearchQuery">
                <button @click="deepSearchQuery = ''" class="text-gray-400 hover:text-gray-600">
                  <Icon name="mdi:close" class="w-5 h-5" />
                </button>
              </template>
            </UInput>
          </div>

          <!-- Loading State for Books -->
          <div v-if="filterPayload.selectedCategory[0] === 'Buku' && isLoadingBookChapters" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
          </div>

          <!-- Loading State for Audio -->
          <div v-else-if="filterPayload.selectedCategory[0] === 'Audio' && isLoadingAudioList" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
          </div>

          <!-- Loading State for Video -->
          <div v-else-if="filterPayload.selectedCategory[0] === 'Video' && isLoadingVideoList" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
          </div>

          <!-- Book Chapters List -->
          <div v-else-if="filterPayload.selectedCategory[0] === 'Buku'" class="space-y-4">
            <div v-for="book in filteredBookChapters" :key="book.book_id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <h3 class="font-semibold text-black dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                {{ book.book_title }}
              </h3>
              <div class="space-y-2">
                <div v-for="chapter in book.chapters" :key="chapter.id">
                  <div class="flex items-start gap-2 py-1">
                    <input type="checkbox" :id="`deep-chapter-${chapter.id}`"
                      :checked="selectedChapterIds.includes(chapter.id)"
                      @change="toggleChapterSelection(chapter.id, chapter)"
                      class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label :for="`deep-chapter-${chapter.id}`" class="text-sm text-black dark:text-white cursor-pointer flex-1">
                      {{ chapter.title }}
                    </label>
                  </div>
                  <div v-if="chapter.children && chapter.children.length > 0" class="ml-6 mt-1 space-y-1">
                    <div v-for="child in chapter.children" :key="child.id" class="flex items-start gap-2 py-1">
                      <input type="checkbox" :id="`deep-chapter-${child.id}`"
                        :checked="selectedChapterIds.includes(child.id)"
                        @change="toggleChapterSelection(child.id, child)"
                        class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label :for="`deep-chapter-${child.id}`" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer flex-1">
                        {{ child.title }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="filteredBookChapters.length === 0" class="text-center py-8">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ deepSearchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada data bab buku' }}
              </p>
            </div>
          </div>

          <!-- Audio List -->
          <div v-else-if="filterPayload.selectedCategory[0] === 'Audio'" class="space-y-4">
            <div v-for="subGroup in filteredAudioList" :key="subGroup.sub_group_id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <input type="checkbox" :id="`audio-group-${subGroup.sub_group_id}`"
                  :checked="isSubGroupSelected(subGroup)"
                  @change="toggleSubGroupVideos(subGroup)"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label :for="`audio-group-${subGroup.sub_group_id}`" class="font-semibold text-black dark:text-white cursor-pointer">
                  {{ subGroup.sub_group_name }}
                </label>
              </div>
              <div class="space-y-1 ml-6">
                <div v-for="video in subGroup.videos" :key="video.id" class="flex items-start gap-2 py-1">
                  <input type="checkbox" :id="`audio-video-${video.id}`"
                    :checked="selectedVideoIds.includes(video.id)"
                    @change="toggleVideoSelection(video.id)"
                    class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label :for="`audio-video-${video.id}`" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer flex-1">
                    {{ video.title }}
                  </label>
                </div>
              </div>
            </div>
            <div v-if="filteredAudioList.length === 0" class="text-center py-8">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ deepSearchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada data audio' }}
              </p>
            </div>
          </div>

          <!-- Video List -->
          <div v-else-if="filterPayload.selectedCategory[0] === 'Video'" class="space-y-4">
            <div v-for="subGroup in filteredVideoList" :key="subGroup.sub_group_id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <input type="checkbox" :id="`video-group-${subGroup.sub_group_id}`"
                  :checked="isSubGroupSelected(subGroup)"
                  @change="toggleSubGroupVideos(subGroup)"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label :for="`video-group-${subGroup.sub_group_id}`" class="font-semibold text-black dark:text-white cursor-pointer">
                  {{ subGroup.sub_group_name }}
                </label>
              </div>
              <div class="space-y-1 ml-6">
                <div v-for="video in subGroup.videos" :key="video.id" class="flex items-start gap-2 py-1">
                  <input type="checkbox" :id="`video-video-${video.id}`"
                    :checked="selectedVideoIds.includes(video.id)"
                    @change="toggleVideoSelection(video.id)"
                    class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label :for="`video-video-${video.id}`" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer flex-1">
                    {{ video.title }}
                  </label>
                </div>
              </div>
            </div>
            <div v-if="filteredVideoList.length === 0" class="text-center py-8">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ deepSearchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada data video' }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
