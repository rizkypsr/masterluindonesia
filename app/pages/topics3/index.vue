<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button @click="goBack()"
        class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white">Topik 3</h1>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
      <template v-if="status === 'pending'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <USkeleton class="h-5 w-3/4 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </template>

      <template v-else-if="treeItems.length > 0">
        <UTree :items="treeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon=""
          collapsed-icon="" :ui="{ linkLeadingIcon: 'hidden', link: 'text-xl' }" @select="handleSelect" />
      </template>

      <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Belum ada topik</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSmartBack } from '~/composables/useSmartBack'
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'

const { goBack } = useSmartBack()

interface Topic3Child {
  id: number
  book_category_id: number
  title: string
}

interface Topic3 {
  id: number
  title: string
  children: Topic3Child[]
}

const config = useRuntimeConfig()
const router = useRouter()

const { data, status } = useAsyncData('topics3List', () =>
  $fetch<{ success: boolean; data: Topic3[] }>(`${config.public.apiBaseUrl}/topics3`)
)

// Transform API data to TreeItem format
const treeItems = computed<TreeItem[]>(() => {
  const apiData = data.value?.data || []

  function transformToTreeItem(item: Topic3 | Topic3Child, isParent = false): TreeItem {
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

function handleSelect(e: TreeItemSelectEvent<TreeItem>) {
  const item = e.detail.value
  // Only navigate if item has no children (is a leaf node)
  if (item?.id && !item.children?.length) {
    router.push(`/topics3/content/${item.id}`)
  }
}
</script>
