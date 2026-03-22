<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const toast = useToast()

const token = computed(() => route.params.token as string)

interface BookmarkItem {
  id: number
  title: string
  type: number
  link: string | null
  child?: BookmarkItem[]
}

const bookmarks = ref<BookmarkItem[]>([])
const loading = ref(true)
const expandedFolders = ref<Set<number>>(new Set())
const error = ref('')

onMounted(async () => {
  await fetchSharedBookmarks()
})

async function fetchSharedBookmarks() {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ success: boolean; message: string; data: BookmarkItem[] }>(
      `${config.public.apiBaseUrl}/bookmark/shared/${token.value}`
    )
    if (response.success) {
      bookmarks.value = response.data
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Link tidak ditemukan atau sudah kadaluarsa'
    toast.add({
      title: error.value,
      color: 'error'
    })
  } finally {
    loading.value = false
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
    const linkData = JSON.parse(item.link)

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
        const chapterId = linkData.contentId || linkData.chapterId
        if (chapterId) {
          navigateTo({
            path: `/book/${chapterId}`,
            query: linkData.page ? { page: linkData.page } : undefined
          })
        }
        break
      case 4: // Topic1
        const topic1SubId = linkData.subId
        if (topic1SubId) {
          navigateTo({
            path: '/topics/detail',
            query: {
              subId: topic1SubId,
              title: linkData.title || item.title
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
</script>

<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800 shrink-0">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold text-black dark:text-white">Bookmark Dibagikan</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 py-4">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-[#bf9638] dark:text-yellow-400" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:alert-circle-outline" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookmarks.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:bookmark-outline" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Tidak ada bookmark</p>
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
