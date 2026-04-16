<template>
  <div v-if="isPublicBookmarkMenuEnabled" class="mt-6 px-4">
    <!-- Header with "Lihat semua" -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-black dark:text-white">Bookmark Publik</h2>
      <NuxtLink to="/public-bookmarks" class="text-primary dark:text-yellow-400 font-medium">Lihat semua</NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loadingPublicBookmarks" class="flex justify-center py-8">
      <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
    </div>

    <!-- Public Bookmarks List -->
    <div v-else-if="publicBookmarks.length > 0" class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <div
        v-for="item in publicBookmarks"
        :key="item.id"
        @click="selectPublicBookmark(item.id)"
        :class="[
          'shrink-0 w-40 p-3 rounded-lg cursor-pointer transition-colors',
          selectedPublicBookmark === item.id
            ? 'bg-primary dark:bg-yellow-500 border-2 border-primary dark:border-yellow-500'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-yellow-500'
        ]"
      >
        <div class="flex items-start justify-between mb-2">
          <h3
            :class="[
              'text-lg font-medium line-clamp-2 flex-1',
              selectedPublicBookmark === item.id ? 'text-black' : 'text-black dark:text-white'
            ]"
          >
            {{ item.title }}
          </h3>
          <Icon
            v-if="item.is_pinned"
            name="mdi:pin"
            :class="[
              'w-4 h-4 shrink-0 ml-1',
              selectedPublicBookmark === item.id ? 'text-black' : 'text-primary dark:text-yellow-500'
            ]"
          />
        </div>
        <p
          :class="[
            'text-sm truncate',
            selectedPublicBookmark === item.id ? 'text-gray-700' : 'text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ item.name || item.user.name }}
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
      <Icon name="mdi:bookmark-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400">Belum ada bookmark publik</p>
    </div>

    <!-- Selected Public Bookmark Content -->
    <div v-if="selectedPublicBookmark && selectedBookmarks.length > 0" class="mt-4 space-y-1">
      <template v-for="item in selectedBookmarks" :key="item.id">
        <!-- Folder -->
        <div v-if="item.type === 0">
          <div
            class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="toggleFolder(item.id)"
          >
            <div class="flex items-center gap-3">
              <Icon name="mdi:folder-outline" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
              <span class="font-medium text-lg text-black dark:text-white">{{ item.title }}</span>
            </div>
            <Icon
              :name="expandedFolders.has(item.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="w-5 h-5 text-gray-400 dark:text-gray-500"
            />
          </div>
          <!-- Folder Children -->
          <div v-if="expandedFolders.has(item.id) && item.child?.length" class="ml-6 space-y-1">
            <div
              v-for="child in item.child"
              :key="child.id"
              class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="navigateToItem(child)"
            >
              <Icon :name="getIcon(child.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
              <span class="text-lg text-black dark:text-white">{{ child.title }}</span>
            </div>
          </div>
        </div>

        <!-- Regular Item -->
        <div
          v-else
          class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
          @click="navigateToItem(item)"
        >
          <Icon :name="getIcon(item.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
          <span class="text-lg text-black dark:text-white">{{ item.title }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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
  type: number
  link: string | null
  child?: BookmarkItem[]
}

interface PublicBookmarkItem {
  id: number
  name: string | null
  title: string
  is_pinned: boolean
  user: {
    id: number
    name: string
  }
  bookmarks: BookmarkItem[]
}

interface PublicBookmarkResponse {
  success: boolean
  data: PublicBookmarkItem[]
}

// Props
const props = defineProps<{
  menuSettings?: any[]
}>()

const config = useRuntimeConfig()
const router = useRouter()

const publicBookmarks = ref<PublicBookmarkItem[]>([])
const loadingPublicBookmarks = ref(false)
const selectedPublicBookmark = ref<number | null>(null)
const expandedFolders = ref<Set<number>>(new Set())

// Check if public bookmark menu is enabled
const isPublicBookmarkMenuEnabled = computed(() => {
  const publicBookmarkMenu = props.menuSettings?.find(m => m.code === 'public_bookmark')
  return publicBookmarkMenu?.status === true
})

// Get selected bookmarks
const selectedBookmarks = computed(() => {
  if (!selectedPublicBookmark.value) return []
  const publicBookmark = publicBookmarks.value.find(pb => pb.id === selectedPublicBookmark.value)
  return publicBookmark?.bookmarks || []
})

// Fetch public bookmarks
async function fetchPublicBookmarks() {
  loadingPublicBookmarks.value = true
  try {
    const response = await $fetch<PublicBookmarkResponse>(
      `${config.public.apiBaseUrl}/public-bookmarks`
    )
    if (response.success) {
      publicBookmarks.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch public bookmarks:', error)
  } finally {
    loadingPublicBookmarks.value = false
  }
}

function selectPublicBookmark(publicBookmarkId: number) {
  if (selectedPublicBookmark.value === publicBookmarkId) {
    // Unselect
    selectedPublicBookmark.value = null
    expandedFolders.value.clear()
  } else {
    // Select
    selectedPublicBookmark.value = publicBookmarkId
    expandedFolders.value.clear()
  }
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
          router.push({ path: `/video/play/${videoCategoryId}`, query: { title: item.title } })
        } else if (videoId) {
          router.push({ path: `/video/play/sub/${videoId}`, query: { title: item.title } })
        }
        break
      case 2: // Audio
        const audioId = linkData.audioId
        if (audioId) {
          router.push({
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
            router.push({
              path: `/book/${chapterId}`,
              query: linkData.page ? { page: linkData.page } : undefined
            })
          } else {
            router.push(`/books/${bookId}`)
          }
        }
        break
      case 4: // Topic1
        const topic1SubId = linkData.subId
        const topic1Title = linkData.title || item.title
        if (topic1SubId) {
          router.push({
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
          router.push({
            path: `/topics2/content/${topic2ContentId}`,
            query: linkData.page ? { page: linkData.page } : undefined
          })
        }
        break
      case 6: // Topic3
        const topic3ContentId = linkData.contentId
        if (topic3ContentId) {
          router.push({
            path: `/topics3/content/${topic3ContentId}`
          })
        }
        break
    }
  } catch (e) {
    console.error('Failed to parse bookmark link:', e)
  }
}

// Fetch on mount if enabled
watch(isPublicBookmarkMenuEnabled, (enabled) => {
  if (enabled) {
    fetchPublicBookmarks()
  }
}, { immediate: true })
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
