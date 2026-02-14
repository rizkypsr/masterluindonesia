<template>
  <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <BackButton />
      <span class="text-lg font-semibold text-black dark:text-white">Community Playlist</span>
      <div class="w-10"></div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 py-6">
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-3">
          <USkeleton class="h-5 w-3/4 mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </template>

      <template v-else-if="playlists.length > 0">
        <NuxtLink 
          v-for="playlist in playlists" 
          :key="playlist.id"
          :to="`/community-playlists/${playlist.id}`"
          class="block bg-white dark:bg-gray-800 rounded-xl p-4 border-2 hover:shadow-lg transition-shadow mb-3 relative"
          :class="playlist.is_pinned ? 'border-yellow-400 dark:border-yellow-500' : 'border-gray-300 dark:border-gray-600'"
        >
          <!-- Pinned Badge -->
          <div v-if="playlist.is_pinned" class="absolute top-2 right-2">
            <Icon name="mdi:pin" class="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex-1 pr-6">
              <h3 class="text-base font-semibold text-black dark:text-white line-clamp-2">
                {{ playlist.title }}
              </h3>
              <p v-if="playlist.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {{ playlist.description }}
              </p>
              <div class="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <Icon name="mdi:playlist-music" class="w-4 h-4" />
                <span>{{ playlist.item_count }} item{{ playlist.item_count !== 1 ? 's' : '' }}</span>
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400 shrink-0 ml-2" />
          </div>
        </NuxtLink>
      </template>

      <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="mdi:playlist-music-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Belum ada playlist</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/lib/auth'

definePageMeta({
  layout: 'blank'
})

interface CommunityPlaylist {
  id: number
  user_id: number
  title: string
  description: string | null
  is_pinned: boolean
  created_at: string
  item_count: number
}

const { isAuthenticated, getAuthHeader } = useAuth()
const toast = useToast()
const config = useRuntimeConfig()

const showCreateModal = ref(false)
const isCreating = ref(false)
const newPlaylist = ref({
  title: '',
  description: ''
})

const { data, status, refresh } = useAsyncData('allCommunityPlaylists', () =>
  $fetch<{ success: boolean; data: CommunityPlaylist[] }>(`${config.public.apiBaseUrl}/community-playlists`)
)

const playlists = computed(() => data.value?.data || [])
const isLoading = computed(() => status.value === 'pending')

async function createPlaylist() {
  if (!newPlaylist.value.title.trim()) return

  isCreating.value = true
  try {
    await $fetch(`${config.public.apiBaseUrl}/community-playlists`, {
      method: 'POST',
      headers: getAuthHeader() as Record<string, string>,
      body: {
        title: newPlaylist.value.title.trim(),
        description: newPlaylist.value.description.trim() || null
      }
    })

    toast.add({
      title: 'Berhasil',
      description: 'Playlist berhasil dibuat',
      color: 'success'
    })

    showCreateModal.value = false
    newPlaylist.value = { title: '', description: '' }
    refresh()
  } catch (error) {
    toast.add({
      title: 'Gagal',
      description: 'Gagal membuat playlist',
      color: 'error'
    })
  } finally {
    isCreating.value = false
  }
}
</script>
