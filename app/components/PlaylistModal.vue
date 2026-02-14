<template>
  <UModal v-model:open="showPlaylistModal">
    <template #content>
      <div class="p-6 bg-white dark:bg-gray-800 max-h-[80vh] flex flex-col">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Tambah ke Playlist</h3>

        <!-- Create New Playlist Section -->
        <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Buat Playlist Baru</h4>
          
          <div class="space-y-3">
            <input 
              v-model="newPlaylistTitle"
              type="text"
              maxlength="255"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white text-sm"
              placeholder="Judul playlist"
            />
            
            <textarea 
              v-model="newPlaylistDescription"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white text-sm"
              placeholder="Deskripsi (opsional)"
            ></textarea>

            <button 
              @click="handleCreatePlaylist"
              :disabled="isCreatingPlaylist || !newPlaylistTitle.trim()"
              class="w-full px-4 py-2 bg-primary dark:bg-yellow-500 text-black rounded-lg disabled:opacity-50 text-sm font-medium"
            >
              {{ isCreatingPlaylist ? 'Membuat...' : 'Buat & Tambahkan' }}
            </button>
          </div>
        </div>

        <!-- Existing Playlists Section -->
        <div class="flex-1 overflow-y-auto">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pilih Playlist</h4>
          
          <template v-if="isLoadingPlaylists">
            <div v-for="i in 3" :key="i" class="mb-2">
              <USkeleton class="h-12 w-full rounded-lg" />
            </div>
          </template>

          <template v-else-if="userPlaylists.length > 0">
            <button
              v-for="playlist in userPlaylists"
              :key="playlist.id"
              @click="handleAddToPlaylist(playlist.id)"
              :disabled="isAddingToPlaylist"
              class="w-full text-left px-4 py-3 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-black dark:text-white text-sm">{{ playlist.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ playlist.items_count }} item{{ playlist.items_count !== 1 ? 's' : '' }}</p>
                </div>
                <Icon name="mdi:plus" class="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </template>

          <div v-else class="text-center py-8">
            <Icon name="mdi:playlist-music-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 dark:text-gray-400">Belum ada playlist</p>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          @click="showPlaylistModal = false"
          class="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
        >
          Batal
        </button>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const {
  showPlaylistModal,
  userPlaylists,
  isLoadingPlaylists,
  isCreatingPlaylist,
  isAddingToPlaylist,
  newPlaylistTitle,
  newPlaylistDescription,
  createPlaylist,
  addToPlaylist
} = usePlaylist()

async function handleCreatePlaylist() {
  await createPlaylist()
}

async function handleAddToPlaylist(playlistId: number) {
  await addToPlaylist(playlistId)
}
</script>
