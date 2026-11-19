<script setup lang="ts">
import { useAuth } from '~/lib/auth'
import { useChatFaqApi, type ChatFaq } from '~/composables/useChatFaqApi'

const { isAuthenticated, isAdmin, ensureSession } = useAuth()
const { list, create, update, remove } = useChatFaqApi()
const toast = useToast()

const faqs = ref<ChatFaq[]>([])
const loading = ref(true)

// Edit/create modal state
const isFormModalOpen = ref(false)
const editingItem = ref<ChatFaq | null>(null)
const formQuestion = ref('')
const formAnswer = ref('')
const formIsActive = ref(true)
const isSaving = ref(false)

// Delete modal state
const isDeleteModalOpen = ref(false)
const deletingItem = ref<ChatFaq | null>(null)
const isDeleting = ref(false)

onMounted(async () => {
  await ensureSession()
  if (!isAuthenticated.value || !isAdmin.value) {
    toast.add({ title: 'Halaman ini khusus admin', color: 'error' })
    navigateTo('/lainnya')
    return
  }
  await fetchFaqs()
})

async function fetchFaqs() {
  loading.value = true
  try {
    const data = await list(1, 100)
    faqs.value = data.items
  } catch {
    toast.add({ title: 'Gagal memuat chat FAQ', color: 'error' })
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingItem.value = null
  formQuestion.value = ''
  formAnswer.value = ''
  formIsActive.value = true
  isFormModalOpen.value = true
}

function openEditModal(item: ChatFaq) {
  editingItem.value = item
  formQuestion.value = item.question
  formAnswer.value = item.answer
  formIsActive.value = item.is_active
  isFormModalOpen.value = true
}

async function saveForm() {
  if (!formQuestion.value.trim() || !formAnswer.value.trim()) return

  isSaving.value = true
  try {
    if (editingItem.value) {
      await update(editingItem.value.id, {
        question: formQuestion.value.trim(),
        answer: formAnswer.value.trim(),
        is_active: formIsActive.value,
      })
      toast.add({ title: 'FAQ berhasil diubah', color: 'success' })
    } else {
      await create({
        question: formQuestion.value.trim(),
        answer: formAnswer.value.trim(),
        is_active: formIsActive.value,
      })
      toast.add({ title: 'FAQ berhasil dibuat', color: 'success' })
    }
    isFormModalOpen.value = false
    await fetchFaqs()
  } catch (e: any) {
    toast.add({
      title: e?.data?.message || 'Gagal menyimpan FAQ',
      color: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

function closeFormModal() {
  isFormModalOpen.value = false
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
}

function openDeleteModal(item: ChatFaq) {
  deletingItem.value = item
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!deletingItem.value) return

  isDeleting.value = true
  try {
    await remove(deletingItem.value.id)
    toast.add({ title: 'FAQ berhasil dihapus', color: 'success' })
    isDeleteModalOpen.value = false
    await fetchFaqs()
  } catch {
    toast.add({ title: 'Gagal menghapus FAQ', color: 'error' })
  } finally {
    isDeleting.value = false
  }
}

async function toggleActive(item: ChatFaq) {
  try {
    await update(item.id, { is_active: !item.is_active })
    item.is_active = !item.is_active
  } catch {
    toast.add({ title: 'Gagal mengubah status FAQ', color: 'error' })
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
          <h1 class="text-lg font-semibold text-black dark:text-white">Chat FAQ</h1>
        </div>
        <button @click="openCreateModal" class="p-1">
          <Icon name="mdi:plus-circle-outline" class="w-6 h-6 text-[#bf9638] dark:text-yellow-400" />
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
      <div v-else-if="faqs.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:frequently-asked-questions" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Belum ada FAQ</p>
      </div>

      <!-- FAQ List -->
      <div v-else class="space-y-3">
        <div v-for="item in faqs" :key="item.id"
          class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <div class="flex items-start justify-between gap-2 mb-2">
            <p class="font-medium text-black dark:text-white flex-1 min-w-0">{{ item.question }}</p>
            <button
              class="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border"
              :class="item.is_active
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-gray-400 text-gray-500 dark:text-gray-400'"
              @click="toggleActive(item)"
            >
              {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
            </button>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ item.answer }}</p>
          <div class="flex items-center gap-2 justify-end">
            <button @click="openEditModal(item)"
              class="p-1 border border-[#bf9638] dark:border-yellow-400 flex justify-baseline items-center rounded-md">
              <Icon name="mdi:pencil-outline" class="w-5 h-5 text-[#bf9638] dark:text-yellow-400" />
            </button>
            <button @click="openDeleteModal(item)"
              class="p-1 border border-[#bf9638] dark:border-yellow-400 flex justify-baseline items-center rounded-md">
              <Icon name="mdi:delete-outline" class="w-5 h-5 text-[#bf9638] dark:text-yellow-400" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UModal v-model:open="isFormModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">
            {{ editingItem ? 'Edit FAQ' : 'Buat FAQ Baru' }}
          </h3>

          <div class="mb-4">
            <label class="block text-black dark:text-white font-medium mb-2">Pertanyaan</label>
            <input v-model="formQuestion" type="text"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#bf9638] focus:outline-none text-black dark:text-white bg-white dark:bg-gray-800"
              placeholder="mis. Apakah arti mimpi ?" />
          </div>

          <div class="mb-4">
            <label class="block text-black dark:text-white font-medium mb-2">Jawaban</label>
            <textarea v-model="formAnswer" rows="4"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#bf9638] focus:outline-none text-black dark:text-white bg-white dark:bg-gray-800"
              placeholder="Jawaban yang akan disampaikan bot dengan gaya bahasanya sendiri" />
          </div>

          <div class="flex items-center gap-2 mb-6">
            <input id="faq-active" v-model="formIsActive" type="checkbox" class="w-4 h-4" />
            <label for="faq-active" class="text-black dark:text-white">Aktif</label>
          </div>

          <div class="flex gap-3 justify-end">
            <UButton variant="outline" @click="closeFormModal">
              Batal
            </UButton>
            <UButton :loading="isSaving" :disabled="!formQuestion.trim() || !formAnswer.trim()"
              class="bg-[#bf9638] hover:bg-primary/90 text-black" @click="saveForm">
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
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Hapus FAQ</h3>

          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Apakah Anda yakin ingin menghapus "{{ deletingItem?.question }}"?
          </p>

          <div class="flex gap-3 justify-end">
            <UButton variant="outline" @click="closeDeleteModal">
              Batal
            </UButton>
            <UButton :loading="isDeleting" color="error" @click="confirmDelete">
              Hapus
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
