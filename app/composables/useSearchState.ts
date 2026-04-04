import type { SearchItem, FilterPayload } from '~/types/search'

export const useSearchState = () => {
  // Persist search state across navigation using useState
  const searchQuery = useState('search-query', () => '')
  const searchedKeyword = useState('searched-keyword', () => '')
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

  // Local state
  const isLoading = ref(false)
  const expandedItems = ref<Set<string>>(new Set())
  const speakingItemId = ref<string | null>(null)
  const isSpeaking = ref(false)

  const config = useRuntimeConfig()
  const searchCache = useSearchCache()

  // Get current filters for cache key
  function getCurrentFilters() {
    return {
      year: filterPayload.value.year,
      selectedCategory: filterPayload.value.selectedCategory,
      selectedKeyword: filterPayload.value.selectedKeyword,
      listShowKeyword: filterPayload.value.listShowKeyword,
      listHideKeyword: filterPayload.value.listHideKeyword,
      chapter_ids: filterPayload.value.chapter_ids,
      audio_ids: filterPayload.value.audio_ids,
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

      const response = await $fetch<{
        success: boolean
        message: string
        data: SearchItem[]
      }>(`${config.public.apiBaseUrl}/search?page=${currentPage.value}`, {
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

  function handleSearch() {
    if (!searchQuery.value.trim()) return
    searchedKeyword.value = searchQuery.value.trim()
    currentPage.value = 1
    hasSearched.value = true
    fetchResults()
  }

  function loadMore() {
    currentPage.value++
    fetchResults()
  }

  function getItemKey(item: SearchItem): string {
    const itemType = item.type.toLowerCase()
    if (itemType === 'book' || itemType === 'buku') {
      return String(item.header_id)
    }
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

  function speakContent(item: SearchItem) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech synthesis not supported')
      return
    }

    const itemKey = getItemKey(item)

    if (isSpeaking.value && speakingItemId.value === itemKey) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
      speakingItemId.value = null
      return
    }

    window.speechSynthesis.cancel()

    const text = stripHtml(item.full_detail)
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

  return {
    searchQuery,
    searchedKeyword,
    currentPage,
    hasSearched,
    results,
    filterPayload,
    isLoading,
    expandedItems,
    speakingItemId,
    isSpeaking,
    fetchResults,
    handleSearch,
    loadMore,
    getItemKey,
    toggleExpand,
    stripHtml,
    copyFullDetail,
    speakContent,
    searchCache
  }
}
