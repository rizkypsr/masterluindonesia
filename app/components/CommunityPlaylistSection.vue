<template>
  <div class="mt-6 px-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-black dark:text-white">Community Playlist</h2>
      <NuxtLink to="/community-playlists" class="text-primary dark:text-yellow-400 font-medium">Lihat semua</NuxtLink>
    </div>

    <div class="space-y-3">
      <template v-if="isLoading">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <USkeleton class="h-5 w-3/4 mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </template>

      <template v-else-if="playlists.length > 0">
        <NuxtLink 
          v-for="playlist in playlists" 
          :key="playlist.id" 
          :to="`/community-playlists/${playlist.id}`"
          class="block bg-white dark:bg-gray-800 rounded-xl p-4 border-2 hover:shadow-lg transition-shadow relative"
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
interface CommunityPlaylist {
  id: number
  user_id: number
  title: string
  description: string | null
  is_pinned: boolean
  created_at: string
  item_count: number
}

const config = useRuntimeConfig()

const { data, status } = useAsyncData('communityPlaylists', () =>
  $fetch<{ success: boolean; data: CommunityPlaylist[] }>(`${config.public.apiBaseUrl}/community-playlists?limit=5`)
)

const playlists = computed(() => data.value?.data?.slice(0, 5) || [])
const isLoading = computed(() => status.value === 'pending')
</script>
