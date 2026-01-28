<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div
      class="px-4 pt-6 pb-4 shadow-md bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shrink-0">
      <h1 class="text-black dark:text-white mb-2 font-semibold">
        Apa yang ingin kamu pelajari?
      </h1>
      <div class="flex items-center bg-white dark:bg-gray-700 rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-black dark:text-gray-300 mr-2" />
        <input v-model="searchKeyword" type="text" placeholder="Keyword"
          class="flex-1 bg-transparent outline-none text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          @keyup.enter="handleSearch" />
      </div>
    </div>

    <!-- TAB BAR -->
    <div class="bg-white dark:bg-gray-800 shadow-md shrink-0">
      <div ref="tabContainer" class="flex overflow-x-auto scrollbar-hide relative">
        <button v-for="(tab, index) in tabs" :key="tab.id" :ref="el => (tabRefs[index] = el as HTMLElement)"
          @click="selectTab(tab.id, index)"
          class="px-4 py-3 whitespace-nowrap text-lg font-medium transition-colors relative shrink-0"
          :class="activeTab === tab.id ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'">
          {{ tab.label }}
          <span v-if="activeTab === tab.id"
            class="absolute bottom-0 left-4 right-4 h-0.5 bg-black dark:bg-white rounded-full" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <TabsTabTerbaru v-if="activeTab === 'terbaru'" />
      <TabsTabParitta v-else-if="activeTab === 'paritta'" />
      <TabsTabUnduh v-else-if="activeTab === 'unduh'" />
      <TabsTabEdukasi v-else-if="activeTab === 'edukasi'" />
      <TabsTabTentang v-else-if="activeTab === 'tentang'" />
      <TabsTabContact v-else-if="activeTab === 'contact'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue"
import { useAuth } from '~/lib/auth'

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

const route = useRoute()
const router = useRouter()
const { isAuthenticated, getAuthHeader } = useAuth()

const activeTab = ref("terbaru")
const tabContainer = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLElement[]>([])
const searchKeyword = ref('')

// Search state from search page (to pre-fill)
const searchQuery = useState('search-query', () => '')
const hasSearched = useState('search-has-searched', () => false)

const tabs = [
  { id: "terbaru", label: "Terbaru" },
  { id: "paritta", label: "Paritta" },
  { id: "unduh", label: "Unduh" },
  { id: "edukasi", label: "Edukasi" },
  { id: "tentang", label: "Tentang" },
  { id: "contact", label: "Contact" },
]

const TARGET_VISIBLE_INDEX = 1
const GAP_OFFSET = 8

const HISTORY_RETENTION_KEY = 'history_retention_setting'

// Check for tab query parameter on mount
onMounted(async () => {
  const tabParam = route.query.tab as string
  if (tabParam) {
    const tabIndex = tabs.findIndex(t => t.id === tabParam)
    if (tabIndex !== -1) {
      selectTab(tabParam, tabIndex)
    }
  }

  // Handle history retention - delete old history based on setting
  if (isAuthenticated.value) {
    const retention = localStorage.getItem(HISTORY_RETENTION_KEY)
    // Default to 1 month if no setting saved
    const retentionValue = retention ? parseInt(retention, 10) : 1

    // 0 = forever (don't delete), other values = delete based on range
    if (retentionValue > 0) {
      // Fire and forget - don't block app loading
      $fetch(`https://api.masterluindonesia.com/api/history/${retentionValue}`, {
        method: 'DELETE',
        headers: getAuthHeader() as Record<string, string>
      }).catch(err => console.error('Failed to delete history:', err))
    }
  }
})

const selectTab = (tabId: string, index: number) => {
  activeTab.value = tabId
  nextTick(() => scrollTabToPreferredPosition(index))
}

const scrollTabToPreferredPosition = (index: number) => {
  const container = tabContainer.value
  const tab = tabRefs.value[index]

  if (!container || !tab) return

  const tabLeft = tab.offsetLeft
  const tabWidth = tab.offsetWidth
  const containerWidth = container.clientWidth
  const maxScrollLeft = container.scrollWidth - containerWidth

  const targetScrollLeft = tabLeft - tabWidth * TARGET_VISIBLE_INDEX - GAP_OFFSET
  const finalScrollLeft = Math.min(Math.max(0, targetScrollLeft), maxScrollLeft)

  container.scrollTo({
    left: finalScrollLeft,
    behavior: "smooth",
  })
}

function handleSearch() {
  if (!searchKeyword.value.trim()) return

  // Set the search state for the search page
  searchQuery.value = searchKeyword.value.trim()
  hasSearched.value = true

  // Reset results and page for fresh search
  const searchResults = useState<SearchItem[]>('search-results', () => [])
  const searchPage = useState('search-page', () => 1)
  searchResults.value = []
  searchPage.value = 1

  // Navigate to search page
  router.push('/search')
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
