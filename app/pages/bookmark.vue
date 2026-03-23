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
  subId?: number
  title?: string
}

interface BookmarkItem {
  id: number
  title: string
  type: number // 0 = folder, 1 = video, 2 = audio, 3 = book, 4 = recipe/topic1, 5 = topic2, 6 = topic3
  link: string | null
  child?: BookmarkItem[]
}

interface BookmarkResponse {
  success: boolean
  message: string
  data: BookmarkItem[]
}

const { isAuthenticated, getAuthHeader } = useAuth()
const config = useRuntimeConfig()
const toast = useToast()

const bookmarks = ref<BookmarkItem[]>([])
const userBookmarks = ref<BookmarkItem[]>([]) // Store user's original bookmarks
const loading = ref(true)
const expandedFolders = ref<Set<number>>(new Set())

// Search state
const isSearchMode = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)

// Share state
const isShareModalOpen = ref(false)
const activeShareLink = ref<{
  shareToken: string
  sharePath: string
  apiUrl: string
  createdAt: string
  expiresAt: string | null
  isActive: boolean
  accessCount: number
} | null>(null)
const isCreatingShare = ref(false)
const isDeletingShare = ref(false)

// Computed share URL for display
const shareUrl = computed(() => {
  if (!activeShareLink.value) return ''
  return `${window.location.origin}${activeShareLink.value.sharePath}`
})

onMounted(async () => {
  if (!isAuthenticated.value) {
    toast.add({
      title: 'Anda harus login untuk mengakses halaman ini',
      color: 'error'
    })
    navigateTo('/lainnya')
    return
  }
  await Promise.all([
    fetchBookmarks(),
    fetchActiveShareLink()
  ])
})

async function fetchBookmarks(search?: string) {
  loading.value = true
  try {
    let url = `${config.public.apiBaseUrl}/bookmark`
    if (search) {
      url += `?search=${encodeURIComponent(search)}`
    }
    const response = await $fetch<BookmarkResponse>(url, {
      headers: getAuthHeader() as Record<string, string>
    })
    if (response.success) {
      bookmarks.value = response.data
      // Store user's original bookmarks if not in search mode
      if (!search) {
        userBookmarks.value = response.data
      }
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
    case 4: return 'mdi:book-alphabet'
    case 5: return 'mdi:text-box-outline'
    case 6: return 'mdi:comment-question-outline'
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
            // Go to specific chapter with page - using new simplified URL
            navigateTo({
              path: `/book/${chapterId}`,
              query: linkData.page ? { page: linkData.page } : undefined
            })
          } else {
            // Go to book overview
            navigateTo({ path: `/books/${bookId}`, query: { title: item.title } })
          }
        }
        break
      case 4: // Topic1
        const topic1SubId = linkData.subId
        const topic1Title = linkData.title || item.title
        if (topic1SubId) {
          navigateTo({
            path: '/topics/detail',
            query: {
              subId: topic1SubId,
              title: topic1Title
            }
          })
        }
        break
      case 5: // Topic2
        const topic2ContentId = linkData.contentId
        if (topic2ContentId) {
          navigateTo({
            path: `/topics2/content/${topic2ContentId}`,
            query: linkData.page ? { page: linkData.page } : undefined
          })
        }
        break
      case 6: // Topic3
        const topic3ContentId = linkData.contentId
        if (topic3ContentId) {
          navigateTo({
            path: `/topics3/content/${topic3ContentId}`
          })
        }
        break
    }
  } catch (e) {
    console.error('Failed to parse bookmark link:', e)
  }
}

// Fetch active share link
async function fetchActiveShareLink() {
  try {
    const response = await $fetch<{ success: boolean; data: any }>(`${config.public.apiBaseUrl}/bookmark/share`, {
      headers: getAuthHeader() as Record<string, string>
    })
    if (response.success && response.data) {
      activeShareLink.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch share link:', error)
  }
}

// Open share modal
function openShareModal() {
  isShareModalOpen.value = true
}

// Create share link
async function createShareLink(expiresInDays?: number) {
  isCreatingShare.value = true
  try {
    const body = expiresInDays ? { expiresInDays } : {}
    const response = await $fetch<{ success: boolean; message: string; data: any }>(
      `${config.public.apiBaseUrl}/bookmark/share`,
      {
        method: 'POST',
        headers: getAuthHeader() as Record<string, string>,
        body
      }
    )
    if (response.success) {
      activeShareLink.value = response.data
      toast.add({
        title: response.message,
        color: 'success'
      })
    }
  } catch (error: any) {
    toast.add({
      title: error.data?.message || 'Gagal membuat link share',
      color: 'error'
    })
  } finally {
    isCreatingShare.value = false
  }
}

// Copy share link to clipboard
async function copyShareLink() {
  if (!activeShareLink.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    toast.add({
      title: 'Link berhasil disalin',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Gagal menyalin link',
      color: 'error'
    })
  }
}

// Deactivate share link
async function deactivateShareLink() {
  isDeletingShare.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string }>(
      `${config.public.apiBaseUrl}/bookmark/share`,
      {
        method: 'DELETE',
        headers: getAuthHeader() as Record<string, string>
      }
    )
    if (response.success) {
      activeShareLink.value = null
      toast.add({
        title: response.message,
        color: 'success'
      })
    }
  } catch (error: any) {
    toast.add({
      title: error.data?.message || 'Gagal menonaktifkan link share',
      color: 'error'
    })
  } finally {
    isDeletingShare.value = false
  }
}
</script>

<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header - Normal Mode -->
    <div v-if="!isSearchMode" class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800 shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">Bookmark</h1>
        </div>
        <div class="flex gap-2">
          <button @click="openShareModal" class="p-1 flex justify-center items-center cursor-pointer">
            <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
          </button>
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
    <div v-else class="px-4 py-4 shadow-md bg-white dark:bg-gray-800 shrink-0">
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
    <div class="flex-1 overflow-y-auto px-4 py-4">
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

    <!-- Share Modal -->
    <UModal v-model:open="isShareModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Bagikan Bookmark</h3>

          <!-- Active Share Link -->
          <div v-if="activeShareLink" class="mb-6">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Link Aktif</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ activeShareLink.accessCount }} kali diakses
                </span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <input :value="shareUrl" readonly
                  class="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-black dark:text-white" />
                <UButton size="sm" @click="copyShareLink">
                  <Icon name="mdi:content-copy" class="w-4 h-4" />
                </UButton>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <div>Dibuat: {{ new Date(activeShareLink.createdAt).toLocaleDateString('id-ID') }}</div>
                <div v-if="activeShareLink.expiresAt">
                  Kadaluarsa: {{ new Date(activeShareLink.expiresAt).toLocaleDateString('id-ID') }}
                </div>
                <div v-else>Tidak ada batas waktu</div>
              </div>
            </div>
            <UButton variant="outline" color="error" block :loading="isDeletingShare" @click="deactivateShareLink">
              Nonaktifkan Link
            </UButton>
          </div>

          <!-- Create Share Link -->
          <div v-else>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Buat link untuk membagikan semua bookmark Anda dengan orang lain
            </p>
            <UButton block class="bg-primary hover:bg-primary/90 text-black" :loading="isCreatingShare"
              @click="createShareLink()">
              Buat Link Berbagi
            </UButton>
          </div>

          <div class="flex justify-end mt-6">
            <UButton variant="outline" @click="isShareModalOpen = false">
              Tutup
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
