<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button @click="goBack()"
        class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white">{{ pageTitle }}</h1>
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

interface Video {
  topic_video_id: number
  video_id: number
  title: string
  synopsis: string
  url: string
  url_audio: string
  date: string | null
  seq: number
  category_title: string
}

interface Topic3TreeItemChild {
  id: number
  topics3_id: number
  title: string
  videos: Video[]
  children: Topic3TreeItemChild[]
}

interface Topic3TreeItem {
  id: number
  topics3_id: number
  title: string
  videos: Video[]
  children: Topic3TreeItemChild[]
}

const route = useRoute()
const config = useRuntimeConfig()
const router = useRouter()

const topicId = computed(() => route.params.id as string)
const pageTitle = computed(() => route.query.title as string || 'Topik 3')

const { data, status } = useAsyncData(`topics3Detail-${topicId.value}`, () =>
  $fetch<{ success: boolean; data: Topic3TreeItem[] }>(`${config.public.apiBaseUrl}/topics3/${topicId.value}`)
)

// Transform API data to TreeItem format
const treeItems = computed<TreeItem[]>(() => {
  const apiData = data.value?.data || []

  function transformToTreeItem(item: Topic3TreeItem | Topic3TreeItemChild, isRoot = false): TreeItem {
    const hasVideos = item.videos && item.videos.length > 0
    const hasChildren = item.children && item.children.length > 0

    const treeItem: TreeItem = {
      id: item.id,
      label: item.title,
      defaultExpanded: isRoot
    }

    // If has videos but no children, make it selectable to view content
    if (hasVideos && !hasChildren) {
      // Selectable leaf node
    } else if (hasChildren) {
      // Has children, prevent selection
      treeItem.onSelect = (e: Event) => {
        e.preventDefault()
      }
      treeItem.children = item.children!.map(child => transformToTreeItem(child, false))
    } else {
      // No videos and no children, still make it selectable
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
