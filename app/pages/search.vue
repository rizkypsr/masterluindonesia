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
  topic1_category_ids?: number[]
  topic2_chapter_ids?: number[]
  topic3_chapter_ids?: number[]
}

interface BookChapter {
  id: number
  title: string
  have_child: number
  children?: BookChapter[]
}

interface Book {
  id: number
  title: string
  chapters: BookChapter[]
}

interface BookGroup {
  id: number
  title: string
  books: Book[]
}

interface AudioVideo {
  id: number
  title: string
}

interface AudioSubGroup {
  id: number
  name: string
  audios: AudioVideo[]
}

interface AudioCategory {
  id: number
  title: string
  sub_groups: AudioSubGroup[]
}

interface AudioGroup {
  id: number
  title: string
  children: AudioCategory[]
}

interface VideoSubGroup {
  id: number
  name: string
  videos: AudioVideo[]
}

interface VideoChild {
  id: number
  title: string
  sub_groups: VideoSubGroup[]
}

interface VideoCategory {
  id: number
  title: string
  children: VideoChild[]
}

interface VideoYearGroup {
  id: number
  title: string
  video_categories: VideoCategory[]
}

interface VideoGroup {
  id: number
  title: string
  children: VideoYearGroup[]
}

interface Topic1Child {
  id: number
  title: string
}

interface Topic1Category {
  id: number
  title: string
  children?: Topic1Child[]
}

interface Topic1Group {
  topic_id: number
  topic_title: string
  categories: Topic1Category[]
}

interface Topic2Chapter {
  id: number
  title: string
  children?: Topic2Chapter[]
}

interface Topic2Topic {
  id: number
  title: string
  chapters: Topic2Chapter[]
}

interface Topic2Group {
  id: number
  title: string
  topics: Topic2Topic[]
}

interface Topic3Chapter {
  id: number
  title: string
  children?: Topic3Chapter[]
}

interface Topic3Topic {
  id: number
  title: string
  chapters: Topic3Chapter[]
}

interface Topic3Group {
  id: number
  title: string
  topics: Topic3Topic[]
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
const bookChapters = ref<BookGroup[]>([])
const selectedChapterIds = ref<number[]>([])
const isLoadingBookChapters = ref(false)
const bookChaptersPage = ref(1)
const bookChaptersHasMore = ref(true)

// Deep search state for audio
const audioList = ref<AudioGroup[]>([])
const selectedVideoIds = ref<number[]>([])
const isLoadingAudioList = ref(false)
const audioListPage = ref(1)
const audioListHasMore = ref(true)

// Deep search state for video
const videoList = ref<VideoGroup[]>([])
const isLoadingVideoList = ref(false)
const videoListPage = ref(1)
const videoListHasMore = ref(true)

// Deep search state for topic1
const topic1List = ref<Topic1Group[]>([])
const selectedTopic1CategoryIds = ref<number[]>([])
const isLoadingTopic1List = ref(false)
const topic1ListPage = ref(1)
const topic1ListHasMore = ref(true)

// Deep search state for topic2
const topic2List = ref<Topic2Group[]>([])
const selectedTopic2ChapterIds = ref<number[]>([])
const isLoadingTopic2List = ref(false)
const topic2ListPage = ref(1)
const topic2ListHasMore = ref(true)

// Deep search state for topic3
const topic3List = ref<Topic3Group[]>([])
const selectedTopic3ChapterIds = ref<number[]>([])
const isLoadingTopic3List = ref(false)
const topic3ListPage = ref(1)
const topic3ListHasMore = ref(true)

// Deep search filter
const deepSearchQuery = ref('')

// Accordion state for deep search
const expandedAccordions = ref<Set<string>>(new Set())

// Scroll container ref
const deepSearchScrollContainer = ref<HTMLElement | null>(null)

// Computed filtered lists
const filteredBookChapters = computed(() => {
  if (!deepSearchQuery.value.trim()) return bookChapters.value

  const query = deepSearchQuery.value.toLowerCase()

  return bookChapters.value.map(bookGroup => {
    // Check if book group title matches
    const groupMatches = bookGroup.title.toLowerCase().includes(query)

    // If group matches, return entire group with all books
    if (groupMatches) {
      return bookGroup
    }

    // Filter books within the group
    const filteredBooks = bookGroup.books.map(book => {
      const bookMatches = book.title.toLowerCase().includes(query)

      // If book matches, return entire book with all chapters
      if (bookMatches) {
        return book
      }

      // Filter chapters
      const filteredChapters = book.chapters.filter(chapter => {
        const chapterMatches = chapter.title.toLowerCase().includes(query)
        const childMatches = chapter.children?.some(child =>
          child.title.toLowerCase().includes(query)
        )
        return chapterMatches || childMatches
      }).map(chapter => {
        // If chapter matches, show all children
        if (chapter.title.toLowerCase().includes(query)) {
          return chapter
        }
        // Otherwise, filter children
        return {
          ...chapter,
          children: chapter.children?.filter(child =>
            child.title.toLowerCase().includes(query)
          )
        }
      })

      // Return book if it has matching chapters
      if (filteredChapters.length > 0) {
        return {
          ...book,
          chapters: filteredChapters
        }
      }
      return null
    }).filter(book => book !== null) as Book[]

    // Return group if it has matching books
    if (filteredBooks.length > 0) {
      return {
        ...bookGroup,
        books: filteredBooks
      }
    }
    return null
  }).filter(group => group !== null) as BookGroup[]
})

const filteredAudioList = computed(() => {
  if (!deepSearchQuery.value.trim()) return audioList.value

  const query = deepSearchQuery.value.toLowerCase()

  return audioList.value.map(audioGroup => {
    // Check if audio group title matches
    const groupMatches = audioGroup.title.toLowerCase().includes(query)

    // If group matches, return entire group
    if (groupMatches) {
      return audioGroup
    }

    // Filter categories within the group
    const filteredCategories = audioGroup.children.map(category => {
      const categoryMatches = category.title.toLowerCase().includes(query)

      // If category matches, return entire category
      if (categoryMatches) {
        return category
      }

      // Filter sub groups
      const filteredSubGroups = category.sub_groups.filter(subGroup => {
        const subGroupMatches = subGroup.name.toLowerCase().includes(query)
        const audioMatches = subGroup.audios.some(audio =>
          audio.title.toLowerCase().includes(query)
        )
        return subGroupMatches || audioMatches
      }).map(subGroup => {
        // If sub group matches, show all audios
        if (subGroup.name.toLowerCase().includes(query)) {
          return subGroup
        }
        // Otherwise, filter audios
        return {
          ...subGroup,
          audios: subGroup.audios.filter(audio =>
            audio.title.toLowerCase().includes(query)
          )
        }
      })

      // Return category if it has matching sub groups
      if (filteredSubGroups.length > 0) {
        return {
          ...category,
          sub_groups: filteredSubGroups
        }
      }
      return null
    }).filter(category => category !== null) as AudioCategory[]

    // Return group if it has matching categories
    if (filteredCategories.length > 0) {
      return {
        ...audioGroup,
        children: filteredCategories
      }
    }
    return null
  }).filter(group => group !== null) as AudioGroup[]
})

const filteredTopic3List = computed(() => {
  if (!deepSearchQuery.value.trim()) return topic3List.value

  const query = deepSearchQuery.value.toLowerCase()

  // Recursive function to filter chapters
  function filterChapters(chapters: Topic3Chapter[]): Topic3Chapter[] {
    return chapters.map(chapter => {
      const chapterMatches = chapter.title.toLowerCase().includes(query)

      if (chapterMatches) {
        return chapter
      }

      if (chapter.children) {
        const filteredChildren = filterChapters(chapter.children)
        if (filteredChildren.length > 0) {
          return {
            ...chapter,
            children: filteredChildren
          }
        }
      }

      return null
    }).filter(chapter => chapter !== null) as Topic3Chapter[]
  }

  return topic3List.value.map(topic3Group => {
    const groupMatches = topic3Group.title.toLowerCase().includes(query)

    if (groupMatches) {
      return topic3Group
    }

    const filteredTopics = topic3Group.topics.map(topic => {
      const topicMatches = topic.title.toLowerCase().includes(query)

      if (topicMatches) {
        return topic
      }

      const filteredChapters = filterChapters(topic.chapters)

      if (filteredChapters.length > 0) {
        return {
          ...topic,
          chapters: filteredChapters
        }
      }

      return null
    }).filter(topic => topic !== null) as Topic3Topic[]

    if (filteredTopics.length > 0) {
      return {
        ...topic3Group,
        topics: filteredTopics
      }
    }
    return null
  }).filter(group => group !== null) as Topic3Group[]
})

const filteredTopic2List = computed(() => {
  if (!deepSearchQuery.value.trim()) return topic2List.value

  const query = deepSearchQuery.value.toLowerCase()

  // Recursive function to filter chapters
  function filterChapters(chapters: Topic2Chapter[]): Topic2Chapter[] {
    return chapters.map(chapter => {
      const chapterMatches = chapter.title.toLowerCase().includes(query)

      if (chapterMatches) {
        return chapter
      }

      if (chapter.children) {
        const filteredChildren = filterChapters(chapter.children)
        if (filteredChildren.length > 0) {
          return {
            ...chapter,
            children: filteredChildren
          }
        }
      }

      return null
    }).filter(chapter => chapter !== null) as Topic2Chapter[]
  }

  return topic2List.value.map(topic2Group => {
    const groupMatches = topic2Group.title.toLowerCase().includes(query)

    if (groupMatches) {
      return topic2Group
    }

    const filteredTopics = topic2Group.topics.map(topic => {
      const topicMatches = topic.title.toLowerCase().includes(query)

      if (topicMatches) {
        return topic
      }

      const filteredChapters = filterChapters(topic.chapters)

      if (filteredChapters.length > 0) {
        return {
          ...topic,
          chapters: filteredChapters
        }
      }

      return null
    }).filter(topic => topic !== null) as Topic2Topic[]

    if (filteredTopics.length > 0) {
      return {
        ...topic2Group,
        topics: filteredTopics
      }
    }
    return null
  }).filter(group => group !== null) as Topic2Group[]
})

const filteredTopic1List = computed(() => {
  if (!deepSearchQuery.value.trim()) return topic1List.value

  const query = deepSearchQuery.value.toLowerCase()

  return topic1List.value.map(topic1Group => {
    const groupMatches = topic1Group.topic_title.toLowerCase().includes(query)

    if (groupMatches) {
      return topic1Group
    }

    const filteredCategories = topic1Group.categories.map(category => {
      const categoryMatches = category.title.toLowerCase().includes(query)

      if (categoryMatches) {
        return category
      }

      // Filter children if they exist
      if (category.children) {
        const filteredChildren = category.children.filter(child =>
          child.title.toLowerCase().includes(query)
        )

        if (filteredChildren.length > 0) {
          return {
            ...category,
            children: filteredChildren
          }
        }
      }

      return null
    }).filter(category => category !== null) as Topic1Category[]

    if (filteredCategories.length > 0) {
      return {
        ...topic1Group,
        categories: filteredCategories
      }
    }
    return null
  }).filter(group => group !== null) as Topic1Group[]
})

const filteredVideoList = computed(() => {
  if (!deepSearchQuery.value.trim()) return videoList.value

  const query = deepSearchQuery.value.toLowerCase()

  return videoList.value.map(videoGroup => {
    const groupMatches = videoGroup.title.toLowerCase().includes(query)

    if (groupMatches) {
      return videoGroup
    }

    const filteredChildren = videoGroup.children.map(yearGroup => {
      const yearMatches = yearGroup.title.toLowerCase().includes(query)

      if (yearMatches) {
        return yearGroup
      }

      const filteredCategories = yearGroup.video_categories.map(category => {
        const categoryMatches = category.title.toLowerCase().includes(query)

        if (categoryMatches) {
          return category
        }

        const filteredCategoryChildren = category.children.map(child => {
          const childMatches = child.title.toLowerCase().includes(query)

          if (childMatches) {
            return child
          }

          const filteredSubGroups = child.sub_groups.filter(subGroup => {
            const subGroupMatches = subGroup.name.toLowerCase().includes(query)
            const videoMatches = subGroup.videos.some(video =>
              video.title.toLowerCase().includes(query)
            )
            return subGroupMatches || videoMatches
          }).map(subGroup => {
            if (subGroup.name.toLowerCase().includes(query)) {
              return subGroup
            }
            return {
              ...subGroup,
              videos: subGroup.videos.filter(video =>
                video.title.toLowerCase().includes(query)
              )
            }
          })

          if (filteredSubGroups.length > 0) {
            return {
              ...child,
              sub_groups: filteredSubGroups
            }
          }
          return null
        }).filter(child => child !== null) as VideoChild[]

        if (filteredCategoryChildren.length > 0) {
          return {
            ...category,
            children: filteredCategoryChildren
          }
        }
        return null
      }).filter(category => category !== null) as VideoCategory[]

      if (filteredCategories.length > 0) {
        return {
          ...yearGroup,
          video_categories: filteredCategories
        }
      }
      return null
    }).filter(yearGroup => yearGroup !== null) as VideoYearGroup[]

    if (filteredChildren.length > 0) {
      return {
        ...videoGroup,
        children: filteredChildren
      }
    }
    return null
  }).filter(group => group !== null) as VideoGroup[]
})

// Setup single infinite scroll that handles all categories
useInfiniteScroll(
  deepSearchScrollContainer,
  () => {
    // Only trigger if modal is open
    if (!isDeepSearchOpen.value) return

    const firstCategory = filterPayload.value.selectedCategory[0]

    if (firstCategory === 'Buku' && bookChaptersHasMore.value && !isLoadingBookChapters.value) {
      fetchBookChapters(true)
    } else if (firstCategory === 'Audio' && audioListHasMore.value && !isLoadingAudioList.value) {
      fetchAudioList(true)
    } else if (firstCategory === 'Video' && videoListHasMore.value && !isLoadingVideoList.value) {
      fetchVideoList(true)
    } else if (firstCategory === 'topik1' && topic1ListHasMore.value && !isLoadingTopic1List.value) {
      fetchTopic1List(true)
    } else if (firstCategory === 'topik2' && topic2ListHasMore.value && !isLoadingTopic2List.value) {
      fetchTopic2List(true)
    } else if (firstCategory === 'topik3' && topic3ListHasMore.value && !isLoadingTopic3List.value) {
      fetchTopic3List(true)
    }
  },
  {
    distance: 200,
    interval: 500,
    canLoadMore: () => {
      // Only allow loading if modal is open
      if (!isDeepSearchOpen.value) return false

      // Don't load if there's a search query (filtered results)
      if (deepSearchQuery.value.trim()) return false

      const firstCategory = filterPayload.value.selectedCategory[0]
      if (firstCategory === 'Buku') return bookChaptersHasMore.value
      if (firstCategory === 'Audio') return audioListHasMore.value
      if (firstCategory === 'Video') return videoListHasMore.value
      if (firstCategory === 'topik1') return topic1ListHasMore.value
      if (firstCategory === 'topik2') return topic2ListHasMore.value
      if (firstCategory === 'topik3') return topic3ListHasMore.value
      return false
    }
  }
)

// Reset scroll position when modal opens
watch(isDeepSearchOpen, (isOpen) => {
  if (isOpen) {
    // Reset scroll position to top when modal opens
    nextTick(() => {
      if (deepSearchScrollContainer.value) {
        deepSearchScrollContainer.value.scrollTop = 0
      }
    })
  } else {
    // Clear search when modal closes to prevent filtered state issues
    deepSearchQuery.value = ''
    // Clear expanded accordions
    expandedAccordions.value.clear()
  }
})

// Toggle accordion
function toggleAccordion(key: string) {
  if (expandedAccordions.value.has(key)) {
    expandedAccordions.value.delete(key)
  } else {
    expandedAccordions.value.add(key)
  }
  expandedAccordions.value = new Set(expandedAccordions.value)
}

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
    video_ids: filterPayload.value.video_ids,
    topic1_category_ids: filterPayload.value.topic1_category_ids,
    topic2_chapter_ids: filterPayload.value.topic2_chapter_ids,
    topic3_chapter_ids: filterPayload.value.topic3_chapter_ids
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
async function fetchBookChapters(loadMore = false) {
  if (isLoadingBookChapters.value) return
  if (loadMore && !bookChaptersHasMore.value) return

  isLoadingBookChapters.value = true
  try {
    const page = bookChaptersPage.value
    const response = await $fetch<{
      success: boolean
      message: string
      data: BookGroup[]
      pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        has_more: boolean
      }
    }>(`${config.public.apiBaseUrl}/search/book/chapters?page=${page}&per_page=10`)

    if (response.success && response.data) {
      if (loadMore) {
        // Just push new data - no reassignment needed
        bookChapters.value.push(...response.data)
      } else {
        bookChapters.value = response.data
      }
      // Increment page for next fetch
      bookChaptersPage.value = page + 1
      bookChaptersHasMore.value = response.pagination.has_more
    }
  } catch (error) {
    console.error('Failed to fetch book chapters:', error)
  } finally {
    isLoadingBookChapters.value = false
  }
}

// Fetch audio list for deep search
async function fetchAudioList(loadMore = false) {
  if (isLoadingAudioList.value) return
  if (loadMore && !audioListHasMore.value) return

  isLoadingAudioList.value = true
  try {
    const page = audioListPage.value
    const response = await $fetch<{
      success: boolean
      message: string
      data: AudioGroup[]
      pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        has_more: boolean
      }
    }>(`${config.public.apiBaseUrl}/search/audio/list?page=${page}&per_page=10`)

    if (response.success && response.data) {
      if (loadMore) {
        // Just push new data - no reassignment needed
        audioList.value.push(...response.data)
      } else {
        audioList.value = response.data
      }
      // Increment page for next fetch
      audioListPage.value = page + 1
      audioListHasMore.value = response.pagination.has_more
    }
  } catch (error) {
    console.error('Failed to fetch audio list:', error)
  } finally {
    isLoadingAudioList.value = false
  }
}

// Fetch topic3 list for deep search
async function fetchTopic3List(loadMore = false) {
  if (isLoadingTopic3List.value) return
  if (loadMore && !topic3ListHasMore.value) return

  isLoadingTopic3List.value = true
  try {
    const page = topic3ListPage.value
    const response = await $fetch<{
      success: boolean
      message: string
      data: Topic3Group[]
      pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        has_more: boolean
      }
    }>(`${config.public.apiBaseUrl}/search/topic3/list?page=${page}&per_page=10`)

    if (response.success && response.data) {
      if (loadMore) {
        topic3List.value.push(...response.data)
      } else {
        topic3List.value = response.data
      }
      topic3ListPage.value = page + 1
      topic3ListHasMore.value = response.pagination.has_more
    }
  } catch (error) {
    console.error('Failed to fetch topic3 list:', error)
  } finally {
    isLoadingTopic3List.value = false
  }
}

// Fetch topic1 list for deep search
async function fetchTopic1List(loadMore = false) {
  if (isLoadingTopic1List.value) return
  if (loadMore && !topic1ListHasMore.value) return

  isLoadingTopic1List.value = true
  try {
    const page = topic1ListPage.value
    const response = await $fetch<{
      success: boolean
      message: string
      data: Topic1Group[]
      pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        has_more: boolean
      }
    }>(`${config.public.apiBaseUrl}/search/topic1/list?page=${page}&per_page=10`)

    if (response.success && response.data) {
      if (loadMore) {
        topic1List.value.push(...response.data)
      } else {
        topic1List.value = response.data
      }
      topic1ListPage.value = page + 1
      topic1ListHasMore.value = response.pagination.has_more
    }
  } catch (error) {
    console.error('Failed to fetch topic1 list:', error)
  } finally {
    isLoadingTopic1List.value = false
  }
}

// Fetch topic2 list for deep search
async function fetchTopic2List(loadMore = false) {
  if (isLoadingTopic2List.value) return
  if (loadMore && !topic2ListHasMore.value) return

  isLoadingTopic2List.value = true
  try {
    const page = topic2ListPage.value
    const response = await $fetch<{
      success: boolean
      message: string
      data: Topic2Group[]
      pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        has_more: boolean
      }
    }>(`${config.public.apiBaseUrl}/search/topic2/list?page=${page}&per_page=10`)

    if (response.success && response.data) {
      if (loadMore) {
        topic2List.value.push(...response.data)
      } else {
        topic2List.value = response.data
      }
      topic2ListPage.value = page + 1
      topic2ListHasMore.value = response.pagination.has_more
    }
  } catch (error) {
    console.error('Failed to fetch topic2 list:', error)
  } finally {
    isLoadingTopic2List.value = false
  }
}

// Fetch video list for deep search
async function fetchVideoList(loadMore = false) {
  if (isLoadingVideoList.value) return
  if (loadMore && !videoListHasMore.value) return

  isLoadingVideoList.value = true
  try {
    const page = videoListPage.value
    const response = await $fetch<{
      success: boolean
      message: string
      data: VideoGroup[]
      pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        has_more: boolean
      }
    }>(`${config.public.apiBaseUrl}/search/video/list?page=${page}&per_page=10`)

    if (response.success && response.data) {
      if (loadMore) {
        // Just push new data - no reassignment needed
        videoList.value.push(...response.data)
      } else {
        videoList.value = response.data
      }
      // Increment page for next fetch
      videoListPage.value = page + 1
      videoListHasMore.value = response.pagination.has_more
    }
  } catch (error) {
    console.error('Failed to fetch video list:', error)
  } finally {
    isLoadingVideoList.value = false
  }
}

// Toggle topic3 chapter selection (recursive)
function toggleTopic3ChapterSelection(chapterId: number, chapter: Topic3Chapter) {
  const idx = selectedTopic3ChapterIds.value.indexOf(chapterId)
  if (idx > -1) {
    // Unselect this chapter and all its children
    selectedTopic3ChapterIds.value.splice(idx, 1)
    if (chapter.children) {
      unselectAllTopic3Children(chapter.children)
    }
  } else {
    // Select this chapter and all its children
    selectedTopic3ChapterIds.value.push(chapterId)
    if (chapter.children) {
      selectAllTopic3Children(chapter.children)
    }
  }
}

// Select all topic3 children recursively
function selectAllTopic3Children(children: Topic3Chapter[]) {
  children.forEach(child => {
    if (!selectedTopic3ChapterIds.value.includes(child.id)) {
      selectedTopic3ChapterIds.value.push(child.id)
    }
    if (child.children) {
      selectAllTopic3Children(child.children)
    }
  })
}

// Unselect all topic3 children recursively
function unselectAllTopic3Children(children: Topic3Chapter[]) {
  children.forEach(child => {
    const idx = selectedTopic3ChapterIds.value.indexOf(child.id)
    if (idx > -1) {
      selectedTopic3ChapterIds.value.splice(idx, 1)
    }
    if (child.children) {
      unselectAllTopic3Children(child.children)
    }
  })
}

// Toggle topic2 chapter selection (recursive)
function toggleTopic2ChapterSelection(chapterId: number, chapter: Topic2Chapter) {
  const idx = selectedTopic2ChapterIds.value.indexOf(chapterId)
  if (idx > -1) {
    // Unselect this chapter and all its children
    selectedTopic2ChapterIds.value.splice(idx, 1)
    if (chapter.children) {
      unselectAllTopic2Children(chapter.children)
    }
  } else {
    // Select this chapter and all its children
    selectedTopic2ChapterIds.value.push(chapterId)
    if (chapter.children) {
      selectAllTopic2Children(chapter.children)
    }
  }
}

// Select all topic2 children recursively
function selectAllTopic2Children(children: Topic2Chapter[]) {
  children.forEach(child => {
    if (!selectedTopic2ChapterIds.value.includes(child.id)) {
      selectedTopic2ChapterIds.value.push(child.id)
    }
    if (child.children) {
      selectAllTopic2Children(child.children)
    }
  })
}

// Unselect all topic2 children recursively
function unselectAllTopic2Children(children: Topic2Chapter[]) {
  children.forEach(child => {
    const idx = selectedTopic2ChapterIds.value.indexOf(child.id)
    if (idx > -1) {
      selectedTopic2ChapterIds.value.splice(idx, 1)
    }
    if (child.children) {
      unselectAllTopic2Children(child.children)
    }
  })
}

// Toggle topic1 category selection
function toggleTopic1CategorySelection(categoryId: number, category: Topic1Category) {
  const idx = selectedTopic1CategoryIds.value.indexOf(categoryId)
  if (idx > -1) {
    // Unselect this category and all its children
    selectedTopic1CategoryIds.value.splice(idx, 1)
    if (category.children) {
      category.children.forEach(child => {
        const childIdx = selectedTopic1CategoryIds.value.indexOf(child.id)
        if (childIdx > -1) {
          selectedTopic1CategoryIds.value.splice(childIdx, 1)
        }
      })
    }
  } else {
    // Select this category and all its children
    selectedTopic1CategoryIds.value.push(categoryId)
    if (category.children) {
      category.children.forEach(child => {
        if (!selectedTopic1CategoryIds.value.includes(child.id)) {
          selectedTopic1CategoryIds.value.push(child.id)
        }
      })
    }
  }
}

// Handle scroll event for infinite loading
function handleDeepSearchScroll(event: Event) {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // Load more when user scrolls to 80% of the content
  if (scrollTop + clientHeight >= scrollHeight * 0.8) {
    const firstCategory = filterPayload.value.selectedCategory[0]

    if (firstCategory === 'Buku' && bookChaptersHasMore.value && !isLoadingBookChapters.value) {
      fetchBookChapters(true)
    } else if (firstCategory === 'Audio' && audioListHasMore.value && !isLoadingAudioList.value) {
      fetchAudioList(true)
    } else if (firstCategory === 'Video' && videoListHasMore.value && !isLoadingVideoList.value) {
      fetchVideoList(true)
    } else if (firstCategory === 'topik1' && topic1ListHasMore.value && !isLoadingTopic1List.value) {
      fetchTopic1List(true)
    }
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
function toggleSubGroupVideos(subGroup: AudioSubGroup | VideoSubGroup) {
  const items = 'audios' in subGroup ? subGroup.audios : subGroup.videos
  const allSelected = items.every(item => selectedVideoIds.value.includes(item.id))

  if (allSelected) {
    // Unselect all items in this sub group
    items.forEach(item => {
      const idx = selectedVideoIds.value.indexOf(item.id)
      if (idx > -1) {
        selectedVideoIds.value.splice(idx, 1)
      }
    })
  } else {
    // Select all items in this sub group
    items.forEach(item => {
      if (!selectedVideoIds.value.includes(item.id)) {
        selectedVideoIds.value.push(item.id)
      }
    })
  }
}

// Check if all videos in sub group are selected
function isSubGroupSelected(subGroup: AudioSubGroup | VideoSubGroup): boolean {
  const items = 'audios' in subGroup ? subGroup.audios : subGroup.videos
  if (!items || items.length === 0) return false
  return items.every(item => selectedVideoIds.value.includes(item.id))
}

// Toggle audio selection
function toggleAudioSelection(audioId: number) {
  const idx = selectedVideoIds.value.indexOf(audioId)
  if (idx > -1) {
    selectedVideoIds.value.splice(idx, 1)
  } else {
    selectedVideoIds.value.push(audioId)
  }
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

// Add hide keyword
function addHideKeyword() {
  const keyword = hideKeywordInput.value.trim()
  if (keyword && !filterPayload.value.listHideKeyword.includes(keyword)) {
    filterPayload.value.listHideKeyword.push(keyword)
    hideKeywordInput.value = ''
  }
}

// Remove hide keyword
function removeHideKeyword(index: number) {
  filterPayload.value.listHideKeyword.splice(index, 1)
}

// Add show keyword
function addShowKeyword() {
  const keyword = showKeywordInput.value.trim()
  if (keyword && !filterPayload.value.listShowKeyword.includes(keyword)) {
    filterPayload.value.listShowKeyword.push(keyword)
    showKeywordInput.value = ''
  }
}

// Remove show keyword
function removeShowKeyword(index: number) {
  filterPayload.value.listShowKeyword.splice(index, 1)
}

// Toggle filter item - use unique key combining filter title and item
function toggleFilterItem(filterTitle: string, item: string) {
  // Create unique key: "filterTitle::item"
  const uniqueKey = `${filterTitle}::${item}`
  const idx = filterPayload.value.selectedKeyword.indexOf(uniqueKey)
  if (idx > -1) {
    filterPayload.value.selectedKeyword.splice(idx, 1)
  } else {
    filterPayload.value.selectedKeyword.push(uniqueKey)
  }
}

// Check if filter item is selected - use unique key
function isFilterItemSelected(filterTitle: string, item: string): boolean {
  const uniqueKey = `${filterTitle}::${item}`
  return filterPayload.value.selectedKeyword.includes(uniqueKey)
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
  } else if (firstCategory === 'topik1' && !topic1List.value.length) {
    fetchTopic1List()
  } else if (firstCategory === 'topik2' && !topic2List.value.length) {
    fetchTopic2List()
  } else if (firstCategory === 'topik3' && !topic3List.value.length) {
    fetchTopic3List()
  }

  isDeepSearchOpen.value = true
}

function applyDeepSearch() {
  const firstCategory = filterPayload.value.selectedCategory[0]

  console.log('applyDeepSearch called for category:', firstCategory)
  console.log('selectedTopic1CategoryIds:', selectedTopic1CategoryIds.value)
  console.log('selectedTopic2ChapterIds:', selectedTopic2ChapterIds.value)
  console.log('selectedTopic3ChapterIds:', selectedTopic3ChapterIds.value)

  // Add chapter_ids, video_ids, topic1_category_ids, topic2_chapter_ids, or topic3_chapter_ids based on category
  if (firstCategory === 'Buku') {
    if (selectedChapterIds.value.length > 0) {
      filterPayload.value.chapter_ids = selectedChapterIds.value
    } else {
      delete filterPayload.value.chapter_ids
    }
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'Audio' || firstCategory === 'Video') {
    if (selectedVideoIds.value.length > 0) {
      filterPayload.value.video_ids = selectedVideoIds.value
    } else {
      delete filterPayload.value.video_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'topik1') {
    if (selectedTopic1CategoryIds.value.length > 0) {
      filterPayload.value.topic1_category_ids = selectedTopic1CategoryIds.value
    } else {
      delete filterPayload.value.topic1_category_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic2_chapter_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'topik2') {
    if (selectedTopic2ChapterIds.value.length > 0) {
      filterPayload.value.topic2_chapter_ids = selectedTopic2ChapterIds.value
    } else {
      delete filterPayload.value.topic2_chapter_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic3_chapter_ids
  } else if (firstCategory === 'topik3') {
    if (selectedTopic3ChapterIds.value.length > 0) {
      filterPayload.value.topic3_chapter_ids = selectedTopic3ChapterIds.value
    } else {
      delete filterPayload.value.topic3_chapter_ids
    }
    delete filterPayload.value.chapter_ids
    delete filterPayload.value.video_ids
    delete filterPayload.value.topic1_category_ids
    delete filterPayload.value.topic2_chapter_ids
  }

  console.log('filterPayload after update:', filterPayload.value)

  isDeepSearchOpen.value = false
  currentPage.value = 1

  // Always refetch results
  fetchResults()
}

function resetDeepSearch() {
  selectedChapterIds.value = []
  selectedVideoIds.value = []
  selectedTopic1CategoryIds.value = []
  selectedTopic2ChapterIds.value = []
  selectedTopic3ChapterIds.value = []
  bookChaptersPage.value = 1
  bookChaptersHasMore.value = true
  audioListPage.value = 1
  audioListHasMore.value = true
  videoListPage.value = 1
  videoListHasMore.value = true
  topic1ListPage.value = 1
  topic1ListHasMore.value = true
  topic2ListPage.value = 1
  topic2ListHasMore.value = true
  topic3ListPage.value = 1
  topic3ListHasMore.value = true
  delete filterPayload.value.chapter_ids
  delete filterPayload.value.video_ids
  delete filterPayload.value.topic1_category_ids
  delete filterPayload.value.topic2_chapter_ids
  delete filterPayload.value.topic3_chapter_ids
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

  console.log('navigateToDetail called:', { itemType, id: item.id, item })

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
  } else if (itemType === 'topik1' || itemType === 'topic1' || itemType === 'ensiklopedia') {
    // Navigate to topics (topik1) detail page
    router.push({
      path: `/topics/detail`,
      query: {
        subId: item.id,
        title: item.title
      }
    })
  } else if (itemType === 'topic2' || itemType === 'topik2' || itemType === 'topik') {
    // Navigate to topics2 content page
    console.log('Navigating to topics2:', `/topics2/content/${item.id}`)
    router.push({
      path: `/topics2/content/${item.id}`,
      query: { chapter: item.title }
    })
  } else if (itemType === 'topic3' || itemType === 'topik3' || itemType === 'kumpulan tanya jawab') {
    // Navigate to topics3 content page
    console.log('Navigating to topics3:', `/topics3/content/${item.id}`)
    router.push({
      path: `/topics3/content/${item.id}`,
      query: { title: item.title }
    })
  } else {
    console.log('No matching type found for:', itemType)
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
          <UButton v-if="selectedCategoryLabel" size="lg"
            class="bg-primary hover:bg-primary/90 text-black rounded-full font-bold" @click="openDeepSearch">
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
              <div v-if="item.related_chapters && item.related_chapters.length > 0"
                class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
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
        <div class="p-4 space-y-6 overflow-y-auto max-h-[80vh] bg-white dark:bg-gray-900 pb-12" style="font-size: 1.2em;">
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
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" :class="isFilterItemSelected(filter.title, item)
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
            <div class="flex gap-2 mb-2">
              <UInput v-model="hideKeywordInput" placeholder="Masukan kata kunci" size="md" class="flex-1"
                @keyup.enter="addHideKeyword" />
              <button @click="addHideKeyword" :disabled="!hideKeywordInput.trim()"
                class="px-3 py-2 rounded-lg transition-colors shrink-0" :class="hideKeywordInput.trim()
                  ? 'bg-primary hover:bg-primary/90 text-black'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'">
                <Icon name="mdi:plus" class="w-5 h-5" />
              </button>
            </div>
            <!-- List of hide keywords -->
            <div v-if="filterPayload.listHideKeyword.length > 0" class="flex flex-wrap gap-2">
              <div v-for="(keyword, idx) in filterPayload.listHideKeyword" :key="`hide-${idx}`"
                class="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm">
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
            <h3 class="font-semibold text-black dark:text-white mb-3">Tambahkan kata kunci</h3>
            <div class="flex gap-2 mb-2">
              <UInput v-model="showKeywordInput" placeholder="Masukan kata kunci" size="md" class="flex-1"
                @keyup.enter="addShowKeyword" />
              <button @click="addShowKeyword" :disabled="!showKeywordInput.trim()"
                class="px-3 py-2 rounded-lg transition-colors shrink-0" :class="showKeywordInput.trim()
                  ? 'bg-primary hover:bg-primary/90 text-black'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'">
                <Icon name="mdi:plus" class="w-5 h-5" />
              </button>
            </div>
            <!-- List of show keywords -->
            <div v-if="filterPayload.listShowKeyword.length > 0" class="flex flex-wrap gap-2">
              <div v-for="(keyword, idx) in filterPayload.listShowKeyword" :key="`show-${idx}`"
                class="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                <span>{{ keyword }}</span>
                <button @click="removeShowKeyword(idx)"
                  class="hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5">
                  <Icon name="mdi:close" class="w-4 h-4" />
                </button>
              </div>
            </div>
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
          <div class="pt-4 pb-8">
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
        <div class="flex flex-col max-h-[80vh] bg-white dark:bg-gray-900" style="font-size: 1.2em;">
          <!-- Fixed Header Section -->
          <div class="p-4 space-y-4 shrink-0">
            <!-- Header with Apply Button -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 class="text-lg font-semibold text-black dark:text-white">{{ selectedCategoryLabel || 'Pencarian Mendalam' }}</h2>
                <p v-if="filterPayload.selectedCategory[0] === 'Buku' && selectedChapterIds.length > 0"
                  class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ selectedChapterIds.length }} bab dipilih
                </p>
                <p v-else-if="(filterPayload.selectedCategory[0] === 'Audio' || filterPayload.selectedCategory[0] === 'Video') && selectedVideoIds.length > 0"
                  class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ selectedVideoIds.length }} video dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'topik1' && selectedTopic1CategoryIds.length > 0"
                  class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ selectedTopic1CategoryIds.length }} kategori dipilih
                </p>
                <p v-else-if="filterPayload.selectedCategory[0] === 'topik2' && selectedTopic2ChapterIds.length > 0"
                  class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ selectedTopic2ChapterIds.length }} bab dipilih
                </p>
              </div>
              <div class="flex gap-2">
                <button class="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300"
                  @click="resetDeepSearch">
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
            <p v-else-if="filterPayload.selectedCategory[0] === 'Audio'"
              class="text-sm text-gray-600 dark:text-gray-400">
              Pilih audio untuk pencarian yang lebih spesifik
            </p>
            <p v-else-if="filterPayload.selectedCategory[0] === 'Video'"
              class="text-sm text-gray-600 dark:text-gray-400">
              Pilih video untuk pencarian yang lebih spesifik
            </p>
            <p v-else-if="filterPayload.selectedCategory[0] === 'topik1'"
              class="text-sm text-gray-600 dark:text-gray-400">
              Pilih kategori ensiklopedia untuk pencarian yang lebih spesifik
            </p>
            <p v-else-if="filterPayload.selectedCategory[0] === 'topik2'"
              class="text-sm text-gray-600 dark:text-gray-400">
              Pilih bab topik untuk pencarian yang lebih spesifik
            </p>
            <p v-else-if="filterPayload.selectedCategory[0] === 'topik3'"
              class="text-sm text-gray-600 dark:text-gray-400">
              Pilih bab kumpulan tanya jawab untuk pencarian yang lebih spesifik
            </p>

            <!-- Search Input -->
            <div class="w-full">
              <UInput v-model="deepSearchQuery" placeholder="Cari..." size="md" icon="i-heroicons-magnifying-glass"
                class="w-full" />
            </div>
          </div>

          <!-- Scrollable List Section -->
          <div ref="deepSearchScrollContainer" class="flex-1 overflow-y-auto px-4 pb-32">
            <!-- Book Chapters List -->
            <div v-if="filterPayload.selectedCategory[0] === 'Buku'" class="space-y-4">
              <!-- Book Group Level (Accordion) -->
              <div v-for="bookGroup in filteredBookChapters" :key="`group-${bookGroup.id}`" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Accordion Header -->
                <button @click="toggleAccordion(`book-group-${bookGroup.id}`)" 
                  class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <h2 class="text-base font-bold text-black dark:text-white">
                    {{ bookGroup.title }}
                  </h2>
                  <Icon :name="expandedAccordions.has(`book-group-${bookGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                    class="w-5 h-5 text-black dark:text-white" />
                </button>

                <!-- Accordion Content -->
                <div v-if="expandedAccordions.has(`book-group-${bookGroup.id}`)" class="p-3 space-y-3">
                  <!-- Book Level -->
                  <div v-for="book in bookGroup.books" :key="`book-${book.id}`"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <h3
                      class="font-semibold text-black dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                      {{ book.title }}
                    </h3>

                    <!-- Chapter Level -->
                    <div class="space-y-2">
                      <div v-for="chapter in book.chapters" :key="`ch-${chapter.id}`">
                        <div class="flex items-start gap-2 py-1">
                          <input type="checkbox" :id="`deep-chapter-${chapter.id}`"
                            :checked="selectedChapterIds.includes(chapter.id)"
                            @change="toggleChapterSelection(chapter.id, chapter)"
                            class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <label :for="`deep-chapter-${chapter.id}`"
                            class="text-base text-black dark:text-white cursor-pointer flex-1">
                            {{ chapter.title }}
                          </label>
                        </div>

                        <!-- Sub-chapter Level -->
                        <div v-if="chapter.children && chapter.children.length > 0" class="ml-6 mt-1 space-y-1">
                          <div v-for="child in chapter.children" :key="`chd-${child.id}`"
                            class="flex items-start gap-2 py-1">
                            <input type="checkbox" :id="`deep-chapter-child-${child.id}`"
                              :checked="selectedChapterIds.includes(child.id)"
                              @change="toggleChapterSelection(child.id, child)"
                              class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label :for="`deep-chapter-child-${child.id}`"
                              class="text-base text-black dark:text-white cursor-pointer flex-1">
                              {{ child.title }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredBookChapters.length === 0 && !isLoadingBookChapters" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data bab buku' }}
                </p>
              </div>

              <!-- Loading More Indicator for Books - Fixed at bottom -->
              <div v-if="isLoadingBookChapters && bookChapters.length > 0" class="flex justify-center py-4">
                <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
              </div>

              <!-- Initial Loading for Books -->
              <div v-if="bookChapters.length === 0 && isLoadingBookChapters" class="flex justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>

            <!-- Audio List -->
            <div v-else-if="filterPayload.selectedCategory[0] === 'Audio'" class="space-y-4">
              <!-- Audio Group Level (Accordion) -->
              <div v-for="audioGroup in filteredAudioList" :key="`agroup-${audioGroup.id}`" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Accordion Header -->
                <button @click="toggleAccordion(`audio-group-${audioGroup.id}`)" 
                  class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <h2 class="text-base font-bold text-black dark:text-white">
                    {{ audioGroup.title }}
                  </h2>
                  <Icon :name="expandedAccordions.has(`audio-group-${audioGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                    class="w-5 h-5 text-black dark:text-white" />
                </button>

                <!-- Accordion Content -->
                <div v-if="expandedAccordions.has(`audio-group-${audioGroup.id}`)" class="p-3 space-y-3">
                  <!-- Audio Category Level -->
                  <div v-for="category in audioGroup.children" :key="`acat-${category.id}`" class="space-y-2">
                    <h3 class="text-base font-semibold text-black dark:text-white">
                      {{ category.title }}
                    </h3>

                    <!-- Audio Sub Group Level -->
                    <div v-for="subGroup in category.sub_groups" :key="`asg-${subGroup.id}`"
                      class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 ml-2">
                      <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <input type="checkbox" :id="`audio-group-${subGroup.id}`" :checked="isSubGroupSelected(subGroup)"
                          @change="toggleSubGroupVideos(subGroup)"
                          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label :for="`audio-group-${subGroup.id}`"
                          class="font-semibold text-black dark:text-white cursor-pointer">
                          {{ subGroup.name }}
                        </label>
                      </div>

                      <!-- Audio Level -->
                      <div class="space-y-1 ml-6">
                        <div v-for="audio in subGroup.audios" :key="`av-${audio.id}`" class="flex items-start gap-2 py-1">
                          <input type="checkbox" :id="`audio-${audio.id}`" :checked="selectedVideoIds.includes(audio.id)"
                            @change="toggleAudioSelection(audio.id)"
                            class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <label :for="`audio-${audio.id}`"
                            class="text-base text-black dark:text-white cursor-pointer flex-1">
                            {{ audio.title }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredAudioList.length === 0 && !isLoadingAudioList" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data audio' }}
                </p>
              </div>

              <!-- Loading More Indicator for Audio -->
              <div v-if="isLoadingAudioList && audioList.length > 0" class="flex justify-center py-4">
                <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
              </div>

              <!-- Initial Loading for Audio -->
              <div v-if="audioList.length === 0 && isLoadingAudioList" class="flex justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>

            <!-- Video List -->
            <div v-else-if="filterPayload.selectedCategory[0] === 'Video'" class="space-y-4">
              <!-- Video Group Level (Accordion) -->
              <div v-for="videoGroup in filteredVideoList" :key="`vgroup-${videoGroup.id}`" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Accordion Header -->
                <button @click="toggleAccordion(`video-group-${videoGroup.id}`)" 
                  class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <h2 class="text-base font-bold text-black dark:text-white">
                    {{ videoGroup.title }}
                  </h2>
                  <Icon :name="expandedAccordions.has(`video-group-${videoGroup.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                    class="w-5 h-5 text-black dark:text-white" />
                </button>

                <!-- Accordion Content -->
                <div v-if="expandedAccordions.has(`video-group-${videoGroup.id}`)" class="p-3 space-y-3">

                <!-- Year Group Level -->
                <div v-for="yearGroup in videoGroup.children" :key="`vyear-${yearGroup.id}`" class="space-y-2 ml-2">
                  <h3 class="text-base font-semibold text-black dark:text-white">
                    {{ yearGroup.title }}
                  </h3>

                  <!-- Video Category Level -->
                  <div v-for="category in yearGroup.video_categories" :key="`vcat-${category.id}`"
                    class="space-y-2 ml-2">
                    <h4 class="text-base font-medium text-black dark:text-white">
                      {{ category.title }}
                    </h4>

                    <!-- Video Child Level -->
                    <div v-for="child in category.children" :key="`vchild-${child.id}`" class="space-y-2 ml-2">
                      <h5 class="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {{ child.title }}
                      </h5>

                      <!-- Video Sub Group Level -->
                      <div v-for="subGroup in child.sub_groups" :key="`vsg-${subGroup.id}`"
                        class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 ml-2">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                          <input type="checkbox" :id="`video-group-${subGroup.id}`"
                            :checked="isSubGroupSelected(subGroup)" @change="toggleSubGroupVideos(subGroup)"
                            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <label :for="`video-group-${subGroup.id}`"
                            class="font-semibold text-black dark:text-white cursor-pointer">
                            {{ subGroup.name }}
                          </label>
                        </div>

                        <!-- Video Level -->
                        <div class="space-y-1 ml-6">
                          <div v-for="video in subGroup.videos" :key="`vv-${video.id}`"
                            class="flex items-start gap-2 py-1">
                            <input type="checkbox" :id="`video-${video.id}`"
                              :checked="selectedVideoIds.includes(video.id)" @change="toggleVideoSelection(video.id)"
                              class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label :for="`video-${video.id}`"
                              class="text-base text-black dark:text-white cursor-pointer flex-1">
                              {{ video.title }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div v-if="filteredVideoList.length === 0 && !isLoadingVideoList" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data video' }}
                </p>
              </div>

              <!-- Loading More Indicator for Video -->
              <div v-if="isLoadingVideoList && videoList.length > 0" class="flex justify-center py-4">
                <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
              </div>

              <!-- Initial Loading for Video -->
              <div v-if="videoList.length === 0 && isLoadingVideoList" class="flex justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>

            <!-- Topic1 List -->
            <div v-else-if="filterPayload.selectedCategory[0] === 'topik1'" class="space-y-4">
              <!-- Topic1 Group Level (Accordion) -->
              <div v-for="topic1Group in filteredTopic1List" :key="`t1group-${topic1Group.topic_id}`" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Accordion Header -->
                <button @click="toggleAccordion(`topic1-group-${topic1Group.topic_id}`)" 
                  class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <h2 class="text-base font-bold text-black dark:text-white">
                    {{ topic1Group.topic_title }}
                  </h2>
                  <Icon :name="expandedAccordions.has(`topic1-group-${topic1Group.topic_id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                    class="w-5 h-5 text-black dark:text-white" />
                </button>

                <!-- Accordion Content -->
                <div v-if="expandedAccordions.has(`topic1-group-${topic1Group.topic_id}`)" class="p-3 space-y-3">

                <!-- Topic1 Category Level -->
                <div v-for="category in topic1Group.categories" :key="`t1cat-${category.id}`" class="space-y-2 ml-2">
                  <div class="flex items-start gap-2 py-1">
                    <input type="checkbox" :id="`topic1-category-${category.id}`"
                      :checked="selectedTopic1CategoryIds.includes(category.id)"
                      @change="toggleTopic1CategorySelection(category.id, category)"
                      class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label :for="`topic1-category-${category.id}`"
                      class="text-base font-semibold text-black dark:text-white cursor-pointer flex-1">
                      {{ category.title }}
                    </label>
                  </div>

                  <!-- Topic1 Children Level -->
                  <div v-if="category.children && category.children.length > 0" class="ml-6 mt-1 space-y-1">
                    <div v-for="child in category.children" :key="`t1child-${child.id}`"
                      class="flex items-start gap-2 py-1">
                      <input type="checkbox" :id="`topic1-child-${child.id}`"
                        :checked="selectedTopic1CategoryIds.includes(child.id)"
                        @change="toggleTopic1CategorySelection(child.id, { id: child.id, title: child.title })"
                        class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <label :for="`topic1-child-${child.id}`"
                        class="text-base text-black dark:text-white cursor-pointer flex-1">
                        {{ child.title }}
                      </label>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div v-if="filteredTopic1List.length === 0 && !isLoadingTopic1List" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data ensiklopedia' }}
                </p>
              </div>

              <!-- Loading More Indicator for Topic1 -->
              <div v-if="isLoadingTopic1List && topic1List.length > 0" class="flex justify-center py-4">
                <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
              </div>

              <!-- Initial Loading for Topic1 -->
              <div v-if="topic1List.length === 0 && isLoadingTopic1List" class="flex justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>

            <!-- Topic2 List -->
            <div v-else-if="filterPayload.selectedCategory[0] === 'topik2'" class="space-y-4">
              <!-- Topic2 Group Level (Accordion) -->
              <div v-for="topic2Group in filteredTopic2List" :key="`t2group-${topic2Group.id}`" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Accordion Header -->
                <button @click="toggleAccordion(`topic2-group-${topic2Group.id}`)" 
                  class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <h2 class="text-base font-bold text-black dark:text-white">
                    {{ topic2Group.title }}
                  </h2>
                  <Icon :name="expandedAccordions.has(`topic2-group-${topic2Group.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                    class="w-5 h-5 text-black dark:text-white" />
                </button>

                <!-- Accordion Content -->
                <div v-if="expandedAccordions.has(`topic2-group-${topic2Group.id}`)" class="p-3 space-y-3">

                <!-- Topic2 Topic Level -->
                <div v-for="topic in topic2Group.topics" :key="`t2topic-${topic.id}`" class="space-y-2 ml-2">
                  <h3 class="text-base font-semibold text-black dark:text-white">
                    {{ topic.title }}
                  </h3>

                  <!-- Recursive Chapter Component -->
                  <div class="ml-2">
                    <template v-for="chapter in topic.chapters" :key="`t2ch-${chapter.id}`">
                      <div class="space-y-1">
                        <div class="flex items-start gap-2 py-1">
                          <input type="checkbox" :id="`topic2-chapter-${chapter.id}`"
                            :checked="selectedTopic2ChapterIds.includes(chapter.id)"
                            @change="toggleTopic2ChapterSelection(chapter.id, chapter)"
                            class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <label :for="`topic2-chapter-${chapter.id}`"
                            class="text-base text-black dark:text-white cursor-pointer flex-1">
                            {{ chapter.title }}
                          </label>
                        </div>

                        <!-- Recursive Children -->
                        <div v-if="chapter.children && chapter.children.length > 0" class="ml-6">
                          <template v-for="child in chapter.children" :key="`t2chd-${child.id}`">
                            <div class="space-y-1">
                              <div class="flex items-start gap-2 py-1">
                                <input type="checkbox" :id="`topic2-child-${child.id}`"
                                  :checked="selectedTopic2ChapterIds.includes(child.id)"
                                  @change="toggleTopic2ChapterSelection(child.id, child)"
                                  class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <label :for="`topic2-child-${child.id}`"
                                  class="text-base text-black dark:text-white cursor-pointer flex-1">
                                  {{ child.title }}
                                </label>
                              </div>

                              <!-- Third Level Children -->
                              <div v-if="child.children && child.children.length > 0" class="ml-6">
                                <div v-for="grandchild in child.children" :key="`t2gch-${grandchild.id}`"
                                  class="flex items-start gap-2 py-1">
                                  <input type="checkbox" :id="`topic2-grandchild-${grandchild.id}`"
                                    :checked="selectedTopic2ChapterIds.includes(grandchild.id)"
                                    @change="toggleTopic2ChapterSelection(grandchild.id, grandchild)"
                                    class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                  <label :for="`topic2-grandchild-${grandchild.id}`"
                                    class="text-base text-black dark:text-white cursor-pointer flex-1">
                                    {{ grandchild.title }}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                </div>
              </div>

              <div v-if="filteredTopic2List.length === 0 && !isLoadingTopic2List" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data topik' }}
                </p>
              </div>

              <!-- Loading More Indicator for Topic2 -->
              <div v-if="isLoadingTopic2List && topic2List.length > 0" class="flex justify-center py-4">
                <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
              </div>

              <!-- Initial Loading for Topic2 -->
              <div v-if="topic2List.length === 0 && isLoadingTopic2List" class="flex justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>

            <!-- Topic3 List -->
            <div v-else-if="filterPayload.selectedCategory[0] === 'topik3'" class="space-y-4">
              <!-- Topic3 Group Level (Accordion) -->
              <div v-for="topic3Group in filteredTopic3List" :key="`t3group-${topic3Group.id}`" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <!-- Accordion Header -->
                <button @click="toggleAccordion(`topic3-group-${topic3Group.id}`)" 
                  class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <h2 class="text-base font-bold text-black dark:text-white">
                    {{ topic3Group.title }}
                  </h2>
                  <Icon :name="expandedAccordions.has(`topic3-group-${topic3Group.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                    class="w-5 h-5 text-black dark:text-white" />
                </button>

                <!-- Accordion Content -->
                <div v-if="expandedAccordions.has(`topic3-group-${topic3Group.id}`)" class="p-3 space-y-3">

                <!-- Topic3 Topic Level -->
                <div v-for="topic in topic3Group.topics" :key="`t3topic-${topic.id}`" class="space-y-2 ml-2">
                  <h3 class="text-base font-semibold text-black dark:text-white">
                    {{ topic.title }}
                  </h3>

                  <!-- Recursive Chapter Component -->
                  <div class="ml-2">
                    <template v-for="chapter in topic.chapters" :key="`t3ch-${chapter.id}`">
                      <div class="space-y-1">
                        <div class="flex items-start gap-2 py-1">
                          <input type="checkbox" :id="`topic3-chapter-${chapter.id}`"
                            :checked="selectedTopic3ChapterIds.includes(chapter.id)"
                            @change="toggleTopic3ChapterSelection(chapter.id, chapter)"
                            class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <label :for="`topic3-chapter-${chapter.id}`"
                            class="text-base text-black dark:text-white cursor-pointer flex-1">
                            {{ chapter.title }}
                          </label>
                        </div>

                        <!-- Recursive Children -->
                        <div v-if="chapter.children && chapter.children.length > 0" class="ml-6">
                          <template v-for="child in chapter.children" :key="`t3chd-${child.id}`">
                            <div class="space-y-1">
                              <div class="flex items-start gap-2 py-1">
                                <input type="checkbox" :id="`topic3-child-${child.id}`"
                                  :checked="selectedTopic3ChapterIds.includes(child.id)"
                                  @change="toggleTopic3ChapterSelection(child.id, child)"
                                  class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <label :for="`topic3-child-${child.id}`"
                                  class="text-base text-black dark:text-white cursor-pointer flex-1">
                                  {{ child.title }}
                                </label>
                              </div>

                              <!-- Third Level Children -->
                              <div v-if="child.children && child.children.length > 0" class="ml-6">
                                <div v-for="grandchild in child.children" :key="`t3gch-${grandchild.id}`"
                                  class="flex items-start gap-2 py-1">
                                  <input type="checkbox" :id="`topic3-grandchild-${grandchild.id}`"
                                    :checked="selectedTopic3ChapterIds.includes(grandchild.id)"
                                    @change="toggleTopic3ChapterSelection(grandchild.id, grandchild)"
                                    class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                  <label :for="`topic3-grandchild-${grandchild.id}`"
                                    class="text-base text-black dark:text-white cursor-pointer flex-1">
                                    {{ grandchild.title }}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                </div>
              </div>

              <div v-if="filteredTopic3List.length === 0 && !isLoadingTopic3List" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data kumpulan tanya jawab' }}
                </p>
              </div>

              <!-- Loading More Indicator for Topic3 -->
              <div v-if="isLoadingTopic3List && topic3List.length > 0" class="flex justify-center py-4">
                <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
              </div>

              <!-- Initial Loading for Topic3 -->
              <div v-if="topic3List.length === 0 && isLoadingTopic3List" class="flex justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
