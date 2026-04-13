<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center gap-4">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">Ensiklopedia</h1>
        </div>
        <div class="flex items-center gap-2">
          <button @click="showInfoModal = true" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <Icon name="mdi:information" class="w-6 h-6 text-primary dark:text-yellow-400" />
          </button>
          <button @click="sharePage" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
      <template v-if="isLoading">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <USkeleton class="h-5 w-3/4 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </template>

      <template v-else-if="treeItems.length > 0">
        <UTree :items="treeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon="" collapsed-icon="" :ui="{
          linkLeadingIcon: 'hidden',
          link: 'text-xl hover:text-primary dark:hover:text-yellow-400 active:text-primary dark:active:text-yellow-400 transition-colors active:scale-[0.98] transition-transform relative group',
          linkLabel: 'transition-colors'
        }" @select="handleSelect" />
      </template>

      <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Belum ada topik</p>
      </div>
    </div>

    <!-- Information Modal -->
    <UModal v-model:open="showInfoModal" title="Informasi Ensiklopedia">
      <template #body>
        <div v-if="isLoadingInfo" class="flex justify-center py-8">
          <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
        </div>

        <div v-else-if="infoDescription" class="text-black dark:text-white">
          <div class="text-base leading-relaxed" v-html="infoDescription"></div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Tidak ada informasi tersedia</p>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'

interface Topic {
  id: number
  category_id: number | null
  title: string
  short_title: string
  seq: number
  icon: number
}

const config = useRuntimeConfig()
const router = useRouter()

// Information modal state
const showInfoModal = ref(false)
const infoDescription = ref('')
const isLoadingInfo = ref(false)

const { data, status } = useAsyncData('topicsList', () =>
  $fetch<{ success: boolean; data: Topic[] }>(`${config.public.apiBaseUrl}/topics`)
)

// Transform API data to TreeItem format
const treeItems = computed<TreeItem[]>(() => {
  const apiData = data.value?.data || []
  return apiData
    .sort((a, b) => a.seq - b.seq)
    .map(topic => ({
      id: topic.id,
      label: topic.title,
      defaultExpanded: false
    }))
})

const isLoading = computed(() => status.value === 'pending')

function handleSelect(e: TreeItemSelectEvent<TreeItem>) {
  const item = e.detail.value
  if (item?.id) {
    const topic = data.value?.data?.find(t => t.id === item.id)
    if (topic) {
      router.push({
        path: `/topics/${topic.id}`,
        query: { title: topic.title }
      })
    }
  }
}

const sharePage = async () => {
  const shareData = {
    title: 'Ensiklopedia',
    text: 'Ensiklopedia',
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`Lihat "Ensiklopedia" di\n${window.location.href}`)
    alert('Link berhasil disalin!')
  }
}

// Fetch information when modal opens
const fetchInformation = async () => {
  if (infoDescription.value) return // Already fetched

  isLoadingInfo.value = true
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: Array<{
        id: number
        description: string
        type: string
        created_at: string
        updated_at: string
      }>
    }>(`${config.public.apiBaseUrl}/information?type=topik1`)

    if (response.success && response.data.length > 0) {
      infoDescription.value = response.data[0]?.description || ''
    }
  } catch (error) {
    console.error('Failed to fetch information:', error)
  } finally {
    isLoadingInfo.value = false
  }
}

// Watch for modal open to fetch information
watch(showInfoModal, (isOpen) => {
  if (isOpen) {
    fetchInformation()
  }
})
</script>
