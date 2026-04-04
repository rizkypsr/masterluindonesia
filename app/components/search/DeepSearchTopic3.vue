<script setup lang="ts">
const props = defineProps<{
  deepSearch: ReturnType<typeof useDeepSearch>
  deepSearchQuery: string
  expandedAccordions: Set<string>
}>()

const emit = defineEmits<{
  toggleAccordion: [key: string]
}>()

const helpers = useDeepSearchHelpers(props.deepSearch)
const filters = useDeepSearchFilters(props.deepSearch, toRef(props, 'deepSearchQuery'))
</script>

<template>
  <div class="space-y-4">
    <div v-for="topic3Group in filters.filteredTopic3List.value" :key="`t3group-${topic3Group.id}`" 
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button @click="emit('toggleAccordion', `topic3-group-${topic3Group.id}`)" 
        class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center gap-2">
          <input type="checkbox" :id="`topic3-group-checkbox-${topic3Group.id}`"
            :checked="helpers.isTopic3GroupSelected(topic3Group)"
            @click.stop="helpers.toggleTopic3GroupSelection(topic3Group)"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <h2 class="text-lg font-bold text-black dark:text-white text-left">
            {{ topic3Group.title }}
          </h2>
        </div>
        <Icon :name="expandedAccordions.has(`topic3-group-${topic3Group.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="w-5 h-5 text-black dark:text-white" />
      </button>

      <div v-if="expandedAccordions.has(`topic3-group-${topic3Group.id}`)" class="p-3 space-y-3">
        <div v-for="topic in topic3Group.topics" :key="`t3topic-${topic.id}`" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `topic3-topic-${topic.id}`)"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`topic3-topic-checkbox-${topic.id}`"
                :checked="helpers.isTopic3TopicSelected(topic)"
                @click.stop="helpers.toggleTopic3TopicSelection(topic)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <h3 class="text-lg font-semibold text-black dark:text-white text-left">
                {{ topic.title }}
              </h3>
            </div>
            <Icon :name="expandedAccordions.has(`topic3-topic-${topic.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`topic3-topic-${topic.id}`)" class="p-3">
            <SearchDeepSearchTopic3Chapter 
              :chapters="topic.chapters"
              :deep-search="deepSearch"
              :helpers="helpers"
              :expanded-accordions="expandedAccordions"
              @toggle-accordion="emit('toggleAccordion', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="filters.filteredTopic3List.value.length === 0 && !deepSearch.isLoadingTopic3List.value" class="text-center py-8">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data kumpulan tanya jawab' }}
      </p>
    </div>

    <div v-if="deepSearch.isLoadingTopic3List.value && deepSearch.topic3List.value.length > 0" class="flex justify-center py-4">
      <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-if="deepSearch.topic3List.value.length === 0 && deepSearch.isLoadingTopic3List.value" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
</template>
