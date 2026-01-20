<script setup lang="ts">
const router = useRouter()

interface SearchItem {
  id: number
  header_id: string
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

const searchQuery = ref('')
const currentPage = ref(1)
const isFilterOpen = ref(false)
const hasSearched = ref(false)
const expandedItems = ref<Set<number>>(new Set())

// Filter state
const filterPayload = ref<FilterPayload>({
  keyword: '',
  year: [],
  selectedCategory: [],
  selectedKeyword: [],
  listShowKeyword: [],
  listHideKeyword: []
})

const hideKeywordInput = ref('')
const showKeywordInput = ref('')

const categoryOptions = ['Buku', 'Audio', 'Video', 'Resep']
const radioOptions = ['Wenda', 'Zhishuo', 'Zongshu', 'Shuhua']
const videoOptions = ['Totem', 'Ceramah', 'Tanya Jawab', 'Kisah Buddhis']
const yearOptions = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008]

const results = ref<SearchItem[]>([])
const isLoading = ref(false)

async function fetchResults() {
  isLoading.value = true
  try {
    const body: FilterPayload = {
      ...filterPayload.value,
      keyword: searchQuery.value
    }

    const response = await $fetch<ApiResponse>(`https://api.masterluindonesia.com/api/search?page=${currentPage.value}`, {
      method: 'POST',
      body
    })
    if (currentPage.value === 1) {
      results.value = response.data || []
    } else {
      results.value = [...results.value, ...(response.data || [])]
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
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function toggleExpand(id: number) {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
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
  // header_id format: "bookId#chapterId#contentType"
  const [bookId, chapterId] = item.header_id.split('#')
  
  if (item.type === 'book') {
    router.push(`/book/${bookId}/${chapterId}`)
  } else if (item.type === 'audio') {
    router.push(`/audio/${item.id}`)
  } else if (item.type === 'video') {
    router.push(`/video/${item.id}`)
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200">
      <h1 class="text-lg font-semibold text-black">Pencarian</h1>
    </div>

    <!-- Initial Search View (when no search performed) -->
    <div v-if="!hasSearched" class="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      <div class="flex-1 px-6 pt-4">
        <UInput v-model="searchQuery" placeholder="Masukan kata kunci" size="xl" class="w-full"
          @keyup.enter="handleSearch" />
      </div>

      <div class="px-6 pb-24">
        <UButton block size="xl" variant="solid"
          :class="searchQuery.trim() ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400'" :disabled="!searchQuery.trim()"
          @click="handleSearch">
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
        <p class="text-sm text-gray-400 mb-4 uppercase tracking-wide">
          MENAMPILKAN "{{ searchQuery }}"
        </p>

        <!-- Loading (only show when no results yet) -->
        <div v-if="isLoading && results.length === 0" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
        </div>

        <!-- Results List -->
        <div v-else class="space-y-4">
          <div v-for="item in results" :key="item.id" class="rounded-xl overflow-hidden"
            :class="expandedItems.has(item.id) ? 'bg-[#c09637]' : 'bg-white'">
            <!-- Card Header -->
            <div class="p-4 cursor-pointer" :class="expandedItems.has(item.id) ? 'bg-[#c09637]' : 'bg-white'"
              @click="toggleExpand(item.id)">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-bold text-black dark:text-white">{{ item.title }}</h3>
                  <p class="text-black mt-1">{{ item.detail }}</p>
                </div>
                <button @click.stop="navigateToDetail(item)" class="p-2">
                  <Icon name="mdi:arrow-right" class="w-6 h-6 text-primary shrink-0" />
                </button>
              </div>
            </div>

            <!-- Expandable Content (Kesaksian) -->
            <div v-if="expandedItems.has(item.id)" class="m-4 p-4 bg-white rounded-lg">
              <p class="text-black text-sm leading-relaxed whitespace-pre-line">
                {{ stripHtml(item.full_detail) }}
              </p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="results.length === 0" class="text-center py-8">
            <p class="text-gray-500">Tidak ada hasil ditemukan</p>
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
        <div class="p-4 space-y-6 overflow-y-auto max-h-[80vh]">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-black">Filter Pencarian</h2>
            <button class="text-gray-500 text-sm" @click="resetFilter">Reset Filter</button>
          </div>

          <!-- Kategori -->
          <div>
            <h3 class="font-semibold text-black mb-3">Kategori</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categoryOptions"
                :key="cat"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors"
                :class="filterPayload.selectedCategory.includes(cat) 
                  ? 'bg-primary border-primary text-black' 
                  : 'bg-white border-gray-300 text-black'"
                @click="toggleCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Acara Program Radio -->
          <div>
            <h3 class="font-semibold text-black mb-3">Acara Program Radio</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="radio in radioOptions"
                :key="radio"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors"
                :class="filterPayload.selectedKeyword.includes(radio) 
                  ? 'bg-primary border-primary text-black' 
                  : 'bg-white border-gray-300 text-black'"
                @click="toggleKeyword(radio)"
              >
                {{ radio }}
              </button>
            </div>
          </div>

          <!-- Video -->
          <div>
            <h3 class="font-semibold text-black mb-3">Video</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="video in videoOptions"
                :key="video"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors"
                :class="filterPayload.selectedKeyword.includes(video) 
                  ? 'bg-primary border-primary text-black' 
                  : 'bg-white border-gray-300 text-black'"
                @click="toggleKeyword(video)"
              >
                {{ video }}
              </button>
            </div>
          </div>

          <!-- Sembunyikan kata kunci -->
          <div>
            <h3 class="font-semibold text-black mb-3">Sembunyikan kata kunci</h3>
            <UInput v-model="hideKeywordInput" placeholder="Masukan kata kunci" size="md" />
          </div>

          <!-- Tambahkan kata kunci -->
          <div>
            <h3 class="font-semibold text-black mb-3">Tambahkan kata kunci</h3>
            <UInput v-model="showKeywordInput" placeholder="Masukan kata kunci" size="md" />
          </div>

          <!-- Tahun -->
          <div>
            <h3 class="font-semibold text-black mb-3">Tahun</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="year in yearOptions"
                :key="year"
                class="px-4 py-1.5 rounded-full text-sm border transition-colors"
                :class="filterPayload.year.includes(year) 
                  ? 'bg-primary border-primary text-black' 
                  : 'bg-white border-gray-300 text-black'"
                @click="toggleYear(year)"
              >
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
