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
const expandedItems = ref<Set<string>>(new Set())
const hideKeywordInput = ref('')
const showKeywordInput = ref('')

const categoryOptions = ['Buku', 'Audio', 'Video', 'Resep']
const radioOptions = ['Wenda', 'Zhishuo', 'Zongshu', 'Shuhua']
const videoOptions = ['Totem', 'Ceramah', 'Tanya Jawab', 'Kisah Buddhis']
const yearOptions = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008]

const isLoading = ref(false)

// Auto-search on mount if coming from index page with keyword
onMounted(() => {
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
    listHideKeyword: filterPayload.value.listHideKeyword
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

    const response = await $fetch<ApiResponse>(`https://api.masterluindonesia.com/api/search?page=${currentPage.value}`, {
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

function toggleCategory(category: string) {
  const idx = filterPayload.value.selectedCategory.indexOf(category)
  if (idx > -1) {
    filterPayload.value.selectedCategory.splice(idx, 1)
  } else {
    filterPayload.value.selectedCategory.push(category)
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

function toggleKeyword(keyword: string) {
  const idx = filterPayload.value.selectedKeyword.indexOf(keyword)
  if (idx > -1) {
    filterPayload.value.selectedKeyword.splice(idx, 1)
  } else {
    filterPayload.value.selectedKeyword.push(keyword)
  }
}

function applyFilter() {
  isFilterOpen.value = false
  currentPage.value = 1
  fetchResults()
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
    const [bookId, chapterId, page] = parts
    router.push({
      path: `/book/${bookId}/${chapterId}`,
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
  } else if (itemType === 'resep' || itemType === 'recipe') {
    router.push(`/recipes/${item.id}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-lg font-semibold text-black dark:text-white">Pencarian</h1>
    </div>

    <!-- Initial Search View (when no search performed) -->
    <div v-if="!hasSearched" class="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
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
    <div v-else>
      <div class="px-4 py-4">
        <!-- Filter Button -->
        <div class="mb-2">
          <UButton size="lg" class="bg-primary hover:bg-primary/90 text-black rounded-full font-bold"
            @click="isFilterOpen = true">
            Filter
            <Icon name="mdi:tune-variant" class="w-4 h-4 ml-1" />
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
            <div v-if="expandedItems.has(getItemKey(item))"
              class="m-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <p class="text-black dark:text-white leading-relaxed whitespace-pre-wrap">
                {{ stripHtml(item.full_detail) }}
              </p>
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
              <button v-for="cat in categoryOptions" :key="cat"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" :class="filterPayload.selectedCategory.includes(cat)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleCategory(cat)">
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Acara Program Radio -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3">Acara Program Radio</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="radio in radioOptions" :key="radio"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" :class="filterPayload.selectedKeyword.includes(radio)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleKeyword(radio)">
                {{ radio }}
              </button>
            </div>
          </div>

          <!-- Video -->
          <div>
            <h3 class="font-semibold text-black dark:text-white mb-3">Video</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="video in videoOptions" :key="video"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors" :class="filterPayload.selectedKeyword.includes(video)
                  ? 'bg-primary border-primary text-black dark:bg-yellow-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white'"
                @click="toggleKeyword(video)">
                {{ video }}
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

          <!-- Tahun -->
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
  </div>
</template>
