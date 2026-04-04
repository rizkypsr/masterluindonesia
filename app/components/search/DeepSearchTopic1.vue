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
    <div v-for="topic1Group in filters.filteredTopic1List.value" :key="`t1group-${topic1Group.topic_id}`" 
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button @click="emit('toggleAccordion', `topic1-group-${topic1Group.topic_id}`)" 
        class="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center gap-2">
          <input type="checkbox" :id="`topic1-group-checkbox-${topic1Group.topic_id}`"
            :checked="helpers.isTopic1GroupSelected(topic1Group)"
            @click.stop="helpers.toggleTopic1GroupSelection(topic1Group)"
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <h2 class="text-lg font-bold text-black dark:text-white text-left">
            {{ topic1Group.topic_title }}
          </h2>
        </div>
        <Icon :name="expandedAccordions.has(`topic1-group-${topic1Group.topic_id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="w-5 h-5 text-black dark:text-white" />
      </button>

      <div v-if="expandedAccordions.has(`topic1-group-${topic1Group.topic_id}`)" class="p-3 space-y-3">
        <div v-for="category in topic1Group.categories" :key="`t1cat-${category.id}`" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button @click="emit('toggleAccordion', `topic1-cat-${category.id}`)"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div class="flex items-center gap-2">
              <input type="checkbox" :id="`topic1-category-${category.id}`"
                :checked="helpers.isTopic1CategorySelected(category)"
                @click.stop="helpers.toggleTopic1CategorySelection(category.id, category)"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label :for="`topic1-category-${category.id}`"
                class="text-lg font-semibold text-black dark:text-white cursor-pointer text-left">
                {{ category.title }}
              </label>
            </div>
            <Icon :name="expandedAccordions.has(`topic1-cat-${category.id}`) ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="w-5 h-5 text-black dark:text-white" />
          </button>

          <div v-if="expandedAccordions.has(`topic1-cat-${category.id}`)" class="p-3">
            <div v-if="category.children && category.children.length > 0" class="ml-6 space-y-1">
              <div v-for="child in category.children" :key="`t1child-${child.id}`"
                class="flex items-start gap-2 py-1">
                <input type="checkbox" :id="`topic1-child-${child.id}`"
                  :checked="deepSearch.selectedTopic1CategoryIds.value.includes(child.id)"
                  @change="helpers.toggleTopic1CategorySelection(child.id, { id: child.id, title: child.title })"
                  class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label :for="`topic1-child-${child.id}`"
                  class="text-lg text-black dark:text-white cursor-pointer flex-1">
                  {{ child.title }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filters.filteredTopic1List.value.length === 0 && !deepSearch.isLoadingTopic1List.value" class="text-center py-8">
      <p class="text-lg text-gray-500 dark:text-gray-400">
        {{ deepSearchQuery ? 'Tidak ada hasil yang cocok' : 'Tidak ada data ensiklopedia' }}
      </p>
    </div>

    <div v-if="deepSearch.isLoadingTopic1List.value && deepSearch.topic1List.value.length > 0" class="flex justify-center py-4">
      <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-if="deepSearch.topic1List.value.length === 0 && deepSearch.isLoadingTopic1List.value" class="flex justify-center py-8">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
</template>
