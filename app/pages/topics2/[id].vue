<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center gap-4">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">{{ topicTitle }}</h1>
        </div>
        <button class="p-1" @click="shareTopic">
          <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="py-2 px-1">
      <template v-if="isLoading">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <USkeleton class="h-6 w-3/4 mb-4" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </template>

      <template v-else-if="treeItems.length > 0">
        <UTree :items="treeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon="" collapsed-icon=""
          :ui="{ linkLeadingIcon: 'hidden', link: 'text-xl' }" @select="handleSelect" />
      </template>

      <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Tidak ada data</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'

interface Topic2TreeItem {
  id: number
  topics2_id: number
  title: string
  children?: Topic2TreeItem[]
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const topicId = computed(() => route.params.id as string)
const topicTitle = computed(() => (route.query.title as string) || 'Detail Topik')

const { data, status } = useAsyncData(`topics2Detail-${topicId.value}`, () =>
  $fetch<{ success: boolean; data: Topic2TreeItem[] }>(`${config.public.apiBaseUrl}/topics2/${topicId.value}`)
)

// Transform API data to TreeItem format
const treeItems = computed<TreeItem[]>(() => {
  const apiData = data.value?.data || []

  function transformToTreeItem(item: Topic2TreeItem): TreeItem {
    const hasChildren = item.children && item.children.length > 0

    const treeItem: TreeItem = {
      id: item.id,
      label: item.title,
      defaultExpanded: true
    }

    if (hasChildren) {
      treeItem.children = item.children!.map(transformToTreeItem)
      // Prevent parent items from being selected
      treeItem.onSelect = (e: Event) => {
        e.preventDefault()
      }
    }

    return treeItem
  }

  return apiData.map(transformToTreeItem)
})

const isLoading = computed(() => status.value === 'pending')

function handleSelect(e: TreeItemSelectEvent<TreeItem>) {
  const item = e.detail.value
  // Only navigate if item has no children (is a leaf node)
  if (item?.id && !item.children?.length) {
    router.push(`/topics2/content/${item.id}`)
  }
}

const shareTopic = async () => {
  const shareData = {
    title: 'Topik',
    text: topicTitle.value,
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
    await navigator.clipboard.writeText(`Lihat Topik "${topicTitle.value}" di\n${window.location.href}`)
    alert('Link berhasil disalin!')
  }
}
</script>
