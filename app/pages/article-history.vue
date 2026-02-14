<script setup lang="ts">
import { useAuth } from '~/lib/auth'

interface HistoryLink {
  book_id?: number
  contentId?: number | null
  page?: number | null
  videoId?: number | null
  video_category_id?: number | null
  lang?: string
  audioId?: number
  subtitleId?: number | null
}

interface HistoryItem {
  id: number
  pengguna_id: number
  title: string
  data: string
  type: number // 1 = video, 2 = audio, 3 = book
  created_at: string
}

interface HistoryResponse {
  success: boolean
  message: string
  data: HistoryItem[]
}

const { isAuthenticated, getAuthHeader } = useAuth()
const config = useRuntimeConfig()
const toast = useToast()

const historyItems = ref<HistoryItem[]>([])
const loading = ref(true)
const currentPage = ref(1)
const hasMore = ref(true)
const loadingMore = ref(false)

// Search state
const isSearchMode = ref(false)
const searchQuery = ref('')

// Settings modal
const isSettingsOpen = ref(false)
const retentionOptions = [
  { label: '1 Bulan', value: 1 },
  { label: '3 Bulan', value: 3 },
  { label: '6 Bulan', value: 6 },
  { label: '1 Tahun', value: 12 },
  { label: 'Selamanya (tidak pernah di hapus)', value: 0 },
  { label: 'Hapus semua saat buka aplikasi', value: 100 }
]
const selectedRetention = ref<number>(1)

const STORAGE_KEY = 'history_retention_setting'

onMounted(async () => {
  if (!isAuthenticated.value) {
    toast.add({
      title: 'Anda harus login untuk mengakses halaman ini',
      color: 'error'
    })
    navigateTo('/lainnya')
    return
  }
  
  // Load saved retention setting
  const savedRetention = localStorage.getItem(STORAGE_KEY)
  if (savedRetention) {
    selectedRetention.value = parseInt(savedRetention, 10)
  }
  
  // If "Hapus semua saat buka aplikasi" is selected, delete all history first
  if (selectedRetention.value === 100) {
    await deleteHistory(100)
  }
  
  await fetchHistory()
})

async function fetchHistory(page = 1, search?: string) {
  if (page === 1) {
    loading.value = true
  } else {
    loadingMore.value = true
  }
  
  try {
    let url = `${config.public.apiBaseUrl}/history?page=${page}`
    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }
    const response = await $fetch<HistoryResponse>(url, {
      headers: getAuthHeader() as Record<string, string>
    })
    if (response.success) {
      if (page === 1) {
        historyItems.value = response.data
      } else {
        historyItems.value.push(...response.data)
      }
      hasMore.value = response.data.length >= 20
      currentPage.value = page
    }
  } catch (error) {
    toast.add({
      title: 'Gagal memuat riwayat',
      color: 'error'
    })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function deleteHistory(range: number) {
  try {
    await $fetch(`${config.public.apiBaseUrl}/history/${range}`, {
      method: 'DELETE',
      headers: getAuthHeader() as Record<string, string>
    })
  } catch (error) {
    console.error('Failed to delete history:', error)
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  await fetchHistory(currentPage.value + 1, searchQuery.value || undefined)
}

function openSearch() {
  isSearchMode.value = true
  searchQuery.value = ''
}

function closeSearch() {
  isSearchMode.value = false
  searchQuery.value = ''
  currentPage.value = 1
  fetchHistory()
}

async function performSearch() {
  currentPage.value = 1
  await fetchHistory(1, searchQuery.value.trim() || undefined)
}

function getIcon(type: number): string {
  switch (type) {
    case 1: return 'mdi:play-box-outline'
    case 2: return 'mdi:file-document-outline'
    case 3: return 'mdi:book-open-page-variant-outline'
    default: return 'mdi:history'
  }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`
  return `${Math.floor(diffDays / 30)} bulan yang lalu`
}

function navigateToItem(item: HistoryItem) {
  try {
    const linkData: HistoryLink = JSON.parse(item.data)

    switch (item.type) {
      case 1: // Video
        const videoCategoryId = linkData.video_category_id
        const videoId = linkData.videoId
        if (videoCategoryId) {
          navigateTo({ path: `/video/play/${videoCategoryId}`, query: { title: item.title } })
        } else if (videoId) {
          navigateTo({ path: `/video/play/sub/${videoId}`, query: { title: item.title } })
        }
        break
      case 2: // Audio
        const audioId = linkData.audioId
        if (audioId) {
          navigateTo({
            path: '/audio/detail',
            query: {
              audio_id: audioId,
              subtitle_id: linkData.subtitleId || undefined,
              title: item.title
            }
          })
        }
        break
      case 3: // Book
        const bookId = linkData.book_id
        const contentId = linkData.contentId
        if (bookId) {
          if (contentId) {
            navigateTo({
              path: `/book/${bookId}/${contentId}`,
              query: linkData.page ? { page: linkData.page } : undefined
            })
          } else {
            navigateTo({ path: `/books/${bookId}`, query: { title: item.title } })
          }
        }
        break
    }
  } catch (e) {
    console.error('Failed to parse history link:', e)
  }
}

function selectRetention(value: number) {
  selectedRetention.value = value
  localStorage.setItem(STORAGE_KEY, value.toString())
  isSettingsOpen.value = false
  
  toast.add({
    title: 'Pengaturan disimpan',
    color: 'success'
  })
}
</script>

<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header - Normal Mode -->
    <div v-if="!isSearchMode" class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800 shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">Riwayat Artikel</h1>
        </div>
        <div class="flex gap-2">
          <button @click="openSearch" class="p-1 flex justify-center items-center cursor-pointer">
            <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
          </button>
          <button @click="isSettingsOpen = true" class="p-1 flex justify-center items-center cursor-pointer">
            <Icon name="mdi:cog-outline" class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Header - Search Mode -->
    <div v-else class="px-4 py-4 shadow-md bg-white dark:bg-gray-800 shrink-0">
      <div class="flex items-center gap-3">
        <button @click="closeSearch" class="p-1">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <input v-model="searchQuery" type="text" placeholder="Cari riwayat..."
          class="flex-1 bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          @keyup.enter="performSearch" autofocus />
        <button v-if="searchQuery" @click="searchQuery = ''; performSearch()" class="p-1">
          <Icon name="mdi:close" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 py-4">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-[#bf9638] dark:text-yellow-400" />
      </div>

      <!-- Empty State -->
      <div v-else-if="historyItems.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:history" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Belum ada riwayat artikel</p>
      </div>

      <!-- History List -->
      <div v-else class="space-y-1">
        <div v-for="item in historyItems" :key="item.id"
          class="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
          @click="navigateToItem(item)">
          <Icon :name="getIcon(item.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p class="text-black dark:text-white leading-snug">{{ item.title }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ formatTimeAgo(item.created_at) }}</p>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="flex justify-center py-4">
          <button @click="loadMore" :disabled="loadingMore"
            class="px-4 py-2 text-[#bf9638] dark:text-yellow-400 font-medium">
            <Icon v-if="loadingMore" name="mdi:loading" class="w-5 h-5 animate-spin" />
            <span v-else>Muat lebih banyak</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <UModal v-model:open="isSettingsOpen">
      <template #content>
        <div class="bg-white dark:bg-gray-800 rounded-t-2xl">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-black dark:text-white">Waktu simpan riwayat</h3>
          </div>
          <div class="py-2">
            <button v-for="option in retentionOptions" :key="option.value" @click="selectRetention(option.value)"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-700">
              <span class="text-black dark:text-white">{{ option.label }}</span>
              <Icon v-if="selectedRetention === option.value" name="mdi:check" class="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
