<script setup lang="ts">
import { useAuth } from '~/lib/auth'

interface BookmarkLink {
  book_id?: number
  contentId?: number | null
  page?: number | null
  videoId?: number
  video_category_id?: number | null
  lang?: string
  audioId?: number
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

async function fetchBookmarks() {
  loading.value = true
  try {
    const response = await $fetch<BookmarkResponse>('https://api.masterluindonesia.com/api/bookmark', {
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
        if (linkData.videoId) {
          // video with lang CN uses sub route (subtitle version)
          if (linkData.lang === 'CN') {
            navigateTo({ path: `/video/play/sub/${linkData.videoId}`, query: { title: item.title } })
          } else if (linkData.video_category_id) {
            navigateTo({ path: `/video/play/${linkData.video_category_id}`, query: { title: item.title } })
          } else {
            navigateTo({ path: `/video/play/sub/${linkData.videoId}`, query: { title: item.title } })
          }
        }
        break
      case 2: // Audio
        if (linkData.audioId) {
          navigateTo({ 
            path: '/audio/detail', 
            query: { 
              audio_id: linkData.audioId, 
              subtitle_id: linkData.subtitleId || undefined,
              title: item.title 
            } 
          })
        }
        break
      case 3: // Book
        if (linkData.book_id) {
          if (linkData.contentId) {
            // Go to specific chapter with page
            navigateTo({ 
              path: `/book/${linkData.book_id}/${linkData.contentId}`,
              query: linkData.page ? { page: linkData.page } : undefined
            })
          } else {
            // Go to book overview
            navigateTo({ path: `/books/${linkData.book_id}`, query: { title: item.title } })
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
  <div>
    <!-- Header -->
    <div class="px-4 py-5 shadow-md" style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);">
      <div class="flex items-center gap-3">
        <NuxtLink to="/lainnya">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
        </NuxtLink>
        <h1 class="text-black">Bookmark</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-amber-500" />
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
              @click="toggleFolder(item.id)"
            >
              <div class="flex items-center gap-3">
                <Icon :name="getIcon(item.type)" class="w-6 h-6 text-amber-500" />
                <span class="font-medium">{{ item.title }}</span>
              </div>
              <Icon 
                :name="expandedFolders.has(item.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                class="w-5 h-5 text-gray-400"
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
                <Icon :name="getIcon(child.type)" class="w-6 h-6 text-amber-500" />
                <span>{{ child.title }}</span>
              </div>
            </div>
          </div>

          <!-- Regular Item -->
          <div 
            v-else
            class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
            @click="navigateToItem(item)"
          >
            <Icon :name="getIcon(item.type)" class="w-6 h-6 text-amber-500" />
            <span>{{ item.title }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
