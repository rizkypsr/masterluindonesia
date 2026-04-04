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
    <div v-for="topic2Group in filters.filteredTopic2List.value" :key="`t2group-${topic2Group.id}`" 
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button @click="emit('toggleAccordion', `topic2-group-${topic2Group.id}`)" 
        class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center gap-2">
          <input type="checkbox" :id="`topic2-group-checkbox-${topic2Group.id}`"
            :checked="helpers.isTopic2GroupSelected(topic2Group)"
            @click.stop="helpers.toggleTopic2GroupSelection(topic2Group)"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <h2 class="text-lg font-bold text-black dark:text-white text-left">
            {{ topic2Group.title }}
          </h2>
        </div>
        <Icon :name="expandedAccordions.has(`topic2-group-${topic2Group.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="w-5 h-5 text-black dark:text-white" />
      </button>

      <div v-if="expandedAccordions.has(`topic2-group-${topic2Group.id}`)" class="p-3 space-y-3">
        <div v-for="topic in topic2Group.topics" :key="`t2topic-${topic.id}`" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `topic2-topic-${topic.id}`)"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`topic2-topic-checkbox-${topic.id}`"
                :checked="helpers.isTopic2TopicSelected(topic)"
                @click.stop="helpers.toggleTopic2TopicSelection(topic)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <h3 class="text-lg font-semibold text-black dark:text-white text-left">
                {{ topic.title }}
              </h3>
            </div>
            <Icon :name="expandedAccordions.has(`topic2-topic-${topic.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`topic2-topic-${topic.id}`)" class="p-3">
            <SearchDeepSearchTopic2Chapter 
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

    <div v-if="filters.filteredTopic2List.value.length === 0 && !deepSearch.isLoadingTopic2List.value" class="text-center py-8">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data topik' }}
      </p>
    </div>

    <div v-if="deepSearch.isLoadingTopic2List.value && deepSearch.topic2List.value.length > 0" class="flex justify-center py-4">
      <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-if="deepSearch.topic2List.value.length === 0 && deepSearch.isLoadingTopic2List.value" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
</template>
