<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4 px-4 py-4">
        <BackButton />
        <h1 class="text-lg font-semibold text-black dark:text-white">Topik 2</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <template v-if="isLoading">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <USkeleton class="h-5 w-3/4 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </template>

      <template v-else-if="treeItems.length > 0">
        <UTree :items="treeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon="" collapsed-icon=""
          :ui="{ linkLeadingIcon: 'hidden' }" @select="handleSelect" />
      </template>

      <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Belum ada topik</p>
      </div>
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

const { data, status } = useAsyncData('topics2List', () =>
  $fetch<{ success: boolean; data: Topic2[] }>(`${config.public.apiBaseUrl}/topics2`)
)

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
    router.push(`/topics2/content/${item.id}`)
  }
}
</script>
