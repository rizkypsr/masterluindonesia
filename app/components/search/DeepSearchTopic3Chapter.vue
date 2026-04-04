<script setup lang="ts">
import type { Topic3Chapter } from '~/types/search'

const props = defineProps<{
  chapters: Topic3Chapter[]
  deepSearch: ReturnType<typeof useDeepSearch>
  helpers: ReturnType<typeof useDeepSearchHelpers>
  expandedAccordions: Set<string>
}>()

const emit = defineEmits<{
  toggleAccordion: [key: string]
}>()
</script>

<template>
  <div class="ml-2">
    <template v-for="chapter in chapters" :key="`t3ch-${chapter.id}`">
      <div class="space-y-1">
        <div v-if="chapter.children && chapter.children.length > 0" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `topic3-chapter-${chapter.id}`)"
            class="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`topic3-chapter-${chapter.id}`"
                :checked="helpers.isTopic3ChapterSelected(chapter)"
                @click.stop="helpers.toggleTopic3ChapterSelection(chapter.id, chapter)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label :for="`topic3-chapter-${chapter.id}`"
                class="text-lg text-black dark:text-white cursor-pointer text-left flex-1">
                {{ chapter.title }}
              </label>
            </div>
            <Icon :name="expandedAccordions.has(`topic3-chapter-${chapter.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-4 h-4 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`topic3-chapter-${chapter.id}`)" class="p-3">
            <div class="ml-6">
              <SearchDeepSearchTopic3Chapter 
                :chapters="chapter.children"
                :deep-search="deepSearch"
                :helpers="helpers"
                :expanded-accordions="expandedAccordions"
                @toggle-accordion="emit('toggleAccordion', $event)"
              />
            </div>
          </div>
        </div>

        <div v-else class="flex items-start gap-2 py-1">
          <input type="checkbox" :id="`topic3-chapter-${chapter.id}`"
            :checked="deepSearch.selectedTopic3ChapterIds.value.includes(chapter.id)"
            @change="helpers.toggleTopic3ChapterSelection(chapter.id, chapter)"
            class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label :for="`topic3-chapter-${chapter.id}`"
            class="text-lg text-black dark:text-white cursor-pointer flex-1">
            {{ chapter.title }}
          </label>
        </div>
      </div>
    </template>
  </div>
</template>
