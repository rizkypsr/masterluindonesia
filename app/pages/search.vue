<script setup lang="ts">
import type { FilterPayload, DynamicFilter } from '~/types/search'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

// Use composables
const searchState = useSearchState()
const deepSearch = useDeepSearch()

// Destructure for easier access
const {
  searchQuery,
  searchedKeyword,
  hasSearched,
  results,
  filterPayload,
  isLoading,
  expandedItems,
  speakingItemId,
  isSpeaking,
  handleSearch,
  loadMore,
  getItemKey,
  toggleExpand,
  copyFullDetail,
  speakContent,
  searchCache
} = searchState

// Local UI state
const isFilterOpen = ref(false)
const isDeepSearchOpen = ref(false)
const hideKeywordInput = ref('')
const showKeywordInput = ref('')
const fontSize = ref(18)
const showFabMenu = ref(false)
const resultsScrollContainer = ref<HTMLElement | null>(null)
const deepSearchScrollContainer = ref<HTMLElement | null>(null)
const deepSearchQuery = ref('')
const expandedAccordions = ref<Set<string>>(new Set())
const dynamicFilters = ref<DynamicFilter[]>([])

const categoryOptions = [
  { label: 'Buku', value: 'Buku' },
  { label: 'Audio', value: 'Audio' },
  { label: 'Video', value: 'Video' },
  { label: 'Ensiklopedia', value: 'topik1' },
  { label: 'Topik', value: 'topik2' },
  { label: 'Kumpulan Tanya Jawab', value: 'topik3' }
]

const yearOptions = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008]

const selectedCategoryLabel = computed(() => {
  if (filterPayload.value.selectedCategory.length === 0) return null
  const firstSelected = filterPayload.value.selectedCategory[0]
  const category = categoryOptions.find(cat => cat.value === firstSelected)
  return category ? category.label : null
})

// Fetch filter options
async function fetchFilterOptions() {
  try {
    const response = await $fetch<{
      success: boolean
      data: DynamicFilter[]
    }>(`${config.public.apiBaseUrl}/search/keyword`)

    if (response.success && response.data) {
      dynamicFilters.value = response.data.filter(item =>
        item.keyword && item.keyword.length > 0 && item.title !== 'Buku'
      )
    }
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
  }
}

// Share search function
function shareSearch() {
  const params = new URLSearchParams()
  
  // Add keyword
  if (searchQuery.value) params.append('keyword', searchQuery.value)
  
  // Add array parameters
  filterPayload.value.selectedCategory.forEach(cat => params.append('selectedCategory[]', cat))
  filterPayload.value.year.forEach(year => params.append('year[]', year.toString()))
  filterPayload.value.selectedKeyword.forEach(kw => params.append('selectedKeyword[]', kw))
  filterPayload.value.listShowKeyword.forEach(kw => params.append('listShowKeyword[]', kw))
  filterPayload.value.listHideKeyword.forEach(kw => params.append('listHideKeyword[]', kw))
  
  // Add deep search filter IDs
  if (filterPayload.value.chapter_ids) {
    filterPayload.value.chapter_ids.forEach(id => params.append('chapter_ids[]', id.toString()))
  }
  if (filterPayload.value.audio_ids) {
    filterPayload.value.audio_ids.forEach(id => params.append('audio_ids[]', id.toString()))
  }
  if (filterPayload.value.video_ids) {
    filterPayload.value.video_ids.forEach(id => params.append('video_ids[]', id.toString()))
  }
  if (filterPayload.value.topic1_category_ids) {
    filterPayload.value.topic1_category_ids.forEach(id => params.append('topic1_category_ids[]', id.toString()))
  }
  if (filterPayload.value.topic2_chapter_ids) {
    filterPayload.value.topic2_chapter_ids.forEach(id => params.append('topic2_chapter_ids[]', id.toString()))
  }
  if (filterPayload.value.topic3_chapter_ids) {
    filterPayload.value.topic3_chapter_ids.forEach(id => params.append('topic3_chapter_ids[]', id.toString()))
  }
  
  // Add category ID filters
  if (filterPayload.value.categoryAudioId) {
    filterPayload.value.categoryAudioId.forEach(id => params.append('categoryAudioId[]', id.toString()))
  }
  if (filterPayload.value.categoryVideoId) {
    filterPayload.value.categoryVideoId.forEach(id => params.append('categoryVideoId[]', id.toString()))
  }
  if (filterPayload.value.categoryBookId) {
    filterPayload.value.categoryBookId.forEach(id => params.append('categoryBookId[]', id.toString()))
  }
  if (filterPayload.value.categoryTopic1Id) {
    filterPayload.value.categoryTopic1Id.forEach(id => params.append('categoryTopic1Id[]', id.toString()))
  }
  if (filterPayload.value.categoryTopic2Id) {
    filterPayload.value.categoryTopic2Id.forEach(id => params.append('categoryTopic2Id[]', id.toString()))
  }
  if (filterPayload.value.categoryTopic3Id) {
    filterPayload.value.categoryTopic3Id.forEach(id => params.append('categoryTopic3Id[]', id.toString()))
  }
  
  const shareUrl = `${window.location.origin}/search?${params.toString()}`
  
  if (navigator.share) {
    navigator.share({
      title: 'Hasil Pencarian',
      url: shareUrl
    }).catch(() => {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl)
    })
  } else {
    navigator.clipboard.writeText(shareUrl)
  }
}

// Parse URL parameters on mount
function parseUrlParams() {
  const query = route.query
  
  // Check if there are any search parameters
  const hasParams = Object.keys(query).length > 0
  if (!hasParams) return
  
  // Parse keyword
  if (query.keyword && typeof query.keyword === 'string') {
    searchQuery.value = query.keyword
    searchedKeyword.value = query.keyword
  }
  
  // Parse selectedCategory
  if (query['selectedCategory[]']) {
    const categories = Array.isArray(query['selectedCategory[]']) 
      ? query['selectedCategory[]'] 
      : [query['selectedCategory[]']]
    filterPayload.value.selectedCategory = categories.filter((c): c is string => typeof c === 'string')
  }
  
  // Parse year
  if (query['year[]']) {
    const years = Array.isArray(query['year[]']) 
      ? query['year[]'] 
      : [query['year[]']]
    filterPayload.value.year = years
      .filter((y): y is string => typeof y === 'string')
      .map(y => parseInt(y))
      .filter(y => !isNaN(y))
  }
  
  // Parse selectedKeyword
  if (query['selectedKeyword[]']) {
    const keywords = Array.isArray(query['selectedKeyword[]']) 
      ? query['selectedKeyword[]'] 
      : [query['selectedKeyword[]']]
    filterPayload.value.selectedKeyword = keywords.filter((k): k is string => typeof k === 'string')
  }
  
  // Parse listShowKeyword
  if (query['listShowKeyword[]']) {
    const keywords = Array.isArray(query['listShowKeyword[]']) 
      ? query['listShowKeyword[]'] 
      : [query['listShowKeyword[]']]
    filterPayload.value.listShowKeyword = keywords.filter((k): k is string => typeof k === 'string')
  }
  
  // Parse listHideKeyword
  if (query['listHideKeyword[]']) {
    const keywords = Array.isArray(query['listHideKeyword[]']) 
      ? query['listHideKeyword[]'] 
      : [query['listHideKeyword[]']]
    filterPayload.value.listHideKeyword = keywords.filter((k): k is string => typeof k === 'string')
  }
  
  // Parse deep search filter IDs
  if (query['chapter_ids[]']) {
    const ids = Array.isArray(query['chapter_ids[]']) 
      ? query['chapter_ids[]'] 
      : [query['chapter_ids[]']]
    const parsedIds = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    filterPayload.value.chapter_ids = parsedIds
    deepSearch.selectedChapterIds.value = parsedIds
  }
  
  if (query['audio_ids[]']) {
    const ids = Array.isArray(query['audio_ids[]']) 
      ? query['audio_ids[]'] 
      : [query['audio_ids[]']]
    const parsedIds = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    filterPayload.value.audio_ids = parsedIds
    deepSearch.selectedVideoIds.value = parsedIds
  }
  
  if (query['video_ids[]']) {
    const ids = Array.isArray(query['video_ids[]']) 
      ? query['video_ids[]'] 
      : [query['video_ids[]']]
    const parsedIds = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    filterPayload.value.video_ids = parsedIds
    deepSearch.selectedVideoIds.value = parsedIds
  }
  
  if (query['topic1_category_ids[]']) {
    const ids = Array.isArray(query['topic1_category_ids[]']) 
      ? query['topic1_category_ids[]'] 
      : [query['topic1_category_ids[]']]
    const parsedIds = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    filterPayload.value.topic1_category_ids = parsedIds
    deepSearch.selectedTopic1CategoryIds.value = parsedIds
  }
  
  if (query['topic2_chapter_ids[]']) {
    const ids = Array.isArray(query['topic2_chapter_ids[]']) 
      ? query['topic2_chapter_ids[]'] 
      : [query['topic2_chapter_ids[]']]
    const parsedIds = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    filterPayload.value.topic2_chapter_ids = parsedIds
    deepSearch.selectedTopic2ChapterIds.value = parsedIds
  }
  
  if (query['topic3_chapter_ids[]']) {
    const ids = Array.isArray(query['topic3_chapter_ids[]']) 
      ? query['topic3_chapter_ids[]'] 
      : [query['topic3_chapter_ids[]']]
    const parsedIds = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
    filterPayload.value.topic3_chapter_ids = parsedIds
    deepSearch.selectedTopic3ChapterIds.value = parsedIds
  }
  
  // Parse category ID filters
  if (query['categoryAudioId[]']) {
    const ids = Array.isArray(query['categoryAudioId[]']) 
      ? query['categoryAudioId[]'] 
      : [query['categoryAudioId[]']]
    filterPayload.value.categoryAudioId = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
  }
  
  if (query['categoryVideoId[]']) {
    const ids = Array.isArray(query['categoryVideoId[]']) 
      ? query['categoryVideoId[]'] 
      : [query['categoryVideoId[]']]
    filterPayload.value.categoryVideoId = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
  }
  
  if (query['categoryBookId[]']) {
    const ids = Array.isArray(query['categoryBookId[]']) 
      ? query['categoryBookId[]'] 
      : [query['categoryBookId[]']]
    filterPayload.value.categoryBookId = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
  }
  
  if (query['categoryTopic1Id[]']) {
    const ids = Array.isArray(query['categoryTopic1Id[]']) 
      ? query['categoryTopic1Id[]'] 
      : [query['categoryTopic1Id[]']]
    filterPayload.value.categoryTopic1Id = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
  }
  
  if (query['categoryTopic2Id[]']) {
    const ids = Array.isArray(query['categoryTopic2Id[]']) 
      ? query['categoryTopic2Id[]'] 
      : [query['categoryTopic2Id[]']]
    filterPayload.value.categoryTopic2Id = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
  }
  
  if (query['categoryTopic3Id[]']) {
    const ids = Array.isArray(query['categoryTopic3Id[]']) 
      ? query['categoryTopic3Id[]'] 
      : [query['categoryTopic3Id[]']]
    filterPayload.value.categoryTopic3Id = ids
      .filter((id): id is string => typeof id === 'string')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))
  }
  
  // If we have a keyword, trigger search
  if (searchQuery.value) {
    hasSearched.value = true
    searchState.currentPage.value = 1
    searchState.fetchResults()
  }
}

onMounted(async () => {
  await fetchFilterOptions()
  parseUrlParams()
  
  if (hasSearched.value && searchQuery.value && results.value.length === 0) {
    searchState.fetchResults()
  }
})

// Filter functions
function toggleCategory(value: string) {
  const idx = filterPayload.value.selectedCategory.indexOf(value)
  if (idx > -1) {
    // Unselecting category - clear related deep search selections
    filterPayload.value.selectedCategory.splice(idx, 1)
    
    // Clear deep search selections based on category
    if (value === 'Buku') {
      deepSearch.selectedChapterIds.value = []
      delete filterPayload.value.chapter_ids
    } else if (value === 'Audio') {
      deepSearch.selectedVideoIds.value = []
      delete filterPayload.value.audio_ids
    } else if (value === 'Video') {
      deepSearch.selectedVideoIds.value = []
      delete filterPayload.value.video_ids
    } else if (value === 'topik1') {
      deepSearch.selectedTopic1CategoryIds.value = []
      delete filterPayload.value.topic1_category_ids
    } else if (value === 'topik2') {
      deepSearch.selectedTopic2ChapterIds.value = []
      delete filterPayload.value.topic2_chapter_ids
    } else if (value === 'topik3') {
      deepSearch.selectedTopic3ChapterIds.value = []
      delete filterPayload.value.topic3_chapter_ids
    }
  } else {
    filterPayload.value.selectedCategory.push(value)
  }
}

function toggleYear(year: number) {
  const idx = filterPayload.value.year.indexOf(year)
  if (idx > -1) {
    filterPayload.value.year.splice(idx, 1)
  } else {
    filterPayload.value.year.push(year)
  }
}

function toggleFilterItem(filterTitle: string, item: string) {
  const uniqueKey = `${filterTitle}::${item}`
  const idx = filterPayload.value.selectedKeyword.indexOf(uniqueKey)
  if (idx > -1) {
    filterPayload.value.selectedKeyword.splice(idx, 1)
  } else {
    filterPayload.value.selectedKeyword.push(uniqueKey)
  }
}

function isFilterItemSelected(filterTitle: string, item: string): boolean {
  const uniqueKey = `${filterTitle}::${item}`
  return filterPayload.value.selectedKeyword.includes(uniqueKey)
}

function addHideKeyword() {
  const keyword = hideKeywordInput.value.trim()
  if (keyword && !filterPayload.value.listHideKeyword.includes(keyword)) {
    filterPayload.value.listHideKeyword.push(keyword)
    hideKeywordInput.value = ''
  }
}

function removeHideKeyword(index: number) {
  filterPayload.value.listHideKeyword.splice(index, 1)
}

function addShowKeyword() {
  const keyword = showKeywordInput.value.trim()
  if (keyword && !filterPayload.value.listShowKeyword.includes(keyword)) {
    filterPayload.value.listShowKeyword.push(keyword)
    showKeywordInput.value = ''
  }
}

function removeShowKeyword(index: number) {
  filterPayload.value.listShowKeyword.splice(index, 1)
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
  deepSearch.selectedChapterIds.value = []
}

function applyFilter() {
  // Clear all deep search filter IDs first
  delete filterPayload.value.chapter_ids
  delete filterPayload.value.audio_ids
  delete filterPayload.value.video_ids
  delete filterPayload.value.topic1_category_ids
  delete filterPayload.value.topic2_chapter_ids
  delete filterPayload.value.topic3_chapter_ids

  // Only add back if there are selections
  if (deepSearch.selectedChapterIds.value.length > 0) {
    filterPayload.value.chapter_ids = deepSearch.selectedChapterIds.value
  }

  if (deepSearch.selectedVideoIds.value.length > 0) {
    // Check which category is selected to determine if it's audio or video
    const firstCategory = filterPayload.value.selectedCategory[0]
    if (firstCategory === 'Audio') {
      filterPayload.value.audio_ids = deepSearch.selectedVideoIds.value
    } else if (firstCategory === 'Video') {
      filterPayload.value.video_ids = deepSearch.selectedVideoIds.value
    }
  }

  if (deepSearch.selectedTopic1CategoryIds.value.length > 0) {
    filterPayload.value.topic1_category_ids = deepSearch.selectedTopic1CategoryIds.value
  }

  if (deepSearch.selectedTopic2ChapterIds.value.length > 0) {
    filterPayload.value.topic2_chapter_ids = deepSearch.selectedTopic2ChapterIds.value
  }

  if (deepSearch.selectedTopic3ChapterIds.value.length > 0) {
    filterPayload.value.topic3_chapter_ids = deepSearch.selectedTopic3ChapterIds.value
  }

  isFilterOpen.value = false
  searchState.currentPage.value = 1
  
  // Invalidate cache to force fresh fetch
  searchCache.invalidate(searchQuery.value)
  
  searchState.fetchResults()
}

// Deep search functions
function openDeepSearch() {
  const firstCategory = filterPayload.value.selectedCategory[0]

  if (firstCategory === 'Buku' && !deepSearch.bookChapters.value.length) {
    deepSearch.fetchBookChapters()
  } else if (firstCategory === 'Audio' && !deepSearch.audioList.value.length) {
    deepSearch.fetchAudioList()
  } else if (firstCategory === 'Video' && !deepSearch.videoList.value.length) {
    deepSearch.fetchVideoList()
  } else if (firstCategory === 'topik1' && !deepSearch.topic1List.value.length) {
    deepSearch.fetchTopic1List()
  } else if (firstCategory === 'topik2' && !deepSearch.topic2List.value.length) {
    deepSearch.fetchTopic2List()
  } else if (firstCategory === 'topik3' && !deepSearch.topic3List.value.length) {
    deepSearch.fetchTopic3List()
  }

  isDeepSearchOpen.value = true
}

function applyDeepSearch() {
  const firstCategory = filterPayload.value.selectedCategory[0]

  if (firstCategory === 'Buku') {
    if (deepSearch.selectedChapterIds.value.length > 0) {
      filterPayload.value.chapter_ids = deepSearch.selectedChapterIds.value
    } else {
      delete filterPayload.value.chapter_ids
    }
    delete filterPayload.value.audio_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'Audio') {
    if (deepSearch.selectedVideoIds.value.length > 0) {
      filterPayload.value.audio_ids = deepSearch.selectedVideoIds.value
    } else {
      delete filterPayload.value.audio_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'Video') {
    if (deepSearch.selectedVideoIds.value.length > 0) {
      filterPayload.value.video_ids = deepSearch.selectedVideoIds.value
    } else {
      delete filterPayload.value.video_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.audio_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'topik1') {
    if (deepSearch.selectedTopic1CategoryIds.value.length > 0) {
      filterPayload.value.topic1_category_ids = deepSearch.selectedTopic1CategoryIds.value
    } else {
      delete filterPayload.value.topic1_category_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.audio_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'topik2') {
    if (deepSearch.selectedTopic2ChapterIds.value.length > 0) {
      filterPayload.value.topic2_chapter_ids = deepSearch.selectedTopic2ChapterIds.value
    } else {
      delete filterPayload.value.topic2_chapter_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.audio_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'topik3') {
    if (deepSearch.selectedTopic3ChapterIds.value.length > 0) {
      filterPayload.value.topic3_chapter_ids = deepSearch.selectedTopic3ChapterIds.value
    } else {
      delete filterPayload.value.topic3_chapter_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.audio_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
  }

  isDeepSearchOpen.value = false
  searchState.currentPage.value = 1
  searchState.fetchResults()
}

function toggleAccordion(key: string) {
  if (expandedAccordions.value.has(key)) {
    expandedAccordions.value.delete(key)
  } else {
    expandedAccordions.value.add(key)
  }
  expandedAccordions.value = new Set(expandedAccordions.value)
}

// Navigation
function navigateToDetail(item: any) {
  const itemType = item.type.toLowerCase()

  if (itemType === 'book' || itemType === 'buku') {
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const [, chapterId, page] = parts
    router.push({ path: `/book/${chapterId}`, query: { page } })
  } else if (itemType === 'audio') {
    router.push({ path: '/audio/detail', query: { audio_id: item.header_id || item.id, subtitle_id: item.id } })
  } else if (itemType === 'video') {
    const videoId = item.header_id || item.id
    router.push({ path: `/video/play/sub/${videoId}`, query: { title: item.title } })
  } else if (itemType === 'topik1' || itemType === 'topic1' || itemType === 'ensiklopedia') {
    router.push({ path: '/audio/detail', query: { audio_id: item.header_id, subtitle_id: item.id } })
  } else if (itemType === 'topic2' || itemType === 'topik2' || itemType === 'topik') {
    router.push({ path: `/topics2/content/${item.id}`, query: { chapter: item.title } })
  } else if (itemType === 'topic3' || itemType === 'topik3' || itemType === 'kumpulan tanya jawab') {
    router.push({ path: `/topics3/content/${item.header_id || item.id}`, query: { title: item.title } })
  }
}

function navigateToRelatedChapter(chapter: any) {
  if (chapter.type === 'book') {
    router.push({ path: `/book/${chapter.chapter_id}`, query: { title: chapter.chapter_title } })
  } else if (chapter.type === 'topic2') {
    router.push({ path: `/topics2/content/${chapter.chapter_id}`, query: { chapter: chapter.chapter_title } })
  } else if (chapter.type === 'topic3') {
    router.push({ path: `/topics3/content/${chapter.chapter_id}`, query: { title: chapter.chapter_title } })
  }
}

// FAB actions
const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 24)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 10)
}

const scrollToTop = () => {
  if (resultsScrollContainer.value) {
    resultsScrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Infinite scroll for deep search
useInfiniteScroll(
  deepSearchScrollContainer,
  () => {
    if (!isDeepSearchOpen.value) return

    const firstCategory = filterPayload.value.selectedCategory[0]

    if (firstCategory === 'Buku' && deepSearch.bookChaptersHasMore.value && !deepSearch.isLoadingBookChapters.value) {
      deepSearch.fetchBookChapters(true)
    } else if (firstCategory === 'Audio' && deepSearch.audioListHasMore.value && !deepSearch.isLoadingAudioList.value) {
      deepSearch.fetchAudioList(true)
    } else if (firstCategory === 'Video' && deepSearch.videoListHasMore.value && !deepSearch.isLoadingVideoList.value) {
      deepSearch.fetchVideoList(true)
    } else if (firstCategory === 'topik1' && deepSearch.topic1ListHasMore.value && !deepSearch.isLoadingTopic1List.value) {
      deepSearch.fetchTopic1List(true)
    } else if (firstCategory === 'topik2' && deepSearch.topic2ListHasMore.value && !deepSearch.isLoadingTopic2List.value) {
      deepSearch.fetchTopic2List(true)
    } else if (firstCategory === 'topik3' && deepSearch.topic3ListHasMore.value && !deepSearch.isLoadingTopic3List.value) {
      deepSearch.fetchTopic3List(true)
    }
  },
  {
    distance: 200,
    interval: 500,
    canLoadMore: () => {
      if (!isDeepSearchOpen.value) return false
      if (deepSearchQuery.value.trim()) return false

      const firstCategory = filterPayload.value.selectedCategory[0]
      if (firstCategory === 'Buku') return deepSearch.bookChaptersHasMore.value
      if (firstCategory === 'Audio') return deepSearch.audioListHasMore.value
      if (firstCategory === 'Video') return deepSearch.videoListHasMore.value
      if (firstCategory === 'topik1') return deepSearch.topic1ListHasMore.value
      if (firstCategory === 'topik2') return deepSearch.topic2ListHasMore.value
      if (firstCategory === 'topik3') return deepSearch.topic3ListHasMore.value
      return false
    }
  }
)

watch(isDeepSearchOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      if (deepSearchScrollContainer.value) {
        deepSearchScrollContainer.value.scrollTop = 0
      }
    })
  } else {
    deepSearchQuery.value = ''
    expandedAccordions.value.clear()
  }
})
</script>

<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <h1 class="text-lg font-semibold text-black dark:text-white flex-1">Pencarian</h1>
      <button v-if="hasSearched" @click="shareSearch" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-primary dark:text-yellow-400" />
      </button>
    </div>

    <!-- Initial Search View -->
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
    <div v-else ref="resultsScrollContainer" class="flex-1 overflow-y-auto">
      <div class="px-4 py-4">
        <!-- Search Input in Results View -->
        <div class="mb-4">
          <UInput v-model="searchQuery" placeholder="Masukan kata kunci" size="xl" class="w-full"
            @keyup.enter="handleSearch">
            <template #trailing>
              <UButton size="sm" class="bg-primary hover:bg-primary/90 text-black font-medium" @click="handleSearch"
                :disabled="!searchQuery.trim()">
                Cari
              </UButton>
            </template>
          </UInput>
        </div>

        <!-- Filter Buttons -->
        <div class="mb-2 flex gap-2">
          <UButton size="lg" class="bg-primary hover:bg-primary/90 text-black rounded-full font-bold"
            @click="isFilterOpen = true">
            Filter
            <Icon name="mdi:tune-variant" class="w-4 h-4 ml-1" />
          </UButton>
          <UButton v-if="selectedCategoryLabel" size="lg"
            class="bg-primary hover:bg-primary/90 text-black rounded-full font-bold" @click="openDeepSearch">
            {{ selectedCategoryLabel }}
            <Icon name="mdi:book-search" class="w-4 h-4 ml-1" />
          </UButton>
        </div>

        <!-- Kesaksian Label -->
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wide">
          MENAMPILKAN "{{ searchedKeyword }}"
        </p>

        <!-- Loading -->
        <div v-if="isLoading && results.length === 0" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>

        <!-- Results List -->
        <div v-else class="space-y-4">
          <SearchResultCard
            v-for="item in results"
            :key="getItemKey(item)"
            :item="item"
            :is-expanded="expandedItems.has(getItemKey(item))"
            :font-size="fontSize"
            :is-speaking="speakingItemId === getItemKey(item)"
            :search-keyword="searchedKeyword"
            @toggle="toggleExpand(item)"
            @navigate="navigateToDetail(item)"
            @speak="speakContent(item)"
            @navigate-related="navigateToRelatedChapter"
          />

          <!-- Empty State -->
          <div v-if="results.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="results.length > 0" class="mt-6 pb-6">
          <UButton block variant="outline" class="border-black! text-black! dark:border-white! dark:text-white!" :loading="isLoading" @click="loadMore">
            Muat Lebih Banyak
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filter Drawer -->
    <UDrawer v-model:open="isFilterOpen" direction="bottom" title="Filter Pencarian">
      <template #content>
        <div class="p-4 space-y-6 overflow-y-auto max-h-[80vh] bg-white dark:bg-gray-900 pb-12" style="font-size: 1.2em;">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-black dark:text-white">Filter Pencarian</h2>
            <button class="text-gray-500 dark:text-gray-400 text-lg" @click="resetFilter">Reset Filter</button>
          </div>

          <!-- Kategori -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3 text-lg">Kategori</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="cat in categoryOptions" :key="cat.value"
                class="px-4 py-1.5 rounded-full text-lg border transition-colors" :class="filterPayload.selectedCategory.includes(cat.value)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleCategory(cat.value)">
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Dynamic Filters -->
          <div v-for="filter in dynamicFilters" :key="filter.title">
            <h3 class="font-semibold text-black dark:text-white mb-3 text-lg">{{ filter.title }}</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="item in filter.keyword" :key="item"
                class="px-4 py-1.5 rounded-full text-lg border transition-colors" :class="isFilterItemSelected(filter.title, item)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleFilterItem(filter.title, item)">
                {{ item }}
              </button>
            </div>
          </div>

          <!-- Sembunyikan kata kunci -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3 text-lg">Sembunyikan kata kunci</h3>
            <div class="flex gap-2 mb-2">
              <UInput v-model="hideKeywordInput" placeholder="Masukan kata kunci" size="md" class="flex-1 text-lg"
                @keyup.enter="addHideKeyword" />
              <button @click="addHideKeyword" :disabled="!hideKeywordInput.trim()"
                class="px-3 py-2 rounded-lg transition-colors shrink-0" :class="hideKeywordInput.trim()
                  ? 'bg-primary hover:bg-primary/90 text-black'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'">
                <Icon name="mdi:plus" class="w-5 h-5" />
              </button>
            </div>
            <div v-if="filterPayload.listHideKeyword.length > 0" class="flex flex-wrap gap-2">
              <div v-for="(keyword, idx) in filterPayload.listHideKeyword" :key="`hide-${idx}`"
                class="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-lg">
                <span>{{ keyword }}</span>
                <button @click="removeHideKeyword(idx)"
                  class="hover:bg-red-200 dark:hover:bg-red-800/50 rounded-full p-0.5">
                  <Icon name="mdi:close" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tambahkan kata kunci -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3 text-lg">Tambahkan kata kunci</h3>
            <div class="flex gap-2 mb-2">
              <UInput v-model="showKeywordInput" placeholder="Masukan kata kunci" size="md" class="flex-1 text-lg"
                @keyup.enter="addShowKeyword" />
              <button @click="addShowKeyword" :disabled="!showKeywordInput.trim()"
                class="px-3 py-2 rounded-lg transition-colors shrink-0" :class="showKeywordInput.trim()
                  ? 'bg-primary hover:bg-primary/90 text-black'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'">
                <Icon name="mdi:plus" class="w-5 h-5" />
              </button>
            </div>
            <div v-if="filterPayload.listShowKeyword.length > 0" class="flex flex-wrap gap-2">
              <div v-for="(keyword, idx) in filterPayload.listShowKeyword" :key="`show-${idx}`"
                class="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-lg">
                <span>{{ keyword }}</span>
                <button @click="removeShowKeyword(idx)"
                  class="hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5">
                  <Icon name="mdi:close" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tahun -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3 text-lg">Tahun</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="year in yearOptions" :key="year"
                class="px-4 py-1.5 rounded-full text-lg border transition-colors" :class="filterPayload.year.includes(year)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleYear(year)">
                {{ year }}
              </button>
            </div>
          </div>

          <!-- Terapkan Button -->
          <div class="pt-4 pb-8">
            <UButton block size="lg" class="bg-primary hover:bg-primary/90 text-black text-lg" @click="applyFilter">
              Terapkan
            </UButton>
          </div>
        </div>
      </template>
    </UDrawer>

    <!-- Deep Search Drawer -->
    <UDrawer v-model:open="isDeepSearchOpen" direction="bottom" :title="selectedCategoryLabel || 'Pencarian Mendalam'">
      <template #content>
        <div class="flex flex-col max-h-[80vh] bg-white dark:bg-gray-900" style="font-size: 1.2em;">
          <!-- Fixed Header -->
          <div class="p-4 space-y-4 shrink-0">
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 class="text-xl font-semibold text-black dark:text-white">{{ selectedCategoryLabel || 'Pencarian Mendalam' }}</h2>
                <p v-if="filterPayload.selectedCategory[0] === 'Buku' && deepSearch.selectedChapterIds.value.length > 0"
                  class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {{ deepSearch.selectedChapterIds.value.length }} bab dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'Audio' && deepSearch.selectedVideoIds.value.length > 0"
                  class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {{ deepSearch.selectedVideoIds.value.length }} audio dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'Video' && deepSearch.selectedVideoIds.value.length > 0"
                  class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {{ deepSearch.selectedVideoIds.value.length }} video dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'topik1' && deepSearch.selectedTopic1CategoryIds.value.length > 0"
                  class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {{ deepSearch.selectedTopic1CategoryIds.value.length }} kategori dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'topik2' && deepSearch.selectedTopic2ChapterIds.value.length > 0"
                  class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {{ deepSearch.selectedTopic2ChapterIds.value.length }} bab dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'topik3' && deepSearch.selectedTopic3ChapterIds.value.length > 0"
                  class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {{ deepSearch.selectedTopic3ChapterIds.value.length }} bab dipilih
                </p>
              </div>
              <div class="flex gap-2">
                <button class="text-gray-500 dark:text-gray-400 text-lg hover:text-gray-700 dark:hover:text-gray-300"
                  @click="deepSearch.resetDeepSearch()">
                  Reset
                </button>
                <UButton size="md" class="bg-primary hover:bg-primary/90 text-black text-lg" @click="applyDeepSearch">
                  Terapkan
                </UButton>
              </div>
            </div>

            <!-- Search Input -->
            <div class="w-full">
              <UInput v-model="deepSearchQuery" placeholder="Cari..." size="md" icon="i-heroicons-magnifying-glass"
                class="w-full" />
            </div>
          </div>

          <!-- Scrollable List -->
          <div ref="deepSearchScrollContainer" class="flex-1 overflow-y-auto px-4 pb-32">
            <SearchDeepSearchBook
              v-if="filterPayload.selectedCategory[0] === 'Buku'"
              :deep-search="deepSearch"
              :deep-search-query="deepSearchQuery"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="toggleAccordion"
            />
            <SearchDeepSearchAudio
              v-else-if="filterPayload.selectedCategory[0] === 'Audio'"
              :deep-search="deepSearch"
              :deep-search-query="deepSearchQuery"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="toggleAccordion"
            />
            <SearchDeepSearchVideo
              v-else-if="filterPayload.selectedCategory[0] === 'Video'"
              :deep-search="deepSearch"
              :deep-search-query="deepSearchQuery"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="toggleAccordion"
            />
            <SearchDeepSearchTopic1
              v-else-if="filterPayload.selectedCategory[0] === 'topik1'"
              :deep-search="deepSearch"
              :deep-search-query="deepSearchQuery"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="toggleAccordion"
            />
            <SearchDeepSearchTopic2
              v-else-if="filterPayload.selectedCategory[0] === 'topik2'"
              :deep-search="deepSearch"
              :deep-search-query="deepSearchQuery"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="toggleAccordion"
            />
            <SearchDeepSearchTopic3
              v-else-if="filterPayload.selectedCategory[0] === 'topik3'"
              :deep-search="deepSearch"
              :deep-search-query="deepSearchQuery"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="toggleAccordion"
            />
          </div>
        </div>
      </template>
    </UDrawer>

    <!-- FAB -->
    <div v-if="results.length > 0" class="fixed bottom-0 left-0 right-0 max-w-md mx-auto pointer-events-none">
      <LazyFabZoom v-model:isOpen="showFabMenu" class="absolute right-4 bottom-20 pointer-events-auto" @zoomIn="zoomIn"
        @zoomOut="zoomOut" @scrollTop="scrollToTop" />
    </div>
  </div>
</template>
