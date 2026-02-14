<template>
  <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <BackButton />
      <span class="text-lg font-semibold text-black dark:text-white">Playlist Detail</span>
      <button 
        v-if="isOwner"
        @click="deletePlaylist"
        class="p-2 text-red-500"
      >
        <Icon name="mdi:delete" class="w-6 h-6" />
      </button>
      <div v-else class="w-10"></div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <template v-if="isLoading">
        <div class="px-4 py-6">
          <USkeleton class="h-8 w-3/4 mb-2" />
          <USkeleton class="h-4 w-1/2 mb-6" />
          <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-3">
            <USkeleton class="h-5 w-full mb-2" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </div>
      </template>

      <template v-else-if="playlist">
        <!-- Playlist Info -->
        <div class="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-black dark:text-white mb-2">{{ playlist.title }}</h1>
          <p v-if="playlist.description" class="text-gray-600 dark:text-gray-400 mb-3">
            {{ playlist.description }}
          </p>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Icon name="mdi:playlist-music" class="w-5 h-5" />
            <span>{{ playlist.items.length }} item{{ playlist.items.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <!-- Playlist Items -->
        <div class="px-4 py-6">
          <template v-if="playlist.items.length > 0">
            <div 
              v-for="(item, index) in playlist.items" 
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600 mb-3 relative cursor-pointer hover:shadow-lg transition-shadow"
              @click="navigateToItem(item)"
            >
              <div class="flex items-start gap-3">
                <span class="text-lg font-bold text-gray-400">{{ index + 1 }}</span>
                <div class="flex-1">
                  <p class="text-base font-medium text-black dark:text-white">
                    {{ getItemTitle(item) }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ getItemType(item.type) }}
                  </p>
                </div>
                <button 
                  v-if="isOwner"
                  @click.stop="deleteItem(item.id)"
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Icon name="mdi:close" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </template>

          <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <Icon name="mdi:playlist-music-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">Playlist kosong</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/lib/auth'

definePageMeta({
  layout: 'blank'
})

interface PlaylistItem {
  id: number
  type: number
  data: any
  seq: number
  created_at: string
}

interface PlaylistDetail {
  id: number
  user_id: number
  title: string
  description: string | null
  created_at: string
  items: PlaylistItem[]
}

const route = useRoute()
const router = useRouter()
const { isAuthenticated, getAuthHeader, user } = useAuth()
const toast = useToast()
const config = useRuntimeConfig()

const playlistId = computed(() => route.params.id as string)

const { data, status, refresh } = useAsyncData(`playlist-${playlistId.value}`, () =>
  $fetch<{ success: boolean; data: PlaylistDetail }>(`${config.public.apiBaseUrl}/community-playlists/${playlistId.value}`)
)

const playlist = computed(() => data.value?.data)
const isLoading = computed(() => status.value === 'pending')
const isOwner = computed(() => isAuthenticated.value && user.value?.id === playlist.value?.user_id)

function getItemType(type: number): string {
  switch (type) {
    case 1: return 'Video'
    case 2: return 'Audio'
    case 3: return 'Book'
    default: return 'Unknown'
  }
}

function getItemTitle(item: PlaylistItem): string {
  // Extract title from data if available
  if (item.data.title) return item.data.title
  
  // Fallback based on type
  switch (item.type) {
    case 1: // Video
      return item.data.video_category_id ? `Video Category ${item.data.video_category_id}` : 
             item.data.videoId ? `Video ${item.data.videoId}` : 'Video'
    case 2: // Audio
      return item.data.audioId ? `Audio ${item.data.audioId}` : 'Audio'
    case 3: // Book
      return item.data.bookId ? `Book ${item.data.bookId}` : 'Book'
    default:
      return 'Untitled'
  }
}

function navigateToItem(item: PlaylistItem) {
  try {
    const itemData = item.data

    switch (item.type) {
      case 1: // Video
        const videoId = itemData.videoId
        const videoCategoryId = itemData.video_category_id
        if (videoCategoryId) {
          // Use video_category_id for navigation
          navigateTo({ 
            path: `/video/play/${videoCategoryId}`, 
            query: { title: getItemTitle(item) } 
          })
        } else if (videoId) {
          // Fallback to videoId (sub video)
          navigateTo({ 
            path: `/video/play/sub/${videoId}`, 
            query: { title: getItemTitle(item) } 
          })
        }
        break
        
      case 2: // Audio
        const audioId = itemData.audioId
        if (audioId) {
          navigateTo({
            path: '/audio/detail',
            query: {
              audio_id: audioId,
              subtitle_id: itemData.subtitleId || undefined,
              title: getItemTitle(item)
            }
          })
        }
        break
        
      case 3: // Book
        const bookId = itemData.bookId
        const chapterId = itemData.chapterId
        if (bookId) {
          if (chapterId) {
            // Go to specific chapter with page
            navigateTo({
              path: `/book/${bookId}/${chapterId}`,
              query: itemData.page ? { page: itemData.page } : undefined
            })
          } else {
            // Go to book overview
            navigateTo({ 
              path: `/books/${bookId}`, 
              query: { title: getItemTitle(item) } 
            })
          }
        }
        break
    }
  } catch (e) {
    console.error('Failed to navigate to playlist item:', e)
    toast.add({
      title: 'Gagal',
      description: 'Gagal membuka item',
      color: 'error'
    })
  }
}

async function deleteItem(itemId: number) {
  if (!confirm('Hapus item dari playlist?')) return

  try {
    await $fetch(`${config.public.apiBaseUrl}/community-playlists/${playlistId.value}/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeader() as Record<string, string>
    })

    toast.add({
      title: 'Berhasil',
      description: 'Item berhasil dihapus',
      color: 'success'
    })

    refresh()
  } catch (error) {
    toast.add({
      title: 'Gagal',
      description: 'Gagal menghapus item',
      color: 'error'
    })
  }
}

async function deletePlaylist() {
  if (!confirm('Hapus playlist ini?')) return

  try {
    await $fetch(`${config.public.apiBaseUrl}/community-playlists/${playlistId.value}`, {
      method: 'DELETE',
      headers: getAuthHeader() as Record<string, string>
    })

    toast.add({
      title: 'Berhasil',
      description: 'Playlist berhasil dihapus',
      color: 'success'
    })

    router.push('/community-playlists')
  } catch (error) {
    toast.add({
      title: 'Gagal',
      description: 'Gagal menghapus playlist',
      color: 'error'
    })
  }
}
</script>
