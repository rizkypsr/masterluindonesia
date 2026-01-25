<script setup lang="ts">
import { useAuth } from '~/lib/auth'

interface BookmarkLink {
  book_id?: number
  bookId?: number
  contentId?: number | null
  chapterId?: number | null
  page?: number | null
  videoId?: number
  video_category_id?: number | null
  lang?: string
  audioId?: number
  audio_category_id?: number | null
  subtitleId?: number | null
}

interface BookmarkItem {
  id: number
  title: string
  type: number // 0 = folder, 1 = video, 2 = audio, 3 = book
  link: string | null
  child?: BookmarkItem[]
}

interface BookmarkResponse {
  success: boolean
  message: string
  data: BookmarkItem[]
}

const { isAuthenticated, getAuthHeader } = useAuth()
const toast = useToast()

const bookmarks = ref<BookmarkItem[]>([])
const loading = ref(true)
const expandedFolders = ref<Set<number>>(new Set())

// Search state
const isSearchMode = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)

onMounted(async () => {
  if (!isAuthenticated.value) {
    toast.add({
      title: 'Anda harus login untuk mengakses halaman ini',
      color: 'error'
    })
    navigateTo('/lainnya')
    return
  }
  await fetchBookmarks()
})

async function fetchBookmarks(search?: string) {
  loading.value = true
  try {
    let url = 'https://api.masterluindonesia.com/api/bookmark'
    if (search) {
      url += `?search=${encodeURIComponent(search)}`
    }
    const response = await $fetch<BookmarkResponse>(url, {
      headers: getAuthHeader() as Record<string, string>
    })
    if (response.success) {
      bookmarks.value = response.data
    }
  } catch (error) {
    toast.add({
      title: 'Gagal memuat bookmark',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function openSearch() {
  isSearchMode.value = true
  searchQuery.value = ''
}

function closeSearch() {
  isSearchMode.value = false
  searchQuery.value = ''
  fetchBookmarks()
}

async function performSearch() {
  if (!searchQuery.value.trim()) {
    await fetchBookmarks()
    return
  }
  isSearching.value = true
  await fetchBookmarks(searchQuery.value.trim())
  isSearching.value = false
}

function toggleFolder(id: number) {
  if (expandedFolders.value.has(id)) {
    expandedFolders.value.delete(id)
  } else {
    expandedFolders.value.add(id)
  }
}

function getIcon(type: number): string {
  switch (type) {
    case 0: return 'mdi:folder-outline'
    case 1: return 'mdi:play-box-outline'
    case 2: return 'mdi:file-document-outline'
    case 3: return 'mdi:book-open-page-variant-outline'
    default: return 'mdi:bookmark-outline'
  }
}

function navigateToItem(item: BookmarkItem) {
  if (item.type === 0 || !item.link) return

  try {
    const linkData: BookmarkLink = JSON.parse(item.link)

    switch (item.type) {
      case 1: // Video
        const videoId = linkData.videoId
        const videoCategoryId = linkData.video_category_id
        if (videoCategoryId) {
          // Use video_category_id for navigation
          navigateTo({ path: `/video/play/${videoCategoryId}`, query: { title: item.title } })
        } else if (videoId) {
          // Fallback to videoId (sub video)
          navigateTo({ path: `/video/play/sub/${videoId}`, query: { title: item.title } })
        }
        break
      case 2: // Audio
        const audioId = linkData.audioId
        const audioCategoryId = linkData.audio_category_id
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
        const bookId = linkData.book_id || linkData.bookId
        const chapterId = linkData.contentId || linkData.chapterId
        if (bookId) {
          if (chapterId) {
            // Go to specific chapter with page
            navigateTo({
              path: `/book/${bookId}/${chapterId}`,
              query: linkData.page ? { page: linkData.page } : undefined
            })
          } else {
            // Go to book overview
            navigateTo({ path: `/books/${bookId}`, query: { title: item.title } })
          }
        }
        break
    }
  } catch (e) {
    console.error('Failed to parse bookmark link:', e)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header - Normal Mode -->
    <div v-if="!isSearchMode" class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">Bookmark</h1>
        </div>
        <div class="flex gap-2">
          <button @click="openSearch" class="p-1 flex justify-center items-center cursor-pointer">
            <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
          </button>
          <button @click="navigateTo('/bookmark-manager')" class="p-1 flex justify-center items-center cursor-pointer">
            <Icon name="mdi:square-edit-outline" class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Header - Search Mode -->
    <div v-else class="px-4 py-4 shadow-md bg-white dark:bg-gray-800">
      <div class="flex items-center gap-3">
        <button @click="closeSearch" class="p-1">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <input v-model="searchQuery" type="text" placeholder="Cari bookmark..."
          class="flex-1 bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none" @keyup.enter="performSearch"
          autofocus />
        <button v-if="searchQuery" @click="searchQuery = ''; performSearch()" class="p-1">
          <Icon name="mdi:close" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-[#bf9638] dark:text-yellow-400" />
      </div>

      <!-- Empty State -->
      <div v-else-if="bookmarks.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:bookmark-outline" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Belum ada bookmark</p>
      </div>

      <!-- Bookmark List -->
      <div v-else class="space-y-1">
        <template v-for="item in bookmarks" :key="item.id">
          <!-- Folder -->
          <div v-if="item.type === 0">
            <div
              class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="toggleFolder(item.id)">
              <div class="flex items-center gap-3">
                <Icon :name="getIcon(item.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
                <span class="font-medium text-lg text-black dark:text-white">{{ item.title }}</span>
              </div>
              <Icon :name="expandedFolders.has(item.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <!-- Folder Children -->
            <div v-if="expandedFolders.has(item.id) && item.child?.length" class="ml-6 space-y-1">
              <div v-for="child in item.child" :key="child.id"
                class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="navigateToItem(child)">
                <Icon :name="getIcon(child.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
                <span class="text-lg text-black dark:text-white">{{ child.title }}</span>
              </div>
            </div>
          </div>

          <!-- Regular Item -->
          <div v-else
            class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
            @click="navigateToItem(item)">
            <Icon :name="getIcon(item.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
            <span class="text-lg text-black dark:text-white">{{ item.title }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
