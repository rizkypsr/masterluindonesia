<template>
  <div>
    <!-- Parent Node with Children -->
    <div v-if="item.children && item.children.length > 0">
      <!-- Category Title with Search (only for top level) -->
      <div v-if="!categorySearchModes[item.id]" class="flex items-center justify-between py-3">
        <button 
          @click="toggleExpanded"
          class="flex-1 text-left font-semibold text-black dark:text-white hover:text-primary dark:hover:text-yellow-400"
          :style="{ fontSize: fontSize + 'px', paddingLeft: (level * 16) + 'px' }"
        >
          <Icon 
            :name="isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'" 
            class="w-5 h-5 inline-block mr-2" 
          />
          {{ item.label }}
        </button>
        <button v-if="level === 0" @click="$emit('open-search', item.id)" class="p-1">
          <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>

      <!-- Category Search Input (only for top level) -->
      <div v-else-if="level === 0" class="flex items-center gap-3 py-3" :style="{ paddingLeft: (level * 16) + 'px' }">
        <input 
          v-model="categorySearchQueries[item.id]" 
          type="text" 
          placeholder="Cari dalam kategori ini..."
          class="flex-1 text-black dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none py-1"
          @keyup.enter="$emit('handle-search', item.id)"
          autofocus 
        />
        <button 
          v-if="categorySearchQueries[item.id]?.trim()" 
          @click="$emit('handle-search', item.id)"
          class="px-3 py-1 bg-primary hover:bg-primary/90 text-black text-sm font-medium rounded"
        >
          Cari
        </button>
        <button @click="$emit('close-search', item.id)" class="p-1">
          <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>

      <!-- Category Search Results (only for top level) -->
      <div v-if="level === 0 && (categorySearchLoading[item.id] || categorySearchResults[item.id]?.length > 0 || (categorySearchModes[item.id] && categorySearchQueries[item.id]?.trim() && !categorySearchLoading[item.id] && categorySearchResults[item.id]?.length === 0))"
        :style="{ paddingLeft: (level * 16) + 'px' }">
        <!-- Loading -->
        <div v-if="categorySearchLoading[item.id]" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>

        <!-- Results List -->
        <div v-else-if="categorySearchResults[item.id]?.length > 0" class="space-y-4 mb-4">
          <SearchResultCard
            v-for="searchItem in categorySearchResults[item.id]"
            :key="`cat-${item.id}-${searchItem.type}-${searchItem.header_id}-${searchItem.id}-${searchItem.timestamp || ''}`"
            :item="searchItem"
            :is-expanded="expandedCategorySearchItems[item.id]?.has(`${searchItem.type}-${searchItem.header_id}-${searchItem.id}-${searchItem.timestamp || ''}`)"
            :font-size="fontSize"
            :is-speaking="speakingCategoryItemId[item.id] === `${searchItem.type}-${searchItem.header_id}-${searchItem.id}-${searchItem.timestamp || ''}`"
            :search-keyword="categorySearchQueries[item.id]"
            @toggle="$emit('toggle-expand', item.id, searchItem)"
            @navigate="$emit('navigate', searchItem)"
            @speak="$emit('speak', item.id, searchItem)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
        </div>
      </div>

      <!-- Children (show when not searching OR when search has no results) -->
      <div v-if="(!categorySearchModes[item.id] || !categorySearchResults[item.id]?.length) && isExpanded && item.children">
        <Topics3TreeNode
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :font-size="fontSize"
          :level="level + 1"
          :category-search-modes="categorySearchModes"
          :category-search-queries="categorySearchQueries"
          :category-search-loading="categorySearchLoading"
          :category-search-results="categorySearchResults"
          :expanded-category-search-items="expandedCategorySearchItems"
          :speaking-category-item-id="speakingCategoryItemId"
          @open-search="$emit('open-search', $event)"
          @close-search="$emit('close-search', $event)"
          @handle-search="$emit('handle-search', $event)"
          @toggle-expand="$emit('toggle-expand', $event, $event)"
          @navigate="$emit('navigate', $event)"
          @speak="$emit('speak', $event, $event)"
        />
      </div>
    </div>

    <!-- Leaf Node (no children) -->
    <div v-else>
      <NuxtLink 
        :to="`/topics3/content/${item.id}`"
        class="block py-3 text-black dark:text-white hover:text-primary dark:hover:text-yellow-400"
        :style="{ fontSize: fontSize + 'px', paddingLeft: (level * 16) + 'px' }"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { SearchItem } from '~/types/search'

interface Props {
  item: TreeItem
  fontSize: number
  level?: number
  categorySearchModes: Record<number, boolean>
  categorySearchQueries: Record<number, string>
  categorySearchLoading: Record<number, boolean>
  categorySearchResults: Record<number, SearchItem[]>
  expandedCategorySearchItems: Record<number, Set<string>>
  speakingCategoryItemId: Record<number, string | null>
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

defineEmits<{
  'open-search': [categoryId: number]
  'close-search': [categoryId: number]
  'handle-search': [categoryId: number]
  'toggle-expand': [categoryId: number, item: SearchItem]
  'navigate': [item: SearchItem]
  'speak': [categoryId: number, item: SearchItem]
}>()

const isExpanded = ref(true)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>
