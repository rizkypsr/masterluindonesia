<script setup lang="ts">
import { useAuth } from '~/lib/auth'

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

// Edit modal state
const isEditModalOpen = ref(false)
const editingItem = ref<BookmarkItem | null>(null)
const editTitle = ref('')
const isSaving = ref(false)

// Delete modal state
const isDeleteModalOpen = ref(false)
const deletingItem = ref<BookmarkItem | null>(null)
const isDeleting = ref(false)

// Create folder modal state
const isCreateFolderModalOpen = ref(false)
const newFolderName = ref('')
const isCreatingFolder = ref(false)

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

function getIcon(type: number): string {
  switch (type) {
    case 0: return 'mdi:folder-outline'
    case 1: return 'mdi:play-box-outline'
    case 2: return 'mdi:file-document-outline'
    case 3: return 'mdi:book-open-page-variant-outline'
    default: return 'mdi:bookmark-outline'
  }
}

function openEditModal(item: BookmarkItem) {
  editingItem.value = item
  editTitle.value = item.title
  isEditModalOpen.value = true
}

async function saveEdit() {
  if (!editingItem.value || !editTitle.value.trim()) return

  isSaving.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string }>('https://api.masterluindonesia.com/api/bookmark', {
      method: 'PUT',
      headers: getAuthHeader() as Record<string, string>,
      body: {
        id: editingItem.value.id,
        title: editTitle.value.trim()
      }
    })

    if (response.success) {
      toast.add({
        title: 'Bookmark berhasil diubah',
        color: 'success'
      })
      isEditModalOpen.value = false
      await fetchBookmarks()
    } else {
      toast.add({
        title: response.message || 'Gagal mengubah bookmark',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Gagal mengubah bookmark',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

function openDeleteModal(item: BookmarkItem) {
  deletingItem.value = item
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!deletingItem.value) return

  isDeleting.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string }>(`https://api.masterluindonesia.com/api/bookmark/${deletingItem.value.id}`, {
      method: 'DELETE',
      headers: getAuthHeader() as Record<string, string>
    })

    if (response.success) {
      toast.add({
        title: 'Bookmark berhasil dihapus',
        color: 'success'
      })
      isDeleteModalOpen.value = false
      await fetchBookmarks()
    } else {
      toast.add({
        title: response.message || 'Gagal menghapus bookmark',
        color: 'error'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Gagal menghapus bookmark',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

function openCreateFolder() {
  newFolderName.value = ''
  isCreateFolderModalOpen.value = true
}

async function createFolder() {
  if (!newFolderName.value.trim()) return

  isCreatingFolder.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string }>('https://api.masterluindonesia.com/api/bookmark', {
      method: 'POST',
      headers: getAuthHeader() as Record<string, string>,
      body: {
        id: null,
        type: 0,
        folderId: null,
        title: newFolderName.value.trim(),
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
      isCreateFolderModalOpen.value = false
      await fetchBookmarks()
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

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="px-4 py-4 shadow-sm bg-white dark:bg-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">Bookmark Manager</h1>
        </div>
        <button @click="openCreateFolder" class="p-1">
          <Icon name="mdi:folder-plus-outline" class="w-6 h-6 text-[#bf9638] dark:text-yellow-400" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
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
        <div v-for="item in bookmarks" :key="item.id" class="border-b border-gray-200 dark:border-gray-700">
          <!-- Folder or Item -->
          <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <Icon :name="getIcon(item.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
              <span class="text-black dark:text-white truncate text-lg">{{ item.title }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button @click="openEditModal(item)"
                class="p-1 border border-[#bf9638] dark:border-yellow-400 flex justify-baseline items-center rounded-md">
                <Icon name="mdi:pencil-outline" class="w-6 h-6 text-[#bf9638] dark:text-yellow-400" />
              </button>
              <button @click="openDeleteModal(item)"
                class="p-1 border border-[#bf9638] dark:border-yellow-400 flex justify-baseline items-center rounded-md">
                <Icon name="mdi:delete-outline" class="w-6 h-6 text-[#bf9638] dark:text-yellow-400" />
              </button>
            </div>
          </div>

          <!-- Folder Children -->
          <div v-if="item.type === 0 && item.child?.length" class="ml-8 space-y-1">
            <div v-for="child in item.child" :key="child.id" class="flex items-center justify-between p-3">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <Icon :name="getIcon(child.type)" class="w-6 h-6 shrink-0 text-[#bf9638] dark:text-yellow-400" />
                <span class="text-black text-lg dark:text-white truncate">{{ child.title }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button @click="openEditModal(child)"
                  class="p-1 border border-[#bf9638] dark:border-yellow-400 flex justify-baseline childs-center rounded-md">
                  <Icon name="mdi:pencil-outline" class="w-6 h-6 text-[#bf9638] dark:text-yellow-400" />
                </button>
                <button @click="openDeleteModal(child)"
                  class="p-1 border border-[#bf9638] dark:border-yellow-400 flex justify-baseline items-center rounded-md">
                  <Icon name="mdi:delete-outline" class="w-6 h-6 text-[#bf9638] dark:text-yellow-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Edit Bookmark</h3>

          <div class="mb-6">
            <label class="block text-black dark:text-white font-medium mb-2">Title</label>
            <input v-model="editTitle" type="text"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#bf9638] focus:outline-none text-black dark:text-white bg-white dark:bg-gray-800"
              placeholder="Masukkan judul" />
          </div>

          <div class="flex gap-3 justify-end">
            <UButton variant="outline" @click="isEditModalOpen = false">
              Batal
            </UButton>
            <UButton :loading="isSaving" :disabled="!editTitle.trim()"
              class="bg-[#bf9638] hover:bg-primary/90 text-black" @click="saveEdit">
              Simpan
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Hapus Bookmark</h3>

          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Apakah Anda yakin ingin menghapus "{{ deletingItem?.title }}"?
          </p>

          <div class="flex gap-3 justify-end">
            <UButton variant="outline" @click="isDeleteModalOpen = false">
              Batal
            </UButton>
            <UButton :loading="isDeleting" color="error" @click="confirmDelete">
              Hapus
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Create Folder Modal -->
    <UModal v-model:open="isCreateFolderModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Buat Folder Baru</h3>

          <div class="mb-6">
            <label class="block text-black dark:text-white font-medium mb-2">Nama Folder</label>
            <input v-model="newFolderName" type="text"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:outline-none text-black dark:text-white bg-white dark:bg-gray-800"
              placeholder="Masukkan nama folder" />
          </div>

          <div class="flex gap-3 justify-end">
            <UButton variant="outline" @click="isCreateFolderModalOpen = false">
              Batal
            </UButton>
            <UButton :loading="isCreatingFolder" :disabled="!newFolderName.trim()"
              class="bg-primary hover:bg-primary/90 text-black" @click="createFolder">
              Simpan
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
