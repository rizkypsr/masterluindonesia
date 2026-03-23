<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800 shrink-0">
      <div class="flex items-center gap-3">
        <BackButton />
        <h1 class="text-lg font-semibold text-black dark:text-white">Bookmark Publik</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 py-4">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
      </div>

      <!-- Empty State -->
      <div v-else-if="publicBookmarks.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:bookmark-outline" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Belum ada bookmark publik</p>
      </div>

      <!-- Public Bookmarks List -->
      <div v-else class="space-y-4">
        <div
          v-for="publicBookmark in publicBookmarks"
          :key="publicBookmark.id"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Public Bookmark Header -->
          <div
            @click="togglePublicBookmark(publicBookmark.id)"
            class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-lg text-black dark:text-white truncate">
                  {{ publicBookmark.title }}
                </h3>
                <Icon
                  v-if="publicBookmark.is_pinned"
                  name="mdi:pin"
                  class="w-4 h-4 shrink-0 text-primary dark:text-yellow-500"
                />
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ publicBookmark.name || publicBookmark.user.name }}
              </p>
            </div>
            <Icon
              :name="expandedPublicBookmarks.has(publicBookmark.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="w-6 h-6 text-gray-400 dark:text-gray-500 shrink-0 ml-3"
            />
          </div>

          <!-- Bookmarks Content -->
          <div v-if="expandedPublicBookmarks.has(publicBookmark.id)" class="border-t border-gray-200 dark:border-gray-700">
            <div class="p-2 space-y-1">
              <template v-for="item in publicBookmark.bookmarks" :key="item.id">
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
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="navigateToItem(item)"
                >
                  <Icon :name="getIcon(item.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
                  <span class="text-lg text-black dark:text-white">{{ item.title }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const config = useRuntimeConfig()
const router = useRouter()

const publicBookmarks = ref<PublicBookmarkItem[]>([])
const loading = ref(true)
const expandedPublicBookmarks = ref<Set<number>>(new Set())
const expandedFolders = ref<Set<number>>(new Set())

onMounted(async () => {
  await fetchPublicBookmarks()
})

async function fetchPublicBookmarks() {
  loading.value = true
  try {
    const response = await $fetch<PublicBookmarkResponse>(
      `${config.public.apiBaseUrl}/public-bookmarks?all=true`
    )
    if (response.success) {
      publicBookmarks.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch public bookmarks:', error)
  } finally {
    loading.value = false
  }
}

function togglePublicBookmark(id: number) {
  if (expandedPublicBookmarks.value.has(id)) {
    expandedPublicBookmarks.value.delete(id)
  } else {
    expandedPublicBookmarks.value.add(id)
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
            router.push({ path: `/books/${bookId}`, query: { title: item.title } })
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
</script>
