<template>
  <div class="mt-6 px-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-black dark:text-white">Topik 2</h2>
      <NuxtLink to="/topics2" class="text-primary dark:text-yellow-400 font-medium">Lihat semua</NuxtLink>
    </div>

    <template v-if="isLoading">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <USkeleton class="h-5 w-3/4 mb-2" />
        <USkeleton class="h-4 w-full mb-2" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </template>

    <template v-else-if="treeItems.length > 0">
      <UTree :items="treeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon=""
        collapsed-icon="" :ui="{ linkLeadingIcon: 'hidden' }" @select="handleSelect" />
    </template>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
      <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400">Belum ada topik</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'

interface Topic2Child {
  id: number
  book_category_id: number
  title: string
}

interface Topic2 {
  id: number
  title: string
  children: Topic2Child[]
}

const config = useRuntimeConfig()
const router = useRouter()

const { data, status, error } = await useAsyncData(
  'topics2Preview',
  () => $fetch<{ success: boolean; data: Topic2[] }>(`${config.public.apiBaseUrl}/topics2?limit=5`),
  {
    server: true,
    lazy: false,
    default: () => ({ success: true, data: [] })
  }
)

// Log error in development
if (error.value) {
  console.error('Topics2Section fetch error:', error.value)
}

// Transform API data to TreeItem format
const treeItems = computed<TreeItem[]>(() => {
  const apiData = data.value?.data || []

  function transformToTreeItem(item: Topic2 | Topic2Child, isParent = false): TreeItem {
    const treeItem: TreeItem = {
      id: item.id,
      label: item.title,
      defaultExpanded: isParent
    }

    // If this is a parent (root level), prevent selection
    if (isParent) {
      treeItem.onSelect = (e: Event) => {
        e.preventDefault()
      }
    }

    if ('children' in item && item.children && item.children.length > 0) {
      treeItem.children = item.children!.map(child => transformToTreeItem(child, false))
    }

    return treeItem
  }

  return apiData.map(item => transformToTreeItem(item, true))
})

const isLoading = computed(() => status.value === 'pending')

function handleSelect(e: TreeItemSelectEvent<TreeItem>) {
  const item = e.detail.value
  // Only navigate if item has no children (is a leaf node)
  if (item?.id && !item.children?.length) {
    router.push(`/topics2/${item.id}`)
  }
}
</script>
