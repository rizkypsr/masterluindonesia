<template>
  <USlideover v-model:open="isModalOpen" side="bottom">
    <template #content>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <h3 class="text-xl font-semibold text-black">Tambah Bookmark</h3>
          <button @click="openCreateFolder">
            <Icon name="mdi:folder-plus-outline" class="w-7 h-7 text-primary" />
          </button>
        </div>

        <!-- Title Input -->
        <div class="mb-6">
          <label class="block text-black font-medium mb-2">Title</label>
          <input
            v-model="bookmarkTitle"
            type="text"
            class="w-full px-4 py-3 border-b border-gray-300 focus:border-primary focus:outline-none text-black"
            placeholder="Masukkan judul bookmark"
          />
        </div>

        <!-- Folder Select -->
        <div class="mb-8">
          <label class="block text-black font-medium mb-2">Folder</label>
          <USelect
            v-model="selectedFolderId"
            :items="folderOptions"
            placeholder="Pilih folder (opsional)"
            class="w-full"
          />
        </div>

        <!-- Save Button -->
        <UButton
          @click="saveBookmark"
          :loading="isLoading"
          :disabled="!bookmarkTitle.trim()"
          class="w-full py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-full justify-center"
        >
          SIMPAN
        </UButton>
      </div>
    </template>
  </USlideover>

  <!-- Create Folder Slideover -->
  <USlideover v-model:open="isFolderModalOpen" side="bottom">
    <template #content>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <h3 class="text-xl font-semibold text-black">Buat Folder Baru</h3>
          <Icon name="mdi:folder-plus-outline" class="w-7 h-7 text-primary" />
        </div>

        <!-- Folder Name Input -->
        <div class="mb-8">
          <label class="block text-black font-medium mb-2">Nama Folder</label>
          <input
            v-model="newFolderName"
            type="text"
            class="w-full px-4 py-3 border-b border-gray-300 focus:border-primary focus:outline-none text-black"
            placeholder="Masukkan nama folder"
          />
        </div>

        <!-- Save Folder Button -->
        <UButton
          @click="createFolder"
          :loading="isCreatingFolder"
          :disabled="!newFolderName.trim()"
          class="w-full py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-full justify-center"
        >
          SIMPAN
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { useBookmark } from '~/composables/useBookmark'
import { useAuth } from '~/lib/auth'

const {
  isModalOpen,
  isLoading,
  folders,
  bookmarkTitle,
  selectedFolderId,
  saveBookmark,
  fetchFolders
} = useBookmark()

const toast = useToast()

const folderOptions = computed(() => [
  { label: 'Tanpa folder', value: null },
  ...folders.value.map(f => ({ label: f.title, value: f.id }))
])

// Create folder state
const isFolderModalOpen = ref(false)
const newFolderName = ref('')
const isCreatingFolder = ref(false)

const openCreateFolder = () => {
  newFolderName.value = ''
  isFolderModalOpen.value = true
}

const createFolder = async () => {
  if (!newFolderName.value.trim()) return

  isCreatingFolder.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string }>('https://api.masterluindonesia.com/api/bookmark', {
      method: 'POST',
      headers: useAuth().getAuthHeader() as Record<string, string>,
      body: {
        id: null,
        type: 0,
        folderId: null,
        title: newFolderName.value,
        videoLink: null,
        audioLink: null,
        bookLink: null,
        recipeLink: null
      }
    })

    if (response.success) {
      toast.add({
        title: 'Folder berhasil dibuat',
        color: 'success'
      })
      isFolderModalOpen.value = false
      // Refresh folders list
      await fetchFolders()
    } else {
      toast.add({
        title: response.message || 'Gagal membuat folder',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Gagal membuat folder',
      color: 'error'
    })
  } finally {
    isCreatingFolder.value = false
  }
}
</script>
