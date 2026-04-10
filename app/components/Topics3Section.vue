<template>
  <div class="mt-6 px-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-black dark:text-white">Topik 3</h2>
      <NuxtLink to="/topics3" class="text-primary dark:text-yellow-400 font-medium">Lihat semua</NuxtLink>
    </div>

    <template v-if="!topics3Data">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <USkeleton class="h-5 w-3/4 mb-2" />
        <USkeleton class="h-4 w-full mb-2" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </template>

    <template v-else-if="treeItems.length > 0">
      <UTree :items="treeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon=""
        collapsed-icon="" :ui="{ 
          linkLeadingIcon: 'hidden', 
          link: 'text-xl hover:text-primary dark:hover:text-yellow-400 transition-colors active:scale-[0.98] transition-transform relative group',
          linkLabel: 'transition-colors'
        }" @select="handleSelect" />
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

const props = defineProps<{
  topics3Data?: Topic3[]
}>()

const router = useRouter()

// Use props data if available, otherwise show empty state
const treeItems = computed<TreeItem[]>(() => {
  const apiData = props.topics3Data || []

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

const isLoading = computed(() => !props.topics3Data)

function handleSelect(e: TreeItemSelectEvent<TreeItem>) {
  const item = e.detail.value
  // Only navigate if item has no children (is a leaf node)
  if (item?.id && !item.children?.length) {
    router.push(`/topics3/${item.id}`)
  }
}
</script>
